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
      setMiss('Type a shop name. It becomes the title on the list.')
      return null
    }
    const typed = pin.trim()
    if (stored.pin && sameShop(shopName, stored.name)) {
      if (!typed) {
        setMiss('Type the PIN you set for this shop on this computer.')
        return null
      }
      if (typed !== stored.pin) {
        setMiss('That PIN does not match the one saved on this computer.')
        return null
      }
    } else if (typed && !pinOk(typed)) {
      setMiss('A PIN has to be 4 digits or more.')
      return null
    }
    setMiss('')
    const nextPin = stored.pin && sameShop(shopName, stored.name) ? stored.pin : typed
    return { name: shopName, pin: nextPin, blank: forBlank }
  }

  return (
    <div className="lp-counter">
      <h1>Your shop on this computer</h1>
      <p>
        Name this computer's shop, then open the price log. This is not an
        account. There is no email.
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
        <p className="lp-counter-hint">This name is the title on the list.</p>
        <label>
          PIN, optional
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
            A PIN only locks this browser. Forget it and start a blank log or
            load a saved file.
          </p>
        )}
        <button type="submit" className="lp-site-primary">
          {openLabel ? `Open ${openLabel}` : 'Open the log already here'}
        </button>
      </form>
      <div className="lp-choices">
        <p>
          <button type="button" className="lp-site-text" onClick={onOpenSample}>
            Try the Creek Bed Stone sample
          </button>
          <span> Practice with a fake yard.</span>
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
            Start a blank log
          </button>
          <span> Your own items. Needs a shop name first.</span>
        </p>
      </div>
    </div>
  )
}
