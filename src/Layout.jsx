import TopNav from './components/TopNav.jsx'
import EasterEggs from './components/EasterEggs.jsx'
import PageGestures from './components/PageGestures.jsx'
import SwipeCue from './components/SwipeCue.jsx'

export default function Layout({ children }) {
  return (
    <>
      <TopNav />
      {children}
      <EasterEggs />
      <PageGestures />
      <SwipeCue />
    </>
  )
}
