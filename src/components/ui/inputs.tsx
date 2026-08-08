import { useRef } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { Bold, CaseUpper, Italic } from 'lucide-react'
import { autoCapitalizeOnInput, toggleFormatMarker } from '../../textFormatting'
import type { FormatMarker } from '../../textFormatting'

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Field({ label, value, onChange, placeholder, className }: FieldProps) {
  return (
    <label className={`flex flex-col gap-1 text-left ${className ?? ''}`}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
      />
    </label>
  )
}

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  hint?: string
  formatting?: boolean
}

const FORMAT_BUTTONS: { marker: FormatMarker; title: string; icon: ReactNode }[] = [
  { marker: 'bold', title: 'Bold selected text (**text**)', icon: <Bold size={12} /> },
  { marker: 'italic', title: 'Italicize selected text (*text*)', icon: <Italic size={12} /> },
  { marker: 'caps', title: 'Capitalize selected text (::text::)', icon: <CaseUpper size={12} /> },
]

export function TextAreaField({ label, value, onChange, placeholder, rows = 4, hint, formatting }: TextAreaFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(autoCapitalizeOnInput(value, e.target.value))
  }

  function applyMarker(marker: FormatMarker) {
    const el = textareaRef.current
    if (!el) return
    const result = toggleFormatMarker(value, el.selectionStart, el.selectionEnd, marker)
    if (!result) return
    onChange(result.value)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(result.selectionStart, result.selectionEnd)
    })
  }

  return (
    <label className="flex flex-col gap-1 text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
        {formatting && (
          <div className="flex items-center gap-0.5">
            {FORMAT_BUTTONS.map((btn) => (
              <button
                key={btn.marker}
                type="button"
                title={btn.title}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyMarker(btn.marker)}
                className="flex h-5 w-5 items-center justify-center rounded text-slate-500 transition hover:bg-slate-700 hover:text-slate-200"
              >
                {btn.icon}
              </button>
            ))}
          </div>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={handleChange}
        className="resize-y rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm leading-relaxed text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
      />
      {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
    </label>
  )
}

interface IconButtonProps {
  onClick: () => void
  title: string
  children: ReactNode
  disabled?: boolean
  danger?: boolean
}

export function IconButton({ onClick, title, children, disabled, danger }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-slate-400 transition hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? 'hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400' : ''
      }`}
    >
      {children}
    </button>
  )
}
