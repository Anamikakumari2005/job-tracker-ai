import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users/all')
        setUsers(res.data)
      } catch (err) {
        alert('❌ Admin access required!')
        navigate('/dashboard')
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Job Tracker AI 🎯</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-blue-600 cursor-pointer">Dashboard</button>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">👑 Admin Panel</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <p className="font-semibold text-gray-700">Total Users: {users.length}</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Skills</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {user.skills?.length > 0 ? user.skills.join(', ') : 'No skills added'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}