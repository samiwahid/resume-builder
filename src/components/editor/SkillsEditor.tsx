import { useResume } from '../../ResumeContext'
import type { SkillsSection } from '../../types'
import { TextAreaField } from '../ui/inputs'

export function SkillsEditor({ section }: { section: SkillsSection }) {
  const { dispatch } = useResume()
  return (
    <TextAreaField
      label="Skills"
      value={section.skills}
      rows={4}
      placeholder="One skill per line, e.g.&#10;SQL&#10;Figma&#10;Project Management"
      hint="One skill per line — they'll be shown as a clean inline list on the resume."
      onChange={(skills) => dispatch({ type: 'UPDATE_SKILLS', id: section.id, skills })}
    />
  )
}
