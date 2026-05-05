// Single source of truth for trip data. Re-exports the JSON files so
// pages can `import { rules, route, itinerary, ... } from '../lib/data'`.
//
// Vite 4+ handles JSON imports natively — no assertions / no top-level
// await needed.

import rulesData from '../../data/rules.json'
import routeData from '../../data/route.json'
import itineraryData from '../../data/itinerary.json'
import checklistData from '../../data/checklist.json'
import hotelsData from '../../data/hotels.json'

export const TRIP = {
  name: 'Nepal Workation 2026',
  callsign: 'NEP-26',
  depart: '2026-05-09',
  return: '2026-05-23',
  nights: 14,
  travellers: 2,
  vehicle: 'Mahindra Thar Roxx (Thar Digital Services)',
  capDays: 30,
  permitDaysUsed: 18,
  totalKm: 4050,
}

export const RULES = rulesData
export const ROUTE = routeData
export const ITINERARY = itineraryData?.days || []
export const CHECKLIST = checklistData
export const HOTELS = hotelsData
