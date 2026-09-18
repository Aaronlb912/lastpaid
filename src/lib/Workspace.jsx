import { useEffect, useRef, useState } from 'react'
import { BuyPage } from './BuyPage.jsx'
import { sampleBook } from './sample-buys.js'
import {
  blankBook,
  blankBuy,
  bookVendors,
  cloneBuy,
  downloadBook,
  filterGroupsByVendor,
  formatDate,
  formatPrice,
  groupItems,
  itemKey,
  normalizeBook,
  parseFile,
  searchGroups,
  sortGroups,
  ticketNo,
  todayIso,
} from './lastpaid-json.js'
import './lastpaid.css'

export function Workspace({ value, onChange, onHome, onSignOut }) {
  const undoTimer = useRef(null)
  const fileInput = useRef(null)
  const searchRef = useRef(null)
  const titleInput = useRef(null)
  const [openId, setOpenId] = useState('')
  const [draft, setDraft] = useState(null)
  const [undo, setUndo] = useState(null)
  const [query, setQuery] = useState('')
  const [foundKey, setFoundKey] = useState('')
  const [holdList, setHoldList] = useState(false)
  const [vendor, setVendor] = useState('')
  const [selectedKey, setSelectedKey] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [titleDraft, setTitleDraft] = useState(value.title)
  const [miss, setMiss] = useState('')
  const open = value.buys.find((buy) => buy.id === openId) || null
  const vendors = bookVendors(value.buys)
  const groups = sortGroups(
    filterGroupsByVendor(searchGroups(groupItems(value.buys), query), vendor),
    value.sort || 'item',
  )
  const oneFind = groups.length === 1 && Boolean(query.trim())
  const found =
    groups.find((group) => group.key === foundKey) ||
    (oneFind && !holdList ? groups[0] : null)
  const showingForm = Boolean(draft || open)
  const showingTicket = Boolean(!showingForm && found && (foundKey || oneFind))
  const shownRef = useRef(groups)
  const viewRef = useRef({ showingForm, showingTicket, found, selectedKey })
  shownRef.current = groups
  viewRef.current = { showingForm, showingTicket, found, selectedKey }

  useEffect(() => {
    setTitleDraft(value.title)
  }, [value.title])

  useEffect(() => {
    if (renaming && titleInput.current) titleInput.current.focus()
  }, [renaming])

  useEffect(() => {
    if (!groups.some((group) => group.key === selectedKey)) {
      setSelectedKey(groups[0] ? groups[0].key : '')
    }
  }, [groups, selectedKey])

  useEffect(() => {
    function onKey(event) {
      if (event.target.closest('input, textarea, select, summary')) return
      const view = viewRef.current
      const list = shownRef.current
      if (event.key === 'Escape') {
        if (view.showingForm) return
        if (view.showingTicket) {
          event.preventDefault()
          goList()
        }
        return
      }
      if (event.key === 'n') {
        event.preventDefault()
        addBuy(view.found ? view.found.item : '')
        return
      }
      if (event.key === '/') {
        event.preventDefault()
        searchRef.current?.focus()
        return
      }
      if (view.showingForm || view.showingTicket) return
      if (event.key === 'j' || event.key === 'ArrowDown') {
        event.preventDefault()
        moveSelect(1)
        return
      }
      if (event.key === 'k' || event.key === 'ArrowUp') {
        event.preventDefault()
        moveSelect(-1)
        return
      }
      if (event.key === 'Enter') {
        const key = view.selectedKey || (list[0] && list[0].key)
        if (!key) return
        event.preventDefault()
        setFoundKey(key)
        setHoldList(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function moveSelect(step) {
    const list = shownRef.current
    if (!list.length) return
    const keys = list.map((group) => group.key)
    let index = keys.indexOf(viewRef.current.selectedKey)
    if (index < 0) index = step > 0 ? -1 : 0
    index = Math.max(0, Math.min(keys.length - 1, index + step))
    setSelectedKey(keys[index])
  }

  function setBuys(buys) {
    onChange({ ...value, buys })
  }

  function setSort(sort) {
    if (sort !== value.sort) onChange({ ...value, sort })
  }

  function addBuy(itemName) {
    setUndo(null)
    setMiss('')
    setOpenId('')
    const next = blankBuy()
    if (itemName) next.item = itemName
    setDraft(next)
  }

  function paidAgain(group) {
    const last = group.last
    setUndo(null)
    setMiss('')
    setOpenId('')
    setDraft({
      ...blankBuy(),
      item: last.item,
      vendor: last.vendor,
      unit: last.unit,
      price: last.price,
      sku: last.sku,
      date: todayIso(),
    })
  }

  function resetSample() {
    setUndo(null)
    setOpenId('')
    setDraft(null)
    setFoundKey('')
    setHoldList(false)
    setQuery('')
    setVendor('')
    setMiss('')
    setRenaming(false)
    onChange(normalizeBook(sampleBook()))
  }

  function startBlank() {
    setUndo(null)
    setOpenId('')
    setDraft(null)
    setFoundKey('')
    setHoldList(false)
    setQuery('')
    setVendor('')
    setMiss('')
    setRenaming(false)
    onChange(blankBook())
  }

  function saveBuy(next) {
    if (draft) {
      setBuys([...value.buys, next])
      setDraft(null)
      setFoundKey(itemKey(next.item))
      setHoldList(false)
      setQuery('')
      return
    }
    setBuys(value.buys.map((buy) => (buy.id === next.id ? next : buy)))
    setOpenId('')
    setFoundKey(itemKey(next.item))
    setHoldList(false)
    setQuery('')
  }

  function cancelBuy() {
    setDraft(null)
    setOpenId('')
  }

  function armUndo(entry) {
    if (undoTimer.current) clearTimeout(undoTimer.current)
    setUndo(entry)
    undoTimer.current = setTimeout(() => setUndo(null), 12000)
  }

  function removeBuy(id) {
    const index = value.buys.findIndex((buy) => buy.id === id)
    if (index < 0) return
    const buy = value.buys[index]
    const buys = value.buys.filter((item) => item.id !== id)
    setBuys(buys)
    setDraft(null)
    setOpenId('')
    if (itemKey(buy.item) === foundKey) {
      const still = buys.some((item) => itemKey(item.item) === foundKey)
      if (!still) setFoundKey('')
    }
    armUndo({ buy, index })
  }

  function undoRemove() {
    if (!undo) return
    if (undoTimer.current) clearTimeout(undoTimer.current)
    const buys = [...value.buys]
    buys.splice(Math.min(undo.index, buys.length), 0, undo.buy)
    setBuys(buys)
    setUndo(null)
  }

  function duplicateBuy(buy) {
    setUndo(null)
    setMiss('')
    setOpenId('')
    setDraft(cloneBuy(buy))
  }

  function loadFile(event) {
    const file = event.target.files && event.target.files[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const parsed = parseFile(String(reader.result || ''))
      if (!parsed.ok) {
        setMiss(parsed.error)
        return
      }
      setMiss('')
      setUndo(null)
      setOpenId('')
      setDraft(null)
      setFoundKey('')
      setHoldList(false)
      setQuery('')
      setVendor('')
      setRenaming(false)
      onChange(parsed.book)
    }
    reader.onerror = () => setMiss('This computer could not read that saved copy.')
    reader.readAsText(file)
  }

  function commitTitle() {
    const next = titleDraft.trim() || 'Last paid'
    setRenaming(false)
    setTitleDraft(next)
    if (next !== value.title) onChange({ ...value, title: next })
  }

  function goList() {
    setFoundKey('')
    setDraft(null)
    setOpenId('')
    setHoldList(true)
  }

  return (
    <div className="lp">
      <div className="lp-app">
        <header className="lp-bar lp-chrome">
          {onHome ? (
            <button type="button" className="lp-home" onClick={onHome}>
              Back to the first page
            </button>
          ) : null}
          {renaming ? (
            <input
              ref={titleInput}
              className="lp-title-input"
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={commitTitle}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitTitle()
                }
              }}
              aria-label="Shop name"
            />
          ) : (
            <h1>
              <button type="button" className="lp-title" onClick={() => setRenaming(true)}>
                {value.title}
              </button>
            </h1>
          )}

          {!showingForm ? (
            <label className="lp-find">
              <span className="lp-file">Find</span>
              <input
                ref={searchRef}
                value={query}
                placeholder="Type an item name"
                onChange={(event) => {
                  setQuery(event.target.value)
                  setFoundKey('')
                  setHoldList(false)
                }}
              />
            </label>
          ) : null}

          <div className="lp-bar-actions">
            <button
              type="button"
              className="lp-primary"
              onClick={() => addBuy(found ? found.item : query)}
            >
              Add a new item
            </button>
            <details className="lp-book-menu">
              <summary>Book</summary>
              <div className="lp-book-panel">
                <button type="button" onClick={() => window.print()}>
                  {showingTicket ? 'Print this receipt' : 'Print this list'}
                </button>
                <button type="button" onClick={() => downloadBook(value)}>
                  Save a copy
                </button>
                <button type="button" onClick={() => fileInput.current && fileInput.current.click()}>
                  Load a copy
                </button>
                <button type="button" onClick={startBlank}>
                  Start empty
                </button>
                <button type="button" onClick={resetSample}>
                  Reset to Creek Bed Stone
                </button>
                {onSignOut ? (
                  <button type="button" onClick={onSignOut}>
                    Close the list, keep the prices
                  </button>
                ) : null}
              </div>
            </details>
            <input
              ref={fileInput}
              className="lp-file"
              type="file"
              accept="application/json,.json"
              onChange={loadFile}
            />
          </div>
        </header>

        {miss ? <p className="lp-miss" role="alert">{miss}</p> : null}

        {undo ? (
          <p className="lp-undo">
            Removed {undo.buy.item || 'a pay'}.
            <button type="button" className="lp-quiet" onClick={undoRemove}>
              Undo
            </button>
          </p>
        ) : null}

        {showingForm ? (
          <div className="lp-check-wrap">
            <BuyPage
              buy={draft || open}
              mode={draft ? 'new' : 'edit'}
              onSave={saveBuy}
              onCancel={cancelBuy}
              onDuplicate={draft ? undefined : () => duplicateBuy(open)}
              onRemove={draft ? undefined : () => removeBuy(open.id)}
            />
          </div>
        ) : showingTicket ? (
          <div className="lp-check-wrap">
            <Ticket
              group={found}
              onBack={goList}
              onOpen={(id) => setOpenId(id)}
              onAdd={() => paidAgain(found)}
            />
          </div>
        ) : (
          <div className="lp-body">
            {value.buys.length === 0 ? (
              <div className="lp-empty">
                <p>You have not saved a price yet. Add the first item with the green button.</p>
                <button type="button" className="lp-primary" onClick={() => addBuy('')}>
                  Add a new item
                </button>
              </div>
            ) : (
              <>
                <div className="lp-tools lp-chrome">
                  <p className="lp-list-hint">
                    Tap a row if you want to see the older prices. The green number is the last price you paid.
                  </p>
                  {vendors.length > 1 ? (
                    <div className="lp-vendors">
                      {vendors.map((name) => (
                        <button
                          key={name}
                          type="button"
                          className={vendor === name ? 'is-on' : ''}
                          onClick={() => setVendor(vendor === name ? '' : name)}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <div className="lp-sort">
                    <span>Sort</span>
                    {['item', 'date', 'price'].map((sort) => (
                      <button
                        key={sort}
                        type="button"
                        className={(value.sort || 'item') === sort ? 'is-on' : ''}
                        onClick={() => setSort(sort)}
                      >
                        {sort === 'item' ? 'Item' : sort === 'date' ? 'Date' : 'Price'}
                      </button>
                    ))}
                  </div>
                </div>

                {groups.length === 0 ? (
                  <div className="lp-empty">
                    <p>Nothing on the list matches that. You can add it as a new item.</p>
                    <button type="button" className="lp-primary" onClick={() => addBuy(query)}>
                      Add a new item
                    </button>
                  </div>
                ) : (
                  <ul className="lp-list">
                    {groups.map((group) => (
                      <li key={group.key}>
                        <button
                          type="button"
                          className={`lp-list-row${selectedKey === group.key ? ' is-sel' : ''}`}
                          onClick={() => {
                            setSelectedKey(group.key)
                            setFoundKey(group.key)
                            setHoldList(false)
                          }}
                        >
                          <span className="lp-list-main">
                            <span className="lp-list-item">{group.item}</span>
                            {group.last.sku ? <span className="lp-list-sku">{group.last.sku}</span> : null}
                            <span className="lp-list-meta">
                              {group.last.unit || '—'}
                              {' · '}
                              {formatDate(group.last.date)}
                            </span>
                            {group.lastMove ? (
                              <span className={`lp-list-moved lp-delta-${group.lastMove.dir}`}>
                                moved {formatDate(group.lastMove.date)}
                              </span>
                            ) : null}
                          </span>
                          <span className="lp-list-last">{formatPrice(group.last.price)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function deltaShort(delta) {
  if (!delta) return ''
  if (delta.dir === 'up') return `up ${formatPrice(delta.amount)}`
  if (delta.dir === 'down') return `down ${formatPrice(delta.amount)}`
  return 'same'
}

function Ticket({ group, onBack, onOpen, onAdd }) {
  const no = ticketNo(group.last.id)
  const oldest = group.oldest || [...group.recent].reverse()
  return (
    <article className="lp-check">
      <div className="lp-perf" aria-hidden="true" />
      <div className="lp-check-top">
        <div className="lp-check-meta">
          <button type="button" className="lp-quiet lp-chrome" onClick={onBack}>
            Back to the list
          </button>
          <p className="lp-check-date">{formatDate(group.last.date)}</p>
        </div>
        <p className="lp-check-no">#{no}</p>
      </div>
      <p className="lp-check-item">{group.item}</p>
      <p className="lp-check-vendor">
        {group.last.vendor || '—'}
        {group.last.sku ? ` · ${group.last.sku}` : ''}
      </p>
      <div className="lp-check-cols">
        <span>When</span>
        <span>Amount</span>
      </div>
      <div className="lp-ticket-lines">
        {oldest.map((buy, index) => {
          const isLast = index === oldest.length - 1
          const unit = buy.unit ? ` / ${buy.unit}` : ''
          const qty = buy.qty !== '' && buy.qty != null ? ` × ${buy.qty}` : ''
          if (isLast) {
            return (
              <button
                key={buy.id}
                type="button"
                className="lp-line lp-line-last"
                onClick={() => onOpen(buy.id)}
              >
                <span className="lp-line-last-label">Last pay</span>
                <span className="lp-line-last-pay">
                  <span className="lp-line-last-when">{formatDate(buy.date)}</span>
                  <span>
                    {formatPrice(buy.price)}
                    <span className="lp-line-last-unit">{unit}{qty}</span>
                  </span>
                </span>
              </button>
            )
          }
          return (
            <button key={buy.id} type="button" className="lp-line" onClick={() => onOpen(buy.id)}>
              <span>{formatDate(buy.date)}</span>
              <span className="lp-line-amt">
                {formatPrice(buy.price)}
                {unit}
                {qty}
              </span>
            </button>
          )
        })}
      </div>
      {group.range ? (
        <p className="lp-ticket-note">
          high {formatPrice(group.range.high)} · low {formatPrice(group.range.low)}
        </p>
      ) : null}
      {group.delta ? (
        <p className={`lp-delta lp-delta-${group.delta.dir}`}>{deltaShort(group.delta)}</p>
      ) : (
        <p className="lp-ticket-note">First time on file.</p>
      )}
      {group.last.notes ? <p className="lp-check-notes">{group.last.notes}</p> : null}
      <p className="lp-check-help lp-chrome">
        The last price is the big green number at the bottom.
      </p>
      <div className="lp-check-actions lp-chrome">
        <button type="button" className="lp-primary" onClick={onAdd}>
          Pay this again
        </button>
      </div>
      <div className="lp-check-stub">
        <div className="lp-perf" aria-hidden="true" />
        <span className="lp-check-stub-no">#{no}</span>
        <span className="lp-num">{formatPrice(group.last.price)}</span>
      </div>
    </article>
  )
}
