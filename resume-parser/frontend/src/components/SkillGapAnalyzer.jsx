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
      toast('error', 'Analysis failed. Try again.')
      setStep(1)
      console.error(err)
    } finally {
      setLoading(false)
      clearInterval(msgInterval)
    }
  }

  const handleQuickRole = (role) => {
    setRoleInput(role)
    setTimeout(() => handleAnalyze(role), 100)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Must Have':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Good to Have':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'Nice to Have':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800'
      case 'Beginner':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRelevanceIndicator = (relevance) => {
    switch (relevance) {
      case 'High':
        return '🔴'
      case 'Medium':
        return '🟡'
      case 'Low':
        return '⚪'
      default:
        return '⚪'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Skill Gap Analyzer</h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {step} of 3 • {step === 1 ? 'Role Selection' : step === 2 ? 'Analyzing' : 'Results'}
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
        <div className="px-8 py-8 min-h-[500px]">
          {step === 1 && (
            <div className="max-w-2xl space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Enter Your Target Role
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAnalyze()
                    }}
                  />
                  <button
                    onClick={() => handleAnalyze()}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 font-semibold transition flex items-center gap-2"
                  >
                    Analyze <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">Or quick select:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {quickRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleQuickRole(role)}
                      className="px-4 py-2 text-sm font-medium border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-gray-700"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="text-5xl">🔍</div>
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
            <div className="space-y-8">
              {/* Match Percentage */}
              <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <p className="text-5xl font-black text-blue-600 mb-2">
                  {result.role_match_percentage}%
                </p>
                <p className="text-sm font-semibold text-gray-600 mb-3">Role Match Percentage</p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    result.role_match_percentage >= 70
                      ? 'bg-green-100 text-green-800'
                      : result.role_match_percentage >= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.verdict}
                </span>
              </div>

              {/* Skills You Have */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Check size={20} className="text-green-600" />
                  Skills You Have
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.has_skills?.map((skill, idx) => (
                    <div key={idx} className="bg-white border-2 border-green-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{skill.skill}</p>
                          <p className="text-xs text-gray-500 mt-1">Proficiency level</p>
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap ml-2 ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Relevance: {getRelevanceIndicator(skill.relevance)} {skill.relevance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {result.missing_skills?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-orange-600" />
                    Skills You're Missing
                  </h3>
                  <div className="space-y-3">
                    {result.missing_skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className={`border-2 rounded-lg p-4 ${getPriorityColor(skill.priority)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold">{skill.skill}</p>
                            <span className={`inline-block text-xs font-bold px-2 py-1 rounded mt-2 ${getPriorityColor(skill.priority)}`}>
                              {skill.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm whitespace-nowrap ml-4">
                            <Clock size={16} />
                            ~{skill.learn_time}
                          </div>
                        </div>
                        {skill.resource && (
                          <a
                            href={skill.resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium hover:underline flex items-center gap-1 mt-3"
                          >
                            Learn More <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Roadmap */}
              {result.roadmap?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Your Learning Roadmap</h3>
                  <div className="space-y-0">
                    {result.roadmap.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        {/* Timeline line */}
                        {idx < result.roadmap.length - 1 && (
                          <div className="relative flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 border-4 border-white" />
                            <div className="w-0.5 h-16 bg-blue-200 mt-3" />
                          </div>
                        )}
                        {idx === result.roadmap.length - 1 && (
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 border-4 border-white" />
                          </div>
                        )}

                        {/* Content */}
                        <div className="pb-6 pt-1">
                          <p className="text-sm font-bold text-gray-900">{item.week}</p>
                          <p className="font-semibold text-gray-900 mt-1">{item.focus}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setStep(1)
                    setResult(null)
                    setRoleInput('')
                  }}
                  className="px-6 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Analyze Another Role
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 font-medium transition ml-auto"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
