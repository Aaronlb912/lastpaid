export function sampleBook() {
  return {
    title: 'Creek Bed Stone',
    buys: [
      {
        id: 'buy-blue-2025',
        item: 'Pennsylvania blue stone',
        vendor: 'Ridge Quarry',
        unit: 'sq ft',
        price: 46.5,
        date: '2025-04-18',
        notes: 'First load for the Millvale walk. Ticket in the yard desk.',
      },
      {
        id: 'buy-blue-2026',
        item: 'Pennsylvania blue stone',
        vendor: 'Ridge Quarry',
        unit: 'sq ft',
        price: 51,
        date: '2026-03-11',
        notes: 'Nell Farber. nell@creekbed.example. Call before you order another pallet.',
      },
      {
        id: 'buy-pea-2025',
        item: 'Pea gravel 3/8',
        vendor: 'Holt Aggregates',
        unit: 'ton',
        price: 41,
        date: '2025-10-02',
        notes: 'Dale Pruitt. dale@creekbed.example.',
      },
      {
        id: 'buy-pea-2026',
        item: 'Pea gravel 3/8',
        vendor: 'Holt Aggregates',
        unit: 'ton',
        price: 38,
        date: '2026-05-22',
        notes: 'Same pit. They shaved three dollars.',
      },
      {
        id: 'buy-timber',
        item: 'Landscape timber 8ft',
        vendor: 'Holt Lumber',
        unit: 'each',
        price: 14.75,
        date: '2026-06-14',
        notes: 'Stacked by the fence. Ask Dale if the band is cut.',
      },
      {
        id: 'buy-crusher',
        item: 'Crusher run',
        vendor: 'Mill Creek Pit',
        unit: 'ton',
        price: 28,
        date: '2026-02-02',
        notes: 'Rita Alvarez. rita@creekbed.example. Used under the blue stone.',
      },
    ],
  }
}

export function sampleEmptyBook() {
  return {
    title: 'Creek Bed Stone',
    buys: [],
  }
}
