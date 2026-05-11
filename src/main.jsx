import './styles/stencil.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import AOS from 'aos'
import App from './App.jsx'

import './styles/rugged.css'
import './styles/landing.css'
import './styles/legacy-rendered.css'
import './styles/global.css'
import './styles/atmosphere.css'
import './styles/mountaineering.css'
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
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
