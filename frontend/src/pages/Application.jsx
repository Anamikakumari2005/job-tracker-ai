import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    companyName: '',
    jobRole: '',
    apply_date: '',
    salary: '',
    status: 'Applied',
    notes: '',
    jobDescription: '',
    jobUrl: ''
  })
  const navigate = useNavigate()

  // Fetch all applications
  const fetchApplications = async () => {
    const res = await API.get('/applications/')
    setApplications(res.data)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // Add new application
  const handleAdd = async () => {
    await API.post('/applications/', form)
    setShowForm(false)
    setForm({ companyName: '', jobRole: '', apply_date: '', salary: '', status: 'Applied', notes: '', jobDescription: '', jobUrl: '' })
    fetchApplications()
  }

  // Delete application
  const handleDelete = async (id) => {
    await API.delete(`/applications/${id}`)
    fetchApplications()
  }

  // Update status
  const handleStatusChange = async (id, newStatus, app) => {
    await API.put(`/applications/${id}`, { ...app, status: newStatus })
    fetchApplications()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Job Tracker AI 🎯</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-blue-600 cursor-pointer"
        >
          Dashboard
        </button>
      </nav>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            + Add Application
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Add New Application</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Company Name" className="border p-2 rounded-lg" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
              <input placeholder="Job Role" className="border p-2 rounded-lg" value={form.jobRole} onChange={(e) => setForm({ ...form, jobRole: e.target.value })} />
              <input type="date" className="border p-2 rounded-lg" value={form.apply_date} onChange={(e) => setForm({ ...form, apply_date: e.target.value })} />
              <input placeholder="Salary" type="number" className="border p-2 rounded-lg" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              <input placeholder="Job URL" className="border p-2 rounded-lg" value={form.jobUrl} onChange={(e) => setForm({ ...form, jobUrl: e.target.value })} />
              <select className="border p-2 rounded-lg" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offered</option>
                <option>Rejected</option>
              </select>
              <textarea placeholder="Job Description" className="border p-2 rounded-lg md:col-span-2" value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} />
              <textarea placeholder="Notes" className="border p-2 rounded-lg md:col-span-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">Save</button>
              <button onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 cursor-pointer">Cancel</button>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No applications yet! Add your first job! 🚀</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="p-4">Company</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Salary</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{app.companyName}</td>
                    <td className="p-4">{app.jobRole}</td>
                    <td className="p-4">{app.apply_date}</td>
                    <td className="p-4">₹{app.salary}</td>
                    <td className="p-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value, app)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer border-0 ${
                          app.status === 'Applied' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'Interview' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'Offered' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        <option>Applied</option>
                        <option>Interview</option>
                        <option>Offered</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 flex gap-2">
                      <a href={app.jobUrl} target="_blank" className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-200 cursor-pointer">Apply</a>
                      <button onClick={() => handleDelete(app._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200 cursor-pointer">Delete</button>
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