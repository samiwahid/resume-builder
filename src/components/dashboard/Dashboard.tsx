import { useEffect, useState } from 'react'
import { Copy, FilePlus2, Pencil, Trash2 } from 'lucide-react'
import { createResume, deleteResume, duplicateResume, listResumes, renameResume } from '../../library'
import type { ResumeMeta } from '../../library'
import { ResumeThumbnail } from './ResumeThumbnail'

function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

interface DashboardProps {
  onOpen: (id: string) => void
}

export function Dashboard({ onOpen }: DashboardProps) {
  const [resumes, setResumes] = useState<ResumeMeta[]>([])
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')

  useEffect(() => {
    setResumes(listResumes())
  }, [])

  function refresh() {
    setResumes(listResumes())
  }

  function handleCreate() {
    const name = prompt('Name this resume (e.g. "Software Engineer — Acme"):', 'Untitled Resume')
    if (name === null) return
    const meta = createResume(name)
    refresh()
    onOpen(meta.id)
  }

  function startRename(meta: ResumeMeta) {
    setRenamingId(meta.id)
    setDraftName(meta.name)
  }

  function commitRename(id: string) {
    renameResume(id, draftName)
    setRenamingId(null)
    refresh()
  }

  function handleDuplicate(meta: ResumeMeta) {
    const name = prompt('Name this duplicate:', `${meta.name} (Copy)`)
    if (name === null) return
    const newMeta = duplicateResume(meta.id, name)
    if (newMeta) refresh()
  }

  function handleDelete(meta: ResumeMeta) {
    if (confirm(`Delete "${meta.name}"? This can't be undone.`)) {
      deleteResume(meta.id)
      refresh()
    }
  }

  return (
    <div className="dark-scroll h-full w-full overflow-y-auto bg-slate-950 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Resumes</h1>
            <p className="mt-1 text-sm text-slate-400">Pick up where you left off, or start something new.</p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow shadow-indigo-900/40 transition hover:bg-indigo-400"
          >
            <FilePlus2 size={16} />
            New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 py-20 text-center">
            <p className="text-slate-400">No resumes yet.</p>
            <button
              type="button"
              onClick={handleCreate}
              className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Create your first resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((meta) => (
              <div
                key={meta.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700"
              >
                <button type="button" onClick={() => onOpen(meta.id)} className="flex flex-1 flex-col items-start text-left">
                  <div className="mb-3 w-full">
                    <ResumeThumbnail resumeId={meta.id} />
                  </div>
                  {renamingId !== meta.id && <span className="font-semibold text-slate-100">{meta.name}</span>}
                  <span className="mt-1 text-xs text-slate-500">Edited {formatRelativeDate(meta.updatedAt)}</span>
                </button>

                {renamingId === meta.id && (
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={() => commitRename(meta.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(meta.id)
                      if (e.key === 'Escape') setRenamingId(null)
                    }}
                    className="mb-2 rounded-md border border-indigo-400 bg-slate-800 px-2 py-1 text-sm text-white outline-none"
                  />
                )}

                <div className="mt-3 flex items-center gap-1 border-t border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={() => startRename(meta)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  >
                    <Pencil size={13} />
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(meta)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  >
                    <Copy size={13} />
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(meta)}
                    className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
