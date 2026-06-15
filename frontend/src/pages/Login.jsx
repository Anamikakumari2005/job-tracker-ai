import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)
      const res = await API.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      localStorage.setItem('token', res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.status === 404) alert('❌ User not found! Please signup first!')
      else if (err.response?.status === 400) alert('❌ Wrong password! Please try again!')
      else alert('❌ Something went wrong!')
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Side — Branding */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 flex-col justify-between p-12 text-white">
      <img src="/logo.svg" alt="logo" className="w-8 h-8 mr-2 inline" />
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>Job Tracker AI 🎯</h1>

        <div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome Back! 👋</h2>
          <p className="text-lg opacity-80 mb-8">Track your jobs, generate cover letters, and land your dream job with AI!</p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-3">
              <span className="text-2xl">🔍</span>
              <span>Real Job Search from top companies</span>
            </div>
            <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-3">
              <span className="text-2xl">🤖</span>
              <span>AI Cover Letter in seconds</span>
            </div>
            <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-3">
              <span className="text-2xl">📄</span>
              <span>Resume Optimizer with AI</span>
            </div>
            <div className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-3">
              <span className="text-2xl">📊</span>
              <span>Track all your applications</span>
            </div>
          </div>
        </div>

        <p className="text-sm opacity-60">© 2026 Job Tracker AI — Built by Anamika Kumari</p>
      </div>

      {/* Right Side — Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <h1 className="text-2xl font-bold text-blue-600 mb-8 md:hidden">Job Tracker AI 🎯</h1>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-gray-500 mb-8">Enter your credentials to continue</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer text-lg"
          >
            Login →
          </button>

          <p className="text-center mt-6 text-gray-500">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')} className="text-blue-600 font-semibold hover:underline cursor-pointer">
              Sign Up
            </span>
          </p>

        </div>
      </div>

    </div>
  )
}