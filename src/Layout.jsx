import TopNav from './components/TopNav.jsx'
import EasterEggs from './components/EasterEggs.jsx'

export default function Layout({ children }) {
  return (
    <>
      <TopNav />
      {children}
      <EasterEggs />
    </>
  )
}
