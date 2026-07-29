import { useState } from 'react'
import { FormatToolbar } from './components/FormatToolbar'
import { IconRail } from './components/IconRail'
import { TopBar } from './components/TopBar'
import { EditorPanel } from './components/editor/EditorPanel'
import { ResumePreview } from './components/preview/ResumePreview'

function App() {
  const [viewAsPages, setViewAsPages] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <IconRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <FormatToolbar viewAsPages={viewAsPages} onToggleViewAsPages={setViewAsPages} />
        <div className="grid min-h-0 flex-1 grid-cols-2">
          <EditorPanel />
          <div className="dark-scroll overflow-y-auto bg-slate-900 p-8 print:overflow-visible print:bg-white print:p-0">
            <ResumePreview viewAsPages={viewAsPages} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
