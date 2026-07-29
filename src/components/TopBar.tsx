import { Printer } from 'lucide-react'
import { useResume } from '../ResumeContext'

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function TopBar() {
  const { resume } = useResume()

  function handlePrint() {
    window.print()
  }

  return (
    <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3 print:hidden">
      <div className="flex flex-1 flex-wrap items-center gap-1 overflow-x-auto">
        <NavTab label="Contact" onClick={() => scrollToSection('section-contact')} />
        {resume.sections.map((s) => (
          <NavTab key={s.id} label={s.title} onClick={() => scrollToSection(`section-${s.id}`)} />
        ))}
      </div>
      <button
        type="button"
        onClick={handlePrint}
        className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-indigo-900/40 transition hover:bg-indigo-400"
      >
        <Printer size={16} />
        Download PDF
      </button>
    </div>
  )
}

function NavTab({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:bg-slate-800 hover:text-white"
    >
      {label}
    </button>
  )
}
