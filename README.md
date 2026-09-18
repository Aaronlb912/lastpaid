# Last paid

You write down what you paid last time for stone, parts, or
anything you buy twice a year, so next time you can look it up
before you call. The green number is the last price. Click a
row if you want the older prices on a little receipt.

The demo starts on a first page, then you can try a sample shop
or put a name on this computer (optional numbers, not an
account). If you already run React, copy `src/lib/` into your
app and pass `value` and `onChange`. The prices in the demo
stay in the browser.

The sample is Creek Bed Stone. They last paid $51 for
Pennsylvania blue stone. Names are fake. Emails end in
`.example`.

## Who it is for

A shop or yard that already runs React and buys the same stone
or parts twice a year. They want last year's number before they
call again.

## Run the demo

```
npm install
npm start
```

Open http://127.0.0.1:48629/

- `/#/` first page
- `/#/in` name the list on this computer
- `/#/book` the list of prices
- `/#/how` how to use it
- `/#/about` if you already run a React app

Try Creek Bed Stone. Find Pennsylvania blue stone. The green
number is $51. Click the row for the older prices. Add a new
item if it is not on the list. Book saves a copy.

## Copy into your app

Skip the first pages if you already have a React app. Copy
`src/lib/` into your React `src/`.

```
import { Workspace, normalizeBook, sampleBook } from './lib/index.js'

<Workspace value={book} onChange={setBook} />
```

`value` is a book: `{ title, buys, sort }`. `sort` is `item`,
`date`, or `price`. A buy is `{ id, item, vendor, unit, price,
date, notes, sku, qty }`. `price` is a number. `qty` is optional.
`date` is YYYY-MM-DD. Old files still load if they use `name`
or `amount` instead of `item` and `price`.
