import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, X, Scale, Trophy, Minus,
  Briefcase, Wrench, GraduationCap, MessageSquare,
  Target, Users, ChevronDown, ChevronUp, RotateCcw,
  Loader2, AlertCircle, CheckCircle, XCircle, Copy
} from 'lucide-react'
import { parseResume, compareResumes } from '../services/api'

// ── Sub-components ─────────────────────────────────────────────────────────────

function UploadCard({ label, accentColor, file, parsedData, onFile, onClear, parseStatus }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) onFile(acceptedFiles[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    disabled: !!file,
  })

  const borderColor = accentColor === 'yellow' ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400 bg-blue-50'
  const badgeColor = accentColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
  const labelColor = accentColor === 'yellow' ? 'text-yellow-600' : 'text-blue-600'

  return (
    <div className="flex-1 min-w-0">
      <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${labelColor}`}>
        {label}
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
            ${isDragActive ? borderColor : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}
        >
          <input {...getInputProps()} />
          <Upload size={36} className={`mx-auto mb-3 ${isDragActive ? (accentColor === 'yellow' ? 'text-yellow-500' : 'text-blue-500') : 'text-gray-400'}`} />
          <p className="font-semibold text-gray-700 mb-1">Drop resume here</p>
          <p className="text-sm text-gray-400">PDF, DOCX, or TXT</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <FileText size={20} className="text-red-500" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={onClear} className="p-1 rounded-lg hover:bg-gray-100 transition shrink-0">
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="mt-3">
            {parseStatus === 'parsing' && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={14} className="animate-spin" />
                Parsing resume...
              </div>
            )}
            {parseStatus === 'done' && parsedData && (
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
                  <CheckCircle size={12} /> Parsed — {parsedData.name || 'Unknown'}
                </span>
              </div>
            )}
            {parseStatus === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle size={14} /> Parse failed
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreBar({ score1, score2 }) {
  const total = score1 + score2 || 1
  const pct1 = Math.round((score1 / total) * 100)
  const pct2 = 100 - pct1

  return (
    <div className="flex items-center gap-3 my-4">
      <span className="font-bold text-lg text-yellow-600 w-10 text-right">{score1}</span>
      <div className="flex-1 h-4 rounded-full overflow-hidden bg-gray-100 flex">
        <div
          className="h-full bg-yellow-400 transition-all duration-1000 ease-out"
          style={{ width: `${pct1}%` }}
        />
        <div
          className="h-full bg-blue-400 transition-all duration-1000 ease-out"
          style={{ width: `${pct2}%` }}
        />
      </div>
      <span className="font-bold text-lg text-blue-600 w-10">{score2}</span>
    </div>
  )
}

function WinnerBadge({ winner, side }) {
  if (winner !== side) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
      <Trophy size={10} /> Winner
    </span>
  )
}

function CategoryRow({ icon: Icon, label, data, name1, name2 }) {
  if (!data) return null
  const { resume_1_score, resume_2_score, resume_1_note, resume_2_note, winner } = data

  return (
    <div className="grid grid-cols-[1fr_140px_1fr] gap-4 items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-xl px-2 transition-colors">
      {/* Left — Resume 1 */}
      <div className="text-right">
        <div className="flex items-center justify-end gap-2 mb-1">
          <WinnerBadge winner={winner} side="resume_1" />
          <span className="font-bold text-gray-800">{resume_1_score}/100</span>
        </div>
        <p className="text-xs text-gray-500">{resume_1_note}</p>
      </div>

      {/* Center */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Icon size={14} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</span>
        </div>
        <div className="flex gap-1 justify-center">
          <div className="h-1.5 rounded-full bg-yellow-400" style={{ width: `${resume_1_score * 0.6}px`, maxWidth: 60 }} />
          <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${resume_2_score * 0.6}px`, maxWidth: 60 }} />
        </div>
      </div>

      {/* Right — Resume 2 */}
      <div className="text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-gray-800">{resume_2_score}/100</span>
          <WinnerBadge winner={winner} side="resume_2" />
        </div>
        <p className="text-xs text-gray-500">{resume_2_note}</p>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ResumeComparison({ addToast }) {
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [parsed1, setParsed1] = useState(null)
  const [parsed2, setParsed2] = useState(null)
  const [parseStatus1, setParseStatus1] = useState('idle') // idle | parsing | done | error
  const [parseStatus2, setParseStatus2] = useState('idle')
  const [jobDescription, setJobDescription] = useState('')
  const [showJobDesc, setShowJobDesc] = useState(false)
  const [comparing, setComparing] = useState(false)
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(1) // 1=upload, 2=loading, 3=results

  const handleFile = async (file, slot) => {
    if (slot === 1) {
      setFile1(file)
      setParsed1(null)
      setParseStatus1('parsing')
    } else {
      setFile2(file)
      setParsed2(null)
      setParseStatus2('parsing')
    }

    try {
      const res = await parseResume(file)
      if (slot === 1) {
        setParsed1(res.data)
        setParseStatus1('done')
        addToast?.('success', `Resume A parsed — ${res.data.name || 'Candidate A'}`)
      } else {
        setParsed2(res.data)
        setParseStatus2('done')
        addToast?.('success', `Resume B parsed — ${res.data.name || 'Candidate B'}`)
      }
    } catch (err) {
      if (slot === 1) setParseStatus1('error')
      else setParseStatus2('error')
      addToast?.('error', err.message || 'Failed to parse resume')
    }
  }

  const handleClear = (slot) => {
    if (slot === 1) { setFile1(null); setParsed1(null); setParseStatus1('idle') }
    else { setFile2(null); setParsed2(null); setParseStatus2('idle') }
    setResult(null)
    setStep(1)
  }

  const handleCompare = async () => {
    if (!parsed1 || !parsed2) return
    setStep(2)
    setComparing(true)
    try {
      const res = await compareResumes(parsed1, parsed2, jobDescription)
      setResult(res.data)
      setStep(3)
      addToast?.('success', 'Comparison complete!')
    } catch (err) {
      setStep(1)
      addToast?.('error', err.message || 'Comparison failed')
    } finally {
      setComparing(false)
    }
  }

  const handleReset = () => {
    setFile1(null); setFile2(null)
    setParsed1(null); setParsed2(null)
    setParseStatus1('idle'); setParseStatus2('idle')
    setResult(null); setStep(1)
    setJobDescription('')
  }

  const handleCopyResults = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    addToast?.('success', 'Results copied to clipboard!')
  }

  const canCompare = parsed1 && parsed2 && parseStatus1 === 'done' && parseStatus2 === 'done'

  const name1 = parsed1?.name || 'Candidate A'
  const name2 = parsed2?.name || 'Candidate B'

  const categories = [
    { key: 'experience', icon: Briefcase, label: 'Experience' },
    { key: 'skills', icon: Wrench, label: 'Skills' },
    { key: 'education', icon: GraduationCap, label: 'Education' },
    { key: 'communication', icon: MessageSquare, label: 'Communication' },
    { key: 'ats_friendliness', icon: Target, label: 'ATS Friendliness' },
    { key: 'leadership', icon: Users, label: 'Leadership' },
  ]

  // ── Step 1: Upload ──────────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Scale size={16} className="text-yellow-400" />
            Resume Comparison
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Compare Two Resumes
          </h1>
          <p className="text-gray-500">Upload two resumes to find out who stands out</p>
        </div>

        {/* Upload cards */}
        <div className="flex items-start gap-6 mb-6">
          <UploadCard
            label="Candidate A"
            accentColor="yellow"
            file={file1}
            parsedData={parsed1}
            onFile={(f) => handleFile(f, 1)}
            onClear={() => handleClear(1)}
            parseStatus={parseStatus1}
          />

          {/* VS Divider */}
          <div className="flex flex-col items-center pt-12 shrink-0">
            <div className="w-px h-8 bg-gray-200" />
            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
              VS
            </div>
            <div className="w-px h-8 bg-gray-200" />
          </div>

          <UploadCard
            label="Candidate B"
            accentColor="blue"
            file={file2}
            parsedData={parsed2}
            onFile={(f) => handleFile(f, 2)}
            onClear={() => handleClear(2)}
            parseStatus={parseStatus2}
          />
        </div>

        {/* Optional job description */}
        <div className="mb-6 border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowJobDesc(!showJobDesc)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <span>＋ Add Job Description for targeted comparison (optional)</span>
            {showJobDesc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showJobDesc && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for a role-specific comparison..."
                className="w-full mt-3 p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Compare button */}
        <button
          onClick={handleCompare}
          disabled={!canCompare}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2
            ${canCompare
              ? 'bg-gray-900 text-white hover:bg-yellow-400 hover:text-gray-900 border-l-4 border-yellow-400'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Scale size={18} />
          {!canCompare
            ? parseStatus1 === 'parsing' || parseStatus2 === 'parsing'
              ? 'Parsing resumes...'
              : 'Upload both resumes to compare'
            : 'COMPARE RESUMES'}
        </button>
      </div>
    )
  }

  // ── Step 2: Loading ─────────────────────────────────────────────────────────
  if (step === 2) {
    const msgs = [
      'Reading both resumes...',
      'Comparing experience levels...',
      'Analyzing skill overlap...',
      'Evaluating education...',
      'Calculating scores...',
      'Generating final verdict...',
    ]
    const [msgIdx, setMsgIdx] = React.useState(0)
    React.useEffect(() => {
      const t = setInterval(() => setMsgIdx((i) => (i + 1) % msgs.length), 1200)
      return () => clearInterval(t)
    }, [])

    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-yellow-400 animate-spin mx-auto mb-6" />
        <h2 className="font-display text-xl font-bold text-gray-900 mb-2">Comparing Resumes</h2>
        <p className="text-gray-500 text-sm mb-6">{msgs[msgIdx]}</p>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-yellow-400 animate-pulse-progress rounded-full" style={{ width: '60%' }} />
        </div>
      </div>
    )
  }

  // ── Step 3: Results ─────────────────────────────────────────────────────────
  if (step === 3 && result) {
    const isWinner1 = result.winner === 'resume_1'
    const isWinner2 = result.winner === 'resume_2'
    const isTie = result.winner === 'tie'

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-fadeIn space-y-6">

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-gray-900">Comparison Results</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopyResults}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <Copy size={14} /> Copy JSON
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition"
            >
              <RotateCcw size={14} /> Compare Again
            </button>
          </div>
        </div>

        {/* Winner banner */}
        <div className={`rounded-2xl p-5 border-2 transition-all ${
          isTie
            ? 'border-gray-300 bg-gray-50'
            : isWinner1
            ? 'border-yellow-400 bg-yellow-50 animate-winner-glow'
            : 'border-blue-400 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isTie
                ? <Minus size={28} className="text-gray-500" />
                : <Trophy size={28} className={isWinner1 ? 'text-yellow-500' : 'text-blue-500'} />
              }
              <div>
                <div className="font-display text-lg font-bold text-gray-900">
                  {isTie ? "It's a Tie!" : `${isWinner1 ? name1 : name2} Wins`}
                </div>
                <p className="text-sm text-gray-600">{result.verdict}</p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
              isTie
                ? 'bg-gray-200 text-gray-700'
                : isWinner1
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-blue-500 text-white'
            }`}>
              {isTie ? 'TIE' : isWinner1 ? name1 : name2}
            </div>
          </div>
        </div>

        {/* Overall score bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-semibold text-gray-800 mb-1">Overall Score</h3>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
            <span className="font-medium text-yellow-600">{name1}</span>
            <span className="font-medium text-blue-600">{name2}</span>
          </div>
          <ScoreBar
            score1={result.overall_scores?.resume_1 || 0}
            score2={result.overall_scores?.resume_2 || 0}
          />
        </div>

        {/* Identity row */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { data: parsed1, name: name1, color: 'yellow', score: result.overall_scores?.resume_1 },
            { data: parsed2, name: name2, color: 'blue', score: result.overall_scores?.resume_2 },
          ].map(({ data, name, color, score }, idx) => (
            <div key={idx} className={`bg-white border-2 rounded-2xl p-4 shadow-sm ${color === 'yellow' ? 'border-yellow-200' : 'border-blue-200'}`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'}`}>
                Candidate {color === 'yellow' ? 'A' : 'B'}
              </div>
              <div className="font-display text-lg font-bold text-gray-900 mb-1">{name}</div>
              <div className={`text-2xl font-bold mb-2 ${color === 'yellow' ? 'text-yellow-500' : 'text-blue-500'}`}>
                {score}/100
              </div>
              <div className="flex flex-wrap gap-1">
                {(data?.skills || []).slice(0, 5).map((s, i) => (
                  <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Category comparison */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-gray-800">Category Breakdown</h3>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />{name1}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />{name2}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 text-xs font-bold text-center text-gray-400 uppercase tracking-wide pb-2 border-b border-gray-100 mb-2">
            <span>{name1}</span>
            <span>Category</span>
            <span>{name2}</span>
          </div>
          {categories.map(({ key, icon, label }) => (
            <CategoryRow
              key={key}
              icon={icon}
              label={label}
              data={result.category_comparison?.[key]}
              name1={name1}
              name2={name2}
            />
          ))}
        </div>

        {/* Skills comparison */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Skills Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-bold text-yellow-600 uppercase tracking-wide mb-2">
                Only {name1} ({result.skills_comparison?.only_in_resume_1?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {(result.skills_comparison?.only_in_resume_1 || []).map((s, i) => (
                  <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Both Have ({result.skills_comparison?.common_skills?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {(result.skills_comparison?.common_skills || []).map((s, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
                Only {name2} ({result.skills_comparison?.only_in_resume_2?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1">
                {(result.skills_comparison?.only_in_resume_2 || []).map((s, i) => (
                  <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { name, key: 'resume_1', color: 'yellow', label: name1 },
            { name, key: 'resume_2', color: 'blue', label: name2 },
          ].map(({ key, color, label }) => (
            <div key={key} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
              <div className={`text-xs font-bold uppercase tracking-widest ${color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'}`}>
                {label}
              </div>
              <div>
                <div className="text-xs font-semibold text-green-600 mb-1">Strengths</div>
                {(result.strengths?.[key] || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-sm text-gray-700 mb-1">
                    <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-red-500 mb-1">Weaknesses</div>
                {(result.weaknesses?.[key] || []).map((w, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-sm text-gray-700 mb-1">
                    <XCircle size={13} className="text-red-400 mt-0.5 shrink-0" />
                    {w}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hire recommendation */}
        <div className="bg-gray-900 text-white rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-4">
            Hire Recommendation
          </div>
          <div className="space-y-3 mb-4">
            {[
              { label: 'Technical Role', key: 'for_technical_role' },
              { label: 'Leadership Role', key: 'for_leadership_role' },
              { label: 'Entry Level Role', key: 'for_entry_level' },
            ].map(({ label, key }) => {
              const rec = result.hire_recommendation?.[key]
              const recName = rec === 'resume_1' ? name1 : rec === 'resume_2' ? name2 : 'Tie'
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    rec === 'resume_1' ? 'bg-yellow-400 text-gray-900'
                    : rec === 'resume_2' ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300'
                  }`}>
                    {recName}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="border-t border-gray-700 pt-4 text-sm text-gray-400 italic">
            {result.hire_recommendation?.reasoning}
          </div>
        </div>

        {/* ATS scores with job */}
        {result.ats_score_with_job && jobDescription && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-semibold text-gray-800 mb-4">Job Description Match</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                { name: name1, score: result.ats_score_with_job.resume_1, color: 'yellow' },
                { name: name2, score: result.ats_score_with_job.resume_2, color: 'blue' },
              ].map(({ name, score, color }) => (
                <div key={name}>
                  <div className={`text-4xl font-bold mb-1 ${color === 'yellow' ? 'text-yellow-500' : 'text-blue-500'}`}>
                    {score}%
                  </div>
                  <div className="text-sm text-gray-500">{name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition flex items-center justify-center gap-2"
        >
          <RotateCcw size={15} /> Start a new comparison
        </button>
      </div>
    )
  }

  return null
}
