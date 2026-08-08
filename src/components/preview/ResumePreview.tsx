import { useEffect, useRef, useState } from 'react'
import { useResume } from '../../ResumeContext'
import { PAGE_SIZE_IN, ResumeDocument } from './ResumeDocument'

interface ResumePreviewProps {
  viewAsPages: boolean
}

const PX_PER_IN = 96

export function ResumePreview({ viewAsPages }: ResumePreviewProps) {
  const { resume, dispatch } = useResume()
  const { format } = resume
  const page = PAGE_SIZE_IN[format.pageSize]

  const outerRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [pageHeightPx, setPageHeightPx] = useState(0)
  const pageWidthPx = page.w * PX_PER_IN

  useEffect(() => {
    let styleTag = document.getElementById('print-page-size') as HTMLStyleElement | null
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = 'print-page-size'
      document.head.appendChild(styleTag)
    }
    styleTag.textContent = `@page { size: ${format.pageSize === 'a4' ? 'A4' : 'letter'}; margin: 0; }`
  }, [format.pageSize])

  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return
    const update = () => setScale(Math.min(1, outer.clientWidth / pageWidthPx))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(outer)
    return () => ro.disconnect()
  }, [pageWidthPx])

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    const update = () => setPageHeightPx(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  })

  return (
    <div ref={outerRef} className="w-full">
      <div
        id="resume-page-scale-wrapper"
        className="mx-auto overflow-hidden"
        style={{ width: pageWidthPx * scale, height: pageHeightPx * scale }}
      >
        <ResumeDocument
          resume={resume}
          scale={scale}
          viewAsPages={viewAsPages}
          id="resume-page"
          pageRef={pageRef}
          onPageBreakChange={(sectionId) => dispatch({ type: 'SET_FORMAT', field: 'pageBreakSectionId', value: sectionId })}
        />
      </div>
    </div>
  )
}
