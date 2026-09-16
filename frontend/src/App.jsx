import Insights from './pages/Insights'
import KnowledgeBoost from './pages/KnowledgeBoost'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MoodLog from './pages/MoodLog'
import Journal from './pages/Journal'
import Chat from './pages/Chat'
import Report from './pages/Report'
import Clinics from './pages/Clinics'
import Consent from './pages/Consent'
import DoctorDashboard from './pages/DoctorDashboard'

function PatientOnly({ children }) {
  const token = localStorage.getItem('nirvana_token')

  if (
    !token ||
    token === 'null' ||
    token === 'undefined' ||
    token === ''
  ) {
    return <Navigate to="/login" replace />
  }

  return children
}

function DoctorOnly({ children }) {
  const token = localStorage.getItem('nirvana_token')
  const role = localStorage.getItem('nirvana_role')

  if (!token) return <Navigate to="/login" replace />

  if (role !== 'DOCTOR') {
    return <Navigate to="/patient/dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <PatientOnly>
              <Dashboard />
            </PatientOnly>
          }
        />

        <Route
          path="/patient/mood"
          element={
            <PatientOnly>
              <MoodLog />
            </PatientOnly>
          }
        />

        <Route
          path="/patient/journal"
          element={
            <PatientOnly>
              <Journal />
            </PatientOnly>
          }
        />

        <Route
          path="/patient/chat"
          element={
            <PatientOnly>
              <Chat />
            </PatientOnly>
          }
        />

        <Route
          path="/patient/wellness"
          element={
            <PatientOnly>
              <Report />
            </PatientOnly>
          }
        />

        <Route
          path="/patient/clinics"
          element={
            <PatientOnly>
              <Clinics />
            </PatientOnly>
          }
        />

        <Route
          path="/patient/consent"
          element={
            <PatientOnly>
              <Consent />
            </PatientOnly>
          }
        />

        <Route
          path="/patient/insights"
          element={
            <PatientOnly>
              <Insights />
            </PatientOnly>
          }
        />

        {/* 🌱 Knowledge Boost */}
        <Route
          path="/patient/knowledge-boost"
          element={
            <PatientOnly>
              <KnowledgeBoost />
            </PatientOnly>
          }
        />

        {/* Doctor Route */}
        <Route
          path="/doctor/dashboard"
          element={
            <DoctorOnly>
              <DoctorDashboard />
            </DoctorOnly>
          }
        />

        {/* Default Routes */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}