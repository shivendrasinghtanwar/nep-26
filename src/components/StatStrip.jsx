import { useTMinus } from '../lib/useTMinus.js'

/**
 * StatStrip — horizontal grid of stat tiles with optional T-minus countdown.
 * Pass `stats` as an array of { k, v, u?, accent?, render? } objects.
 * Use { tminus: true } to inject the live T-minus tile (TRIP.depart).
 */
export default function StatStrip({ stats = [], 'data-aos': dataAos = 'fade-up' }) {
  const tminus = useTMinus()
  return (
    <section className="stat-strip" aria-label="Vitals" data-aos={dataAos}>
      {stats.map((s, i) => {
        if (s.tminus) {
          return (
            <div key={i} className="stat accent">
              <div className="k">T-minus</div>
              <div className="v">{tminus}<span className="u">d</span></div>
            </div>
          )
        }
        return (
          <div key={i} className={s.accent ? 'stat accent' : 'stat'}>
            <div className="k">{s.k}</div>
            <div className="v">
              {s.render ? s.render() : <>{s.v}{s.u && <span className="u">{s.u}</span>}</>}
            </div>
          </div>
        )
      })}
    </section>
  )
}
