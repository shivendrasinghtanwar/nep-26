import TopNav from './components/TopNav.jsx'

export default function Layout({ children }) {
  return (
    <>
      <TopNav />
      {children}
    </>
  )
}
