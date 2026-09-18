import '../lib/lastpaid.css'

export function Landing({ session, shopTitle, onOpenSample }) {
  return (
    <div className="lp-land">
      <div className="lp-land-copy">
        <p className="lp-land-kicker">Price log</p>
        <h1>Last paid</h1>
        <p>This is a log of what you paid last time for the same thing.</p>
        <p>
          Look up an item. The green number is last pay. Open it to see older
          pays on a guest check.
        </p>
        <div className="lp-land-actions">
          {session ? (
            <a className="lp-site-primary" href="#/book">
              Open {shopTitle || 'the log already here'}
            </a>
          ) : (
            <button type="button" className="lp-site-primary" onClick={onOpenSample}>
              Try the Creek Bed Stone sample
            </button>
          )}
          <a href="#/in">Use your own shop on this computer</a>
        </div>
        <p className="lp-land-quiet">
          <a href="#/how">How to use it</a>
          {' · '}
          <a href="#/about">Copy into a React app</a>
        </p>
      </div>
      <div className="lp-land-example">
        <p className="lp-land-caption">
          Example. Pennsylvania blue stone, last pay $51.
        </p>
        <article className="lp-check lp-land-check" aria-label="Example guest check">
          <div className="lp-perf" aria-hidden="true" />
          <div className="lp-check-top">
            <p className="lp-check-date">Mar 11, 2026</p>
            <p className="lp-check-no">#2026</p>
          </div>
          <p className="lp-check-item">Pennsylvania blue stone</p>
          <p className="lp-check-vendor">Ridge Quarry · PBS-1</p>
          <div className="lp-check-cols">
            <span>When</span>
            <span>Amount</span>
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
    </div>
  )
}
