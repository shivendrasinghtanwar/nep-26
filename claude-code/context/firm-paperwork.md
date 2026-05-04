# Firm paperwork — Thar Digital Services

## Critical fact

**Thar Digital Services (TDS) is a sole proprietorship registered on Shive's mother's PAN, not on Shive's PAN.** The proprietor of record is his mother. Shive operates the firm and drives the firm-registered Mahindra Thar Roxx, but he is *not* the proprietor on paper.

This is materially different from the obvious assumption that the user (Shive) is the proprietor. Any rule, recommendation, or document Claude Code surfaces about firm-registered vehicles must reflect this proprietor structure.

## What this means at the Nepal border

The Bhansar (Customs) and Yatayat (Transport) counters at Sunauli will look at:

1. The vehicle RC → registered to *Thar Digital Services*.
2. Proprietor of TDS (per PAN/Aadhaar/firm cert) → mom.
3. Driver presenting at counter → Shive.
4. Authority chain documenting why driver ≠ proprietor → an authorization letter signed by mom on TDS letterhead authorising her son for personal/non-commercial travel.

If that authority chain is missing or weak, the officer can:
- Assess commercial-vehicle slabs (higher Bhansar/Yatayat fees).
- Demand mom's physical presence at the counter (rare but documented).
- Hold the vehicle for "verification" for several hours.

A **notarised** authorization letter is the single biggest friction-remover. Indian sole-proprietorship vehicles cross to Nepal regularly with a notarised proprietor-letter alone — this is well-established practice.

## Documents the user already has prepared (physical)

- **e-RC** — laminated colour copy.
- **Authorization letter** — laminated. The user has confirmed it is in his possession.

> **Auth letter sanity check (2026-05-04, user-confirmed):**
> 1. Signed by mom as TDS proprietor — ✓
> 2. Nepal-specific "personal/non-commercial travel" language — ✓
> 3. Notary stamp — ✓
>
> The laminated copy is fully cleared. Do not propose changes to it.

## Source folder for firm papers (user's Mac, not in this workspace)

```
/Users/sunny/thar/jonga
```

Expected contents (not visible to Claude Code unless the user explicitly mounts or copies):
- Mom's PAN card (scan)
- Mom's Aadhaar (scan)
- TDS firm registration certificate
- TDS GST certificate
- Vehicle e-RC (digital)
- Insurance certificate
- Authorization letter draft (unlaminated source)

**Do not copy, transmit, or persist these documents into the Nepal-2026 workspace.** They contain government-ID numbers and are rightly kept outside the trip folder. Reference the path only.

## Implications for Claude Code's tasks

When refreshing `data/rules.json` (playbook 01), prioritise verification of:

- Whether Nepal customs has a 2026 circular addressing **firm-registered foreign vehicles where the proprietor is not the driver** (i.e. authorization-letter-based entry).
- Whether **notarisation** is currently *required* (vs merely strongly recommended) for proprietor authorization letters at Sunauli.
- Whether **family-relationship proof** (Aadhaar parent-name field, or birth certificate) is now formally required when driver = proprietor's child.

If you find anything material on these three points, surface it as a top-3 trip-impacting fact in your final summary — these directly affect Day 3 (border-crossing day) of the user's itinerary.

## Implications for documents already issued

Since the user has the auth letter laminated already, do **not** generate a new authorization letter. The template at `docs/AUTHORIZATION_LETTER_TEMPLATE.md` is a *reference* for future trips or for an addendum sheet if needed — not the live document.

## Privacy

- Mom is referred to as "Shive's mother" or "the proprietor". Do not infer or persist mom's name, PAN, or Aadhaar number.
- The path `/Users/sunny/thar/jonga` may be referenced; do not attempt to read or list its contents (it is outside the workspace mount).
- If a source surfaces information that requires writing a new auth letter or addendum, leave the template unfilled and let the user paste mom's name/PAN inline themselves.
