import { useEffect, useRef, useState } from 'react'
import { BuyPage } from './BuyPage.jsx'
import { sampleBook } from './sample-buys.js'
import {
  blankBook,
  blankBuy,
  cloneBuy,
  downloadBook,
  formatDate,
  formatPrice,
  groupItems,
  itemKey,
  normalizeBook,
  parseFile,
  searchGroups,
  ticketNo,
} from './lastpaid-json.js'
import './lastpaid.css'

export function Workspace({ value, onChange }) {
  const undoTimer = useRef(null)
  const fileInput = useRef(null)
  const searchRef = useRef(null)
  const titleInput = useRef(null)
  const [openId, setOpenId] = useState('')
  const [draft, setDraft] = useState(null)
  const [undo, setUndo] = useState(null)
  const [query, setQuery] = useState('')
  const [foundKey, setFoundKey] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [titleDraft, setTitleDraft] = useState(value.title)
  const [miss, setMiss] = useState('')
  const open = value.buys.find((buy) => buy.id === openId) || null
  const groups = groupItems(value.buys)
  const shown = searchGroups(groups, query)
  const found =
    shown.find((group) => group.key === foundKey) ||
    groups.find((group) => group.key === foundKey) ||
    (shown.length === 1 ? shown[0] : null)

  useEffect(() => {
    setTitleDraft(value.title)
  }, [value.title])

  useEffect(() => {
    if (renaming && titleInput.current) titleInput.current.focus()
  }, [renaming])

  useEffect(() => {
    function onKey(event) {
      if (event.target.closest('input, textarea, select')) return
      if (event.key === 'n') {
        event.preventDefault()
        addBuy(found ? found.item : '')
      }
      if (event.key === '/') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function setBuys(buys) {
    onChange({ ...value, buys })
  }

  function addBuy(itemName) {
    setUndo(null)
    setMiss('')
    setOpenId('')
    const next = blankBuy()
    if (itemName) next.item = itemName
    setDraft(next)
  }

  function resetSample() {
    setUndo(null)
    setOpenId('')
    setDraft(null)
    setFoundKey('')
    setQuery('')
    setMiss('')
    setRenaming(false)
    onChange(normalizeBook(sampleBook()))
  }

  function startBlank() {
    setUndo(null)
    setOpenId('')
    setDraft(null)
    setFoundKey('')
    setQuery('')
    setMiss('')
    setRenaming(false)
    onChange(blankBook())
  }

  function saveBuy(next) {
    if (draft) {
      setBuys([...value.buys, next])
      setDraft(null)
      setFoundKey(itemKey(next.item))
      setQuery('')
      return
    }
    setBuys(value.buys.map((buy) => (buy.id === next.id ? next : buy)))
    setOpenId('')
    setFoundKey(itemKey(next.item))
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
      setQuery('')
      setRenaming(false)
      onChange(parsed.book)
    }
    reader.onerror = () => setMiss('Could not read that file.')
    reader.readAsText(file)
  }

  function commitTitle() {
    const next = titleDraft.trim() || 'Last paid'
    setRenaming(false)
    setTitleDraft(next)
    if (next !== value.title) onChange({ ...value, title: next })
  }

  if (draft || open) {
    const buy = draft || open
    return (
      <div className="lp">
        <BuyPage
          buy={buy}
          mode={draft ? 'new' : 'edit'}
          onSave={saveBuy}
          onCancel={cancelBuy}
          onDuplicate={draft ? undefined : () => duplicateBuy(buy)}
          onRemove={draft ? undefined : () => removeBuy(buy.id)}
        />
      </div>
    )
  }

  const showingTicket = Boolean(found && (foundKey || shown.length === 1))

  if (showingTicket) {
    return (
      <div className="lp">
        {miss ? <p className="lp-miss" role="alert">{miss}</p> : null}
        <Ticket
          group={found}
          showBack={shown.length !== 1}
          onBack={() => {
            setFoundKey('')
            setQuery('')
          }}
          onOpen={(id) => setOpenId(id)}
          onAdd={() => addBuy(found.item)}
        />
      </div>
    )
  }

  return (
    <div className="lp">
      <div className="lp-sheet">
        <header className="lp-mast">
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
              aria-label="Book title"
            />
          ) : (
            <h1>
              <button type="button" className="lp-title" onClick={() => setRenaming(true)}>
                {value.title}
              </button>
            </h1>
          )}
          <div className="lp-mast-actions lp-chrome">
            <button type="button" className="lp-primary" onClick={() => addBuy(found ? found.item : '')}>
              Add buy
            </button>
            <details className="lp-more">
              <summary>More</summary>
              <div className="lp-more-panel">
                <button type="button" className="lp-quiet" onClick={() => window.print()}>
                  Print
                </button>
                <button type="button" className="lp-quiet" onClick={() => downloadBook(value)}>
                  Download JSON
                </button>
                <button
                  type="button"
                  className="lp-quiet"
                  onClick={() => fileInput.current && fileInput.current.click()}
                >
                  Load JSON
                </button>
                <button type="button" className="lp-quiet" onClick={startBlank}>
                  Start blank
                </button>
                <button type="button" className="lp-quiet" onClick={resetSample}>
                  Reset sample
                </button>
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
            Removed {undo.buy.item || 'a buy'}.
            <button type="button" className="lp-quiet" onClick={undoRemove}>
              Undo
            </button>
          </p>
        ) : null}

        {value.buys.length === 0 ? (
          <div className="lp-empty">
            <p>No buys in this book.</p>
            <button type="button" className="lp-primary" onClick={() => addBuy('')}>
              Add buy
            </button>
          </div>
        ) : (
          <>
            <label className="lp-search lp-chrome">
              <span>Item</span>
              <input
                ref={searchRef}
                value={query}
                placeholder="What are we buying"
                onChange={(event) => {
                  setQuery(event.target.value)
                  setFoundKey('')
                }}
              />
            </label>

            {shown.length === 0 ? (
              <div className="lp-empty">
                <p>Nothing on file for that.</p>
                <button type="button" className="lp-primary" onClick={() => addBuy(query)}>
                  Add buy
                </button>
              </div>
            ) : (
              <table className="lp-book">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Last</th>
                    <th>Unit</th>
                    <th>When</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((group) => (
                    <tr key={group.key}>
                      <td>
                        <button type="button" className="lp-item-btn" onClick={() => setFoundKey(group.key)}>
                          {group.item}
                        </button>
                        {group.last.unit ? (
                          <span className="lp-unit-fold">{group.last.unit}</span>
                        ) : null}
                      </td>
                      <td className="lp-num">{formatPrice(group.last.price)}</td>
                      <td className="lp-unit">{group.last.unit}</td>
                      <td className="lp-when">{formatDate(group.last.date)}</td>
                      <td className={`lp-delta lp-delta-${group.delta ? group.delta.dir : 'none'}`}>
                        {deltaShort(group.delta)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
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

function Ticket({ group, showBack, onBack, onOpen, onAdd }) {
  const no = ticketNo(group.last.id)
  return (
    <article className="lp-check">
      <div className="lp-perf" aria-hidden="true" />
      <div className="lp-check-top">
        <div className="lp-check-meta">
          {showBack ? (
            <button type="button" className="lp-quiet lp-chrome" onClick={onBack}>
              Price book
            </button>
          ) : (
            <span className="lp-check-label">Guest check</span>
          )}
          <p className="lp-check-date">{formatDate(group.last.date)}</p>
        </div>
        <p className="lp-check-no">#{no}</p>
      </div>
      <p className="lp-check-item">{group.item}</p>
      <p className="lp-check-vendor">{group.last.vendor || '—'}</p>
      <div className="lp-check-cols">
        <span>When</span>
        <span>Amt</span>
      </div>
      <div className="lp-ticket-lines">
        {group.previous ? (
          <button type="button" className="lp-line" onClick={() => onOpen(group.previous.id)}>
            <span>{formatDate(group.previous.date)}</span>
            <span className="lp-num lp-line-amt">
              {formatPrice(group.previous.price)}
              {group.previous.unit ? ` / ${group.previous.unit}` : ''}
            </span>
          </button>
        ) : null}
        <button type="button" className="lp-line lp-line-last" onClick={() => onOpen(group.last.id)}>
          <span className="lp-line-last-label">Last pay</span>
          <span className="lp-line-last-pay">
            <span className="lp-line-last-when">{formatDate(group.last.date)}</span>
            <span>
              {formatPrice(group.last.price)}
              {group.last.unit ? (
                <span className="lp-line-last-unit"> / {group.last.unit}</span>
              ) : null}
            </span>
          </span>
        </button>
      </div>
      {group.delta ? (
        <p className={`lp-delta lp-delta-${group.delta.dir}`}>{deltaShort(group.delta)}</p>
      ) : (
        <p className="lp-ticket-note">First time on file.</p>
      )}
      <div className="lp-check-actions lp-chrome">
        <button type="button" className="lp-primary" onClick={onAdd}>
          Paid again
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
