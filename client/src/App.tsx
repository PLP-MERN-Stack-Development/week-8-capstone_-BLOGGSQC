import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Dashboard from './components/Dashboard/Dashboard'
import Students from './pages/Students/Students'
import Teachers from './pages/Teachers/Teachers'
import Classes from './pages/Classes/Classes'
import Subjects from './pages/Subjects/Subjects'
import Attendance from './pages/Attendance/Attendance'
import Assignments from './pages/Assignments/Assignments'
import Notes from './pages/Notes/Notes'
import Analytics from './pages/Analytics/Analytics'
import Announcements from './pages/Announcements/Announcements'
import Calendar from './pages/Calendar/Calendar'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/students" 
            element={user ? (
              <Layout>
                <Students />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/teachers" 
            element={user ? (
              <Layout>
                <Teachers />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/classes" 
            element={user ? (
              <Layout>
                <Classes />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/subjects" 
            element={user ? (
              <Layout>
                <Subjects />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/attendance" 
            element={user ? (
              <Layout>
                <Attendance />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/assignments" 
            element={user ? (
              <Layout>
                <Assignments />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/notes" 
            element={user ? (
              <Layout>
                <Notes />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/analytics" 
            element={user ? (
              <Layout>
                <Analytics />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/announcements" 
            element={user ? (
              <Layout>
                <Announcements />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
          <Route 
            path="/calendar" 
            element={user ? (
              <Layout>
                <Calendar />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )} 
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App