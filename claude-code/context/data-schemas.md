# Data schemas

The website is driven by three JSON files in `/data/` plus a regenerated `website/js/data.js`. Any new file you create should follow the same conventions: ASCII-clean keys, snake_case avoided (use camelCase), ISO 8601 dates.

## `data/rules.json` — refresh-target schema

```jsonc
{
  "lastUpdated":  "2026-05-08",                    // ISO date in Asia/Kathmandu
  "verifyBefore": "2026-05-08",
  "officialSources": [
    { "label": "Nepal Department of Customs",   "url": "https://www.customs.gov.np/" },
    { "label": "Nepal Dept. of Transport Mgmt", "url": "https://www.dotm.gov.np/" },
    { "label": "Nepal Immigration",             "url": "https://immigration.gov.np/" },
    { "label": "Nepal Tourism Board",           "url": "https://www.welcomenepal.com/" },
    { "label": "NTNC / ACAP",                   "url": "https://ntnc.org.np/" }
  ],
  "rules": [
    {
      "category":   "Vehicle",                    // Identity | Vehicle | Customs | Driving | Fuel | Money | Connectivity | Insurance | Permits | Altitude | Restricted
      "title":      "Bhansar (Customs) permit",
      "detail":     "Daily fee at border. Pay 2–3 buffer days. Indicative range: NPR ____ for SUV.",
      "source":     "https://www.customs.gov.np/...",
      "fetchedAt":  "2026-05-08T09:13:00+05:45",
      "confidence": "official"                    // official | corroborated | inferred
    }
  ],
  "emergencies": [
    { "label": "Indian Embassy, Kathmandu", "value": "+977-1-4410900" }
  ]
}
```

### Confidence levels

| Level | Meaning |
|-------|---------|
| `official` | Quote/figure pulled directly from a `.gov.np` page. |
| `corroborated` | Stated vaguely on `.gov.np`, with the exact figure confirmed on a reputable secondary source (only count if the secondary is dated after 2026-01-01). |
| `inferred` | No source today corroborates this; carrying forward the prior baseline. Note in change report. |

## `data/itinerary.json` — read-only

```jsonc
{
  "trip": { "name": "...", "depart": "2026-05-09", "return": "2026-05-23", "nights": 14, "travellers": 2, "vehicle": "..." },
  "days": [
    {
      "day": 1, "date": "2026-05-09", "weekday": "Sat",
      "leg": "Bikaner → Noida", "km": 610, "hours": "9–10",
      "halt": "Noida",
      "type": "drive",          // drive | border | work | acclimatise | offroad | darshan | leisure
      "note": "..."
    }
  ]
}
```

## `data/checklist.json` — read-only

```jsonc
{
  "categories": [
    {
      "id":    "vehicle-docs",
      "title": "Vehicle Documents",
      "note":  "...",
      "items": [
        { "id": "v1", "label": "..." }
      ]
    }
  ]
}
```

## `data/hotels.json` — proposed shape (plan 03)

```jsonc
{
  "fetchedAt": "2026-05-07T...",
  "shortlist": [
    {
      "city":         "Pokhara",
      "checkIn":      "2026-05-12",
      "checkOut":     "2026-05-13",
      "candidates": [
        {
          "name":      "Tiger Palace Resort Bhairahawa",
          "rating":    4.6,
          "priceBand": "INR 6,500 / night",
          "fibre":     true,
          "url":       "https://...",
          "notes":     "..."
        }
      ]
    }
  ]
}
```

## `data/route_intel/` — proposed (plan 02)

A folder of dated markdown files capturing first-hand accounts:

```
data/route_intel/
├── beni_jomsom_20260507.md
└── mustang_landslides_20260507.md
```

Each file: source URL, post date, author, the relevant quote (≤ 2 sentences) + your one-line takeaway.
