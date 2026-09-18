import '../lib/lastpaid.css'

export function Landing({ session, shopTitle, onOpenSample }) {
  return (
    <div className="lp-land">
      <div className="lp-land-copy">
        <p className="lp-land-kicker">Before you call</p>
        <h1>Last paid</h1>
        <p>
          You write down what you paid last time for stone, parts, or anything
          you buy twice a year, so next time you can look it up before you
          call.
        </p>
        <p>
          Find the item on the list and read the green number. That is the last
          price you paid. Click the row if you want to see the older prices
          too.
        </p>
        <div className="lp-land-actions">
          {session ? (
            <a className="lp-site-primary" href="#/book">
              Open {shopTitle || 'the list'} on this computer
            </a>
          ) : (
            <button type="button" className="lp-site-primary" onClick={onOpenSample}>
              Try Creek Bed Stone, a sample shop
            </button>
          )}
          <a href="#/in">Put your own shop name on this computer</a>
        </div>
        <p className="lp-land-quiet">
          There is no signup.
          {' · '}
          <a href="#/how">How to use it</a>
          {' · '}
          <a href="#/about">If you already run a React app</a>
        </p>
      </div>
      <div className="lp-land-example">
        <p className="lp-land-caption">
          This little receipt is an example. They last paid $51 for
          Pennsylvania blue stone.
        </p>
        <article className="lp-check lp-land-check" aria-label="Example of last prices on a receipt">
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
