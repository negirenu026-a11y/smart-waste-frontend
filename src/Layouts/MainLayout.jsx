import React from 'react'
import Navigation from '../components/Navigation'
import { Outlet } from 'react-router-dom'
import Footer from "../components/Footer"

const MainLayout = () => {
  return (
    <div>
      <Navigation/>
      <main className="page-main">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default MainLayout
