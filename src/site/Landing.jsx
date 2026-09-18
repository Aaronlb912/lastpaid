import '../lib/lastpaid.css'

export function Landing({ session, onOpenSample }) {
  return (
    <div className="lp-land">
      <div className="lp-land-copy">
        <p className="lp-land-kicker">Yard desk</p>
        <h1>What we paid last time</h1>
        <p>
          For a shop or yard that buys the same stone or parts twice a year.
          Last pay is the number you want before you call the quarry.
        </p>
        <div className="lp-land-actions">
          {session ? (
            <a className="lp-site-primary" href="#/book">
              Open the book
            </a>
          ) : (
            <button type="button" className="lp-site-primary" onClick={onOpenSample}>
              Open the book
            </button>
          )}
          <a href="#/in">Sign in</a>
        </div>
        <p className="lp-land-quiet">
          <a href="#/how">How</a>
          {' · '}
          <a href="#/about">About</a>
        </p>
      </div>
      <article className="lp-check lp-land-check" aria-label="Sample guest check">
        <div className="lp-perf" aria-hidden="true" />
        <div className="lp-check-top">
          <p className="lp-check-date">Mar 11, 2026</p>
          <p className="lp-check-no">#2026</p>
        </div>
        <p className="lp-check-item">Pennsylvania blue stone</p>
        <p className="lp-check-vendor">Ridge Quarry · PBS-1</p>
        <div className="lp-check-cols">
          <span>When</span>
          <span>Amt</span>
        </div>
        <div className="lp-ticket-lines">
          <div className="lp-line">
            <span>Sep 6, 2024</span>
            <span className="lp-line-amt">$44.00</span>
          </div>
          <div className="lp-line lp-line-last">
            <span className="lp-line-last-label">Last pay</span>
            <span className="lp-line-last-pay">
              <span className="lp-line-last-when">Mar 11, 2026</span>
              <span>$51.00</span>
            </span>
          </div>
        </div>
        <div className="lp-check-stub">
          <div className="lp-perf" aria-hidden="true" />
          <span className="lp-check-stub-no">#2026</span>
          <span className="lp-num">$51.00</span>
        </div>
      </article>
    </div>
  )
}
