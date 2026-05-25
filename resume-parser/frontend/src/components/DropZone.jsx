import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, X, File } from 'lucide-react'

function getFileIcon(fileName) {
  const ext = fileName.split('.').pop().toLowerCase()
  switch (ext) {
    case 'pdf':
      return '📄'
    case 'docx':
      return '📝'
    case 'txt':
      return '📋'
    default:
      return '📁'
  }
}

export default function DropZone({ file, onFile, onClear }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) onFile(acceptedFiles[0])
    },
    [onFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  })

  const fileSize = file ? (file.size / 1024).toFixed(1) : 0
  const fileExt = file ? file.name.split('.').pop().toUpperCase() : ''

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-blue-400 bg-blue-500/10'
          : 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700/50'
      }`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="space-y-3">
          <div className="text-3xl">{getFileIcon(file.name)}</div>
          <div className="text-sm font-semibold text-slate-100 truncate px-2">{file.name}</div>
          <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>{fileSize} KB</span>
            <span>·</span>
            <span>{fileExt}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors"
          >
            <X size={14} />
            Remove
          </button>
        </div>
      ) : (
        <>
          <div className={`mx-auto mb-3 ${
            isDragActive ? 'text-blue-400' : 'text-slate-400'
          }`}>
            <UploadCloud size={36} className="mx-auto" />
          </div>
          <p className="font-semibold text-slate-100 mb-1">
            {isDragActive ? 'Drop your resume here' : 'Drag & drop resume'}
          </p>
          <p className="text-xs text-slate-400">or click to browse</p>
        </>
      )}
    </div>
  )
}
