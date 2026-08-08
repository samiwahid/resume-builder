import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Globe, Link, Mail, MapPin, Phone, X } from 'lucide-react'
import { renderFormattedText } from '../../textFormatting'
import type {
  ContactInfo,
  CustomEntry,
  EducationEntry,
  ExperienceEntry,
  ResumeData,
  Section,
  SkillsSection,
  TemplateId,
} from '../../types'

export const PAGE_SIZE_IN: Record<'letter' | 'a4', { w: number; h: number }> = {
  letter: { w: 8.5, h: 11 },
  a4: { w: 8.27, h: 11.69 },
}

const PX_PER_IN = 96
// Matches the mt-5 / mt-3.5 gap previously used between different sections
const SECTION_GAP_PX = { normal: 20, compact: 14 }
// Matches the mt-3.5 / mt-2.5 gap previously used between entries within the same section
const ENTRY_GAP_PX = { normal: 14, compact: 10 }
// Matches the Header's own mb-5
const HEADER_BOTTOM_MARGIN_PX = 20

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function ContactLine({
  contact,
  template,
  accentColor,
  atsMode,
}: {
  contact: ContactInfo
  template: TemplateId
  accentColor: string
  atsMode: boolean
}) {
  const items = [
    contact.location && { icon: <MapPin size={11} />, text: contact.location },
    contact.email && { icon: <Mail size={11} />, text: contact.email },
    contact.phone && { icon: <Phone size={11} />, text: contact.phone },
    contact.linkedin && { icon: <Link size={11} />, text: contact.linkedin },
    contact.website && { icon: <Globe size={11} />, text: contact.website },
  ].filter(Boolean) as { icon: React.ReactNode; text: string }[]

  const justify = template === 'classic' ? 'justify-center' : 'justify-start'

  if (atsMode) {
    return (
      <p className={`text-[0.82em] text-slate-600 ${template === 'classic' ? 'text-center' : ''}`}>
        {items.map((item) => item.text).join('  |  ')}
      </p>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.82em] text-slate-600 ${justify}`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span style={{ color: template === 'classic' ? undefined : accentColor }}>{item.icon}</span>
          {item.text}
        </span>
      ))}
    </div>
  )
}

function Header({
  contact,
  template,
  accentColor,
  atsMode,
}: {
  contact: ContactInfo
  template: TemplateId
  accentColor: string
  atsMode: boolean
}) {
  if (template === 'classic') {
    return (
      <header className="mb-5 text-center">
        <h1 className="text-[2.4em] font-bold tracking-tight text-slate-900">{contact.name || 'Your Name'}</h1>
        {contact.title && <p className="mt-0.5 text-[1.05em] text-slate-600">{contact.title}</p>}
        <div className="mt-2 border-t border-slate-200 pt-2">
          <ContactLine contact={contact} template={template} accentColor={accentColor} atsMode={atsMode} />
        </div>
      </header>
    )
  }

  return (
    <header className="mb-5" style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.7em' }}>
      <h1 className="text-[2.3em] font-bold tracking-tight" style={{ color: accentColor }}>
        {contact.name || 'Your Name'}
      </h1>
      {contact.title && <p className="mt-0.5 text-[1.05em] font-medium text-slate-600">{contact.title}</p>}
      <div className="mt-2">
        <ContactLine contact={contact} template={template} accentColor={accentColor} atsMode={atsMode} />
      </div>
    </header>
  )
}

function SectionHeading({ title, template, accentColor }: { title: string; template: TemplateId; accentColor: string }) {
  if (template === 'classic') {
    return (
      <h2 className="mb-2 border-b border-slate-300 pb-1 text-[1.05em] font-bold uppercase tracking-wide text-slate-900">
        {title}
      </h2>
    )
  }
  if (template === 'compact') {
    return (
      <h2
        className="mb-1.5 text-[0.95em] font-bold uppercase tracking-wide"
        style={{ color: accentColor, borderBottom: `1px solid ${accentColor}55`, paddingBottom: '0.2em' }}
      >
        {title}
      </h2>
    )
  }
  return (
    <h2
      className="mb-2 pl-2.5 text-[1em] font-bold uppercase tracking-wide text-slate-900"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      {title}
    </h2>
  )
}

function EntryRow({ title, subtitle, dateRange }: { title: string; subtitle: string; dateRange: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <p className="font-semibold text-slate-900">
        {title}
        {subtitle && <span className="font-normal text-slate-700"> — {subtitle}</span>}
      </p>
      <span className="shrink-0 text-[0.85em] text-slate-500">{dateRange}</span>
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-700">
      {items.map((b, i) => (
        <li key={i}>{renderFormattedText(b)}</li>
      ))}
    </ul>
  )
}

function ExperienceEntryBody({ item }: { item: ExperienceEntry }) {
  return (
    <>
      <EntryRow
        title={item.role || 'Role'}
        subtitle={item.company}
        dateRange={[item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' – ')}
      />
      {item.location && <p className="text-[0.85em] text-slate-500">{item.location}</p>}
      <Bullets items={linesToArray(item.bullets)} />
    </>
  )
}

function EducationEntryBody({ item }: { item: EducationEntry }) {
  return (
    <>
      <EntryRow
        title={item.degree || 'Degree'}
        subtitle={item.school}
        dateRange={[item.startDate, item.endDate].filter(Boolean).join(' – ')}
      />
      {item.location && <p className="text-[0.85em] text-slate-500">{item.location}</p>}
      {linesToArray(item.details).length > 0 && (
        <div className="mt-1 space-y-0.5 text-slate-700">
          {linesToArray(item.details).map((line, i) => (
            <p key={i}>{renderFormattedText(line)}</p>
          ))}
        </div>
      )}
    </>
  )
}

function CustomEntryBody({ item }: { item: CustomEntry }) {
  return (
    <>
      <EntryRow title={item.heading || 'Entry'} subtitle={item.subheading} dateRange={item.date} />
      <Bullets items={linesToArray(item.bullets)} />
    </>
  )
}

function SkillsBody({ section, accentColor }: { section: SkillsSection; accentColor: string }) {
  return (
    <div className="space-y-1">
      {section.categories.map((cat) => {
        const skills = linesToArray(cat.skills)
        if (skills.length === 0) return null
        return (
          <p key={cat.id} className="text-slate-700">
            {cat.name && <span className="font-semibold text-slate-900">{cat.name}: </span>}
            {skills.map((s, i) => (
              <span key={i}>
                {renderFormattedText(s)}
                {i < skills.length - 1 && <span style={{ color: accentColor }}> &nbsp;•&nbsp; </span>}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

/** The atomic unit of pagination: either a whole single-content section (Summary/Skills), or one entry
 * within a multi-entry section. A section's heading travels with its first entry so it's never orphaned
 * alone at the bottom of a page. */
interface RenderBlock {
  key: string
  sectionId: string
  node: React.ReactNode
}

function buildBlocks(sections: Section[], template: TemplateId, accentColor: string): RenderBlock[] {
  const blocks: RenderBlock[] = []

  for (const section of sections) {
    if (section.kind === 'summary') {
      blocks.push({
        key: section.id,
        sectionId: section.id,
        node: (
          <>
            <SectionHeading title={section.title} template={template} accentColor={accentColor} />
            <p className="text-slate-700">{renderFormattedText(section.content)}</p>
          </>
        ),
      })
    } else if (section.kind === 'skills') {
      blocks.push({
        key: section.id,
        sectionId: section.id,
        node: (
          <>
            <SectionHeading title={section.title} template={template} accentColor={accentColor} />
            <SkillsBody section={section} accentColor={accentColor} />
          </>
        ),
      })
    } else if (section.kind === 'experience') {
      if (section.items.length === 0) {
        blocks.push({ key: section.id, sectionId: section.id, node: <SectionHeading title={section.title} template={template} accentColor={accentColor} /> })
      }
      section.items.forEach((item, idx) => {
        const isFirst = idx === 0
        blocks.push({
          key: isFirst ? section.id : `${section.id}:${item.id}`,
          sectionId: section.id,
          node: (
            <>
              {isFirst && <SectionHeading title={section.title} template={template} accentColor={accentColor} />}
              <div className="break-inside-avoid">
                <ExperienceEntryBody item={item} />
              </div>
            </>
          ),
        })
      })
    } else if (section.kind === 'education') {
      if (section.items.length === 0) {
        blocks.push({ key: section.id, sectionId: section.id, node: <SectionHeading title={section.title} template={template} accentColor={accentColor} /> })
      }
      section.items.forEach((item, idx) => {
        const isFirst = idx === 0
        blocks.push({
          key: isFirst ? section.id : `${section.id}:${item.id}`,
          sectionId: section.id,
          node: (
            <>
              {isFirst && <SectionHeading title={section.title} template={template} accentColor={accentColor} />}
              <div className="break-inside-avoid">
                <EducationEntryBody item={item} />
              </div>
            </>
          ),
        })
      })
    } else {
      // custom
      if (section.items.length === 0) {
        blocks.push({ key: section.id, sectionId: section.id, node: <SectionHeading title={section.title} template={template} accentColor={accentColor} /> })
      }
      section.items.forEach((item, idx) => {
        const isFirst = idx === 0
        blocks.push({
          key: isFirst ? section.id : `${section.id}:${item.id}`,
          sectionId: section.id,
          node: (
            <>
              {isFirst && <SectionHeading title={section.title} template={template} accentColor={accentColor} />}
              <div className="break-inside-avoid">
                <CustomEntryBody item={item} />
              </div>
            </>
          ),
        })
      })
    }
  }

  return blocks
}

function blockMarginClass(prev: RenderBlock | undefined, block: RenderBlock, compact: boolean): string {
  if (!prev) return ''
  if (prev.sectionId === block.sectionId) return compact ? 'mt-2.5' : 'mt-3.5'
  return compact ? 'mt-3.5' : 'mt-5'
}

function PageBreakGap({
  blockKey,
  active,
  interactive,
  onSet,
  onClear,
  onDragStart,
  gapRef,
}: {
  blockKey: string
  active: boolean
  interactive: boolean
  onSet: () => void
  onClear: () => void
  onDragStart: () => void
  gapRef: (el: HTMLDivElement | null) => void
}) {
  return (
    <div ref={gapRef} data-block-key={blockKey} className="group/gap relative flex h-4 items-center print:hidden">
      {active ? (
        <div className="flex w-full items-center gap-1.5">
          <div
            onMouseDown={(e) => {
              if (!interactive) return
              e.preventDefault()
              onDragStart()
            }}
            className={`h-0 flex-1 border-t-2 border-dashed border-indigo-400 ${interactive ? 'cursor-ns-resize' : ''}`}
          />
          <span className="shrink-0 rounded bg-indigo-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
            Page break
          </span>
          {interactive && (
            <button
              type="button"
              onClick={onClear}
              title="Remove page break"
              className="shrink-0 rounded-full bg-slate-200 p-0.5 text-slate-600 transition hover:bg-red-100 hover:text-red-600"
            >
              <X size={10} />
            </button>
          )}
        </div>
      ) : interactive ? (
        <button
          type="button"
          onClick={onSet}
          title="Add page break here"
          className="h-0 w-full border-t border-dashed border-transparent opacity-0 transition group-hover/gap:border-slate-300 group-hover/gap:opacity-100"
        />
      ) : null}
    </div>
  )
}

interface PageDims {
  w: number
  h: number
}

function SimplePage({
  resume,
  page,
  scale,
  id,
  pageRef,
  blocks,
  pageBreaksBefore,
}: {
  resume: ResumeData
  page: PageDims
  scale: number
  id?: string
  pageRef?: React.Ref<HTMLDivElement>
  blocks: RenderBlock[]
  pageBreaksBefore: string[]
}) {
  const { format } = resume
  const effectiveAccent = format.atsMode ? '#1e293b' : format.accentColor
  const compact = format.template === 'compact'

  const pageStyle: React.CSSProperties = {
    width: `${page.w}in`,
    minHeight: `${page.h}in`,
    padding: `${format.margin}in`,
    fontFamily: format.fontFamily,
    fontSize: `${format.fontSize}pt`,
    lineHeight: format.lineHeight,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  }

  return (
    <div id={id} ref={pageRef} className="bg-white text-slate-800 shadow-2xl shadow-black/40" style={pageStyle}>
      <Header contact={resume.contact} template={format.template} accentColor={effectiveAccent} atsMode={format.atsMode} />
      {blocks.map((block, i) => (
        <div
          key={block.key}
          className={blockMarginClass(blocks[i - 1], block, compact)}
          style={pageBreaksBefore.includes(block.key) ? { breakBefore: 'page', pageBreakBefore: 'always' } : undefined}
        >
          {block.node}
        </div>
      ))}
    </div>
  )
}

function PaginatedPages({
  resume,
  page,
  scale,
  id,
  pageRef,
  blocks,
  pageBreaksBefore,
  interactive,
  onPageBreaksChange,
}: {
  resume: ResumeData
  page: PageDims
  scale: number
  id?: string
  pageRef?: React.Ref<HTMLDivElement>
  blocks: RenderBlock[]
  pageBreaksBefore: string[]
  interactive: boolean
  onPageBreaksChange?: (blockKeys: string[]) => void
}) {
  const { format } = resume
  const effectiveAccent = format.atsMode ? '#1e293b' : format.accentColor
  const compact = format.template === 'compact'
  const pageWidthPx = page.w * PX_PER_IN
  const pageHeightPx = page.h * PX_PER_IN
  const marginPx = format.margin * PX_PER_IN
  const contentBudgetPx = pageHeightPx - marginPx * 2
  const sectionGapPx = compact ? SECTION_GAP_PX.compact : SECTION_GAP_PX.normal
  const entryGapPx = compact ? ENTRY_GAP_PX.compact : ENTRY_GAP_PX.normal

  const headerMeasureRef = useRef<HTMLDivElement>(null)
  const blockMeasureRefs = useRef(new Map<string, HTMLDivElement>())
  const [pages, setPages] = useState<RenderBlock[][]>([blocks])

  useLayoutEffect(() => {
    const headerH = (headerMeasureRef.current?.offsetHeight ?? 0) + HEADER_BOTTOM_MARGIN_PX
    const heights = new Map<string, number>()
    blocks.forEach((b) => {
      const el = blockMeasureRefs.current.get(b.key)
      if (el) heights.set(b.key, el.offsetHeight)
    })

    const computed: RenderBlock[][] = [[]]
    let used = headerH
    let prevInPage: RenderBlock | null = null

    for (const block of blocks) {
      const h = heights.get(block.key) ?? 0
      const forced = pageBreaksBefore.includes(block.key)
      const currentPage = computed[computed.length - 1]
      const tentativeGap = prevInPage ? (prevInPage.sectionId === block.sectionId ? entryGapPx : sectionGapPx) : 0
      const wouldOverflow = currentPage.length > 0 && used + tentativeGap + h > contentBudgetPx

      if (currentPage.length > 0 && (forced || wouldOverflow)) {
        computed.push([])
        used = 0
        prevInPage = null
      }

      const gapToAdd = prevInPage ? (prevInPage.sectionId === block.sectionId ? entryGapPx : sectionGapPx) : 0
      used += gapToAdd + h
      computed[computed.length - 1].push(block)
      prevInPage = block
    }

    setPages(computed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, pageBreaksBefore, contentBudgetPx, sectionGapPx, entryGapPx])

  const gapElements = useRef(new Map<string, HTMLDivElement>())
  const [isDragging, setIsDragging] = useState(false)
  const [draggingBlockKey, setDraggingBlockKey] = useState<string | null>(null)
  const [dragTargetKey, setDragTargetKey] = useState<string | null>(null)

  useEffect(() => {
    if (!isDragging) return
    function handleMove(e: MouseEvent) {
      let closestKey: string | null = null
      let closestDist = Infinity
      gapElements.current.forEach((el, key) => {
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(e.clientY - (rect.top + rect.height / 2))
        if (dist < closestDist) {
          closestDist = dist
          closestKey = key
        }
      })
      if (closestKey) setDragTargetKey(closestKey)
    }
    function handleUp() {
      setIsDragging(false)
      setDraggingBlockKey((currentDragging) => {
        setDragTargetKey((currentTarget) => {
          if (currentDragging && currentTarget && currentDragging !== currentTarget) {
            const next = pageBreaksBefore.filter((k) => k !== currentDragging)
            if (!next.includes(currentTarget)) next.push(currentTarget)
            onPageBreaksChange?.(next)
          }
          return null
        })
        return null
      })
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  const activeBreaks =
    isDragging && draggingBlockKey && dragTargetKey
      ? pageBreaksBefore.map((k) => (k === draggingBlockKey ? dragTargetKey : k))
      : pageBreaksBefore

  const outerStyle: React.CSSProperties = {
    fontFamily: format.fontFamily,
    fontSize: `${format.fontSize}pt`,
    lineHeight: format.lineHeight,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  }

  const pageBoxStyle: React.CSSProperties = {
    width: `${page.w}in`,
    minHeight: `${page.h}in`,
    padding: `${format.margin}in`,
  }

  function renderGap(blockKey: string) {
    return (
      <PageBreakGap
        blockKey={blockKey}
        active={activeBreaks.includes(blockKey)}
        interactive={interactive}
        onSet={() => onPageBreaksChange?.([...pageBreaksBefore, blockKey])}
        onClear={() => onPageBreaksChange?.(pageBreaksBefore.filter((k) => k !== blockKey))}
        onDragStart={() => {
          setIsDragging(true)
          setDraggingBlockKey(blockKey)
          setDragTargetKey(blockKey)
        }}
        gapRef={(el) => {
          if (el) gapElements.current.set(blockKey, el)
          else gapElements.current.delete(blockKey)
        }}
      />
    )
  }

  return (
    <div id={id} ref={pageRef} style={outerStyle}>
      <div
        aria-hidden="true"
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', top: 0, left: -99999, width: pageWidthPx - marginPx * 2 }}
      >
        <div ref={headerMeasureRef}>
          <Header contact={resume.contact} template={format.template} accentColor={effectiveAccent} atsMode={format.atsMode} />
        </div>
        {blocks.map((b) => (
          <div
            key={b.key}
            ref={(el) => {
              if (el) blockMeasureRefs.current.set(b.key, el)
              else blockMeasureRefs.current.delete(b.key)
            }}
          >
            {b.node}
          </div>
        ))}
      </div>

      {pages.map((pageBlocks, pageIndex) => (
        <Fragment key={pageIndex}>
          {pageIndex > 0 && pageBlocks[0] && renderGap(pageBlocks[0].key)}
          <div className={`bg-white text-slate-800 shadow-2xl shadow-black/40 ${pageIndex > 0 ? 'mt-6' : ''}`} style={pageBoxStyle}>
            {pageIndex === 0 && (
              <Header contact={resume.contact} template={format.template} accentColor={effectiveAccent} atsMode={format.atsMode} />
            )}
            {pageBlocks.map((block, blockIndex) => (
              <Fragment key={block.key}>
                {blockIndex > 0 && renderGap(block.key)}
                <div
                  className={blockMarginClass(pageBlocks[blockIndex - 1], block, compact)}
                  style={pageBreaksBefore.includes(block.key) ? { breakBefore: 'page', pageBreakBefore: 'always' } : undefined}
                >
                  {block.node}
                </div>
              </Fragment>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  )
}

export interface ResumeDocumentProps {
  resume: ResumeData
  scale: number
  viewAsPages?: boolean
  id?: string
  pageRef?: React.Ref<HTMLDivElement>
  onPageBreaksChange?: (blockKeys: string[]) => void
}

/** Pure, context-free renderer of a resume as a styled paper page (or, in "view as pages" mode, a real
 * multi-page layout). Takes resume data directly as a prop so it can be reused for the live editor
 * preview and for read-only thumbnails (e.g. on the dashboard). */
export function ResumeDocument({ resume, scale, viewAsPages, id, pageRef, onPageBreaksChange }: ResumeDocumentProps) {
  const { format } = resume
  const page = PAGE_SIZE_IN[format.pageSize]
  const visibleSections = resume.sections.filter((s) => s.visible)
  const effectiveAccent = format.atsMode ? '#1e293b' : format.accentColor
  const blocks = buildBlocks(visibleSections, format.template, effectiveAccent)

  if (!viewAsPages) {
    return (
      <SimplePage
        resume={resume}
        page={page}
        scale={scale}
        id={id}
        pageRef={pageRef}
        blocks={blocks}
        pageBreaksBefore={resume.format.pageBreaksBefore}
      />
    )
  }

  return (
    <PaginatedPages
      resume={resume}
      page={page}
      scale={scale}
      id={id}
      pageRef={pageRef}
      blocks={blocks}
      pageBreaksBefore={resume.format.pageBreaksBefore}
      interactive={!!onPageBreaksChange}
      onPageBreaksChange={onPageBreaksChange}
    />
  )
}
