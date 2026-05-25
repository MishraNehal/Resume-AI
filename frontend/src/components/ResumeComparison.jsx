import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, X, Scale, Trophy, Minus,
  Briefcase, Wrench, GraduationCap, MessageSquare,
  Target, Users, ChevronDown, ChevronUp, RotateCcw,
  Loader2, CheckCircle, XCircle, Copy, AlertCircle
} from 'lucide-react'
import { parseResume, compareResumes } from '../services/api'

// ── Upload Card ────────────────────────────────────────────────────────────────
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

  const isYellow = accentColor === 'yellow'
  const dragClass = isDragActive
    ? isYellow ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400 bg-blue-50'
    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
  const labelColor = isYellow ? 'text-yellow-600' : 'text-blue-600'
  const badgeColor = isYellow ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'

  return (
    <div className="flex-1 min-w-0">
      <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${labelColor}`}>
        {label}
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragClass}`}
        >
          <input {...getInputProps()} />
          <Upload size={36} className={`mx-auto mb-3 ${isDragActive ? (isYellow ? 'text-yellow-500' : 'text-blue-500') : 'text-gray-400'}`} />
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
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="p-1 rounded-lg hover:bg-gray-100 transition shrink-0"
            >
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
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
                <CheckCircle size={12} /> {parsedData.name || 'Parsed successfully'}
              </span>
            )}
            {parseStatus === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle size={14} /> Parse failed — try another file
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Score Bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ score1, score2 }) {
  const total = (score1 + score2) || 1
  const pct1 = Math.round((score1 / total) * 100)

  return (
    <div className="flex items-center gap-3 my-3">
      <span className="font-bold text-lg text-yellow-600 w-10 text-right">{score1}</span>
      <div className="flex-1 h-3 rounded-full overflow-hidden bg-gray-100 flex">
        <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${pct1}%` }} />
        <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${100 - pct1}%` }} />
      </div>
      <span className="font-bold text-lg text-blue-600 w-10">{score2}</span>
    </div>
  )
}

// ── Category Row ───────────────────────────────────────────────────────────────
function CategoryRow({ icon: Icon, label, data }) {
  if (!data) return null
  const { resume_1_score, resume_2_score, resume_1_note, resume_2_note, winner } = data

  return (
    <div className="grid grid-cols-[1fr_120px_1fr] gap-3 items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-xl px-2 transition-colors">
      <div className="text-right">
        <div className="flex items-center justify-end gap-2 mb-0.5">
          {winner === 'resume_1' && <Trophy size={12} className="text-yellow-500" />}
          <span className="font-bold text-gray-800 text-sm">{resume_1_score}/100</span>
        </div>
        <p className="text-xs text-gray-400">{resume_1_note}</p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Icon size={13} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        </div>
      </div>

      <div className="text-left">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-gray-800 text-sm">{resume_2_score}/100</span>
          {winner === 'resume_2' && <Trophy size={12} className="text-yellow-500" />}
        </div>
        <p className="text-xs text-gray-400">{resume_2_note}</p>
      </div>
    </div>
  )
}

// ── Loading Step ───────────────────────────────────────────────────────────────
// ✅ FIX: moved useState/useEffect OUTSIDE the conditional render
function LoadingStep() {
  const msgs = [
    'Reading both resumes...',
    'Comparing experience levels...',
    'Analyzing skill overlap...',
    'Evaluating education...',
    'Calculating scores...',
    'Generating final verdict...',
  ]
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % msgs.length), 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-yellow-400 animate-spin mx-auto mb-6" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Comparing Resumes</h2>
      <p className="text-gray-500 text-sm mb-6">{msgs[msgIdx]}</p>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-yellow-400 animate-pulse-progress rounded-full w-3/5" />
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ResumeComparison({ addToast }) {
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [parsed1, setParsed1] = useState(null)
  const [parsed2, setParsed2] = useState(null)
  const [parseStatus1, setParseStatus1] = useState('idle')
  const [parseStatus2, setParseStatus2] = useState('idle')
  const [jobDescription, setJobDescription] = useState('')
  const [showJobDesc, setShowJobDesc] = useState(false)
  const [step, setStep] = useState(1)
  const [result, setResult] = useState(null)

  const name1 = parsed1?.name || 'Candidate A'
  const name2 = parsed2?.name || 'Candidate B'

  const handleFile = async (file, slot) => {
    if (slot === 1) { setFile1(file); setParsed1(null); setParseStatus1('parsing') }
    else { setFile2(file); setParsed2(null); setParseStatus2('parsing') }

    try {
      const res = await parseResume(file)
      if (slot === 1) { setParsed1(res.data); setParseStatus1('done') }
      else { setParsed2(res.data); setParseStatus2('done') }
      addToast?.('success', `Resume ${slot === 1 ? 'A' : 'B'} parsed — ${res.data?.name || 'done'}`)
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
    try {
      const res = await compareResumes(parsed1, parsed2, jobDescription)
      setResult(res.data)
      setStep(3)
      addToast?.('success', 'Comparison complete!')
    } catch (err) {
      setStep(1)
      addToast?.('error', err.message || 'Comparison failed. Please try again.')
    }
  }

  const handleReset = () => {
    setFile1(null); setFile2(null)
    setParsed1(null); setParsed2(null)
    setParseStatus1('idle'); setParseStatus2('idle')
    setResult(null); setStep(1)
    setJobDescription('')
  }

  const canCompare = parseStatus1 === 'done' && parseStatus2 === 'done'

  const categories = [
    { key: 'experience',     icon: Briefcase,      label: 'Experience' },
    { key: 'skills',         icon: Wrench,          label: 'Skills' },
    { key: 'education',      icon: GraduationCap,   label: 'Education' },
    { key: 'communication',  icon: MessageSquare,   label: 'Communication' },
    { key: 'ats_friendliness', icon: Target,        label: 'ATS' },
    { key: 'leadership',     icon: Users,           label: 'Leadership' },
  ]

  // ── Step 1: Upload ────────────────────────────────────────────────────────
  if (step === 1) return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Scale size={16} className="text-yellow-400" />
          Resume Comparison
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Two Resumes</h1>
        <p className="text-gray-500">Upload two resumes to find out who stands out</p>
      </div>

      {/* Upload cards */}
      <div className="flex items-start gap-4 mb-6">
        <UploadCard
          label="Candidate A"
          accentColor="yellow"
          file={file1}
          parsedData={parsed1}
          onFile={(f) => handleFile(f, 1)}
          onClear={() => handleClear(1)}
          parseStatus={parseStatus1}
        />

        <div className="flex flex-col items-center pt-10 shrink-0">
          <div className="w-px h-8 bg-gray-200" />
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">VS</div>
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
          <span>+ Add Job Description for targeted comparison (optional)</span>
          {showJobDesc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showJobDesc && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
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
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
          canCompare
            ? 'bg-gray-900 text-white hover:bg-yellow-400 hover:text-gray-900'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Scale size={18} />
        {!canCompare
          ? parseStatus1 === 'parsing' || parseStatus2 === 'parsing'
            ? 'Parsing resumes...'
            : 'Upload and wait for both resumes to parse'
          : 'COMPARE RESUMES'
        }
      </button>
    </div>
  )

  // ── Step 2: Loading ───────────────────────────────────────────────────────
  if (step === 2) return <LoadingStep />

  // ── Step 3: Results ───────────────────────────────────────────────────────
  if (step === 3 && result) {
    const isWinner1 = result.winner === 'resume_1'
    const isWinner2 = result.winner === 'resume_2'
    const isTie = result.winner === 'tie'

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Comparison Results</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2)).then(() => addToast?.('success', 'Copied!'))}
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
        <div className={`rounded-2xl p-5 border-2 ${
          isTie ? 'border-gray-300 bg-gray-50'
          : isWinner1 ? 'border-yellow-400 bg-yellow-50'
          : 'border-blue-400 bg-blue-50'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {isTie
                ? <Minus size={28} className="text-gray-500" />
                : <Trophy size={28} className={isWinner1 ? 'text-yellow-500' : 'text-blue-500'} />
              }
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {isTie ? "It's a Tie!" : `${isWinner1 ? name1 : name2} Wins`}
                </div>
                <p className="text-sm text-gray-600">{result.verdict}</p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
              isTie ? 'bg-gray-200 text-gray-700'
              : isWinner1 ? 'bg-yellow-400 text-gray-900'
              : 'bg-blue-500 text-white'
            }`}>
              {isTie ? 'TIE' : isWinner1 ? name1 : name2}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between text-sm font-medium mb-1">
            <span className="text-yellow-600">{name1}</span>
            <span className="text-blue-600">{name2}</span>
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
            { data: parsed2, name: name2, color: 'blue',   score: result.overall_scores?.resume_2 },
          ].map(({ data, name, color, score }) => (
            <div key={name} className={`bg-white border-2 rounded-2xl p-4 shadow-sm ${
              color === 'yellow' ? 'border-yellow-200' : 'border-blue-200'
            }`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
              }`}>
                {color === 'yellow' ? 'Candidate A' : 'Candidate B'}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">{name}</div>
              <div className={`text-2xl font-bold mb-2 ${
                color === 'yellow' ? 'text-yellow-500' : 'text-blue-500'
              }`}>{score}/100</div>
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

        {/* Category breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Category Breakdown</h3>
            <div className="flex gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />{name1}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />{name2}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 text-xs font-bold text-gray-400 uppercase text-center pb-2 border-b border-gray-100 mb-1">
            <span>{name1}</span><span>Category</span><span>{name2}</span>
          </div>
          {categories.map(({ key, icon, label }) => (
            <CategoryRow key={key} icon={icon} label={label} data={result.category_comparison?.[key]} />
          ))}
        </div>

        {/* Skills comparison */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Skills Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: `Only ${name1}`, items: result.skills_comparison?.only_in_resume_1, color: 'yellow' },
              { label: 'Both Have',     items: result.skills_comparison?.common_skills,    color: 'gray' },
              { label: `Only ${name2}`, items: result.skills_comparison?.only_in_resume_2, color: 'blue' },
            ].map(({ label, items, color }) => (
              <div key={label}>
                <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${
                  color === 'yellow' ? 'text-yellow-600'
                  : color === 'blue' ? 'text-blue-600'
                  : 'text-gray-500'
                }`}>{label} ({items?.length || 0})</div>
                <div className="flex flex-wrap gap-1">
                  {(items || []).map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
                      color === 'yellow' ? 'bg-yellow-100 text-yellow-800'
                      : color === 'blue' ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700'
                    }`}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'resume_1', name: name1, color: 'yellow' },
            { key: 'resume_2', name: name2, color: 'blue' },
          ].map(({ key, name, color }) => (
            <div key={key} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
              <div className={`text-xs font-bold uppercase tracking-widest ${
                color === 'yellow' ? 'text-yellow-600' : 'text-blue-600'
              }`}>{name}</div>
              <div>
                <div className="text-xs font-semibold text-green-600 mb-1">Strengths</div>
                {(result.strengths?.[key] || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-sm text-gray-700 mb-1">
                    <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" />{s}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-red-500 mb-1">Weaknesses</div>
                {(result.weaknesses?.[key] || []).map((w, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-sm text-gray-700 mb-1">
                    <XCircle size={13} className="text-red-400 mt-0.5 shrink-0" />{w}
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
              { label: 'Technical Role',    key: 'for_technical_role' },
              { label: 'Leadership Role',   key: 'for_leadership_role' },
              { label: 'Entry Level Role',  key: 'for_entry_level' },
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
                  }`}>{recName}</span>
                </div>
              )
            })}
          </div>
          <div className="border-t border-gray-700 pt-4 text-sm text-gray-400 italic">
            {result.hire_recommendation?.reasoning}
          </div>
        </div>

        {/* Reset */}
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