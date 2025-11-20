# Willett Single Barrel Lookup

A fast, mobile-friendly web app for tracking and classifying Willett Family Estate single barrel bottlings. Automatically identifies mashbill type and entry proof category from barrel codes using Willett's internal numbering schemes.

## Features

- 🔍 **Real-time search** across barrel codes, stores, cities, and mashbill types
- 🏷️ **Automatic classification** of 60+ barrel code ranges
- 📊 **Track details**: proof, age, price, ratings, tasting notes
- 📱 **Mobile-responsive** design with dark theme
- ⚡ **Static generation** for instant page loads
- ✅ **Runtime validation** with Zod schemas

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **React 19** (Server + Client Components)
- **Tailwind CSS** (Dark theme, responsive)
- **Zod** (Runtime validation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Project Structure

```
WFE-app/
├── app/
│   ├── bottle/[id]/
│   │   ├── page.tsx          # Bottle detail page
│   │   └── not-found.tsx     # 404 for missing bottles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (server component)
│   └── globals.css            # Tailwind styles
├── components/
│   └── BottleSearch.tsx       # Client-side search UI
├── data/
│   └── willett-barrels.json   # Bottle data (edit this!)
├── lib/
│   ├── types.ts               # TypeScript types & Zod schemas
│   ├── classifyBarrel.ts      # Barrel classification logic
│   ├── bottles.ts             # Data access layer
│   ├── classifyBarrel.test.ts # Classification tests
│   └── bottles.test.ts        # Data loading tests
└── README.md
```

## Managing Your Bottle Collection

### Adding a New Bottle

Edit `data/willett-barrels.json` and add a new entry:

```json
{
  "id": "barrel-12345",
  "barrelCode": "12345",
  "labelName": "Willett Family Estate Bourbon",
  "ageStatement": "7 year",
  "proof": 125.6,
  "selectedFor": "My Local Store",
  "city": "San Francisco",
  "state": "CA",
  "acquiredDate": "2024-03-20",
  "pricePaid": 149.99,
  "rating": 9.0,
  "tastingNotes": "Rich vanilla, oak, and dark fruit...",
  "comments": "Exceptional bottle!"
}
```

**Required fields:**
- `id` - Unique identifier (e.g., "barrel-12345")
- `barrelCode` - The barrel number (e.g., "12345")
- `labelName` - Bottle name

**Optional fields:**
- `ageStatement` - Age (e.g., "7 year")
- `proof` - Alcohol proof (number)
- `selectedFor` - Store/pick name
- `city`, `state` - Location
- `acquiredDate` - Purchase date (YYYY-MM-DD)
- `pricePaid` - Price (number)
- `rating` - Your rating (0-10)
- `tastingNotes` - Flavor notes
- `comments` - Additional notes

### Data Validation

The app validates all bottles against the Zod schema. If validation fails, you'll see a detailed error message:

```
Validation failed for 2 bottle(s) in willett-barrels.json:

  Entry 5 (id: "barrel-test"):
    - barrelCode: Required
    - rating: Number must be less than or equal to 10
```

### Testing Your Data

Run the validation tests:

```bash
# Test data loading and validation
npx tsx lib/bottles.test.ts

# Test barrel classification
npx tsx lib/classifyBarrel.test.ts
```

## Barrel Classification

The app automatically classifies barrels using Willett's internal numbering schemes:

### Classification Rules

- **3-digit codes** (90-989): Early ranges (e.g., 321 → original mashbill)
- **4-digit codes** (1000-9799): Most common (e.g., 9081 → wheated bourbon)
- **5-digit codes** (10500-38399): Extended series (e.g., 32101 → four grain)

### Examples

| Barrel Code | Mashbill Type | Entry Proof | Notes |
|-------------|---------------|-------------|-------|
| 9081 | wheated mashbill bourbon | - | - |
| 17123 | original mashbill | - | - |
| 20361 | high rye rye | - | - |
| 32101 | four grain (55/12/18/15) | - | American oak |
| 38310 | high rye bourbon | - | char 1 |
| 8612 | rye | - | Hoffmeister barrels |
| 6450 | high corn | high entry proof | - |

### Adding New Classification Rules

Edit `lib/classifyBarrel.ts` and add a new range check:

```typescript
if (inRange(40000, 40099)) {
  return {
    mashbillType: "your mashbill type",
    entryProofCategory: "high entry proof", // or null
    classificationNotes: "special notes", // or null
  };
}
```

Always add more specific ranges (5-digit) before less specific ones (4-digit, 3-digit).

## Search Features

The search bar filters bottles by:
- Barrel code
- Store/pick name (`selectedFor`)
- City
- State
- Mashbill type
- Label name

Search is **case-insensitive** and matches **partial strings**.

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy (zero configuration needed!)

The app uses static generation, so all pages are pre-rendered at build time for maximum performance.

## Development

### Run Tests

```bash
# Test barrel classification
npx tsx lib/classifyBarrel.test.ts

# Test bottle data loading
npx tsx lib/bottles.test.ts
```

### Lint & Type Check

```bash
# Lint
npm run lint

# Type check (runs during build)
npm run build
```

## Performance

- **Home page**: 1.44 kB
- **Detail pages**: 165 B each
- **First Load JS**: 102 kB (shared)
- **Build time**: ~17s for 13 bottles
- **Static generation**: All pages pre-rendered

## License

MIT

## Contributing

Feel free to fork and customize for your own collection!

---

Built with Next.js, React, TypeScript, and Tailwind CSS.
