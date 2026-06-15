import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const [applications, setApplications] = useState([])
    const [profile, setProfile] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchApplications = async () => {
            const res = await API.get('/applications/')
            setApplications(res.data)

        const profileRes = await API.get('/users/profile')
        setProfile(profileRes.data)    
        }
        fetchApplications()
    }, [])

    const counts = {
        total: applications.length,
        applied: applications.filter(a => a.status === 'Applied').length,
        interview: applications.filter(a => a.status === 'Interview').length,
        offered: applications.filter(a => a.status === 'Offered').length,
        rejected: applications.filter(a => a.status === 'Rejected').length,
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">Job Tracker AI 🎯</h1>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/applications')} className="text-gray-600 hover:text-blue-600 cursor-pointer">Applications</button>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer">Logout</button>
                </div>
            </nav>

            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-3xl font-bold text-blue-600">{counts.total}</p>
                        <p className="text-gray-500 text-sm">Total</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-3xl font-bold text-yellow-500">{counts.applied}</p>
                        <p className="text-gray-500 text-sm">Applied</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-3xl font-bold text-blue-500">{counts.interview}</p>
                        <p className="text-gray-500 text-sm">Interview</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-3xl font-bold text-green-500">{counts.offered}</p>
                        <p className="text-gray-500 text-sm">Offered</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-3xl font-bold text-red-500">{counts.rejected}</p>
                        <p className="text-gray-500 text-sm">Rejected</p>
                    </div>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer font-medium"
                    >
                        🔍 Job Search
                    </button>
                    <button onClick={() => navigate('/cover-letter')} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer font-medium">
                        🤖 Cover Letter
                    </button>
                    <button onClick={() => navigate('/resume-optimizer')} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer font-medium">
                        📄 Resume Optimizer
                    </button>
                    <button onClick={() => navigate('/profile')} className="text-gray-600 hover:text-blue-600 cursor-pointer">👤 Profile</button>
                    {profile?.role === 'admin' && (
  <button onClick={() => navigate('/admin')} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer">
    👑 Admin Panel
  </button>
)}
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Applications</h3>
                    {applications.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No applications yet! Add your first job! 🚀</p>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="pb-2">Company</th>
                                    <th className="pb-2">Role</th>
                                    <th className="pb-2">Date</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.slice(0, 5).map((app) => (
                                    <tr key={app._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3">{app.companyName}</td>
                                        <td className="py-3">{app.jobRole}</td>
                                        <td className="py-3">{app.apply_date}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${app.status === 'Applied' ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'Interview' ? 'bg-blue-100 text-blue-700' :
                                                    app.status === 'Offered' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}