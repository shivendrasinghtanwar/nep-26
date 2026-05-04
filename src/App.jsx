import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import AOS from 'aos'

import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import Itinerary from './pages/Itinerary.jsx'
import Checklist from './pages/Checklist.jsx'
import Rules from './pages/Rules.jsx'
import RoutePage from './pages/RoutePage.jsx'
import Agent from './pages/Agent.jsx'
import MapPage from './pages/MapPage.jsx'
import Gallery from './pages/Gallery.jsx'
import Folders from './pages/Folders.jsx'
import Viewer from './pages/Viewer.jsx'

function ScrollAndRefresh() {
  const loc = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => AOS.refreshHard(), 50)
  }, [loc.pathname])
  return null
}

export default function App() {
  return (
    <Layout>
      <ScrollAndRefresh />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
