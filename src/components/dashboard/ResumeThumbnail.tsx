import { useEffect, useMemo, useRef, useState } from 'react'
import { FileText } from 'lucide-react'
import { loadResumeData } from '../../library'
import { PAGE_SIZE_IN, ResumeDocument } from '../preview/ResumeDocument'

const PX_PER_IN = 96

export function ResumeThumbnail({ resumeId }: { resumeId: string }) {
  const resume = useMemo(() => loadResumeData(resumeId), [resumeId])
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  const pageWidthPx = resume ? PAGE_SIZE_IN[resume.format.pageSize].w * PX_PER_IN : 0

  useEffect(() => {
    const outer = outerRef.current
    if (!outer || !pageWidthPx) return
    const update = () => setScale(Math.min(1, outer.clientWidth / pageWidthPx))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(outer)
    return () => ro.disconnect()
  }, [pageWidthPx])

  if (!resume) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg bg-slate-800/60 text-slate-600">
        <FileText size={28} />
      </div>
    )
  }

  return (
    <div ref={outerRef} className="h-40 w-full overflow-hidden rounded-lg bg-slate-800/40">
      {scale > 0 && <ResumeDocument resume={resume} scale={scale} />}
    </div>
  )
}
