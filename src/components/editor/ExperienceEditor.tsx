import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useConfirm } from '../../ConfirmDialogContext'
import { useResume } from '../../ResumeContext'
import type { ExperienceEntry, ExperienceSection } from '../../types'
import { Field, IconButton, TextAreaField } from '../ui/inputs'

export function ExperienceEditor({ section }: { section: ExperienceSection }) {
  const { dispatch } = useResume()
  const confirmDialog = useConfirm()

  function update(itemId: string, field: keyof ExperienceEntry, value: string | boolean) {
    dispatch({ type: 'UPDATE_EXPERIENCE_ITEM', sectionId: section.id, itemId, field, value })
  }

  async function handleRemove(itemId: string, label: string) {
    const ok = await confirmDialog({
      title: 'Remove this entry?',
      message: `"${label}" will be removed from your experience.`,
      confirmLabel: 'Remove entry',
    })
    if (ok) dispatch({ type: 'REMOVE_EXPERIENCE_ITEM', sectionId: section.id, itemId })
  }

  return (
    <div className="space-y-3">
      {section.items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {item.role || item.company ? `${item.role || 'Role'} · ${item.company || 'Company'}` : `Entry ${index + 1}`}
            </span>
            <div className="flex items-center gap-0.5">
              <IconButton
                title="Move up"
                disabled={index === 0}
                onClick={() => dispatch({ type: 'MOVE_EXPERIENCE_ITEM', sectionId: section.id, itemId: item.id, direction: 'up' })}
              >
                <ChevronUp size={14} />
              </IconButton>
              <IconButton
                title="Move down"
                disabled={index === section.items.length - 1}
                onClick={() => dispatch({ type: 'MOVE_EXPERIENCE_ITEM', sectionId: section.id, itemId: item.id, direction: 'down' })}
              >
                <ChevronDown size={14} />
              </IconButton>
              <IconButton
                title="Remove entry"
                danger
                onClick={() =>
                  handleRemove(item.id, item.role || item.company ? `${item.role || 'Role'} · ${item.company || 'Company'}` : `Entry ${index + 1}`)
                }
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field label="Role" value={item.role} onChange={(v) => update(item.id, 'role', v)} placeholder="Marketing Manager" />
            <Field label="Company" value={item.company} onChange={(v) => update(item.id, 'company', v)} placeholder="Acme Inc." />
            <Field label="Location" value={item.location} onChange={(v) => update(item.id, 'location', v)} placeholder="Toronto, ON" />
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Start" value={item.startDate} onChange={(v) => update(item.id, 'startDate', v)} placeholder="Jan 2023" />
              <Field
                label="End"
                value={item.current ? 'Present' : item.endDate}
                onChange={(v) => update(item.id, 'endDate', v)}
                placeholder="Present"
              />
            </div>
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) => update(item.id, 'current', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-800 accent-indigo-500"
            />
            I currently work here
          </label>

          <div className="mt-2.5">
            <TextAreaField
              label="Bullet points"
              value={item.bullets}
              rows={3}
              placeholder={'One achievement per line...'}
              hint="One bullet per line."
              onChange={(v) => update(item.id, 'bullets', v)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => dispatch({ type: 'ADD_EXPERIENCE_ITEM', sectionId: section.id })}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:border-indigo-400 hover:text-indigo-300"
      >
        <Plus size={14} /> Add work experience
      </button>
    </div>
  )
}
