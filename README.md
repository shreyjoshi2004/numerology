# Art of Numerology

Compute Vedic name numbers (*Mulank*, *Bhagyank*) and find available Twilio
phone numbers whose digits resonate with them.

The repo ships in two halves:

- **`/` (Python CLI)** — original scripts for batch searching Twilio inventory
  and exporting ranked CSVs.
- **`web/` (Next.js app)** — production web UI at *Art of Numerology* with
  the name-number and Ank Kundali logic ported to TypeScript.

## What it does

In Vedic numerology every digit carries a vibration. Given a date of birth:

- **Mulank** — the digital root of the *day* of birth (1–9).
- **Bhagyank** — the digital root of the *full* date of birth.

Given a name, each letter maps to a value via the Chaldean/Vedic letter chart
in `name_number.py` / `web/lib/numerology.ts`; the values sum and reduce to a
single digit (the *name number*).

Given a `(Mulank, Bhagyank)` pair, the phone search finds Twilio
`AvailablePhoneNumbers` that satisfy:

1. ≥ 50 % of the post-country-code digits are Mulank or Bhagyank.
2. The repeated digital root of those digits equals Mulank or Bhagyank.

Results are sorted by BN/DN density, longest BN/DN run, and longest repeat
run.

## Search strategy

Twilio's `Contains` parameter is a single-digit-wildcard match — no character
classes — so the search enumerates length-`k` patterns drawn from
`{Mulank, Bhagyank}` and issues one `Contains=<pattern>` request per pattern.

A single fixed `k` is too narrow (especially when `Mulank == Bhagyank`, where
`k=5` collapses to one pattern like `55555`). The CLI searches across
multiple anchor lengths (default `2,3,4,5`), unions the responses, dedupes by
phone number, and applies the post-filter. Twilio caps each `Contains` query
at `PageSize` results regardless of true inventory, and different lengths
empirically sample disjoint slices of inventory — so more anchors strictly
yield more candidates.

`debug_anchors.py` is a one-off harness comparing per-length hit counts and
overlaps for a fixed `(BN, DN)` pair.

## Python CLI

Requires Python 3.10+ and `requests`.

```bash
pip install requests
cp .env.example .env   # then fill in Twilio credentials
```

`.env` keys:

```
TWILIO_ACCOUNT_SID=...
# Either an API key pair (preferred):
TWILIO_API_KEY_SID=...
TWILIO_API_KEY_SECRET=...
# Or a legacy auth token:
TWILIO_AUTH_TOKEN=...
```

Run the phone search:

```bash
./numerology.py --bn 3 --dn 8                       # US, default k=2,3,4,5
./numerology.py --bn 1 --dn 5 --country US -k 3,4   # custom anchor lengths
./numerology.py --bn 3 --dn 8 --area-code 415       # area code filter
```

Output: a sorted CSV at `ranked_phone_numbers.csv` plus a top-10 preview on
stderr.

Compute a name number:

```bash
./name_number.py "Shrey Joshi"
./name_number.py -q "Shrey Joshi"   # just the reduced digit
```

## Web app (`web/`)

Next.js 15 (App Router) + React 19 + Tailwind v4.

- **Name number** — enter a name; see the per-letter breakdown and reduced
  root.
- **Ank Kundali** — enter a date of birth; see the Vedic grid chart.

### Local development

```bash
cd web
npm install
npm run dev
```

Open <http://localhost:3000>.

### Deploy

The `web/` directory is set up for Vercel (`vercel.json` declares
`framework: nextjs`).

## Repository layout

```
numerology.py          Twilio search CLI — anchor expansion, post-filter, CSV
name_number.py         Vedic letter chart → name number CLI
debug_anchors.py       Per-length anchor hit / overlap diagnostic
ranked_phone_numbers.csv   Sample CLI output

web/
  app/
    page.tsx           Landing page (tool tiles)
    layout.tsx         Fonts, OpenGraph metadata, page chrome
  components/
    NameCalculator.tsx
    AnkKundaliCalculator.tsx
    PageMandala.tsx    Background SVG ornament
    Tooltip.tsx
  lib/numerology.ts    TS port of digit-root, name-number, Ank Kundali helpers
```

## Credits

By [Shrey Joshi](https://shreyjoshi.com).
