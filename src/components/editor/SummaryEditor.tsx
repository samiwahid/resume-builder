import { useResume } from '../../ResumeContext'
import type { SummarySection } from '../../types'
import { TextAreaField } from '../ui/inputs'

export function SummaryEditor({ section }: { section: SummarySection }) {
  const { dispatch } = useResume()
  return (
    <TextAreaField
      label="Summary"
      value={section.content}
      rows={4}
      placeholder="A short pitch highlighting your experience and what you're looking for next."
      onChange={(content) => dispatch({ type: 'UPDATE_SUMMARY', id: section.id, content })}
    />
  )
}
