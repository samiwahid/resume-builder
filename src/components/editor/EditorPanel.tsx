import { useConfirm } from '../../ConfirmDialogContext'
import { useResume } from '../../ResumeContext'
import type { Section } from '../../types'
import { AddSectionMenu } from './AddSectionMenu'
import { ContactForm } from './ContactForm'
import { CustomSectionEditor } from './CustomSectionEditor'
import { EducationEditor } from './EducationEditor'
import { ExperienceEditor } from './ExperienceEditor'
import { SectionCard } from './SectionCard'
import { SkillsEditor } from './SkillsEditor'
import { SummaryEditor } from './SummaryEditor'

function SectionBody({ section }: { section: Section }) {
  switch (section.kind) {
    case 'summary':
      return <SummaryEditor section={section} />
    case 'experience':
      return <ExperienceEditor section={section} />
    case 'education':
      return <EducationEditor section={section} />
    case 'skills':
      return <SkillsEditor section={section} />
    case 'custom':
      return <CustomSectionEditor section={section} />
  }
}

export function EditorPanel() {
  const { resume, dispatch } = useResume()
  const confirmDialog = useConfirm()

  return (
    <div className="dark-scroll h-full space-y-4 overflow-y-auto bg-slate-950 p-4">
      <ContactForm />

      {resume.sections.map((section, index) => (
        <SectionCard
          key={section.id}
          id={section.id}
          title={section.title}
          visible={section.visible}
          canMoveUp={index > 0}
          canMoveDown={index < resume.sections.length - 1}
          onRename={(title) => dispatch({ type: 'RENAME_SECTION', id: section.id, title })}
          onToggleVisible={() => dispatch({ type: 'TOGGLE_SECTION_VISIBLE', id: section.id })}
          onMoveUp={() => dispatch({ type: 'MOVE_SECTION', id: section.id, direction: 'up' })}
          onMoveDown={() => dispatch({ type: 'MOVE_SECTION', id: section.id, direction: 'down' })}
          onDelete={async () => {
            const ok = await confirmDialog({
              title: 'Remove this section?',
              message: `The "${section.title}" section and everything in it will be removed from this resume.`,
              confirmLabel: 'Remove section',
            })
            if (ok) dispatch({ type: 'REMOVE_SECTION', id: section.id })
          }}
        >
          <SectionBody section={section} />
        </SectionCard>
      ))}

      <AddSectionMenu />
    </div>
  )
}
