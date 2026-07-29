import type { ChangeEvent, ReactNode } from 'react'

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
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4, hint }: TextAreaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-left">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
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
