import React, { useState } from 'react'
import {
  Loader2, AlertCircle, Copy, Moon, Sun,
  Sparkles, ArrowRight, FileSearch, Scale
} from 'lucide-react'
import DropZone from './components/DropZone'
import ResumeResults from './components/ResumeResults'
import ATSChecker from './components/ATSChecker'
import ResumeChat from './components/ResumeChat'
import CoverLetterGenerator from './components/CoverLetterGenerator'
import SkillGapAnalyzer from './components/SkillGapAnalyzer'
import ToastContainer from './components/ToastContainer'
import ScoreDashboard from './components/ScoreDashboard'
import ResumeComparison from './components/ResumeComparison'
import { parseResume, getResumeScore } from './services/api'
import useToast from './hooks/useToast'

const LOADING_STATES = ['Extracting text...', 'Analyzing resume...', 'Structuring data...']

export default function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [resumeText, setResumeText] = useState(null)
  const [scoreData, setScoreData] = useState(null)
  const [error, setError] = useState(null)
  const [loadingStateIndex, setLoadingStateIndex] = useState(0)
  const [activeFeature, setActiveFeature] = useState(null)
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  // ✅ NEW: page state — 'dashboard' or 'compare'
  const [activePage, setActivePage] = useState('dashboard')

  const { toasts, addToast, removeToast } = useToast()

  const handleFile = (f) => {
    setFile(f)
    setResult(null)
    setResumeText(null)
    setScoreData(null)
    setError(null)
  }

  const handleClear = () => {
    setFile(null)
    setResult(null)
    setResumeText(null)
    setScoreData(null)
    setError(null)
  }

  const handleParse = async () => {
    if (!file) return
    setLoading(true)
    setLoadingStateIndex(0)
    setError(null)
    setResult(null)

    const interval = setInterval(() => {
      setLoadingStateIndex((prev) => (prev + 1) % LOADING_STATES.length)
    }, 1200)

    try {
      const response = await parseResume(file)
      setResult(response.data)
      setResumeText(response.resume_text)
      addToast('success', 'Resume parsed successfully!')

      try {
        const scoreResponse = await getResumeScore(response.data)
        if (scoreResponse.success) {
          setScoreData(scoreResponse.data)
        }
      } catch (scoreErr) {
        console.error('Score fetch failed:', scoreErr)
      }
    } catch (err) {
      // ✅ FIX: api.js now throws Error objects directly, so just use err.message
      const msg = err.message || 'Something went wrong.'
      setError(msg)
      addToast('error', msg)
    } finally {
      clearInterval(interval)
      setLoading(false)
      setLoadingStateIndex(0)
    }
  }

  const handleCopyJSON = () => {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    addToast('success', 'JSON copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Shared dark mode classes ────────────────────────────────────────────────
  const bg = darkMode ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'
  const headerBg = darkMode ? 'border-slate-800 bg-slate-950/80' : 'border-gray-200 bg-white/80'
  const sidebarBg = darkMode
    ? 'border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950'
    : 'border-gray-200 bg-gradient-to-b from-gray-50 via-white to-gray-50'
  const pillClass = darkMode
    ? 'bg-slate-800 text-slate-300 border border-slate-700'
    : 'bg-gray-100 text-gray-600 border border-gray-200'
  const stepNumActive = 'bg-blue-500 text-white'
  const stepNumInactive = darkMode ? 'bg-slate-800 text-slate-500' : 'bg-gray-200 text-gray-400'
  const stepTextActive = darkMode ? 'text-slate-300' : 'text-gray-700'
  const stepTextMuted = darkMode ? 'text-slate-500' : 'text-gray-400'

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark' : ''} ${bg}`}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className={`border-b sticky top-0 z-20 backdrop-blur-md transition-colors duration-300 ${headerBg}`}>
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <Sparkles size={20} className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ResumeAI</h1>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePage === 'dashboard'
                  ? darkMode
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-900 text-white'
                  : darkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActivePage('compare')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePage === 'compare'
                  ? darkMode
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-900 text-white'
                  : darkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Scale size={14} />
              Compare
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className={`text-xs font-medium px-3 py-1.5 rounded-full hidden sm:block ${
              darkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'
            }`}>
              Powered by Gemini 2.5 Flash
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Compare Page ───────────────────────────────────────────────────── */}
      {activePage === 'compare' && (
        <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
          <ResumeComparison addToast={addToast} darkMode={darkMode} />
        </div>
      )}

      {/* ── Dashboard Page ─────────────────────────────────────────────────── */}
      {activePage === 'dashboard' && (
        <div className="flex flex-1 overflow-hidden">

          {/* Left Sidebar */}
          <aside className={`w-80 border-r overflow-y-auto transition-colors duration-300 max-sm:hidden shrink-0 ${sidebarBg}`}>
            <div className="p-6 space-y-6">
              <div>
                <h2 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upload Resume
                </h2>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Drag, drop, or click to select
                </p>
              </div>

              {/* Drop Zone */}
              <DropZone file={file} onFile={handleFile} onClear={handleClear} darkMode={darkMode} />

              {/* Format Pills */}
              {!file && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {['PDF', 'DOCX', 'TXT'].map((fmt, i, arr) => (
                    <React.Fragment key={fmt}>
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${pillClass}`}>
                        {fmt}
                      </span>
                      {i < arr.length - 1 && (
                        <span className={`text-xs font-medium self-center ${darkMode ? 'text-slate-600' : 'text-gray-300'}`}>·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Parse Button */}
              <button
                onClick={handleParse}
                disabled={!file || loading}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  !file || loading
                    ? darkMode
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl active:scale-[0.98]'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {LOADING_STATES[loadingStateIndex]}
                  </>
                ) : (
                  <>
                    Parse Resume <ArrowRight size={16} />
                  </>
                )}
                {/* ✅ FIX: removed extra )} that caused syntax error */}
              </button>

              {/* Step Indicator */}
              <div className={`border-t pt-6 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
                <div className="space-y-3">
                  {[
                    { num: 1, label: 'Upload', sub: 'Select your resume', active: !!file },
                    { num: 2, label: 'Parse', sub: 'Extract information', active: loading || !!result },
                    { num: 3, label: 'Results', sub: 'View parsed data', active: !!result },
                  ].map(({ num, label, sub, active }) => (
                    <div key={num} className="flex items-start gap-3">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 transition-all ${
                        active ? stepNumActive : stepNumInactive
                      }`}>
                        {num}
                      </div>
                      <div>
                        <div className={`text-xs font-semibold ${active ? stepTextActive : stepTextMuted}`}>
                          {label}
                        </div>
                        <div className={`text-xs ${stepTextMuted}`}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compare CTA */}
              <div className={`rounded-xl p-4 border ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Compare Two Resumes
                </p>
                <p className={`text-xs mb-3 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                  Upload two resumes and let AI pick the better candidate.
                </p>
                <button
                  onClick={() => setActivePage('compare')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-yellow-600 hover:text-yellow-500 transition"
                >
                  <Scale size={13} /> Try Compare →
                </button>
              </div>
            </div>
          </aside>

          {/* ── Right Content Area ──────────────────────────────────────────── */}
          <main className={`flex-1 overflow-y-auto relative transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className={`rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full mx-4 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                  <div className="mb-6 flex justify-center">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                  </div>
                  <p className={`text-sm font-medium mb-6 min-h-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {LOADING_STATES[loadingStateIndex]}
                  </p>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-progress rounded-full w-3/5" />
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && !loading && (
              <div className="sticky top-0 z-40 bg-red-50 border-b border-red-200 px-6 py-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Error parsing resume</p>
                    <p className="text-sm text-red-700 mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              {result ? (
                <div className="animate-fadeIn space-y-8 max-w-5xl mx-auto">

                  {/* Action Bar */}
                  <div className={`sticky top-0 -mx-8 -mt-8 px-8 py-4 border-b flex gap-2 flex-wrap z-10 transition-colors ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-200'
                  }`}>
                    {[
                      { key: 'score', label: '📊 Resume Score' },
                      { key: 'ats', label: '🎯 ATS Checker' },
                      { key: 'chat', label: '💬 Chat' },
                      { key: 'cover-letter', label: '✉️ Cover Letter' },
                      { key: 'skill-gap', label: '🔍 Skill Gap' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setActiveFeature(activeFeature === key ? null : key)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border-2 ${
                          activeFeature === key
                            ? 'bg-gray-900 text-white border-gray-900'
                            : darkMode
                              ? 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}

                    <button
                      onClick={handleCopyJSON}
                      className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        darkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      <Copy size={14} />
                      {copied ? 'Copied!' : 'Copy JSON'}
                    </button>
                  </div>

                  {/* Score Dashboard */}
                  {scoreData && <ScoreDashboard data={scoreData} />}

                  {/* Resume Results */}
                  <ResumeResults data={result} />
                </div>
              ) : (
                /* ✅ FIX: Removed broken ternary — now a clean else block */
                !loading && (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className={`p-5 rounded-full mb-4 ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                      <FileSearch size={36} className={darkMode ? 'text-slate-500' : 'text-gray-400'} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Ready to parse your resume
                    </h3>
                    <p className={`text-sm max-w-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                      Upload a resume on the left and click "Parse Resume" to extract and analyze the content
                    </p>

                    {/* Feature preview cards */}
                    <div className="grid grid-cols-3 gap-4 mt-10 max-w-2xl w-full">
                      {[
                        { icon: '🎯', title: 'ATS Checker', desc: 'Match against job descriptions' },
                        { icon: '💬', title: 'Chat with Resume', desc: 'Ask AI about your resume' },
                        { icon: '📊', title: 'Resume Score', desc: 'Get a detailed quality score' },
                      ].map(({ icon, title, desc }) => (
                        <div
                          key={title}
                          className={`p-4 rounded-xl border text-center transition-colors ${
                            darkMode
                              ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{icon}</div>
                          <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            {title}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>{desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </main>
        </div>
      )}

      {/* ── Toast Notifications ─────────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ── Feature Modals (only when result exists) ────────────────────────── */}
      {result && (
        <>
          <ATSChecker
            resumeText={resumeText}
            isOpen={activeFeature === 'ats'}
            onClose={() => setActiveFeature(null)}
            toast={addToast}
          />
          <ResumeChat
            resumeData={result}
            isOpen={activeFeature === 'chat'}
            onClose={() => setActiveFeature(null)}
            toast={addToast}
          />
          <CoverLetterGenerator
            resumeData={result}
            isOpen={activeFeature === 'cover-letter'}
            onClose={() => setActiveFeature(null)}
            toast={addToast}
          />
          <SkillGapAnalyzer
            resumeData={result}
            isOpen={activeFeature === 'skill-gap'}
            onClose={() => setActiveFeature(null)}
            toast={addToast}
          />
        </>
      )}
    </div>
  )
}
