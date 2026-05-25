import React, { useState } from 'react'
import { X, ArrowRight, Check, AlertCircle, Clock, ExternalLink } from 'lucide-react'
import { analyzeSkillGap } from '../services/api'

const quickRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'ML Engineer',
  'Android Developer',
  'UI/UX Designer',
]

export default function SkillGapAnalyzer({ resumeData, isOpen, onClose, toast }) {
  const [step, setStep] = useState(1)
  const [roleInput, setRoleInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)

  const loadingMessages = [
    'Analyzing your skills...',
    'Comparing with role requirements...',
    'Building your learning path...',
  ]

  const handleAnalyze = async (role = roleInput) => {
    if (!role.trim()) {
      toast('error', 'Please enter a role')
      return
    }
    setStep(2)
    setLoading(true)
    const msgInterval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length)
    }, 1000)
    try {
      const response = await analyzeSkillGap(resumeData, role)
      if (response.success) {
        setResult(response.data)
        setStep(3)
        toast('success', 'Analysis complete!')
      }
    } catch (err) {
      toast('error', err.message || 'Analysis failed. Try again.')
      setStep(1)
    } finally {
      setLoading(false)
      clearInterval(msgInterval)
    }
  }

  const handleQuickRole = (role) => {
    setRoleInput(role)
    setTimeout(() => handleAnalyze(role), 100)
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Must Have':    return { bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-800',    badge: 'bg-red-100 text-red-800' }
      case 'Good to Have': return { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-800' }
      case 'Nice to Have': return { bg: 'bg-gray-50',   border: 'border-gray-300',   text: 'text-gray-800',   badge: 'bg-gray-100 text-gray-700' }
      default:             return { bg: 'bg-gray-50',   border: 'border-gray-300',   text: 'text-gray-800',   badge: 'bg-gray-100 text-gray-700' }
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert':       return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-blue-100 text-blue-800'
      case 'Beginner':     return 'bg-gray-100 text-gray-700'
      default:             return 'bg-gray-100 text-gray-700'
    }
  }

  const getRelevanceIndicator = (relevance) => {
    switch (relevance) {
      case 'High':   return '🔴'
      case 'Medium': return '🟡'
      case 'Low':    return '⚪'
      default:       return '⚪'
    }
  }

  const getMatchColor = (pct) => {
    if (pct >= 70) return 'text-green-600'
    if (pct >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getVerdictStyle = (pct) => {
    if (pct >= 70) return 'bg-green-100 text-green-800'
    if (pct >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (!isOpen) return null

  return (
    // ✅ FIX: overflow-y-auto on outer so entire modal scrolls on small screens
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 py-8">
        {/* ✅ FIX: removed fixed max-h, let content grow naturally */}
        <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Skill Gap Analyzer</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Step {step} of 3 {' • '} {step === 1 ? 'Role Selection' : step === 2 ? 'Analyzing' : 'Results'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">

            {/* ── Step 1: Role Selection ── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Enter Your Target Role
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      placeholder="e.g. Senior Frontend Developer"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-gray-900 bg-white"
                    />
                    <button
                      onClick={() => handleAnalyze()}
                      className="px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-yellow-400 hover:text-gray-900 font-semibold transition flex items-center gap-2"
                    >
                      Analyze <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Or quick select:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {quickRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleQuickRole(role)}
                        className="px-3 py-2 text-sm font-medium border-2 border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-900 hover:text-white transition text-gray-700 text-center"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Loading ── */}
            {step === 2 && (
              <div className="flex flex-col items-center justify-center py-16 space-y-5">
                <div className="text-5xl">🔍</div>
                <p className="text-lg font-bold text-gray-900 text-center">
                  {loadingMessages[loadingMsgIdx]}
                </p>
                <div className="w-56 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 animate-pulse-progress rounded-full w-3/5" />
                </div>
              </div>
            )}

            {/* ── Step 3: Results ── */}
            {step === 3 && result && (
              <div className="space-y-6">

                {/* Match percentage */}
                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className={`text-6xl font-black mb-1 ${getMatchColor(result.role_match_percentage)}`}>
                    {result.role_match_percentage}%
                  </p>
                  <p className="text-sm text-gray-500 mb-3">Role Match Percentage</p>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${getVerdictStyle(result.role_match_percentage)}`}>
                    {result.verdict}
                  </span>
                </div>

                {/* Skills you have */}
                {result.has_skills?.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      Skills You Have ({result.has_skills.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.has_skills.map((skill, idx) => (
                        <div key={idx} className="bg-white border-2 border-green-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">{skill.skill}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Proficiency level</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold shrink-0 ${getLevelColor(skill.level)}`}>
                              {skill.level}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Relevance: {getRelevanceIndicator(skill.relevance)} {skill.relevance}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing skills */}
                {result.missing_skills?.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={18} className="text-orange-500" />
                      Skills You're Missing ({result.missing_skills.length})
                    </h3>
                    <div className="space-y-3">
                      {result.missing_skills.map((skill, idx) => {
                        const style = getPriorityStyle(skill.priority)
                        return (
                          <div key={idx} className={`border-2 rounded-xl p-4 ${style.bg} ${style.border}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm ${style.text}`}>{skill.skill}</p>
                                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-lg mt-1.5 ${style.badge}`}>
                                  {skill.priority}
                                </span>
                              </div>
                              <div className={`flex items-center gap-1 text-xs shrink-0 ${style.text}`}>
                                <Clock size={13} />
                                ~{skill.learn_time}
                              </div>
                            </div>
                            {skill.resource && (
                              <a
                                href={skill.resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs font-semibold hover:underline flex items-center gap-1 mt-3 ${style.text}`}
                              >
                                Learn More <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Learning roadmap */}
                {result.roadmap?.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4">Your Learning Roadmap</h3>
                    <div className="space-y-0">
                      {result.roadmap.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-3 h-3 rounded-full border-2 border-white mt-1 ${
                              idx === result.roadmap.length - 1 ? 'bg-green-500' : 'bg-gray-900'
                            }`} />
                            {idx < result.roadmap.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-200 my-1" style={{ minHeight: 40 }} />
                            )}
                          </div>
                          <div className="pb-5 pt-0">
                            <span className="inline-block text-xs font-bold bg-gray-900 text-white px-2 py-0.5 rounded-full mb-1">
                              {item.week}
                            </span>
                            <p className="font-semibold text-gray-900 text-sm">{item.focus}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => { setStep(1); setResult(null); setRoleInput('') }}
                    className="px-5 py-2.5 border-2 border-gray-200 rounded-xl hover:border-gray-900 font-medium text-sm text-gray-700 transition"
                  >
                    Analyze Another Role
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-yellow-400 hover:text-gray-900 font-medium text-sm transition ml-auto"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}