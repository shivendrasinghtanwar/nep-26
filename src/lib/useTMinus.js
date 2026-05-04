import { useEffect, useState } from 'react'
import itineraryJson from '../../data/itinerary.json'

const DEPART_ISO = (itineraryJson?.trip?.depart || '2026-05-09') + 'T00:00:00+05:30'

function compute() {
  const dep = new Date(DEPART_ISO).getTime()
  return Math.max(0, Math.ceil((dep - Date.now()) / 86400000))
}

/** Days-until-depart, refreshed every minute. */
export function useTMinus() {
  const [n, setN] = useState(() => compute())
  useEffect(() => {
    const id = setInterval(() => setN(compute()), 60_000)
    return () => clearInterval(id)
  }, [])
  return n
}
