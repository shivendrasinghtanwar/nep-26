# UI Reference Brief — Himalayan Road-Trip Dossier (Nepal 2026 v2)

**Date:** 2026-05-04
**Scope:** Visual-language survey of 8 reference sites to inform a v2 redesign of `website/agent.html`, `website/map.html`, `website/gallery.html` (current rugged-expedition theme in `website/css/rugged.css`).
**Method:** WebFetch summaries of public pages, no logins, no JS-execution beyond what the fetcher renders. Two preferred sites (Patagonia stories, Outside Online) were unreachable on 2026-05-04 (Patagonia was serving a global maintenance/holding page; Outside Online front-doors all redirect to OIDC auth) — substituted with **Field Mag** (outdoor editorial) and **Adventure Journal**. Rivian R1T/R1S product pages returned hollow shells (server HTML carries only `<title>`); substituted with **Ineos Grenadier** which renders meaningful server HTML.

Reference excerpts and notes are kept under `docs/ui-refs/` (timestamped). The patterns we already employ in `rugged.css` are noted where they overlap.

---

## 1. Patagonia — *substituted: site was on a global holding page on 2026-05-04*

The Patagonia stories/journal URL returned a `Sit tight` maintenance shell with no hero, no card grid, no type system. The only design signal carryable from the holding page itself is Patagonia's habitual practice of **crediting the photographer in plain caps** at the bottom of the frame (`PHOTO: Sonnie Trotter`). That's a steal-worthy detail for our gallery and per-day photos: a small, all-caps photo credit chip in trail-dust on night-blue.

What Patagonia is known for in their editorial pages (and what we should pursue when the site comes back): full-bleed reportage photography with an **eyebrow / kicker / lede** stack (small caps category → big editorial headline → narrow column of intro lede), wide-margin single-column reading, generous photo-with-caption blocks, and an off-white-on-warm-grey palette. Treat as a placeholder; revisit once the site is restored.

**Visual one-liner:** holding page only — minimal centred sans-serif on white with a single photo credit. Not a useful sample today.

---

## 2. Field Mag (substitute for Outside Online)

Outside Online was unreachable: every front-door URL 302s to `accounts.outsideonline.com/oidc/o/authorize/...` because the site wraps even read-only content in a logged-in state probe. Substituted with **Field Mag**, which is a closer aesthetic match to our brief anyway (independent outdoor editorial, dossier feel).

- **Hero:** large-scale photography is the hero — a single full-width photograph (e.g. a Cornwall surfing story) sits above a very narrow text column. The wordmark, not a headline, anchors top-left.
- **Palette:** off-white / cream backgrounds, deep forest-green nature-photo dominance, sand/tan neutrals, black body text. Very muted. No saturated brand red or yellow.
- **Type:** custom Field Mag wordmark for brand, sans-serif body, no decorative serif. Editorial calm, not corporate slick.
- **Cards:** image-forward tiles, no borders — relying on whitespace and image contrast. Each card has a small category tag (e.g. *surfing*, *cycling*, *reviews*) above the headline and an author byline below.
- **Interactions:** sticky top nav. Carousel pager (01–05) for the issue showcase. Hover reveals on cards is implied.
- **Maps / data:** none on the journal grid.
- **Distinctive details:** **photo credits include the camera body and film stock** (e.g. "Shot on Pentax 67, Portra 400"). That's the dossier voice we want — gear-spec metadata as part of the credit, not just a photographer name. Asterisk (`***`) section separators in long-form reads.
- **Visual one-liner:** off-white page, one giant editorial photograph at top, a single column of restrained sans-serif beneath it, every photo credited with both photographer and camera/film, asterisk separators between scenes.

---

## 3. Land Rover Defender

- **Hero:** full-bleed cinematic photography — Defender driving on snow, in desert, over rock. All-caps display text *EMBRACE THE IMPOSSIBLE* with *SINCE 1948* as the kicker beneath. No parallax or SVG animation; it's photo-led.
- **Palette:** essentially achromatic — black, white, charcoal — letting paint colours pop in product shots. Only one named accent ("Slate Blue" as a paint option).
- **Type:** heavy all-caps display ("DEFENDER 130", "REFINED. ON YOUR MIND."), clean minimal body. Fonts not declared in markup.
- **Cards:** six identical vehicle cards — hero image, model name, single tagline, two stacked CTAs (`EXPLORE` / `BUILD YOUR OWN`).
- **Interactions:** sticky primary nav (VEHICLES / OWNERS / EXPLORE / SHOP NOW). No scroll-reveal animation in the markup.
- **Maps / data viz:** no diagrams; capacity is plain copy ("up to eight seats"). Interesting *negative* lesson: a flagship 4×4 brand chooses **not** to use spec dials or capability radar charts; it leans on photo + tagline.
- **Distinctive details:** model badges (`D7X-R`, `HARD TOP`) used as inline labels — text-as-stamp, no graphic frame.
- **Visual one-liner:** blacks and whites, all-caps Bebas-feeling display over cinematic 4×4 photography, every model presented as a six-card grid with stacked dual CTAs.

---

## 4. Rivian R1T/R1S — *JS-hollow shell on 2026-05-04, substituted with Ineos Grenadier*

`rivian.com/r1t` and `/r1s` both returned essentially title-only HTML (the body is rendered in the SPA). Reading this is fine for SEO inspection but useless as a design reference, so we pivot to **Ineos Grenadier** which renders meaningful prose server-side.

### Ineos Grenadier

- **Hero:** full-width imagery of vehicles in rugged terrain. Two product lines (Station Wagon, Quartermaster) anchor the page with `Test Drive` and `Explore` CTAs. Origin-story prose runs immediately under the hero — heritage as the lede.
- **Palette:** **utility-grade muted tones**. Earth, grey, natural-landscape colours. Deliberately avoids consumer-brand saturation. Closest of all references to our `rugged.css` night-blue / rust / dust system.
- **Type:** bold sans-serif display ("GRENADIER", "Station Wagon"), descriptive body copy ("Five-seat all-terrain 4X4", "Double-cab off-road pickup truck"). Functional, not lifestyle.
- **Cards / modules:** four parallel capability modules — *More Customisation*, *More Work*, *More Adventure*, *More Endurance*. Each is image + short prose. The "More X" parallelism is a tight rhetorical pattern we can borrow for Thar Roxx capability ribbons.
- **Interactions:** progressive disclosure on scroll; persistent header.
- **Data viz:** no charts. Achievement language ("million miles of testing") substitutes for graphs. Photo-of-real-terrain substitutes for capability dials.
- **Distinctive details:** voicy product copy — "Head off-road, head off-map. Crawl over rocks. Drag a trailer through a swamp if you like." — uses imperative second person and run-ons. Limited-edition badges (`Arcane Works. Detour`) double as fictional narrative hooks.
- **Visual one-liner:** muted earthy photography of a square-jawed 4×4 over four "More X" capability blocks, each with imperative-voice prose; no charts, no dials, just terrain photography and verbs.

---

## 5. Overland Journal

- **Hero:** full-bleed landscape photography (1500×844) overlaid with the table-of-contents headline (e.g. *"Georgia Badlands | Hiking Socks | Deserts of Mangystau | South Korea"*). Pipe-separated TOC headline is unusual and great — feels like a magazine cover.
- **Palette:** stacked white-and-black logo. Earthy desert tones from imagery. Restrained chromatic palette overall.
- **Type:** clean editorial sans throughout. No serif pairing observed. Very magazine-cover feel.
- **Cards:** issue grid — cover image, issue title, $16 price, `Quick Shop` button. The same card serves both browsing and commerce.
- **Interactions:** sticky nav with search, account, cart counter.
- **Maps / data:** no embedded maps on this hub.
- **Distinctive details:** the **pipe-separated TOC overlay** is the signature move. Strapline copy ("environmentally responsible, worldwide vehicle-supported expedition") under the masthead reads like a charter, not marketing.
- **Visual one-liner:** desert-photo cover with pipe-separated TOC across the top, a tidy grid of issue covers below, no chrome — like a print magazine projected onto a webpage.

---

## 6. Best Made Co.

- **Hero:** **full-bleed video hero** (Gerstner 41D Founder's Edition box). Material lede follows immediately: "Kiln-dried American cherry, plain sawn and finished with brass hardware." This is a *materials lede*, not a marketing lede — a model worth stealing for the Thar Roxx hero ("Steel ladder frame. 168 mm articulation. 230 N·m at 1500 rpm.").
- **Palette:** deep navy + warm cream + charcoal + brass/bronze metallics + natural wood tones. Monochromatic with metal accents. No bright colour anywhere.
- **Type:** bold uppercase geometric sans for headlines and nav; sans body. Utilitarian throughout.
- **Cards:** product cards centred — image, title, price, status badge (`SOLD OUT`, `NEW`). Story cards = full-width image with centred headline overlay and a `Discover more` link beneath.
- **Interactions:** sticky nav with logo, menu toggle, cart icon. Scroll-triggered content reveals.
- **Distinctive details:** **numbered brass data-plates on products** — physical-object metaphor in the UI. Hand-dyed Japanese textiles on hero photography. The "bandage" logo emphasises craft / repair ethos. Archive sensibility — products as heirlooms.
- **Visual one-liner:** cream page, bold uppercase nav, hero video of a cherrywood box, numbered brass data-plates as section markers, every product framed as an heirloom rather than an SKU.

---

## 7. REI Co-op Journal — *unreachable on 2026-05-04, substituted with Adventure Journal*

`rei.com/blog` and subpages either timed out or were closed by the server during three retries (likely WAF / rate limiter on automated UAs). Substituted with **Adventure Journal**, which is the right tone (independent print quarterly).

### Adventure Journal

- **Hero:** **typographic hero, not photographic** — large centred all-caps mission statement ("ADVENTURE JOURNAL IS A PRINTED QUARTERLY DEDICATED TO THE THRILL OF EXPLORATION AND THE JOY OF MOTION IN THE GREAT OUTDOORS"). A real outlier among references. Letting the text *be* the hero is a brave move that pays off in editorial credibility.
- **Palette:** neutral / minimal. Lots of white space. Dark text on white. No vibrant colours.
- **Type:** sans for headlines and body; tagline emphasises readability over ornament.
- **Cards:** featured image, category tag, headline, excerpt, `Read more` link. Product cards (single issues, merch) follow the same grid skeleton.
- **Interactions:** sticky nav (logo / menu / cart). No fancy reveal motion described.
- **Distinctive details:** brand voice asserts values ("solar-powered operations", "certified-sustainable paper", "reader-first, reader-supported") **as text, not as icons**. No badge with a leaf icon — the words *are* the badge.
- **Visual one-liner:** white page, type-as-hero, three plain card grids beneath, footer-as-manifesto. The opposite of an adventure-photography lead.

---

## 8. Intrepid Travel — Everest Base Camp 15-day

This is our highest-leverage reference because the page **is exactly the editorial we're building**: a multi-day Himalayan itinerary with day cards, elevation, distance, meals, and a route map.

- **Hero:** **full-bleed photo carousel**. Primary frame = trekkers on trail with overlay lede *"Walk among giants, test your limits and discover your strength"*. Secondary frames are unadorned (no text). One frame is an animated GIF route map.
- **Palette:** muted Himalayan naturals — slate greys, deep blues, warm earth tones, lots of whitespace. CTAs in a single warm accent. No prayer-flag rainbow on the page itself.
- **Type:** geometric sans throughout (likely Inter-class or similar). Bold for headers, light readable body.
- **Day-by-day card pattern (the steal):**
  - Header line: **`Day N • Location (elevation in m / ft)`** — e.g. `Day 4 • Namche Bazaar (3440 m / 11,286 ft)`.
  - Lede: a short narrative paragraph (2–4 sentences) telling the day's story.
  - Beneath the lede, three labelled rows in plain text (no icons): `Accommodation` / `Meals` / `Included activities`.
  - Trekking stats: `~3 hours`, `~8.5 km`, elevation gain/loss — granular but plain text, **not chips with icons**.
  - Optional activities are listed as inline links with USD pricing.
  - Days are wrapped in a `Show all` accordion — first 2–3 visible, rest collapsed.
- **Interactions:** sticky nav (logo + destination filter). Expandable accordion for the itinerary. Carousel for the photo strip and the route map.
- **Maps / route viz:** **animated GIF route map** in the carousel — labelled `Map of Epic Everest Base Camp Trek including Nepal`. No interactive Leaflet/Mapbox embed; it's a static asset. Per-day elevation gain/loss is in the day card text only — there's no continuous elevation profile chart.
- **Distinctive details:** travel-style badges (`Original`, `Basix`, `Comfort`, `Premium`), prominent star rating with review count (`5.0 | 888 reviews`), physical rating indicator, sale stickers (`Sale now on`), `Save up to USD X` chips. *Cultural references in prose* (Tengboche Monastery, Sherpa heritage) **without** a single icon — no prayer flag SVGs anywhere. They earn trust by knowing the names, not by sprinkling motifs.
- **Visual one-liner:** atmospheric photo carousel up top, a stack of `Day N • Location (elevation)` cards with narrative ledes and labelled meal/accommodation rows underneath, an animated GIF route map embedded as a sibling photo, no decorative iconography — it's basically a long magazine article with collapsible scenes.

---

## Patterns to steal (5–10 specific moves)

1. **Day card header convention from Intrepid:** `Day N • Location (m / ft)` with day number in our flag-yellow `Bebas Neue`, location in `Inter` and the elevation in `JetBrains Mono`. Replace any unstyled day headers with this single recurring pattern across `agent.html` itinerary answers, `map.html` waypoint popups, and a future `itinerary.html`.
2. **Materials lede from Best Made:** open the site / hero with a *materials/spec lede* instead of a marketing lede. Our v2 hero subhead becomes `4×4 Mahindra Thar Roxx · 168 mm articulation · 230 N·m · 14 days · 2,400 km` — JetBrains Mono, single line, no icons.
3. **Photo credit with gear from Field Mag:** every photo caption in `gallery.html` should carry photographer + body + lens (e.g. `PHOTO: SHIVE · iPhone 15 Pro · 24mm`). Use small caps, trail-dust on night-blue, monospace digits. Keeps the dossier feel without adding chrome.
4. **Pipe-separated TOC overlay from Overland Journal:** the homepage hero gains a single overlaid line `Sunauli | Beni–Jomsom | Muktinath | Kagbeni`. Replaces the current generic strapline with magazine-cover energy.
5. **"More X" parallel capability ribbon from Ineos:** four short capability blocks under the hero — *More Range. More Permits. More Backup. More Cash.* Each one a single sentence. We get the parallel-prose rhythm without needing a stat dial.
6. **Static GIF / SVG route map fallback from Intrepid:** keep Leaflet on `map.html`, but bake a static SVG/GIF fallback of the route into the hero of every other page. Loads instantly, gives the dossier feel, and survives offline / GH-Pages cold cache. Avoids the JS-only failure mode that kills Rivian's pages for crawlers.
7. **Plain-text stat rows from Intrepid (avoid icons):** `Accommodation: …  Meals: B/L/D  Distance: ~85 km  Gain: +420 m`. No SVG icons, no chips with backgrounds. Plain text in monospace. We currently use prayer-flag chips — keep them for *recommendations* but **demote stat rows to plain mono**. Iconography is reserved for tone, not data.
8. **All-caps Land-Rover-style dual CTA stack:** every dossier page footer ends with two stacked CTAs — `OPEN MAP` / `OPEN CHECKLIST` — Bebas Neue, all-caps, full-width on mobile, side-by-side on desktop. Replaces the inconsistent buttons we have today.
9. **Numbered brass data-plate motif from Best Made:** each section header gets a small brass-rectangle SVG with `§ N` etched into it. Rust on dust, two pixels of inset shadow. One graphic, used everywhere. Cheaper than a custom icon set; more characteristic.
10. **Adventure Journal type-as-hero option for `agent.html`:** the chat manager doesn't need a photo hero. Open it with a full-width all-caps statement (`THIS IS YOUR TRIP MANAGER. ASK IT ANYTHING ABOUT NEPAL 2026.`) — Bebas, alpine-night background, contour pattern overlay, then the chat. More confident than a stock mountain photo.

## Patterns to avoid

1. **Prayer-flag rainbow as decoration.** Intrepid — the actual Nepal operator — uses zero rainbow flags. Cultural cliché when applied as background bunting. Keep our prayer-flag chip motif **only** for recommendation tags, not anywhere else; do not put a rainbow stripe across the hero or footer.
2. **SVG icon for every data point.** Intrepid and Land Rover both prove the genre is more confident in plain text. Our current chip-with-icon-and-emoji style leans toward consumer-app territory. Demote to mono text where the value is data.
3. **Hand-drawn "summit" / "boot-print" trek illustrations.** Common in low-end Nepal trek operator sites; absent from every premium reference here. Skip entirely.
4. **JS-only data viz (e.g. three.js terrain, animated radar charts).** Rivian's hollow shells are the cautionary tale: aggressive SPA rendering eats SEO and our static-host benefits. Anything that *can* be a static SVG should be one.
5. **"Adventure awaits / discover yourself / unleash" copy.** None of the strong references use this voice. Best Made writes in materials, Ineos writes in imperatives, Intrepid writes in geography. Strip aspirational vagueness.

## Library / tech recommendations

- **Tailwind via Play CDN:** *no.* We already have a coherent custom token system in `rugged.css` (alpine-night, Thar rust, trail dust, flag yellow, glacier blue, prayer-flag green). Tailwind's defaults would dilute the brief into a generic theme and double our deps. Stay hand-rolled.
- **Alpine.js (3.x, ~17 KB min):** *yes.* Vanilla reactivity for the chat input, accordion day cards, gallery filter, layer toggles in `map.html` — without a build step. Single `<script defer src="...">` from CDN. Replaces a bunch of `addEventListener` boilerplate in `app.js`/`agent.js`.
- **GSAP vs AOS for scroll:** *AOS only*, if anything. AOS is ~14 KB and a `data-aos="fade-up"` attribute does 80 % of what we need. GSAP is overkill for a 4-page static site. Honestly we can also do it in 30 lines of `IntersectionObserver` and skip AOS entirely.
- **Lucide icons (web-component or inline SVG):** *yes — used sparingly.* Per the patterns-to-avoid note, restrict icons to nav, accordion chevrons, and a few category markers. Use Lucide via inline SVG to avoid a runtime dep; copy the few icons we need into `website/assets/icons/`.
- **mapbox-gl vs Leaflet:** *stay on Leaflet.* Our `map.html` already runs on Leaflet + OSM with zero API key, which is exactly the GH-Pages-friendly choice. Mapbox-gl would buy us prettier terrain shading at the cost of an API key (token rotation pain) and a 200 KB bundle. The Intrepid page itself uses an *animated GIF*, not even a real map — so Leaflet is plenty.
- **three.js / 3D terrain:** *no.* See "patterns to avoid" #4. If we want depth, use parallax CSS on the existing topographic SVG contour overlay; we already have the asset.

**Recommendation for a static GH-Pages site, install these 2:**
1. Alpine.js 3.x (CDN, defer-loaded) — for accordion, gallery filter, chat input reactivity.
2. Lucide icons (inline-SVG copies in repo, no runtime dep) — for the 5–6 icons we actually need.

Everything else stays vanilla. Keep Leaflet on `map.html` only. Skip Tailwind, GSAP, AOS, three.js, mapbox-gl.

## Color / type tokens — proposed `rugged.css` v2

Current tokens are good. v2 keeps the palette and adds three things:

```css
:root {
  /* existing — keep */
  --night:        #0a1424;
  --thar-rust:    #c8552a;
  --trail-dust:   #d4a574;
  --flag-yellow:  #e8b13a;
  --flag-green:   #3d8a5a;
  --glacier-blue: #5b9fcc;

  /* v2 additions */
  --paper:        #f1ead8;   /* warm off-cream for "field journal" sections,
                                inspired by Field Mag + Adventure Journal cream */
  --brass:        #b08a3e;   /* numbered data-plate motif (Best Made steal) */
  --ink:          #1a2436;   /* slightly lifted off --night for body on paper */

  /* type roles — names, not faces, so we can swap families later */
  --font-display:  "Bebas Neue", "Oswald", sans-serif;     /* day numbers, hero, all-caps CTAs */
  --font-body:     "Inter", system-ui, sans-serif;         /* prose, captions */
  --font-mono:     "JetBrains Mono", ui-monospace, monospace; /* elevation, distance, GPS, coords */
  --font-editorial: "Tiempos Text", "Source Serif 4", serif; /* OPTIONAL — only for long-form
                                                                day-by-day prose if we add an
                                                                itinerary.html. Keep dormant
                                                                until then. */
}
```

Three explicit role rules to encode into `rugged.css` v2:

- **Day-card header line** uses `--font-display` for the number, `--font-body` 600 weight for the place, `--font-mono` for the elevation in parentheses. One canonical class `.day-header` emits all three from a single piece of HTML.
- **Stat rows** are always `--font-mono` on `--paper` or `--font-mono` on `--night` with `--trail-dust` text. No icons, no chip backgrounds. This is the single biggest typographic shift from v1.
- **Photo credits** are `--font-mono`, `--trail-dust`, `text-transform: uppercase`, `letter-spacing: 0.08em`, `font-size: 0.7rem`. Always include camera body if known (Field Mag steal).

Prayer-flag chips, contour overlay, corner ticks on dossier cards — all retained from v1.

---

## Source health log (2026-05-04)

| Site | Status | Notes |
|---|---|---|
| patagonia.com/stories/ | down (maintenance) | Holding page only; not useful as reference today. |
| outsideonline.com (any path) | blocked | OIDC redirect on every front-door URL. |
| landrover.com/vehicles/defender | OK | Server-rendered enough to read. |
| rivian.com/r1t, /r1s | hollow SPA | Body rendered client-side; useless to a server fetcher. |
| ineosgrenadier.com/en | OK (substitute for Rivian) | Strong server HTML, real prose. |
| expeditionportal.com | 403 | Bot wall. |
| overlandjournal.com | OK | Magazine-cover layout legible. |
| bestmadeco.com | OK | Strong material-lede pattern. |
| howlerbros.com | OK | Reference for descriptive colour-naming and trip-card-style product grid. |
| rei.com/blog | timeout / closed connection | WAF or rate limiter likely. |
| adventure-journal.com | OK (substitute for REI) | Type-as-hero outlier; useful contrast point. |
| fieldmag.com | OK (substitute for Patagonia) | Strong photo-credit-as-spec pattern. |
| intrepidtravel.com /us/nepal/everest-base-camp-trek-167245 | OK | **Highest-value reference.** Day-card grammar, route-map-as-image, plain-text stats. |
| mountainmadness.com | 403 | Bot wall. |
| muchbetteradventures.com | OK (homepage) | Trip-card grammar, level badges. |
| gestalten.com | OK | Editorial/archive feel; serif headline cue. |
