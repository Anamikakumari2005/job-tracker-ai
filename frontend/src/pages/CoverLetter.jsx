import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'

export default function CoverLetter() {
  const [form, setForm] = useState({
    companyName: '',
    jobRole: '',
    jobDescription: '',
    resumeSummary: ''
  })
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const generateCoverLetter = async () => {
    setLoading(true)
    try {
      const res = await API.post('/ai/cover-letter', form)
      setCoverLetter(res.data.cover_letter)
    } catch (err) {
      alert('❌ Something went wrong!')
    }
    setLoading(false)
  }

  const downloadPDF = (content, filename) => {
  const doc = new jsPDF()
  
  // Title add karo
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Cover Letter', 20, 20)
  
  // Line
  doc.line(20, 25, 190, 25)
  
  // Content add karo
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  
  // Long text wrap karo
  const splitText = doc.splitTextToSize(content, 170)
  doc.text(splitText, 20, 35)
  
  // Download karo
  doc.save(filename)
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Job Tracker AI 🎯</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-blue-600 cursor-pointer">Dashboard</button>
          <button onClick={() => navigate('/jobs')} className="text-gray-600 hover:text-blue-600 cursor-pointer">Job Search</button>
        </div>
      </nav>

      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Cover Letter Generator 🤖</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Side */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-700 mb-4">Job Details</h3>
            <input
              placeholder="Company Name"
              className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
            <input
              placeholder="Job Role"
              className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.jobRole}
              onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
            />
            <textarea
              placeholder="Paste Job Description here..."
              className="w-full border p-3 rounded-lg mb-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.jobDescription}
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
            />
            <textarea
              placeholder="Your Resume Summary (skills, experience, projects)..."
              className="w-full border p-3 rounded-lg mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.resumeSummary}
              onChange={(e) => setForm({ ...form, resumeSummary: e.target.value })}
            />
            <button
              onClick={generateCoverLetter}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? '🤖 Generating...' : 'Generate Cover Letter 🚀'}
            </button>
            <div className="flex gap-3 mt-3">
  <button
    onClick={() => navigator.clipboard.writeText(coverLetter)}
    className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 cursor-pointer text-sm"
  >
    Copy 📋
  </button>
  <button
    onClick={() => downloadPDF(coverLetter, 'cover-letter.pdf')}
    className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 cursor-pointer text-sm"
  >
    Download PDF 📥
  </button>
</div>
          </div>

          {/* Output Side */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-700 mb-4">Generated Cover Letter</h3>
            {coverLetter ? (
              <>
                <textarea
                  className="w-full border p-3 rounded-lg h-80 focus:outline-none text-sm"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <button
                  onClick={() => navigator.clipboard.writeText(coverLetter)}
                  className="w-full mt-3 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 cursor-pointer"
                >
                  Copy to Clipboard 📋
                </button>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                <p>Fill the form and click Generate! 🤖</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}