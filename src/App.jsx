import { useEffect, useState } from 'react'
import { blankBook, normalizeBook, sampleBook, Workspace } from './lib/index.js'
import { About } from './site/About.jsx'
import { How } from './site/How.jsx'
import { Landing } from './site/Landing.jsx'
import { SignIn } from './site/SignIn.jsx'
import { SiteShell } from './site/SiteShell.jsx'
import { goHash, readHash } from './site/hash.js'
import { closeSession, hasSession, openSession, readShop, writeShop } from './site/shop.js'
import './lib/lastpaid.css'
import './site/site.css'

const STORAGE_KEY = 'lastpaid-book'
const KNOWN = new Set(['', '#', '#/', '#/in', '#/book', '#/how', '#/about'])

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return normalizeBook(JSON.parse(raw))
    return normalizeBook(sampleBook())
  } catch {
    return normalizeBook(sampleBook())
  }
}

function writeStored(book) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(book))
  } catch {
    // Demo still runs if storage is blocked.
  }
}

function usePath() {
  const [path, setPath] = useState(readHash)

  useEffect(() => {
    function onHash() {
      if (!KNOWN.has(window.location.hash) && window.location.hash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/`)
      }
      setPath(readHash())
    }
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return path
}

export default function App() {
  const [book, setBook] = useState(readStored)
  const [session, setSession] = useState(hasSession)
  const path = usePath()
  const view = path === '/book' && !session ? '/in' : path

  function change(next) {
    const normalized = normalizeBook(next)
    setBook(normalized)
    writeStored(normalized)
  }

  function enter() {
    openSession()
    setSession(true)
    goHash('/book')
  }

  function openSample() {
    change(normalizeBook(sampleBook()))
    writeShop({ name: 'Creek Bed Stone', pin: readShop().pin })
    enter()
  }

  function lockShop(shop) {
    writeShop({ name: shop.name, pin: shop.pin || '' })
  }

  function openShop(shop) {
    lockShop(shop)
    if (book.title !== shop.name) change({ ...book, title: shop.name })
    enter()
  }

  function startBlank(shop) {
    lockShop(shop)
    change({ ...blankBook(), title: shop.name })
    enter()
  }

  function signOut() {
    closeSession()
    setSession(false)
    goHash('/')
  }

  useEffect(() => {
    if (path === '/book' && !session) goHash('/in')
  }, [path, session])

  useEffect(() => {
    const titles = {
      '/': 'Last paid',
      '/in': 'Name the list · Last paid',
      '/how': 'How to use last paid',
      '/about': 'If you already run a React app · Last paid',
      '/book': `${book.title} · Last paid`,
    }
    document.title = titles[view] || 'Last paid'
  }, [view, book.title])

  if (view === '/book') {
    return (
      <Workspace
        value={book}
        onChange={change}
        onHome={() => goHash('/')}
        onSignOut={signOut}
      />
    )
  }

  let page = (
    <Landing session={session} shopTitle={book.title} onOpenSample={openSample} />
  )
  if (view === '/in') {
    page = (
      <SignIn
        shopTitle={book.title}
        onOpenShop={openShop}
        onOpenSample={openSample}
        onStartBlank={startBlank}
      />
    )
  } else if (view === '/how') {
    page = <How />
  } else if (view === '/about') {
    page = <About />
  }

  return (
    <SiteShell path={view} session={session}>
      {page}
    </SiteShell>
  )
}
