import { Minus, Plus } from 'lucide-react'
import { useResume } from '../ResumeContext'
import { ACCENT_COLORS, FONT_OPTIONS } from '../types'
import type { TemplateId } from '../types'

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'compact', label: 'Compact' },
]

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-400"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

function Stepper({
  value,
  onChange,
  step,
  min,
  max,
}: {
  value: number
  onChange: (v: number) => void
  step: number
  min: number
  max: number
}) {
  const round = (n: number) => Math.round(n * 100) / 100
  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-1 py-1">
      <button
        type="button"
        onClick={() => onChange(round(Math.max(min, value - step)))}
        className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-700 hover:text-white"
      >
        <Minus size={12} />
      </button>
      <span className="w-8 text-center text-xs font-semibold text-slate-200">{value}</span>
      <button
        type="button"
        onClick={() => onChange(round(Math.min(max, value + step)))}
        className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-700 hover:text-white"
      >
        <Plus size={12} />
      </button>
    </div>
  )
}

function ToolLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{children}</span>
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-indigo-500' : 'bg-slate-700'}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}

interface FormatToolbarProps {
  viewAsPages: boolean
  onToggleViewAsPages: (v: boolean) => void
}

export function FormatToolbar({ viewAsPages, onToggleViewAsPages }: FormatToolbarProps) {
  const { resume, dispatch } = useResume()
  const { format } = resume

  function setFormat(field: keyof typeof format, value: string | number | boolean) {
    dispatch({ type: 'SET_FORMAT', field, value })
  }

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-slate-800 bg-slate-900/60 px-4 py-2.5 print:hidden">
      <div className="flex items-center gap-1.5">
        <ToolLabel>Template</ToolLabel>
        <Select
          value={format.template}
          onChange={(v) => setFormat('template', v)}
          options={TEMPLATES.map((t) => ({ label: t.label, value: t.id }))}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <ToolLabel>Font</ToolLabel>
        <Select
          value={format.fontFamily}
          onChange={(v) => setFormat('fontFamily', v)}
          options={FONT_OPTIONS}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <ToolLabel>Size</ToolLabel>
        <Stepper value={format.fontSize} onChange={(v) => setFormat('fontSize', v)} step={0.5} min={7} max={14} />
      </div>

      <div className="flex items-center gap-1.5">
        <ToolLabel>Line spacing</ToolLabel>
        <Stepper value={format.lineHeight} onChange={(v) => setFormat('lineHeight', v)} step={0.1} min={1} max={2} />
      </div>

      <div className="flex items-center gap-1.5">
        <ToolLabel>Margin</ToolLabel>
        <Stepper value={format.margin} onChange={(v) => setFormat('margin', v)} step={0.1} min={0.3} max={1.2} />
      </div>

      <div className="flex items-center gap-1.5">
        <ToolLabel>Page</ToolLabel>
        <Select
          value={format.pageSize}
          onChange={(v) => setFormat('pageSize', v)}
          options={[
            { label: 'Letter', value: 'letter' },
            { label: 'A4', value: 'a4' },
          ]}
        />
      </div>

      <div className={`flex items-center gap-1.5 transition ${format.atsMode ? 'pointer-events-none opacity-30' : ''}`}>
        <ToolLabel>Accent</ToolLabel>
        <div className="flex items-center gap-1">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => setFormat('accentColor', color)}
              style={{ backgroundColor: color }}
              className={`h-5 w-5 rounded-full border-2 transition ${
                format.accentColor === color ? 'border-white scale-110' : 'border-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <ToggleSwitch
          checked={format.atsMode}
          onChange={(v) => setFormat('atsMode', v)}
          label="ATS-safe mode"
        />
        <ToggleSwitch checked={viewAsPages} onChange={onToggleViewAsPages} label="View as pages" />
      </div>
    </div>
  )
}
