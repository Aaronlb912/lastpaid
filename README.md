# Last paid

What we paid last time for the same thing. Item, vendor, unit,
price, date. Look it up before you call again.

Drop `src/lib/` into a React app you already have. Host apps pass
`value` and `onChange`. The demo keeps the book in the browser.

The sample is Creek Bed Stone. Names are fake. Emails end in
`.example`.

## Who it is for

A shop or yard that already runs React and buys the same stone
or parts twice a year. They finish "what did we pay last time."

## Run the demo

```
npm install
npm start
```

Open http://127.0.0.1:48629/

- `/#/` landing
- `/#/in` sign in (shop name, optional PIN on this browser)
- `/#/book` the last-price book
- `/#/how` how to use it
- `/#/about` local copy, no account

Find an item. Last pay is the useful number. Open a row for the
guest check. Add a buy. Download JSON from Book.

## Copy into your app

Copy `src/lib/` into your React `src/`.

```
import { Workspace, normalizeBook, sampleBook } from './lib/index.js'

<Workspace value={book} onChange={setBook} />
```

`value` is a book: `{ title, buys, sort }`. `sort` is `item`,
`date`, or `price`. A buy is `{ id, item, vendor, unit, price,
date, notes, sku, qty }`. `price` is a number. `qty` is optional.
`date` is YYYY-MM-DD. Old files still load if they use `name`
or `amount` instead of `item` and `price`.
