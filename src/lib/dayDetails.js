/* Per-day reasoning, alternatives, hotel pick, and sources for each day
   in the itinerary. Surfaces the "why" behind decisions that aren't
   obvious from leg/km alone. The Itinerary page renders these inside
   an expandable "Show details" panel. */

export const DAY_DETAILS = {
  1: {
    why: 'Start the long expressway haul early. NH11 + WPE around Delhi to Noida is ~610 km, doable in a 9–10 h day with two long fuel stops. Keep the day buffered so you arrive Noida by 7 PM and avoid Delhi NCR rush.',
    bullets: [
      'Pre-loaded toll FASTag verified before Bikaner gate.',
      'Two fuel stops max — every state-border pump has HP/IOC nearby.',
      'No work today (hard offline) — wife is co-pilot, you focus on the wheel.',
    ],
    hotel: 'Radisson Blu MBD Sector 18, Noida (top pick) — secure parking, breakfast, work-friendly desk for the 14 May email triage.',
  },
  2: {
    why: 'The expressway-chain day. Yamuna → Agra–Lucknow → Purvanchal → Gorakhpur Link. Almost continuous expressway = the longest km but probably the easiest drive. Aim Gorakhpur by 7 PM to keep the next day rested for Sunauli.',
    bullets: [
      'No fuel stops on the expressway dead zones — top up at Mathura and Lucknow exits.',
      'Last secure-parking petrol station test before Nepal — confirm it tomorrow morning.',
    ],
    hotel: 'Ramada by Wyndham Gorakhnath Mandir Road — best parking + 24h F&B; near the bypass for an easy 7 AM start to Sunauli.',
  },
  3: {
    why: '**Stop at Bhairahawa, do NOT push to Pokhara.** Validated by `docs/DAY_3_BORDER_DECISION.md` — Sunauli border is 2–3 h typical / 4 h+ worst-case for an Indian-registered SUV with proprietor-authorised driver (mom-PAN auth letter chain). The Mahendra Highway Mugling–Pokhara stretch has a documented night-driving accident pattern (Trishuli river bus crash, KP 2026-02-23, 18 dead at 01:15 AM). Pushing through risks 13–14 h elapsed driving + dark mountain road = the most dangerous variable on the trip.',
    bullets: [
      'Border process: Indian customs exit → walk to Nepal side → Bhansar (customs) → Yatayat (transport) → tourist SIM → exchange counter. Allow 3 h minimum.',
      'Nepal cap day-counter starts here (1 of 30). Plan reads ~18 of 30.',
      'INR 100 / 200 / 500 widely accepted. INR 2000 NOT — leave them in the car.',
      'Buy NTC SIM at Sunauli, not Bhairahawa. Better Mustang coverage than Ncell.',
      'Lumbini side trip option: Mayadevi temple gate is ~25 km from Sunauli. Open 06:00–18:00. ~1.5 h end-to-end. Day 3 vs Day 14 is your call.',
    ],
    hotel: 'Two finalists — pick before booking. **Buddha Maya Garden by KGH (Lumbini)** in budget, 5-min walk to Mayadevi gate. **Tiger Palace by Soaltee (Bhairahawa)** over budget but best parking + casino F&B + closer to border. Your call: pilgrimage walkability vs splurge.',
    sources: [
      { label: 'DAY_3_BORDER_DECISION.md (full doc)', url: '/docs/DAY_3_BORDER_DECISION.md' },
      { label: 'Trishuli bus crash (Kathmandu Post 2026-02-23)', url: 'https://kathmandupost.com/' },
    ],
  },
  4: {
    why: 'The Mahendra Highway day, but in daylight and rested. Butwal → Mugling → Pokhara, ~190 km, 6–7 h with curve discipline. Buy ACAP permits in Pokhara that evening at the Nepal Tourism Board office or online at epermit.ntnc.org.np — never at Ghasa check-post (double fee).',
    bullets: [
      'Stay BEHIND buses on the Mugling–Pokhara curves. Don\'t overtake into blind bends.',
      'Top up fuel at Mugling — last reliable big pump before Beni.',
      '**ACAP cost: 2 × NPR 1,000 = NPR 2,000 (SAARC nationals).** Aadhaar / Voter ID accepted in lieu of passport for Indians.',
    ],
    hotel: 'Pokhara workation block starts here (4 of 6 nights). Top pick: **Waterfront Resort by KGH Group** — fibre verified, lake-facing, work-friendly desk.',
  },
  5: {
    why: 'First full work day in Pokhara. Settle the rhythm: stand-up → focused block → afternoon walk on Phewa Lakeside.',
    bullets: [
      'WorldLink/Vianet 50–150 Mbps SME plans verified at Lakeside cafes 20–50 Mbps. Speed-test on check-in.',
      'Fallback if hotel fibre is weak: Pokhara Coworking Space day pass.',
    ],
  },
  6: {
    why: 'Tar road via Naya Pul. Sleep at Tatopani (~1,200 m) to start the altitude curve gently before the Jomsom climb. Soak in the hot springs for tomorrow\'s legs.',
    bullets: [
      'Last reliable Pokhara pump = top up here, never Beni.',
      'Tatopani hot springs are public; INR 50–100 entry. Towel + slippers from hotel.',
    ],
    hotel: '**Shrestha Hotel HotSpring** — only ~3.5 h drive from Pokhara, on-route, hot-spring access included.',
  },
  7: {
    why: 'The 4×4 day. Beni → Jomsom is gravel, narrow, river crossings, multiple landslide-prone stretches (Tatopani–Ghasa is the worst). Engage 4WD-Low. Do NOT stop under loose slopes.',
    bullets: [
      'Slow pace through Tatopani → Ghasa → Lete → Tukuche → Marpha → Jomsom.',
      'Jomsom airstrip = altitude reference (2,720 m). Acclimatise overnight here, not Muktinath.',
      'Watch for: ataxia, severe headache, breathlessness. Diamox prophylaxis 24 h prior to Muktinath.',
      'ROUTE_CONDITIONS recommendation: **DRIVE** (verified 2026-05-04). Re-verify on 13 May in Pokhara before committing.',
    ],
    hotel: '**Hotel Om\'s Home, Jomsom** — top pick. **Phone-confirm electric heater (not just blanket) — wife on trip, May nights drop to ~5 °C.**',
  },
  8: {
    why: 'Pre-dawn start to beat the wind funnel that builds by noon in the Kali Gandaki valley. Climb past Kagbeni to Muktinath (3,800 m). 90 min for darshan + 108-spout bath. Back to Jomsom for lunch and rest.',
    bullets: [
      'Hard offline day. No work, no calls.',
      'Drone / sat phone confirmed banned — do not bring out of bag.',
      'AMS warning: descend immediately if ataxia / severe headache. Manipal Pokhara is the nearest competent altitude care.',
    ],
  },
  9: {
    why: 'Reverse the gravel descent. Easier than the climb but still attention-required at the same Tatopani–Ghasa landslide zone.',
    bullets: [
      'Recovery night in Pokhara — fibre + lakeside dinner. Sleep early.',
    ],
    hotel: 'Same Pokhara block (Waterfront / Atithi).',
  },
  10: { why: 'Pokhara work day 2. Solid focus block + Sarangkot sunset run if time permits.' },
  11: { why: 'Pokhara work + leisure mix. Buffer day — eats slip from the Mustang side if Day 7 / 8 / 9 ran late.' },
  12: { why: 'Pokhara work day 3. Last full day at the workation base. Print exit-side paperwork copies.' },
  13: {
    why: 'Reverse the Mahendra Highway in daylight. Buffer at Bhairahawa for the 14 May border exit. Same logic as Day 3 inbound: never do the border + a long drive in one day.',
    hotel: 'Bhairahawa pick (same shortlist as Day 3).',
  },
  14: {
    why: 'Border exit + Lucknow drive. Sunauli exit is faster than entry (no Bhansar verification needed for Indian vehicles leaving). Then ~600 km to Lucknow on Purvanchal.',
    bullets: [
      'Bhansar exit: hand back the pass at the counter. Yatayat: separate counter, fast.',
      'Last chance to spend NPR — convert at the Nepal-side exchange counter, INR-side rates are worse.',
      'Final India fuel at Gorakhpur — same drill as Day 2.',
    ],
    hotel: '**Lemon Tree Hotel, Lucknow** — top pick.',
  },
  15: {
    why: 'Home day. Lucknow → Bikaner via the same Purvanchal → Agra–Lucknow → Yamuna → WPE → NH11 chain. Hard offline.',
    bullets: [
      'Plan a buffer hour for Delhi NCR ring-road traffic.',
      'Re-verify the 30-day cumulative cap counter in your trip log: 14 / 30 used. 16 days remaining for any 2026 add-on.',
    ],
  },
}
