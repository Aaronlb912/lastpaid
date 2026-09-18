import { useEffect, useState } from 'react'
import { formatPrice, normalizeBuy, parsePrice, ticketNo } from './lastpaid-json.js'
import './lastpaid.css'

export function BuyPage({ buy, mode, onSave, onCancel, onRemove, onDuplicate }) {
  const isNew = mode === 'new'
  const [item, setItem] = useState(buy.item || '')
  const [vendor, setVendor] = useState(buy.vendor || '')
  const [unit, setUnit] = useState(buy.unit || '')
  const [price, setPrice] = useState(isNew && buy.price === 0 ? '' : String(buy.price ?? ''))
  const [date, setDate] = useState(buy.date || '')
  const [notes, setNotes] = useState(buy.notes || '')
  const [miss, setMiss] = useState('')

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  function save(event) {
    event.preventDefault()
    if (!item.trim()) {
      setMiss('item')
      return
    }
    const parsed = parsePrice(price)
    if (!parsed.ok && parsed.reason === 'blank') {
      setMiss('price-blank')
      return
    }
    if (!parsed.ok) {
      setMiss('price-junk')
      return
    }
    setMiss('')
    onSave(normalizeBuy({
      ...buy,
      item,
      vendor,
      unit,
      price: parsed.value,
      date,
      notes,
    }))
  }

  const heading = isNew ? 'New buy' : item.trim() || 'Untitled buy'
  const itemMiss = miss === 'item'
  const priceMiss = miss === 'price-blank' || miss === 'price-junk'
  const priceHint = miss === 'price-blank' ? 'Need a price.' : miss === 'price-junk' ? 'Price has to be a number.' : ''
  const parsedStub = parsePrice(price)
  const stubPrice = parsedStub.ok ? formatPrice(parsedStub.value) : price || '—'

  return (
    <article className="lp-check">
      <div className="lp-perf" aria-hidden="true" />
      <div className="lp-check-top">
        <div className="lp-check-meta">
          <button type="button" className="lp-quiet lp-back lp-chrome" onClick={onCancel}>
            Price book
          </button>
          <p className="lp-check-label">{isNew ? 'New ticket' : 'Ticket'}</p>
        </div>
        <p className="lp-check-no">#{ticketNo(buy.id)}</p>
      </div>
      <h1>{heading}</h1>

      <form className="lp-form" onSubmit={save}>
        <label className={`lp-field${itemMiss ? ' lp-field-miss' : ''}`}>
          <span>Item</span>
          <input
            value={item}
            onChange={(event) => setItem(event.target.value)}
            autoFocus
          />
          {itemMiss ? <span className="lp-field-hint">Need an item.</span> : null}
        </label>
        <label className="lp-field">
          <span>Vendor</span>
          <input
            value={vendor}
            placeholder="Ridge Quarry"
            onChange={(event) => setVendor(event.target.value)}
          />
        </label>
        <label className={`lp-field lp-field-price${priceMiss ? ' lp-field-miss' : ''}`}>
          <span>Amt</span>
          <input
            value={price}
            inputMode="decimal"
            placeholder="51"
            onChange={(event) => setPrice(event.target.value)}
          />
          {priceHint ? <span className="lp-field-hint">{priceHint}</span> : null}
        </label>
        <div className="lp-row">
          <label className="lp-field">
            <span>Unit</span>
            <input
              value={unit}
              placeholder="sq ft, ton, each"
              onChange={(event) => setUnit(event.target.value)}
            />
          </label>
          <label className="lp-field">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>
        <label className="lp-field">
          <span>Notes</span>
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>

        <div className="lp-actions lp-chrome">
          <button type="submit" className="lp-primary">
            Save
          </button>
          <button type="button" className="lp-secondary" onClick={onCancel}>
            Cancel
          </button>
          {onDuplicate ? (
            <button type="button" className="lp-secondary" onClick={() => onDuplicate(buy)}>
              Duplicate
            </button>
          ) : null}
          {onRemove ? (
            <button type="button" className="lp-quiet" onClick={onRemove}>
              Remove
            </button>
          ) : null}
        </div>
      </form>

      <div className="lp-check-stub">
        <div className="lp-perf" aria-hidden="true" />
        <span className="lp-check-stub-no">#{ticketNo(buy.id)}</span>
        <span className="lp-num">{stubPrice}</span>
      </div>
    </article>
  )
}
