import { useState } from 'react'
import { FormatToolbar } from './components/FormatToolbar'
import { IconRail } from './components/IconRail'
import { TopBar } from './components/TopBar'
import { EditorPanel } from './components/editor/EditorPanel'
import { ResumePreview } from './components/preview/ResumePreview'

function App() {
  const [viewAsPages, setViewAsPages] = useState(false)
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <IconRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <FormatToolbar viewAsPages={viewAsPages} onToggleViewAsPages={setViewAsPages} />

        <div className="flex border-b border-slate-800 bg-slate-900/60 md:hidden print:hidden">
          <button
            type="button"
            onClick={() => setMobileView('edit')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
              mobileView === 'edit' ? 'border-b-2 border-indigo-400 text-white' : 'text-slate-500'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
              mobileView === 'preview' ? 'border-b-2 border-indigo-400 text-white' : 'text-slate-500'
            }`}
          >
            Preview
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
          <div className={mobileView === 'edit' ? 'block min-h-0' : 'hidden md:block'}>
            <EditorPanel />
          </div>
          <div
            className={`dark-scroll overflow-y-auto bg-slate-900 p-4 md:p-8 print:overflow-visible print:bg-white print:p-0 ${
              mobileView === 'preview' ? 'block' : 'hidden md:block'
            }`}
          >
            <ResumePreview viewAsPages={viewAsPages} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
