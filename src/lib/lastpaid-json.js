function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function newBuyId() {
  return uid('buy')
}

function pad(value) {
  return String(value).padStart(2, '0')
}

export function todayIso(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function parseDate(value) {
  const raw = String(value == null ? '' : value).trim()
  if (!raw) return { ok: false, reason: 'blank' }
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return { ok: false, reason: 'junk' }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { ok: false, reason: 'junk' }
  }
  return { ok: true, date, iso: `${match[1]}-${match[2]}-${match[3]}` }
}

export function parsePrice(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { ok: true, value }
  }
  const raw = String(value == null ? '' : value).trim()
  if (!raw) return { ok: false, reason: 'blank' }
  const cleaned = raw.replace(/[$,\s]/g, '')
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return { ok: false, reason: 'junk' }
  const next = Number(cleaned)
  if (!Number.isFinite(next)) return { ok: false, reason: 'junk' }
  return { ok: true, value: next }
}

export function formatPrice(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function ticketNo(id) {
  const raw = String(id || '0')
  let n = 0
  for (let i = 0; i < raw.length; i += 1) n = (n * 31 + raw.charCodeAt(i)) >>> 0
  return String(n % 10000).padStart(4, '0')
}

export function formatDate(value) {
  const parsed = parseDate(value)
  if (!parsed.ok) return String(value || '').trim() || 'No date'
  return parsed.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function dateRank(value) {
  const parsed = parseDate(value)
  if (!parsed.ok) return Number.NEGATIVE_INFINITY
  return parsed.date.getTime()
}

export function itemKey(name) {
  return String(name || '').trim().toLowerCase()
}

export function parseQty(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return { ok: true, value }
  const raw = String(value == null ? '' : value).trim()
  if (!raw) return { ok: true, value: '' }
  if (!/^\d+(\.\d+)?$/.test(raw)) return { ok: false, reason: 'junk' }
  const next = Number(raw)
  if (!Number.isFinite(next)) return { ok: false, reason: 'junk' }
  return { ok: true, value: next }
}

export function normalizeBuy(buy, index = 0) {
  const raw = buy && typeof buy === 'object' ? buy : {}
  const parsedPrice = parsePrice(raw.price ?? raw.amount ?? raw.cost)
  const parsedDate = parseDate(raw.date ?? raw.when ?? raw.paid)
  const parsedQty = parseQty(raw.qty ?? raw.quantity ?? raw.qtyBought)
  return {
    id: String(raw.id || `buy-${index + 1}`),
    item: String(raw.item ?? raw.name ?? raw.product ?? '').trim(),
    vendor: String(raw.vendor ?? raw.from ?? raw.supplier ?? '').trim(),
    unit: String(raw.unit ?? raw.units ?? raw.per ?? '').trim(),
    price: parsedPrice.ok ? parsedPrice.value : 0,
    date: parsedDate.ok ? parsedDate.iso : String(raw.date ?? raw.when ?? raw.paid ?? '').trim(),
    notes: String(raw.notes ?? '').trim(),
    sku: String(raw.sku ?? raw.code ?? '').trim(),
    qty: parsedQty.ok ? parsedQty.value : '',
  }
}

export function blankBuy() {
  return {
    id: newBuyId(),
    item: '',
    vendor: '',
    unit: '',
    price: 0,
    date: todayIso(),
    notes: '',
    sku: '',
    qty: '',
  }
}

export function cloneBuy(buy) {
  const next = normalizeBuy(buy)
  return {
    ...next,
    id: newBuyId(),
    date: todayIso(),
  }
}

export function blankBook() {
  return {
    title: 'Last paid',
    buys: [],
    sort: 'item',
  }
}

function bookSort(value) {
  const sort = String(value || '').trim()
  if (sort === 'date' || sort === 'price' || sort === 'item') return sort
  return 'item'
}

function looksLikeBuy(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false
  return Boolean(
    raw.item ||
    raw.name ||
    raw.product ||
    raw.vendor ||
    raw.amount != null ||
    raw.price != null ||
    raw.date ||
    raw.when,
  )
}

export function normalizeBook(data) {
  if (Array.isArray(data)) {
    return {
      title: 'Last paid',
      buys: data.map((buy, index) => normalizeBuy(buy, index)),
      sort: 'item',
    }
  }
  const raw = data && typeof data === 'object' ? data : {}
  const list = Array.isArray(raw.buys)
    ? raw.buys
    : Array.isArray(raw.items)
      ? raw.items
      : Array.isArray(raw.payments)
        ? raw.payments
        : null
  if (list) {
    return {
      title: String(raw.title || '').trim() || 'Last paid',
      buys: list.map((buy, index) => normalizeBuy(buy, index)),
      sort: bookSort(raw.sort),
    }
  }
  if (looksLikeBuy(raw)) {
    return {
      title: 'Last paid',
      buys: [normalizeBuy(raw, 0)],
      sort: 'item',
    }
  }
  if (raw.title) {
    return {
      title: String(raw.title).trim() || 'Last paid',
      buys: [],
      sort: bookSort(raw.sort),
    }
  }
  return blankBook()
}

export function paysForItem(buys) {
  const recent = [...buys].sort((left, right) => dateRank(right.date) - dateRank(left.date))
  return {
    last: recent[0] || null,
    previous: recent[1] || null,
    recent,
  }
}

export function priceDelta(last, previous) {
  if (!last || !previous) return null
  if (typeof last.price !== 'number' || typeof previous.price !== 'number') return null
  const amount = last.price - previous.price
  if (amount > 0) return { dir: 'up', amount }
  if (amount < 0) return { dir: 'down', amount: Math.abs(amount) }
  return { dir: 'same', amount: 0 }
}

export function lastPriceMove(recent) {
  if (!recent || recent.length < 2) return null
  const last = recent[0]
  const older = recent.slice(1).find((buy) => buy.price !== last.price)
  if (!older) return null
  return {
    date: last.date,
    dir: last.price > older.price ? 'up' : last.price < older.price ? 'down' : 'same',
  }
}

export function priceRange(buys) {
  const prices = buys
    .map((buy) => buy.price)
    .filter((value) => typeof value === 'number' && Number.isFinite(value))
  if (prices.length < 2) return null
  const high = Math.max(...prices)
  const low = Math.min(...prices)
  if (high === low) return null
  return { high, low }
}

export function bookVendors(buys) {
  const names = []
  buys.forEach((buy) => {
    const vendor = String(buy.vendor || '').trim()
    if (vendor && !names.includes(vendor)) names.push(vendor)
  })
  return names.sort((left, right) => left.localeCompare(right))
}

export function sortGroups(groups, sort) {
  const list = [...groups]
  if (sort === 'date') {
    return list.sort(
      (left, right) => dateRank(right.last.date) - dateRank(left.last.date) || left.item.localeCompare(right.item),
    )
  }
  if (sort === 'price') {
    return list.sort(
      (left, right) => (right.last.price || 0) - (left.last.price || 0) || left.item.localeCompare(right.item),
    )
  }
  return list.sort((left, right) => left.item.localeCompare(right.item))
}

export function filterGroupsByVendor(groups, vendor) {
  const needle = String(vendor || '').trim().toLowerCase()
  if (!needle) return groups
  return groups.filter((group) =>
    group.buys.some((buy) => String(buy.vendor || '').trim().toLowerCase() === needle),
  )
}

export function groupItems(buys) {
  const map = new Map()
  buys.forEach((buy) => {
    const key = itemKey(buy.item) || '(no item)'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(buy)
  })
  return [...map.entries()].map(([key, itemBuys]) => {
    const pays = paysForItem(itemBuys)
    return {
      key,
      item: pays.last.item || 'Untitled item',
      buys: itemBuys,
      last: pays.last,
      previous: pays.previous,
      recent: pays.recent,
      oldest: [...pays.recent].reverse(),
      delta: priceDelta(pays.last, pays.previous),
      lastMove: lastPriceMove(pays.recent),
      range: priceRange(itemBuys),
    }
  })
}

function haystack(buy) {
  return [
    buy.item,
    buy.vendor,
    buy.unit,
    buy.notes,
    buy.date,
    buy.sku,
    formatPrice(buy.price),
  ]
    .join(' ')
    .toLowerCase()
}

export function searchGroups(groups, query) {
  const needle = String(query || '').trim().toLowerCase()
  if (!needle) return groups
  return groups.filter((group) => group.buys.some((buy) => haystack(buy).includes(needle)))
}

function download(filename, text, type) {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function fileName(title) {
  const slug = String(title || 'last-paid')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'last-paid'
  return `${slug}.json`
}

export function downloadBook(book) {
  download(
    fileName(book.title),
    `${JSON.stringify(normalizeBook(book), null, 2)}\n`,
    'application/json',
  )
}

export function parseFile(text) {
  try {
    const data = JSON.parse(text)
    if (data == null || (typeof data !== 'object' && !Array.isArray(data))) {
      return { ok: false, error: 'That file is not a list of prices this tool can open.' }
    }
    return { ok: true, book: normalizeBook(data) }
  } catch {
    return { ok: false, error: 'That file is not a saved copy of a price list.' }
  }
}
