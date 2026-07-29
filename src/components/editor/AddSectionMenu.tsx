import { useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { useResume } from '../../ResumeContext'
import type { SectionKind } from '../../types'

const OPTIONS: { kind: SectionKind; title: string; description: string }[] = [
  { kind: 'summary', title: 'Summary', description: 'A short professional pitch' },
  { kind: 'experience', title: 'Experience', description: 'Jobs, roles, achievements' },
  { kind: 'education', title: 'Education', description: 'Degrees and schools' },
  { kind: 'skills', title: 'Skills', description: 'A list of your key skills' },
  { kind: 'custom', title: 'Custom Section', description: 'Projects, awards, volunteering...' },
]

export function AddSectionMenu() {
  const { dispatch } = useResume()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function addSection(kind: SectionKind, title: string) {
    dispatch({ type: 'ADD_SECTION', kind, title })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 py-2.5 text-sm font-semibold text-slate-300 hover:border-indigo-400 hover:text-indigo-300"
      >
        <Plus size={16} /> Add Section
      </button>
      {open && (
        <div className="absolute bottom-full z-10 mb-2 w-72 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-xl">
          {OPTIONS.map((opt) => (
            <button
              key={opt.kind}
              type="button"
              onClick={() => addSection(opt.kind, opt.title)}
              className="flex w-full flex-col items-start gap-0.5 px-3.5 py-2.5 text-left hover:bg-slate-700/70"
            >
              <span className="text-sm font-semibold text-slate-100">{opt.title}</span>
              <span className="text-xs text-slate-400">{opt.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
