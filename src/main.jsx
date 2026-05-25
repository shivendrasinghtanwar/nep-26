import './styles/stencil.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AOS from 'aos'
import App from './App.jsx'

import './styles/rugged.css'
import './styles/landing.css'
import './styles/legacy-rendered.css'
import './styles/global.css'
import './styles/atmosphere.css'
import './styles/mountaineering.css'
import './styles/recap.css'
import 'leaflet/dist/leaflet.css'
import 'aos/dist/aos.css'

AOS.init({
  duration: 550,
  easing: 'ease-out-cubic',
  once: true,
  offset: 30,
  disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      BrowserRouter with basename="/nep-26" — clean URLs on GH Pages.
      Direct-load of a known route (e.g. /nep-26/log) works because the
      Vite build mirrors index.html into each route's directory (see
      mirrorRoutesToIndex plugin in vite.config.js). Unknown paths fall
      back through public/404.html → the restore script in index.html
      (head) → BrowserRouter → App's <Navigate to="/" /> catchall.
    */}
    <BrowserRouter basename="/nep-26">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
