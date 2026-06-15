import { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'

export default function ResumeOptimizer() {
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [improvedResume, setImprovedResume] = useState('')
  const [rewriting, setRewriting] = useState(false)
  const navigate = useNavigate()

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setExtracting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await API.post('/ai/extract-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResume(res.data.text)
    } catch (err) {
      alert('❌ PDF extract nahi hua!')
    }
    setExtracting(false)
  }

  const optimizeResume = async () => {
    setLoading(true)
    try {
      const res = await API.post('/ai/resume-optimizer', { resume, jobDescription })
      setAnalysis(res.data.analysis)
    } catch (err) {
      alert('❌ Something went wrong!')
    }
    setLoading(false)
  }

  const rewriteResume = async () => {
    setRewriting(true)
    try {
      const res = await API.post('/ai/rewrite-resume', { resume, jobDescription })
      setImprovedResume(res.data.improved_resume)
    } catch (err) {
      alert('❌ Something went wrong!')
    }
    setRewriting(false)
  }

  const downloadPDF = (content, filename) => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Resume Analysis', 20, 20)
    doc.line(20, 25, 190, 25)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const splitText = doc.splitTextToSize(content, 170)
    doc.text(splitText, 20, 35)
    doc.save(filename)
  }

  const downloadTxt = () => {
    const blob = new Blob([analysis], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume-analysis.txt'
    a.click()
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Resume Optimizer 📄</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Input Side */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-700 mb-4">Your Details</h3>

            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 mb-3 text-center">
              <p className="text-gray-500 text-sm mb-2">Upload Resume (PDF)</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="cursor-pointer text-sm text-blue-600"
              />
              {extracting && <p className="text-blue-500 text-sm mt-2">Extracting... ⏳</p>}
            </div>

            <p className="text-center text-gray-400 text-sm mb-3">— OR paste manually —</p>

            <textarea
              placeholder="Paste your Resume here..."
              className="w-full border p-3 rounded-lg mb-3 h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
            <textarea
              placeholder="Paste Job Description here..."
              className="w-full border p-3 rounded-lg mb-4 h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <button
              onClick={optimizeResume}
              disabled={loading}
              className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer disabled:opacity-50 mb-3"
            >
              {loading ? '🤖 Analyzing...' : 'Optimize Resume 🚀'}
            </button>
            <button
              onClick={rewriteResume}
              disabled={rewriting}
              className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 hover:-translate-y-1 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {rewriting ? '✨ Rewriting...' : 'Rewrite Resume with AI ✨'}
            </button>
          </div>

          {/* Output Side */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-700 mb-4">AI Analysis</h3>
            {analysis ? (
              <>
                <textarea
                  className="w-full border p-3 rounded-lg h-80 focus:outline-none text-sm"
                  value={analysis}
                  onChange={(e) => setAnalysis(e.target.value)}
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(analysis)}
                    className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 cursor-pointer text-sm"
                  >
                    Copy 📋
                  </button>
                  <button
                    onClick={downloadTxt}
                    className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    Download TXT 📥
                  </button>
                  <button
                    onClick={() => downloadPDF(analysis, 'resume-analysis.pdf')}
                    className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 cursor-pointer text-sm"
                  >
                    Download PDF 📥
                  </button>
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                <p>Upload resume + paste JD → Click Optimize! 🚀</p>
              </div>
            )}
          </div>

        </div>

        {/* Improved Resume Section */}
        {improvedResume && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="font-bold text-gray-700 mb-4">✨ AI Improved Resume</h3>
            <textarea
              className="w-full border p-3 rounded-lg h-80 focus:outline-none text-sm"
              value={improvedResume}
              onChange={(e) => setImprovedResume(e.target.value)}
            />
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => navigator.clipboard.writeText(improvedResume)}
                className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 cursor-pointer text-sm"
              >
                Copy 📋
              </button>
              <button
                onClick={() => downloadPDF(improvedResume, 'improved-resume.pdf')}
                className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 cursor-pointer text-sm"
              >
                Download PDF 📥
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}