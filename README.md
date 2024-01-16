# logistiksystem
## Endpoints
Generate/:? // to generate data
/Working/:warehouseIndex/:day/:jobtitle // Working in a warehouse on a given day with described jobtitle
Working/:warehouseIndex // Working at the given warehouse index, the first one is index 0
/Productsinstock/:productName // Product in stock with given name, ex Gloomhaven
/pickers/without/:param // pickers without order
/Orderstobe/picked/:? // Orders that havent been picked up yet but are assigned to a picker
/Orderstobe/driven/:oldestOrAll // returns either all orders that need to be driven or the oldest order that needs to be driven
/orders/:month/:totalOrSingle // returns either the most expensive order from the given month or the total from the given month
### Known bugs
- /orders/:month/:totalOrSingle returns the value for that month, disregarding year so orders from febuary 2021 and febuary 2022 both count towards the total.

****
To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.js
```

This project was created using `bun init` in bun v1.0.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
