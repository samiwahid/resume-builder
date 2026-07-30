import { useState } from 'react'
import { Dashboard } from './components/dashboard/Dashboard'
import { EditorView } from './components/EditorView'
import { ensureLibraryInitialized } from './library'

ensureLibraryInitialized()

function App() {
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {activeResumeId ? (
        <EditorView key={activeResumeId} resumeId={activeResumeId} onBack={() => setActiveResumeId(null)} />
      ) : (
        <Dashboard onOpen={setActiveResumeId} />
      )}
    </div>
  )
}

export default App
