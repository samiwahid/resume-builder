import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { resumeReducer } from './resumeReducer'
import type { ResumeAction } from './resumeReducer'
import { createDefaultResume } from './defaultResume'
import type { ResumeData } from './types'

const STORAGE_KEY = 'resume-builder-data'

function loadInitialState(): ResumeData {
  const defaults = createDefaultResume()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ResumeData
      return {
        ...defaults,
        ...parsed,
        contact: { ...defaults.contact, ...parsed.contact },
        format: { ...defaults.format, ...parsed.format },
      }
    }
  } catch {
    // fall through to default
  }
  return defaults
}

interface ResumeContextValue {
  resume: ResumeData
  dispatch: React.Dispatch<ResumeAction>
}

const ResumeContext = createContext<ResumeContextValue | null>(null)

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, dispatch] = useReducer(resumeReducer, undefined, loadInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
  }, [resume])

  const value = useMemo(() => ({ resume, dispatch }), [resume])

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within a ResumeProvider')
  return ctx
}
