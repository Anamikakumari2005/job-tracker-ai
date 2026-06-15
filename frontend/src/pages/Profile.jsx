import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [resumeSummary, setResumeSummary] = useState('')
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const res = await API.get('/users/profile')
    setProfile(res.data)
    setName(res.data.name)
    setResumeSummary(res.data.resumeSummary || '')
    setSkills(res.data.skills?.join(', ') || '')
    
    if (res.data.role === 'admin') {
      setIsAdmin(true)
      fetchAllUsers()
    }
  }

  const fetchAllUsers = async () => {
    const res = await API.get('/users/all')
    setAllUsers(res.data)
  }

  const updateProfile = async () => {
    setLoading(true)
    await API.put('/users/profile', {
      name,
      resumeSummary,
      skills: skills.split(',').map(s => s.trim())
    })
    alert('✅ Profile updated!')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Job Tracker AI 🎯</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-blue-600 cursor-pointer">Dashboard</button>
      </nav>

      <div className="p-8 max-w-4xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
              <p className="text-gray-500">{profile?.email}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {isAdmin ? '👑 Admin' : '👤 User'}
              </span>
            </div>
          </div>

          {/* Edit Form */}
          <h3 className="font-bold text-gray-700 mb-4">Edit Profile</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                placeholder="React, Python, FastAPI, LangChain..."
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume Summary</label>
              <textarea
                placeholder="Brief summary of your experience and skills..."
                className="w-full border p-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resumeSummary}
                onChange={(e) => setResumeSummary(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={updateProfile}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer font-semibold"
          >
            {loading ? 'Saving...' : 'Save Profile ✅'}
          </button>
        </div>

        {/* Admin Panel */}
        {isAdmin && (
          <div className="bg-white rounded-2xl shadow p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">👑 Admin Panel — All Users</h3>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}