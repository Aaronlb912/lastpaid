const SHOP_KEY = 'lastpaid-shop'
const SESSION_KEY = 'lastpaid-session'

export function readShop() {
  try {
    const raw = localStorage.getItem(SHOP_KEY)
    if (!raw) return { name: '', pin: '' }
    const data = JSON.parse(raw)
    return {
      name: String(data.name || ''),
      pin: String(data.pin || ''),
    }
  } catch {
    return { name: '', pin: '' }
  }
}

export function writeShop(shop) {
  try {
    localStorage.setItem(
      SHOP_KEY,
      JSON.stringify({ name: shop.name || '', pin: shop.pin || '' }),
    )
  } catch {
    // Desk lock is optional if storage is blocked.
  }
}

export function hasSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return true
  }
}

export function openSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // Book still opens if sessionStorage is blocked.
  }
}

export function closeSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Ignore.
  }
}

export function sameShop(a, b) {
  return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase()
}

export function pinOk(pin) {
  return /^\d{4,}$/.test(String(pin || ''))
}
