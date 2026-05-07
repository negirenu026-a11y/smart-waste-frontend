import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainLayout from './Layouts/MainLayout'
import DashboardLayout from './Layouts/DashboardLayout'

// Pages
import Home from './pages/Home'
import Auth from './pages/Auth'
import About from "./pages/About"
import Services from "./pages/Services"
import Causes from "./pages/Causes"
import Contact from "./pages/Contact"
import Events from "./pages/Events"
import Blog from "./pages/Blog"
import Gallery from "./pages/Gallery"
import Donation from "./pages/Donation"
import Volunteer from "./pages/Volunteer"
import VolunteerForm from "./pages/VolunteerForm"

// Admin Pages
import AdminDashboard from './panels/admin/pages/Dashboard'
import Managemc from './panels/admin/pages/Managemc'
import Manageareas from './panels/admin/pages/Manageareas'
import Managecitizens from './panels/admin/pages/Managecitizen'
import Managecomplaints from './panels/admin/pages/Managecomplaints'
import Managetasks from './panels/admin/pages/Managetasks'

// Citizen Pages
import CitizenDashboard from './panels/citizen/pages/Dashboard'
import Register from './panels/citizen/pages/Register'
import CitizenRoutes from './panels/citizen/citizenRoutes'

// MC Pages
import McDashboard from './panels/mc/pages/Dashboard'
import ManageWorkers from './panels/mc/pages/Manageworker'
import McManageComplaints from './panels/mc/pages/Managecomplaints'
import McManageTasks from './panels/mc/pages/Managetasks'
import McReports from './panels/mc/pages/WeeklyReport'

// Shared Components
import SettingsModule from './components/dashboard/SettingsModule'


import AdminReports from './panels/admin/pages/AdminReports'
import { SearchProvider } from './context/SearchContext'

const App = () => {
  return (
    <BrowserRouter>
      <SearchProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
        <Routes>
        {/* Public Routes */}
        <Route path='/auth' element={<Auth />} />
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='services' element={<Services />} />
          <Route path='causes' element={<Causes />} />
          <Route path='contact' element={<Contact />} />
          <Route path='events' element={<Events />} />
          <Route path='blog' element={<Blog />} />
          <Route path='gallery' element={<Gallery />} />
          <Route path='donation' element={<Donation />} />
          <Route path='volunteer' element={<Volunteer />} />
          <Route path='volunteer-form' element={<VolunteerForm />} />
        </Route>

        {/* Admin Routes */}
        <Route path='/admin' element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path='manage-mc' element={<Managemc />} />
          <Route path='manage-areas' element={<Manageareas />} />
          <Route path='manage-citizens' element={<Managecitizens />} />
          <Route path='manage-complaints' element={<Managecomplaints />} />
          <Route path='manage-tasks' element={<Managetasks />} />
          <Route path='review-reports' element={<AdminReports />} />
          <Route path='settings' element={<SettingsModule />} />
        </Route>

        {/* Citizen Routes */}
        <Route path='/citizen' element={<DashboardLayout role="citizen" />}>
          <Route index element={<CitizenDashboard />} />
          <Route path='register' element={<Register />} />
          <Route path='settings' element={<SettingsModule />} />
          <Route path='*' element={<CitizenRoutes />} />
        </Route>

        {/* MC Routes */}
        <Route path='/mc' element={<DashboardLayout role="mc" />}>
          <Route index element={<McDashboard />} />
          <Route path='manage-workers' element={<ManageWorkers />} />
          <Route path='complaints' element={<McManageComplaints />} />
          <Route path='tasks' element={<McManageTasks />} />
          <Route path='reports' element={<McReports />} />
          <Route path='settings' element={<SettingsModule />} />
        </Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </SearchProvider>
    </BrowserRouter>
  )
}

export default App
