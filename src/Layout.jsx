import TopNav from './components/TopNav.jsx'
import EasterEggs from './components/EasterEggs.jsx'
import PageGestures from './components/PageGestures.jsx'
import SwipeCue from './components/SwipeCue.jsx'
import TharPhotoEgg from './components/TharPhotoEgg.jsx'

export default function Layout({ children }) {
  return (
    <>
      <TopNav />
      {children}
      <EasterEggs />
      <PageGestures />
      <SwipeCue />
      <TharPhotoEgg />
    </>
  )
}
