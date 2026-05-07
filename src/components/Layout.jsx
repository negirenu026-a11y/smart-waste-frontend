import { Outlet, useLocation } from 'react-router-dom'
import Navigation from './Navigation.jsx'
import Footer from './Footer.jsx'

export function SharedSpinner() {
  return null; // For now, we return null to avoid UI interference unless needed
}

function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isDashboard = location.pathname.startsWith('/dashboard') || location.hash.includes('/dashboard');

  return (
    <>
      {!isDashboard && <Navigation />}
      <main className={isDashboard ? "" : "page-main"}>
        <Outlet />
      </main>
      {!isAuthPage && !isDashboard && <Footer />}
    </>
  )
}

export default Layout
