export function SiteShell({ path, session, children }) {
  return (
    <div className="lp-site">
      <header className="lp-site-bar">
        <a className="lp-site-brand" href="#/">
          Last paid
        </a>
        <nav className="lp-site-nav" aria-label="Site">
          <a href="#/how" className={path === '/how' ? 'is-on' : undefined}>
            How
          </a>
          <a href="#/about" className={path === '/about' ? 'is-on' : undefined}>
            About
          </a>
          <a href="#/in" className={path === '/in' ? 'is-on' : undefined}>
            Sign in
          </a>
        </nav>
        {session ? (
          <a className="lp-site-primary" href="#/book">
            Open book
          </a>
        ) : null}
      </header>
      <div className="lp-site-body">{children}</div>
      <footer className="lp-site-foot">The book stays on this computer. No account.</footer>
    </div>
  )
}
