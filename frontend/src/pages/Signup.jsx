import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async () => {
    try {
      const res = await API.post('/auth/signup', { name, email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      if (err.response?.status === 400) alert('❌ Email already registered!')
      else alert('❌ Something went wrong!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <nav className="flex justify-between items-center px-8 py-4">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/login')}>Job Tracker AI 🎯</h1>
          <button onClick={() => navigate('/login')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 cursor-pointer">
            Login
          </button>
        </nav>

        <div className="text-center py-12">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey! 🚀</h2>
          <p className="text-xl opacity-80">Create your free account and land your dream job!</p>
        </div>
      </div>

      {/* FEATURES */}
      <div className="py-12 px-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <h3 className="font-bold text-gray-800">Real Job Search</h3>
            <p className="text-gray-500 text-sm mt-1">Search from top companies!</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl mb-3">🤖</p>
            <h3 className="font-bold text-gray-800">AI Cover Letter</h3>
            <p className="text-gray-500 text-sm mt-1">Generate in seconds!</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl mb-3">📄</p>
            <h3 className="font-bold text-gray-800">Resume Optimizer</h3>
            <p className="text-gray-500 text-sm mt-1">AI powered suggestions!</p>
          </div>
        </div>

        {/* SIGNUP FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account 🚀</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            Create Account →
          </button>

          <p className="text-center mt-4 text-gray-500 text-sm">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline cursor-pointer">
              Login
            </span>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-8 text-center mt-8">
        <p className="text-xl font-bold mb-2">Job Tracker AI 🎯</p>
        <p className="text-gray-400 text-sm">Built with ❤️ by Anamika Kumari</p>
        <p className="text-gray-400 text-sm mt-1">© 2026 All rights reserved</p>
      </footer>

    </div>
  )
}