import { useState } from 'react'
import { pinOk, readShop, sameShop } from './shop.js'

export function SignIn({ onOpenShop, onOpenSample, onStartBlank }) {
  const stored = readShop()
  const [name, setName] = useState(stored.name)
  const [pin, setPin] = useState('')
  const [miss, setMiss] = useState('')

  function check(forBlank) {
    const shopName = name.trim()
    if (!shopName) {
      setMiss('Put the shop name.')
      return null
    }
    const typed = pin.trim()
    if (stored.pin && sameShop(shopName, stored.name)) {
      if (!typed) {
        setMiss('Type the PIN for this shop.')
        return null
      }
      if (typed !== stored.pin) {
        setMiss('That PIN does not match.')
        return null
      }
    } else if (typed && !pinOk(typed)) {
      setMiss('PIN is 4 digits or more.')
      return null
    }
    setMiss('')
    const nextPin = stored.pin && sameShop(shopName, stored.name) ? stored.pin : typed
    return { name: shopName, pin: nextPin, blank: forBlank }
  }

  return (
    <div className="lp-counter">
      <h1>Sign in</h1>
      <p>Shop name on this computer. PIN is optional. There is no email and no account.</p>
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
        <label>
          PIN
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
          <p className="lp-counter-hint">Leave PIN blank if you do not want a lock.</p>
        )}
        <button type="submit" className="lp-site-primary">
          Open shop
        </button>
      </form>
      <p className="lp-land-quiet">
        <button
          type="button"
          className="lp-site-text"
          onClick={() => {
            const next = check(true)
            if (next) onStartBlank(next)
          }}
        >
          Start blank
        </button>
        {' · '}
        <button type="button" className="lp-site-text" onClick={onOpenSample}>
          Open Creek Bed Stone
        </button>
      </p>
    </div>
  )
}
