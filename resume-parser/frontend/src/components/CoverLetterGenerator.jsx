import React, { useState } from 'react'
import { X, ArrowRight, Download, Copy, RotateCcw } from 'lucide-react'
import { generateCoverLetter } from '../services/api'

const toneOptions = [
  {
    value: 'professional',
    label: 'Professional',
    icon: '💼',
    desc: 'Formal & polished',
  },
  {
    value: 'enthusiastic',
    label: 'Enthusiastic',
    icon: '🚀',
    desc: 'Energetic & engaging',
  },
  {
    value: 'concise',
    label: 'Concise',
    icon: '📋',
    desc: 'Straight to the point',
  },
]

const loadingMessages = [
  'Reading your experience...',
  'Matching with job requirements...',
  'Writing opening paragraph...',
  'Polishing the final draft...',
]

export default function CoverLetterGenerator({ resumeData, isOpen, onClose, toast }) {
  const [step, setStep] = useState(1)
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone] = useState('professional')
  const [result, setResult] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [copied, setCopied] = useState(null)

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast('error', 'Please enter a job description')
      return
    }
    if (jobDescription.length < 50) {
      toast('error', 'Job description must be at least 50 characters')
      return
    }

    setStep(2)
    setLoading(true)

    const msgInterval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length)
    }, 1000)

    try {
      const response = await generateCoverLetter(resumeData, jobDescription, tone)
      if (response.success) {
        setResult(response.data)
        setEditedText(response.data.cover_letter)
        setStep(3)
        toast('success', 'Cover letter generated!')
      }
    } catch (err) {
      toast('error', 'Generation failed. Please try again.')
      setStep(1)
      console.error(err)
    } finally {
      setLoading(false)
      clearInterval(msgInterval)
    }
  }

  const handleDownload = () => {
    const text = isEditing ? editedText : result.cover_letter
    const fullContent = `Subject: ${result.subject}\n\n${text}`
    const blob = new Blob([fullContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cover-letter.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast('success', 'Downloaded!')
  }

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    toast('success', `${type} copied to clipboard!`)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleRegenerate = () => {
    setStep(1)
    setResult(null)
    setEditedText('')
    setIsEditing(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cover Letter Generator</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {step} of 3 • {step === 1 ? 'Job Details' : step === 2 ? 'Generating' : 'Result'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Paste the Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Choose Tone
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {toneOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTone(option.value)}
                      className={`p-4 rounded-lg border-2 transition text-center ${
                        tone === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateCoverLetter}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 font-semibold transition"
              >
                Generate Cover Letter <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="text-5xl">✨</div>
              <p className="text-xl font-bold text-gray-900 text-center">
                {loadingMessages[loadingMsgIdx]}
              </p>
              <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse-progress"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="space-y-6 max-w-4xl">
              {/* Subject Line */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  Subject Line
                </p>
                <p className="text-lg font-semibold text-blue-900">{result.subject}</p>
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-900">Cover Letter</label>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition"
                  >
                    {isEditing ? '✓ Done' : '✏️ Edit'}
                  </button>
                </div>
                {isEditing ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
                  />
                ) : (
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-8 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
                    {result.cover_letter}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => handleCopy(isEditing ? editedText : result.cover_letter, 'Letter')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
                >
                  <Copy size={16} />
                  {copied === 'Letter' ? 'Copied!' : 'Copy Letter'}
                </button>
                <button
                  onClick={() => handleCopy(result.subject, 'Subject')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
                >
                  <Copy size={16} />
                  {copied === 'Subject' ? 'Copied!' : 'Copy Subject'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
                >
                  <RotateCcw size={16} />
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
