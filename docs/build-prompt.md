# TARGET 2026-09-17

What we paid last time. Item, vendor, unit, price, date. Look it
up before you call again. JSON in, JSON out. Drop `src/lib/` into
a React app you already have.

Prompt file (do not wait for a paste):
`C:\Users\aaron\OneDrive\Documents\prompts\other prompts\draft-30-prompt.md`

Continue later:
`C:\Users\aaron\OneDrive\Documents\prompts\multi-session-build-prompt-react.md`

Kind: last-price log. Not a who-owes split. Not a table editor of
current stock. Not a search-only list.

Local URL: http://127.0.0.1:48629/
Repo folder: `C:\Users\aaron\Documents\lastpaid`

Pages:
- Find: type an item. See the last pay, and the one before.
  Recent buys under that. Add a buy. Reset sample.
- Buy page: item, vendor, unit, price, date, notes. Save.
  Escape cancels.

Auth: none.

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
- [ ] L-B. Full history. Ticket lists every pay for that item,
      oldest first, last at the bottom.
- [ ] L-C. Paid again. Primary on the ticket. Prefills item,
      vendor, unit, last price, today.
- [ ] L-D. Vendor chips. From vendors in the book. Filter the
      sheet.
- [ ] L-E. Sort. Item, last date, last price. Stored on the book.
- [ ] L-F. Qty and sku. Optional. Last price stays per unit.
      Junk qty misses.
- [ ] L-G. High / low. Quiet on the ticket. Not a chart.
- [ ] L-H. Print. Print this ticket. Print the book. Chrome gone.
- [ ] L-I. Keyboard. j/k in the book, Enter opens the ticket,
      n adds. / find stays.
- [ ] L-J. Empty book. A blank check, not a lecture. Notes on
      the ticket if the last pay has them.
- [ ] L-K. Last change. Book row can show when the price last
      moved, quiet.
- [ ] L-L. Application CSS. Tabular lining figures, perforation,
      ticket number type, book density, focus, 390, print.
- [ ] Session ship: screenshots, demo video, README Demo, LinkedIn
      draft, SHIPPED.

## This session

L-A. Book is a wider last-price sheet. Ticket is a narrow guest
check with a tear and a number. Last pay is the money line.
Do not ship.

## Next session

L-B. Full history on the ticket, oldest first, last pay on the
bottom. Open this repo. Do not ship.

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
9. README says how? Session 1: who, run, local URL. Full copy
   `src/lib/` before SHIPPED.

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
