const ROUTES = new Set(['/', '/in', '/book', '/how', '/about'])

export function readHash() {
  let raw = window.location.hash.replace(/^#/, '')
  if (!raw || raw === '/') return '/'
  if (!raw.startsWith('/')) raw = `/${raw}`
  raw = raw.replace(/\/+$/, '') || '/'
  if (ROUTES.has(raw)) return raw
  return '/'
}

export function goHash(path) {
  const next = path === '/' ? '#/' : `#${path}`
  if (window.location.hash === next) return
  if (path === '/' && (window.location.hash === '' || window.location.hash === '#')) return
  window.location.hash = path === '/' ? '/' : path
}
