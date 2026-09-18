import { useState } from 'react'
import { pinOk, readShop, sameShop } from './shop.js'

export function SignIn({ shopTitle, onOpenShop, onOpenSample, onStartBlank }) {
  const stored = readShop()
  const [name, setName] = useState(stored.name || shopTitle || '')
  const [pin, setPin] = useState('')
  const [miss, setMiss] = useState('')
  const openLabel = (name.trim() || stored.name || shopTitle || '').trim()

  function check(forBlank) {
    const shopName = name.trim()
    if (!shopName) {
      setMiss('Please type a shop name so the list has a title.')
      return null
    }
    const typed = pin.trim()
    if (stored.pin && sameShop(shopName, stored.name)) {
      if (!typed) {
        setMiss('Type the numbers you chose for this shop on this computer.')
        return null
      }
      if (typed !== stored.pin) {
        setMiss('Those numbers do not match what this computer has saved.')
        return null
      }
    } else if (typed && !pinOk(typed)) {
      setMiss('If you use numbers, use at least four digits.')
      return null
    }
    setMiss('')
    const nextPin = stored.pin && sameShop(shopName, stored.name) ? stored.pin : typed
    return { name: shopName, pin: nextPin, blank: forBlank }
  }

  return (
    <div className="lp-counter">
      <h1>Name the list on this computer</h1>
      <p>
        Type a shop name so the list has a title, then open it. You can add
        optional numbers if you do not want someone else on this computer
        opening it. There is no email and no account. If you forget the
        numbers, start empty or load a saved file.
      </p>
      <form
        className="lp-counter-form"
        onSubmit={(event) => {
          event.preventDefault()
          const next = check(false)
          if (next) onOpenShop(next)
        }}
      >
        <label>
          Shop name
          <input
            value={name}
            autoComplete="organization"
            onChange={(event) => {
              setName(event.target.value)
              setMiss('')
            }}
          />
        </label>
        <p className="lp-counter-hint">This is what you will see at the top of the list.</p>
        <label>
          Optional numbers
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(event) => {
              setPin(event.target.value)
              setMiss('')
            }}
          />
        </label>
        {miss ? (
          <p className="lp-site-miss" role="alert">
            {miss}
          </p>
        ) : (
          <p className="lp-counter-hint">
            Leave this blank if you are the only one using this computer.
          </p>
        )}
        <button type="submit" className="lp-site-primary">
          {openLabel ? `Open the ${openLabel} list` : 'Open the list already here'}
        </button>
      </form>
      <div className="lp-choices">
        <p>
          <button type="button" className="lp-site-text" onClick={onOpenSample}>
            Try Creek Bed Stone
          </button>
          {' '}
          if you want to practice with a fake yard that already has prices.
        </p>
        <p>
          <button
            type="button"
            className="lp-site-text"
            onClick={() => {
              const next = check(true)
              if (next) onStartBlank(next)
            }}
          >
            Start empty
          </button>
          {' '}
          if you want a blank list for your own items. Type a shop name first.
        </p>
      </div>
    </div>
  )
}
