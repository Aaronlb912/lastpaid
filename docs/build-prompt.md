# TARGET 2026-09-17

What we paid last time. Item, vendor, unit, price, date. Look it
up before you call again. JSON in, JSON out. Drop `src/lib/` into
a React app you already have.

Prompt file (do not wait for a paste):
`C:\Users\aaron\OneDrive\Documents\prompts\finished-product-prompt.md`

Continue later:
`C:\Users\aaron\OneDrive\Documents\prompts\multi-session-build-prompt-react.md`

Kind: last-price log. Not a who-owes split. Not a table editor of
current stock. Not a search-only list.

Local URL: http://127.0.0.1:48629/
Repo folder: `C:\Users\aaron\Documents\lastpaid`

Pages:
- Landing, sign in, how, about (site).
- Book: find an item, last pay, guest check, add a buy.

Auth: shop name on this browser. Optional local PIN. No
server.

Sample: Creek Bed Stone in `src/lib/sample-buys.js`. Fake names.
Email on `.example`.

## Session plan

- [x] Session 1: scaffold, sample buys, look up last price, add a
      buy, JSON download, demo running.
- [x] Session 2: miss on a blank item or a bad price, persist,
      empty state, search polish.
- [x] Session 3: several books or richer fields, CSS, old JSON
      still loads.
- [x] L-A. Two objects. Book is a last-price sheet. Ticket is a
      guest check. They do not share one cream column.
- [x] R-A. New shell. App frame, not a manila sheet. Find, Add
      buy, quiet Book menu.
- [x] R-B. Last-price list. Item, last, unit, when. Last price
      is the useful number.
- [x] R-C. Guest check. Receipt stays. Full history, last pay
      huge. Paid again is primary.
- [x] R-D. Write a ticket. Prefill on Paid again. Miss on the
      field.
- [x] R-E. Vendor filter and sort. Stored on the book.
- [x] R-F. Qty, sku, high/low. Last price stays per unit.
- [x] R-G. Keyboard, print, empty, 390.
- [x] P-A. Routes and site shell.
- [x] P-B. Landing.
- [x] P-C. Sign in (shop name, optional PIN).
- [x] P-D. Gate the book. Sign out.
- [x] P-E. How and About.
- [x] C-A. Landing + titles.
- [x] C-B. Sign in copy.
- [x] C-C. How walkthrough.
- [x] C-D. About + README.
- [x] C-E. Book labels.
- [x] V-A. Landing in spoken sentences.
- [x] V-B. Your shop, full sentences.
- [x] V-C. How walkthrough, ordinary talk.
- [x] V-D. About + README voice.
- [x] V-E. List, receipt, form chrome.
- [x] M-1. Motion tokens and reduced motion.
- [x] M-2. Routes and landing check.
- [x] M-3. List and guest check motion.
- [x] M-4. Walk landing, list, check, 390, print.
- [x] Session ship: screenshots, demo video, README Demo, LinkedIn
      draft, SHIPPED.

## This session

Ship. Screenshots, demo video, README Demo, LinkedIn draft.

## Next session

SHIPPED. Next chat in this repo: finished-product prompt if a
stranger still cannot land. Do not start a second product.

## Usefulness check

1. Who else? A shop or yard that already runs React and calls
   for the same stone or parts twice a year. They finish "what
   did we pay last time."
2. Their data? Yes. Pass a book of buys, or load JSON.
3. Make it theirs? Yes. Title, units, CSS in `src/lib/lastpaid.css`.
4. Take it? Yes. Copy `src/lib/` into their React `src/`.
5. No account? Yes. No signup. No npm publish.
6. Coworker test? Yes. Zip `src/lib/`. They import it.
7. Keep a copy? Yes. Download JSON.
8. Miss and recover? Yes. Blank item. Bad price. Empty book.
9. README says how? Yes. Copy `src/lib/`, import, props, three
   tool screenshots, github.com player.

## Go deep (done-means)

A person can add, open, edit, and remove their own buys. A buy
has more than a title (vendor, unit, price, date). Sample or
blank. Work stays after a refresh. JSON download works. Host
apps get `value` / `onChange`. Last price and the one before
are the useful line. A miss is recoverable. Escape cancels.
Quiet Remove. Old JSON still loads.

## SHIPPED means

Session plan checked. Usefulness 1-9 all yes. README has copy
`src/lib/`, import, props, three tool screenshots, and a
github.com player URL. Log marked SHIPPED. Do not SHIPPED until
screenshots and video. No second product in this repo.
