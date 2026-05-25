import React, { useState, useEffect } from 'react'
import { Zap, TrendingUp, Briefcase, CheckCircle, AlertCircle } from 'lucide-react'

function AnimatedNumber({ value, duration = 800 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return count
}

export default function ScoreDashboard({ data }) {
  if (!data) return null

  const overall = data.overall || 0
  const sections = data.sections || {}
  const topStrengths = data.top_strengths || []
  const criticalImprovements = data.critical_improvements || []
  const industryFit = data.industry_fit || []
  const experienceLevel = data.experience_level || 'Mid-level'

  const getScoreColor = (score) => {
    if (score >= 70) return 'from-green-400 to-green-600 border-green-500'
    if (score >= 40) return 'from-yellow-400 to-yellow-600 border-yellow-500'
    return 'from-red-400 to-red-600 border-red-500'
  }

  const getScoreTextColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBarColor = (score) => {
    if (score >= 70) return 'bg-green-500'
    if (score >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const experienceLevelIcon = {
    Fresher: '🌱',
    Junior: '📈',
    'Mid-level': '⭐',
    Senior: '🏆',
    Lead: '👑',
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Row - 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <div
          className={`relative bg-gradient-to-br ${getScoreColor(
            overall
          )} border-2 rounded-xl p-6 text-white overflow-hidden`}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-90 mb-2">
              Overall Score
            </p>
            <p className="text-5xl font-black mb-2">
              <AnimatedNumber value={overall} />
            </p>
            <p className="text-sm font-medium opacity-95">Resume Quality</p>
          </div>
        </div>

        {/* Experience Level */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{experienceLevelIcon[experienceLevel]}</div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                Experience Level
              </p>
              <p className="text-2xl font-bold text-gray-900">{experienceLevel}</p>
              <p className="text-xs text-gray-500 mt-2">Career stage</p>
            </div>
          </div>
        </div>

        {/* Industry Fit */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Best Fit Industries
          </p>
          <div className="flex flex-wrap gap-2">
            {industryFit.slice(0, 3).map((industry, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section Scores Grid - 2x3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(sections).map(([key, { score, feedback }], idx) => {
          const label = key
            .replace(/_/g, ' ')
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')

          return (
            <div
              key={key}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              style={{
                animation: `fadeIn 0.4s ease-out ${idx * 50}ms backwards`,
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className={`text-lg font-bold ${getScoreTextColor(score)}`}>{score}%</p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${getBarColor(score)} transition-all duration-600`}
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600">{feedback}</p>
            </div>
          )
        })}
      </div>

      {/* Bottom Row - Two Columns */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-green-600" />
            <h3 className="text-sm font-bold text-gray-900">Top Strengths</h3>
          </div>
          <ul className="space-y-3">
            {topStrengths.map((strength, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                <span className="text-sm text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Needs Improvement */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-red-600" />
            <h3 className="text-sm font-bold text-gray-900">Needs Improvement</h3>
          </div>
          <ul className="space-y-3">
            {criticalImprovements.map((improvement, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="text-red-600 font-bold flex-shrink-0">!</span>
                <span className="text-sm text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
