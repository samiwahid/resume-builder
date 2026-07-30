import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { resumeReducer } from './resumeReducer'
import type { ResumeAction } from './resumeReducer'
import { createDefaultResume } from './defaultResume'
import { loadResumeData, saveResumeData } from './library'
import type { ResumeData } from './types'

function loadInitialState(resumeId: string): ResumeData {
  const defaults = createDefaultResume()
  const parsed = loadResumeData(resumeId)
  if (!parsed) return defaults
  return {
    ...defaults,
    ...parsed,
    contact: { ...defaults.contact, ...parsed.contact },
    format: { ...defaults.format, ...parsed.format },
  }
}

interface ResumeContextValue {
  resume: ResumeData
  dispatch: React.Dispatch<ResumeAction>
}

const ResumeContext = createContext<ResumeContextValue | null>(null)

export function ResumeProvider({ resumeId, children }: { resumeId: string; children: ReactNode }) {
  const [resume, dispatch] = useReducer(resumeReducer, resumeId, loadInitialState)

  useEffect(() => {
    saveResumeData(resumeId, resume)
  }, [resumeId, resume])

  const value = useMemo(() => ({ resume, dispatch }), [resume])

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within a ResumeProvider')
  return ctx
}
