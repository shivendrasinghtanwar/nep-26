# Rules Change Report — 2026-05-04

Compiled by Claude Code's parallel-agent crawl pass against `/data/rules.prior.json`.
Six agents fanned out across `customs.gov.np`, `dotm.gov.np`, `immigration.gov.np`, `ntnc.org.np` + `epermit.ntnc.org.np`, `welcomenepal.com` (replaced by `ntb.gov.np`), `indembkathmandu.gov.in`, and two reputable secondary sources for cross-reference.

## Summary

- Confirmed unchanged: **6**
- Changed: **4** (1 Bhansar fee, 1 embassy phone, 1 Upper Mustang structure, 1 acceptable-IDs)
- New rules picked up: **5**
- Inferred (no live source today): **10**

## Confirmed unchanged

- 30-day cumulative annual cap for Indian-registered vehicles — still in force, same threshold.
- ACAP fee for SAARC nationals — still **NPR 1,000** per person (single entry).
- Indian visa-free regime under the 1950 Treaty of Peace and Friendship.
- Lower-Mustang boundary placement: **Jomsom, Kagbeni, Muktinath remain Lower** (open). Kagbeni has NOT been reclassified into restricted.
- INR 100 / 200 / 500 widely accepted; INR 2000 notes still rejected.
- Mustang fuel scarcity — Beni and Jomsom remain the only reliable pumps en route.

## Changed

| Rule | Prior value | New value (2026) | Source | Recommended action |
|------|-------------|------------------|--------|--------------------|
| **Bhansar daily fee (SUV)** | "Daily fee at border. Pay 2–3 buffer days." (no figure) | **NPR 600/day for four-wheelers** at Gaur Customs Office (KP 2026-04-17). Three-wheelers NPR 400, motorbikes NPR 200. Older Indian-consulate range NPR 250–500/day. | https://kathmandupost.com/.../madhesh-crackdown-on-indian-registered-vehicles | **Bump INR cash floor.** Budget NPR 600/day × 18 days ≈ NPR 10,800 (≈ INR 6,800) for Bhansar alone. Update the **money** category of the master checklist. |
| Indian Embassy Kathmandu phone | `+977-1-4410900` | `+977-1-4423702` (general reception); `+977-9851316807` (24×7 emergency); `cons.kathmandu@mea.gov.in` (consular email) | https://www.indembkathmandu.gov.in/page/contacts/ | Save both new numbers. Old `+977-1-4410900` does **not** appear anywhere on the embassy site as of 2026-05-04 — it appears to be stale. |
| Upper Mustang permit cost | "USD 500 / 10 days" minimum | **USD 50 / person / day, flat** — no minimum, no 10-day floor | https://www.immigration.gov.np/page/trekking-route-and-permit-fee | Not relevant to this trip (Muktinath is Lower Mustang). Update for future reference / casual reader. |
| Acceptable IDs at air entry | "Voter ID, OR PAN/Aadhaar; Aadhaar alone is weak" | **Passport (preferred) OR original ECI Voter ID. Aadhaar NOT accepted. PAN NOT listed.** | https://www.immigration.gov.np/page/information-for-indian-nationals + https://www.indembkathmandu.gov.in/page/valid-travel-documents/ | Carry passport. Voter ID as backup. Drop Aadhaar from the ID short-list. |

## New rules picked up

1. **ACAP at-checkpost surcharge.** Buying the ACAP permit at a check-post inside the conservation area (e.g. Ghasa) costs **DOUBLE**. Always buy online at `epermit.ntnc.org.np` or at the Pokhara/Simpani counter before driving up.
2. **ACAP for Indian SAARC — alternate IDs.** NTNC's e-permit FAQ explicitly accepts **Aadhaar OR Voter ID** in lieu of passport for Indian SAARC nationals (this is *more* permissive than Nepal Immigration's air-entry list).
3. **TIMS card explicitly NOT required for road Jomsom-Muktinath.** NTB's revised TIMS provision lists only "Upper Mustang Trek" and "Sarebung Pass Trek" under Mustang. Lower-Mustang road travel is exempt — don't pay it pre-emptively.
4. **Upper Mustang restructured to USD 50/day flat** (no more 10-day minimum).
5. **Indian Embassy Kathmandu 24×7 emergency line: `+977-9851316807`.** This is the after-hours number for distressed Indian citizens.

## Could not verify (now `inferred`)

- Yatayat (Transport) permit daily fee — neither DOTM nor any reputable secondary source quotes a 2026 figure. Confirm at Sunauli on 2026-05-11.
- PUC certificate requirement for Indian vehicles entering Nepal — not listed by Customs or by Indian Embassy Indian-Vehicles page. Carry one anyway as defensive doc.
- Firm-registered SUV authorization letter format — no source page details required form. Use the in-repo template.
- Used personal electronics exemption — Customs FAQ addresses only returning Nepali residents' personal effects; tourist-visit treatment is not on the page.
- New unboxed goods rule — no 2026 update.
- Nepal third-party motor insurance fee at Sunauli — no source page details current price.
- NTC vs Ncell coverage trade-off — operator pages not scraped (out of scope for this pass).
- Drones / sat phones ban — no 2026 circular found; rule carried forward.
- Muktinath altitude protocol (Diamox, ataxia warning) — medical advice, not a govt-source-checkable rule.
- Driving rules (speed limits, lights ON, alcohol zero-tolerance) — DOTM has no foreign-driver page.

## Source health notes (worth remembering)

- ⚠️ **`welcomenepal.com` is hijacked.** The domain 301-redirects (via Cloudflare) to `https://openingparliament.org/organizations`, an unrelated parliament-monitoring site. Tried `https://www.`, `https://`, `http://www.` — all redirect identically. Either NTB let the domain lapse and someone is squatting, or DNS is misconfigured. **Canonical Nepal Tourism Board is now `ntb.gov.np`** — the website's `officialSources` array has been updated.
- ⚠️ **`customs.gov.np` and `dotm.gov.np` are JS-rendered hollow shells.** Server-side HTML contains only the chrome (nav, footer, lists). Body content is hydrated client-side via AJAX after page load. `curl` retrieves zero useful prose from any content/N/ article-detail page. Upshot: the Indian Embassy's Indian-Vehicles page (which IS server-rendered and detailed) carried the load for this pass.
- ⚠️ Possible XSS attempt on `indembkathmandu.gov.in/page/contacts/` (one phone number field has `+977-1-4413347alert('XSS')`, HTML-escaped, so harmless to render). Indicates a sanitisation bug on the .gov.in CMS. Trip impact: nil.

---

*Re-run this pass on 2026-05-08 to satisfy the `verifyBefore` deadline. The fetch log lives at `/data/rules.fetch_log.json`; raw pages at `/data/rules.raw/`.*
