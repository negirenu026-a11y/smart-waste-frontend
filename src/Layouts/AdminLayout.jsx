import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className='d-flex '>
      <Sidebar/>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default AdminLayout
