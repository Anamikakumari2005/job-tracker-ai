import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Application'
import JobSearch from './pages/JobSearch'
import CoverLetter from './pages/CoverLetter'
import ResumeOptimizer from './pages/ResumeOptimizer'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/resume-optimizer" element={<ResumeOptimizer />} />
        <Route path="/profile" element={<Profile />} />
<Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App