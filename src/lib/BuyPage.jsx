import { useEffect, useState } from 'react'
import { formatPrice, normalizeBuy, parsePrice, parseQty, ticketNo } from './lastpaid-json.js'
import './lastpaid.css'

export function BuyPage({ buy, mode, onSave, onCancel, onRemove, onDuplicate }) {
  const isNew = mode === 'new'
  const [item, setItem] = useState(buy.item || '')
  const [vendor, setVendor] = useState(buy.vendor || '')
  const [unit, setUnit] = useState(buy.unit || '')
  const [price, setPrice] = useState(isNew && buy.price === 0 ? '' : String(buy.price ?? ''))
  const [date, setDate] = useState(buy.date || '')
  const [notes, setNotes] = useState(buy.notes || '')
  const [sku, setSku] = useState(buy.sku || '')
  const [qty, setQty] = useState(buy.qty === '' || buy.qty == null ? '' : String(buy.qty))
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
    const parsedQty = parseQty(qty)
    if (!parsedQty.ok) {
      setMiss('qty')
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
      sku,
      qty: parsedQty.value,
    }))
  }

  const heading = isNew ? (buy.item ? buy.item : 'A new price') : item.trim() || 'This price'
  const itemMiss = miss === 'item'
  const priceMiss = miss === 'price-blank' || miss === 'price-junk'
  const qtyMiss = miss === 'qty'
  const priceHint =
    miss === 'price-blank'
      ? 'Please type how much you paid.'
      : miss === 'price-junk'
        ? 'The amount has to be a number, like 51.'
        : ''
  const parsedStub = parsePrice(price)
  const stubPrice = parsedStub.ok ? formatPrice(parsedStub.value) : price || '—'

  return (
    <article className="lp-check">
      <div className="lp-perf" aria-hidden="true" />
      <div className="lp-check-top">
        <div className="lp-check-meta">
          <button type="button" className="lp-quiet lp-back lp-chrome" onClick={onCancel}>
            Back to the list
          </button>
          <p className="lp-check-label">{isNew ? 'One price you paid' : 'This price'}</p>
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
          {itemMiss ? <span className="lp-field-hint">Please type what you bought.</span> : null}
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
          <span>Amount</span>
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
        <div className="lp-row">
          <label className="lp-field">
            <span>Optional code from the seller</span>
            <input
              value={sku}
              placeholder="PBS-1"
              onChange={(event) => setSku(event.target.value)}
            />
          </label>
          <label className={`lp-field${qtyMiss ? ' lp-field-miss' : ''}`}>
            <span>Qty</span>
            <input
              value={qty}
              inputMode="decimal"
              placeholder="optional"
              onChange={(event) => setQty(event.target.value)}
            />
            {qtyMiss ? <span className="lp-field-hint">If you fill in a quantity, it has to be a number.</span> : null}
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
