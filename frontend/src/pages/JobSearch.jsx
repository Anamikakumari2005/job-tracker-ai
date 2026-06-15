import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function JobSearch() {
  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const searchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${query}&num_pages=1&country=in`,
        {
          headers: {
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
            'x-rapidapi-key': import.meta.env.VITE_JSEARCH_API_KEY
          }
        }
      )
      const data = await res.json()
      setJobs(data.data || [])
    } catch (err) {
      alert('❌ Something went wrong!')
    }
    setLoading(false)
  }

  const saveToTracker = async (job) => {
    await API.post('/applications/', {
      companyName: job.employer_name,
      jobRole: job.job_title,
      apply_date: new Date().toISOString().split('T')[0],
      salary: 0,
      status: 'Applied',
      notes: '',
      jobDescription: job.job_description?.slice(0, 500) || '',
      jobUrl: job.job_apply_link
    })
    alert('✅ Saved to Tracker!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Job Tracker AI 🎯</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-blue-600 cursor-pointer">Dashboard</button>
          <button onClick={() => navigate('/applications')} className="text-gray-600 hover:text-blue-600 cursor-pointer">My Applications</button>
        </div>
      </nav>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Jobs 🔍</h2>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Python Developer, React Engineer..."
            className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchJobs()}
          />
          <button
            onClick={searchJobs}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            {loading ? 'Searching...' : 'Search 🔍'}
          </button>
        </div>

        {/* Jobs List */}
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <div key={job.job_id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{job.job_title}</h3>
                  <p className="text-blue-600 font-medium">{job.employer_name}</p>
                  <p className="text-gray-500 text-sm mt-1">
  📍 {job.job_location || job.job_city || job.job_state || job.job_country || 'India'}
</p>
                  <p className="text-gray-500 text-sm">💼 {job.job_employment_type}</p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{job.job_description?.slice(0, 200)}...</p>
                </div>
                {job.employer_logo && (
                  <img src={job.employer_logo} alt="logo" className="w-16 h-16 object-contain rounded-lg" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <a
                  href={job.job_apply_link}
                  target="_blank"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
                >
                  Apply Now ✅
                </a>
                <button
                  onClick={() => saveToTracker(job)}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-200 cursor-pointer"
                >
                  Save to Tracker 🔖
                </button>
              </div>
            </div>
          ))}

          {jobs.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-12">Search karo — real jobs dikhenge! 🚀</p>
          )}
        </div>
      </div>
    </div>
  )
}