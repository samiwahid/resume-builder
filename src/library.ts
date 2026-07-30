import { v4 as uuid } from 'uuid'
import { createDefaultResume } from './defaultResume'
import type { ResumeData } from './types'

export interface ResumeMeta {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

const INDEX_KEY = 'resume-builder-library'
const LEGACY_DATA_KEY = 'resume-builder-data'
const resumeKey = (id: string) => `resume-builder-resume-${id}`

function readIndex(): ResumeMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    return raw ? (JSON.parse(raw) as ResumeMeta[]) : []
  } catch {
    return []
  }
}

function writeIndex(list: ResumeMeta[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(list))
}

function blankResume(): ResumeData {
  const fresh = createDefaultResume()
  return {
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
  }
}

/** One-time migration from the old single-resume storage, or seed a sample resume for first-time users. */
export function ensureLibraryInitialized() {
  if (localStorage.getItem(INDEX_KEY)) return

  const now = new Date().toISOString()
  const legacyRaw = localStorage.getItem(LEGACY_DATA_KEY)

  if (legacyRaw) {
    try {
      const legacyData = JSON.parse(legacyRaw) as ResumeData
      const id = uuid()
      localStorage.setItem(resumeKey(id), legacyRaw)
      writeIndex([{ id, name: legacyData.contact?.name || 'My Resume', createdAt: now, updatedAt: now }])
      localStorage.removeItem(LEGACY_DATA_KEY)
      return
    } catch {
      // fall through to seeding a fresh sample below
    }
  }

  const sample = createDefaultResume()
  const id = uuid()
  localStorage.setItem(resumeKey(id), JSON.stringify(sample))
  writeIndex([{ id, name: sample.contact.name || 'Sample Resume', createdAt: now, updatedAt: now }])
}

export function listResumes(): ResumeMeta[] {
  return [...readIndex()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function loadResumeData(id: string): ResumeData | null {
  try {
    const raw = localStorage.getItem(resumeKey(id))
    return raw ? (JSON.parse(raw) as ResumeData) : null
  } catch {
    return null
  }
}

export function saveResumeData(id: string, data: ResumeData) {
  localStorage.setItem(resumeKey(id), JSON.stringify(data))
  const list = readIndex()
  const entry = list.find((m) => m.id === id)
  if (entry) {
    entry.updatedAt = new Date().toISOString()
    writeIndex(list)
  }
}

export function createResume(name: string): ResumeMeta {
  const now = new Date().toISOString()
  const meta: ResumeMeta = { id: uuid(), name: name.trim() || 'Untitled Resume', createdAt: now, updatedAt: now }
  localStorage.setItem(resumeKey(meta.id), JSON.stringify(blankResume()))
  writeIndex([...readIndex(), meta])
  return meta
}

export function renameResume(id: string, name: string) {
  const list = readIndex()
  const entry = list.find((m) => m.id === id)
  if (entry) {
    entry.name = name.trim() || 'Untitled Resume'
    writeIndex(list)
  }
}

export function deleteResume(id: string) {
  localStorage.removeItem(resumeKey(id))
  writeIndex(readIndex().filter((m) => m.id !== id))
}

export function importResume(name: string, data: ResumeData): ResumeMeta {
  const now = new Date().toISOString()
  const meta: ResumeMeta = { id: uuid(), name: name.trim() || 'Imported Resume', createdAt: now, updatedAt: now }
  localStorage.setItem(resumeKey(meta.id), JSON.stringify(data))
  writeIndex([...readIndex(), meta])
  return meta
}
