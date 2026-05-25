import React from 'react'
import {
  User, Mail, Phone, MapPin, Linkedin, Github, Globe,
  Briefcase, GraduationCap, Wrench, Award, Languages,
  AlignLeft, Calendar, Star,
} from 'lucide-react'

const skillColors = [
  'bg-blue-100 text-blue-800 border border-blue-200',
  'bg-purple-100 text-purple-800 border border-purple-200',
  'bg-pink-100 text-pink-800 border border-pink-200',
  'bg-green-100 text-green-800 border border-green-200',
  'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'bg-red-100 text-red-800 border border-red-200',
  'bg-indigo-100 text-indigo-800 border border-indigo-200',
  'bg-cyan-100 text-cyan-800 border border-cyan-200',
]

function SkillTag({ children, index }) {
  return (
    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${skillColors[index % skillColors.length]}`}>
      {children}
    </span>
  )
}

function LanguageTag({ children }) {
  return (
    <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
      {children}
    </span>
  )
}

function CertificationBadge({ children }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
      <Star size={14} className="text-amber-600 shrink-0" />
      <span className="text-sm font-medium text-amber-900">{children}</span>
    </div>
  )
}

export default function ResumeResults({ data }) {
  const c = data.contact || {}

  const contactItems = [
    { icon: Mail, value: c.email },
    { icon: Phone, value: c.phone },
    { icon: MapPin, value: c.location },
    { icon: Linkedin, value: c.linkedin },
    { icon: Github, value: c.github },
    { icon: Globe, value: c.website },
  ].filter((i) => i.value)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Identity */}
      {data.name && (
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{data.name}</h2>
          {contactItems.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {contactItems.map(({ icon: Icon, value }, i) => (
                <a
                  key={i}
                  href={value.startsWith('http') ? value : '#'}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                  target={value.startsWith('http') ? '_blank' : undefined}
                  rel={value.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <Icon size={16} className="text-slate-400" />
                  <span className="truncate">{value}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft size={18} className="text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Summary</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wrench size={18} className="text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <SkillTag key={i} index={i}>
                {skill}
              </SkillTag>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 bg-slate-50">
            <Briefcase size={18} className="text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
          </div>
          <div className="px-6 py-4 space-y-0">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                {i < data.experience.length - 1 && (
                  <div className="absolute left-0 top-8 w-0.5 h-12 bg-gradient-to-b from-blue-400 to-transparent" />
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900">{exp.title}</h4>
                    <p className="text-sm text-slate-600 font-medium">{exp.company}</p>
                    {exp.dates && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Calendar size={12} />
                        {exp.dates}
                      </div>
                    )}
                    {exp.description && (
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 bg-slate-50">
            <GraduationCap size={18} className="text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Education</h3>
          </div>
          <div className="px-6 py-4 space-y-0">
            {data.education.map((edu, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                {i < data.education.length - 1 && (
                  <div className="absolute left-0 top-8 w-0.5 h-12 bg-gradient-to-b from-indigo-400 to-transparent" />
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-indigo-500 border-4 border-white shadow-sm" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                    <p className="text-sm text-slate-600 font-medium">{edu.institution}</p>
                    {edu.dates && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Calendar size={12} />
                        {edu.dates}
                      </div>
                    )}
                    {edu.gpa && (
                      <p className="text-xs text-slate-500 mt-1 font-medium">GPA: {edu.gpa}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Certifications</h3>
          </div>
          <div className="space-y-2">
            {data.certifications.map((cert, i) => (
              <CertificationBadge key={i}>{cert}</CertificationBadge>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Languages size={18} className="text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Languages</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang, i) => (
              <LanguageTag key={i}>{lang}</LanguageTag>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
