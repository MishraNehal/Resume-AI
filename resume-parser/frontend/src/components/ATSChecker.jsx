import React, { useState, useEffect, useRef } from 'react'
import { X, ArrowRight, AlertCircle, Check, XCircle } from 'lucide-react'
import { analyzeATS } from '../services/api'

function CircleScore({ score }) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let animationId
    let startTime
    const duration = 1200

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      setAnimatedScore(Math.floor(progress * score))

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [score])

  const getColor = () => {
    if (animatedScore >= 70) return '#10b981'
    if (animatedScore >= 40) return '#eab308'
    return '#ef4444'
  }

  const getLabel = () => {
    if (animatedScore >= 70) return 'Excellent'
    if (animatedScore >= 40) return 'Good'
    return 'Needs Work'
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold" style={{ color: getColor() }}>
            {animatedScore}
          </div>
          <div className="text-xs font-semibold text-gray-500">ATS Score</div>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 mt-4">{getLabel()}</p>
    </div>
  )
}

function SubScore({ label, score }) {
  const getColor = () => {
    if (score >= 70) return 'bg-green-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-600">{score}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()}`}
          style={{ width: `${score}%`, transition: 'width 0.6s ease-out' }}
        />
      </div>
    </div>
  )
}

export default function ATSChecker({ resumeText, isOpen, onClose, toast }) {
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef(null)

  const handleJobDescChange = (e) => {
    const text = e.target.value
    setJobDescription(text)
    setCharCount(text.length)
  }

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast('error', 'Please enter a job description')
      return
    }
    if (jobDescription.length < 50) {
      toast('error', 'Job description must be at least 50 characters')
      return
    }

    setLoading(true)
    try {
      const response = await analyzeATS(resumeText, jobDescription)
      if (response.success) {
        setResult(response.data)
        toast('success', 'ATS analysis complete!')
      }
    } catch (err) {
      toast('error', 'Analysis failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const verdictColor = {
    'Strong Match': 'bg-green-100 text-green-800',
    'Good Match': 'bg-blue-100 text-blue-800',
    'Partial Match': 'bg-yellow-100 text-yellow-800',
    'Weak Match': 'bg-red-100 text-red-800',
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ATS Score Checker</h2>
            <p className="text-sm text-gray-500 mt-1">Check how well your resume matches the job description</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {!result ? (
              <div className="max-w-2xl">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Paste the Job Description
                </label>
                <textarea
                  ref={textareaRef}
                  value={jobDescription}
                  onChange={handleJobDescChange}
                  placeholder="Paste the job description here... The more detailed, the better the analysis."
                  className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex justify-between items-center mt-2 mb-6">
                  <div className="text-xs text-gray-500">{charCount} characters</div>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !jobDescription.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                  >
                    Analyze Match <ArrowRight size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Or select a sample job description:
                  </label>
                  <button
                    onClick={() => {
                      const sample =
                        'We are looking for a Senior Frontend Developer with 5+ years of experience in React and TypeScript. You should have expertise in building scalable web applications, working with RESTful APIs, and a strong understanding of modern CSS and responsive design. Experience with testing frameworks like Jest is required. Nice to have: GraphQL, Next.js, or Kubernetes.'
                      setJobDescription(sample)
                      setCharCount(sample.length)
                    }}
                    className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 text-xs text-gray-600 transition"
                  >
                    📋 Senior Frontend Developer (Sample)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Score Circle */}
                <div className="flex justify-center">
                  <CircleScore score={result.overall_score} />
                </div>

                {/* Verdict */}
                <div className="flex justify-center">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      verdictColor[result.verdict] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {result.verdict}
                  </span>
                </div>

                {/* Sub-scores Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <SubScore label="Keywords" score={result.keyword_match} />
                  <SubScore label="Experience" score={result.experience_match} />
                  <SubScore label="Skills" score={result.skills_match} />
                  <SubScore label="Education" score={result.education_match} />
                </div>

                {/* Matched and Missing Keywords */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      Matched Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.matched_keywords?.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <XCircle size={16} className="text-red-500" />
                      Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords?.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strong Points and Suggestions */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      Strong Points
                    </h3>
                    <ul className="space-y-2">
                      {result.strong_points?.map((point, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-green-500 flex-shrink-0">✓</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={16} className="text-yellow-500" />
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {result.improvement_suggestions?.map((sugg, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-yellow-500 flex-shrink-0">→</span>
                          {sugg}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Analyzing your resume...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {result && (
          <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 flex gap-4">
            <button
              onClick={() => {
                setResult(null)
                setJobDescription('')
                setCharCount(0)
              }}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition"
            >
              Analyze Another Job
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 font-medium text-sm transition ml-auto"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
