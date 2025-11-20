# Willett Barrel Decoder

A public reference tool for decoding Willett Family Estate barrel codes. Instantly identify mashbill types, entry proof categories, and barrel characteristics from Willett's internal numbering schemes.

## Purpose

This is a **neutral reference database** and decoder for Willett barrel codes - not a personal collection tracker. It helps whiskey enthusiasts, collectors, and retailers understand what a Willett barrel code means.

## Features

- 🔍 **Barrel Decoder** - Enter any barrel code to instantly identify its classification
- 📋 **Browse Rules** - Searchable database of 62 barrel code ranges and their classifications
- 📚 **Known Releases** - Reference database of known Willett Family Estate single barrel releases
- 📱 **Mobile-Responsive** - Clean, dark-themed interface that works on all devices
- ⚡ **Lightning Fast** - Static generation for instant page loads
- 🎯 **Public Reference** - No login, no tracking, just information

## What is a Barrel Code?

Willett Family Estate uses internal numbering schemes to track barrels. The barrel code reveals:
- **Mashbill Type** (e.g., high rye bourbon, wheated bourbon, low rye rye)
- **Entry Proof Category** (high or low entry proof)
- **Special Notes** (e.g., aged in Hoffmeister barrels, char level, experimental batches)

## Examples

| Barrel Code | Mashbill Type | Entry Proof | Notes |
|-------------|---------------|-------------|-------|
| 9081 | wheated mashbill bourbon | - | - |
| 17123 | original mashbill | - | - |
| 20361 | high rye rye | - | - |
| 32145 | four grain (55/12/18/15) | - | American oak |
| 38310 | high rye bourbon | - | char 1 |
| 8612 | rye | - | Hoffmeister barrels |
| 4728 | high rye bourbon | - | - |
| 6450 | high corn | high entry proof | - |

## Tech Stack

- **Next.js 15** (App Router, TypeScript, Server Components)
- **React 19** (Server + Client Components)
- **Tailwind CSS** (Dark theme, responsive design)
- **Zod** (Runtime data validation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/WFE-app.git
cd WFE-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the decoder.

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
│   ├── api/decode/           # API route for barrel decoding
│   ├── rules/                # Browse rules page
│   ├── releases/             # Known releases page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (decoder)
├── components/
│   ├── BarrelDecoder.tsx     # Main decoder UI
│   ├── RulesBrowser.tsx      # Rules browsing UI
│   └── ReleasesBrowser.tsx   # Releases browsing UI
├── data/
│   ├── barrel-rules.json     # 62 classification rules
│   └── releases.json         # Known public releases
├── lib/
│   ├── types.ts              # TypeScript types & Zod schemas
│   └── decoder.ts            # Data access & decoding logic
└── README.md
```

## Data Files

### barrel-rules.json

Contains 62 barrel classification rules with:
- `id` - Unique identifier
- `minCode` / `maxCode` - Barrel code range
- `patternLabel` - Human-readable pattern (e.g., "90xx–91xx")
- `mashbillType` - Classification (e.g., "wheated mashbill bourbon")
- `entryProofCategory` - Entry proof level (if applicable)
- `notes` - Special characteristics (if applicable)

### releases.json

Reference database of known Willett releases with:
- `id` - Unique identifier
- `barrelCode` - The barrel number
- `labelName` - Bottle label
- `ageStatement`, `proof` - Specs (if known)
- `selectedFor` - Store or barrel pick group
- `city`, `state` - Location
- `releaseYear` - Year released

## Adding Data

### Adding New Classification Rules

Edit `data/barrel-rules.json` and add a new rule:

```json
{
  "id": "rule-063",
  "minCode": 40000,
  "maxCode": 40099,
  "patternLabel": "400xx",
  "mashbillType": "your mashbill type",
  "entryProofCategory": null,
  "notes": null
}
```

More specific ranges (smaller range, exact matches) take precedence.

### Adding Known Releases

Edit `data/releases.json` and add a new release:

```json
{
  "id": "release-4728",
  "barrelCode": "4728",
  "labelName": "Willett Family Estate Bourbon",
  "ageStatement": "6 year",
  "proof": 120.5,
  "selectedFor": "Store Name",
  "city": "City",
  "state": "State",
  "releaseYear": 2024
}
```

The decoder will automatically classify it using the barrel code.

## How It Works

1. **User enters a barrel code** (e.g., "9081")
2. **API normalizes to integer** (9081)
3. **Searches barrel-rules.json** for matching range
4. **Returns classification** with mashbill type and notes
5. **Displays result** with all relevant information

The decoder prioritizes:
- Exact matches first (minCode === maxCode)
- Smaller ranges before larger ranges
- First match wins

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy (zero configuration needed!)

All pages use static generation for maximum performance.

## Performance

- **Home page (decoder)**: 1.62 kB
- **Browse Rules page**: 1.42 kB
- **Known Releases page**: 1.36 kB
- **API route**: 123 B
- **First Load JS**: 102 kB (shared)
- **Build time**: ~8s for 62 rules + 11 releases

## Contributing

This is a community reference tool. Contributions welcome:

1. **New barrel rules** - If you know of undocumented ranges
2. **Known releases** - Add public barrel picks to the database
3. **Corrections** - Fix any incorrect classifications
4. **Improvements** - UI/UX enhancements

Please open an issue or PR on GitHub.

## Data Sources

Barrel classification rules compiled from:
- Public Willett barrel pick information
- Community knowledge and documentation
- Verified single barrel releases

## License

MIT

## Disclaimer

This is an unofficial community tool. Not affiliated with Willett Distillery or Kentucky Bourbon Distillers. Classification information is provided as-is for reference purposes.

---

Built with Next.js, React, TypeScript, and Tailwind CSS.
