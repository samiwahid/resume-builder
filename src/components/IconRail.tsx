import { useRef } from 'react'
import { Download, FilePlus2, RotateCcw, Sparkles, Upload } from 'lucide-react'
import { useResume } from '../ResumeContext'
import { createDefaultResume } from '../defaultResume'
import type { ResumeData } from '../types'

function RailButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="group flex h-11 w-11 flex-col items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-indigo-300"
    >
      {icon}
    </button>
  )
}

export function IconRail() {
  const { resume, dispatch } = useResume()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleNew() {
    if (confirm('Start a blank resume? This clears all current content.')) {
      const fresh = createDefaultResume()
      dispatch({
        type: 'LOAD_RESUME',
        data: {
          ...fresh,
          contact: { name: '', title: '', location: '', email: '', phone: '', linkedin: '', website: '' },
          sections: fresh.sections.map((s) =>
            s.kind === 'summary'
              ? { ...s, content: '' }
              : s.kind === 'skills'
                ? { ...s, skills: '' }
                : s.kind === 'experience' || s.kind === 'education' || s.kind === 'custom'
                  ? { ...s, items: [] }
                  : s
          ),
        },
      })
    }
  }

  function handleResetToSample() {
    if (confirm('Reset to the original sample resume? This clears all current content.')) {
      dispatch({ type: 'LOAD_RESUME', data: createDefaultResume() })
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const fileName = (resume.contact.name || 'resume').trim().replace(/\s+/g, '-').toLowerCase()
    a.href = url
    a.download = `${fileName}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as ResumeData
        dispatch({ type: 'LOAD_RESUME', data })
      } catch {
        alert('That file could not be read as a resume JSON export.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-slate-800 bg-slate-900 py-4 print:hidden">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg shadow-indigo-900/40">
        <Sparkles size={18} />
      </div>
      <RailButton icon={<FilePlus2 size={19} />} label="New blank resume" onClick={handleNew} />
      <RailButton icon={<RotateCcw size={19} />} label="Reset to sample resume" onClick={handleResetToSample} />
      <RailButton icon={<Upload size={19} />} label="Import resume (.json)" onClick={handleImportClick} />
      <RailButton icon={<Download size={19} />} label="Export resume (.json)" onClick={handleExport} />
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
    </aside>
  )
}
