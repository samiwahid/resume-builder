import { useResume } from '../../ResumeContext'
import type { ContactInfo } from '../../types'
import { Field } from '../ui/inputs'

export function ContactForm() {
  const { resume, dispatch } = useResume()

  function setField(field: keyof ContactInfo, value: string) {
    dispatch({ type: 'SET_CONTACT_FIELD', field, value })
  }

  return (
    <div id="section-contact" className="scroll-mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">Contact</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Full name" value={resume.contact.name} onChange={(v) => setField('name', v)} placeholder="Jane Doe" />
        <Field label="Job title" value={resume.contact.title} onChange={(v) => setField('title', v)} placeholder="Product Designer" />
        <Field label="Location" value={resume.contact.location} onChange={(v) => setField('location', v)} placeholder="Toronto, Ontario" />
        <Field label="Email" value={resume.contact.email} onChange={(v) => setField('email', v)} placeholder="jane@email.com" />
        <Field label="Phone" value={resume.contact.phone} onChange={(v) => setField('phone', v)} placeholder="+1 (555) 123-4567" />
        <Field label="LinkedIn" value={resume.contact.linkedin} onChange={(v) => setField('linkedin', v)} placeholder="in/jane-doe" />
        <Field label="Website" value={resume.contact.website} onChange={(v) => setField('website', v)} placeholder="janedoe.com" />
      </div>
    </div>
  )
}
