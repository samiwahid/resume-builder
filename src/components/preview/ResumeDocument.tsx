import { Globe, Link, Mail, MapPin, Phone } from 'lucide-react'
import type { ContactInfo, ResumeData, Section, TemplateId } from '../../types'

export const PAGE_SIZE_IN: Record<'letter' | 'a4', { w: number; h: number }> = {
  letter: { w: 8.5, h: 11 },
  a4: { w: 8.27, h: 11.69 },
}

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

function EntryRow({
  title,
  subtitle,
  dateRange,
}: {
  title: string
  subtitle: string
  dateRange: string
}) {
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
        <li key={i}>{b}</li>
      ))}
    </ul>
  )
}

function SectionContent({ section, template, accentColor }: { section: Section; template: TemplateId; accentColor: string }) {
  const spacing = template === 'compact' ? 'space-y-2.5' : 'space-y-3.5'

  switch (section.kind) {
    case 'summary':
      return <p className="text-slate-700">{section.content}</p>

    case 'skills': {
      const skills = linesToArray(section.skills)
      return (
        <p className="text-slate-700">
          {skills.map((s, i) => (
            <span key={i}>
              {s}
              {i < skills.length - 1 && <span style={{ color: accentColor }}> &nbsp;•&nbsp; </span>}
            </span>
          ))}
        </p>
      )
    }

    case 'experience':
      return (
        <div className={spacing}>
          {section.items.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <EntryRow
                title={item.role || 'Role'}
                subtitle={item.company}
                dateRange={[item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' – ')}
              />
              {item.location && <p className="text-[0.85em] text-slate-500">{item.location}</p>}
              <Bullets items={linesToArray(item.bullets)} />
            </div>
          ))}
        </div>
      )

    case 'education':
      return (
        <div className={spacing}>
          {section.items.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <EntryRow
                title={item.degree || 'Degree'}
                subtitle={item.school}
                dateRange={[item.startDate, item.endDate].filter(Boolean).join(' – ')}
              />
              {item.location && <p className="text-[0.85em] text-slate-500">{item.location}</p>}
              {linesToArray(item.details).length > 0 && (
                <div className="mt-1 space-y-0.5 text-slate-700">
                  {linesToArray(item.details).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )

    case 'custom':
      return (
        <div className={spacing}>
          {section.items.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <EntryRow title={item.heading || 'Entry'} subtitle={item.subheading} dateRange={item.date} />
              <Bullets items={linesToArray(item.bullets)} />
            </div>
          ))}
        </div>
      )
  }
}

export interface ResumeDocumentProps {
  resume: ResumeData
  scale: number
  viewAsPages?: boolean
  id?: string
  pageRef?: React.Ref<HTMLDivElement>
}

/** Pure, context-free renderer of a resume as a styled paper page. Takes resume data directly as a prop so it can be reused for the live editor preview and for read-only thumbnails (e.g. on the dashboard). */
export function ResumeDocument({ resume, scale, viewAsPages, id, pageRef }: ResumeDocumentProps) {
  const { format } = resume
  const page = PAGE_SIZE_IN[format.pageSize]
  const visibleSections = resume.sections.filter((s) => s.visible)
  const effectiveAccent = format.atsMode ? '#1e293b' : format.accentColor

  const pageStyle: React.CSSProperties = {
    width: `${page.w}in`,
    minHeight: `${page.h}in`,
    padding: `${format.margin}in`,
    fontFamily: format.fontFamily,
    fontSize: `${format.fontSize}pt`,
    lineHeight: format.lineHeight,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    backgroundImage: viewAsPages
      ? `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${page.h}in - 1px), #cbd5e1 calc(${page.h}in - 1px), #cbd5e1 ${page.h}in)`
      : undefined,
  }

  return (
    <div id={id} ref={pageRef} className="bg-white text-slate-800 shadow-2xl shadow-black/40" style={pageStyle}>
      <Header contact={resume.contact} template={format.template} accentColor={effectiveAccent} atsMode={format.atsMode} />
      <div className={format.template === 'compact' ? 'space-y-3.5' : 'space-y-5'}>
        {visibleSections.map((section) => (
          <section key={section.id} className="break-inside-avoid">
            <SectionHeading title={section.title} template={format.template} accentColor={effectiveAccent} />
            <SectionContent section={section} template={format.template} accentColor={effectiveAccent} />
          </section>
        ))}
      </div>
    </div>
  )
}
