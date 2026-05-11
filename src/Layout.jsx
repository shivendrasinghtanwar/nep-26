import TopNav from './components/TopNav.jsx'
import EasterEggs from './components/EasterEggs.jsx'
import PageGestures from './components/PageGestures.jsx'
import SwipeCue from './components/SwipeCue.jsx'
import TharPhotoEgg from './components/TharPhotoEgg.jsx'
import RainOverlay from './components/RainOverlay.jsx'
import RainEgg from './components/RainEgg.jsx'
import MuktinathEgg from './components/MuktinathEgg.jsx'
import RouteAsciiEgg from './components/RouteAsciiEgg.jsx'

export default function Layout({ children }) {
  return (
    <>
      <div className="topo-bg" aria-hidden="true" />
      <TopNav />
      {children}
      <EasterEggs />
      <RainOverlay />
      <PageGestures />
      <SwipeCue />
      <TharPhotoEgg />
      <RainEgg />
      <MuktinathEgg />
      <RouteAsciiEgg />
    </>
  )
}
