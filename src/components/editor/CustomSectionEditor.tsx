import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useConfirm } from '../../ConfirmDialogContext'
import { useResume } from '../../ResumeContext'
import type { CustomEntry, CustomSection } from '../../types'
import { Field, IconButton, TextAreaField } from '../ui/inputs'

export function CustomSectionEditor({ section }: { section: CustomSection }) {
  const { dispatch } = useResume()
  const confirmDialog = useConfirm()

  function update(itemId: string, field: keyof CustomEntry, value: string) {
    dispatch({ type: 'UPDATE_CUSTOM_ITEM', sectionId: section.id, itemId, field, value })
  }

  async function handleRemove(itemId: string, label: string) {
    const ok = await confirmDialog({
      title: 'Remove this entry?',
      message: `"${label}" will be removed from this section.`,
      confirmLabel: 'Remove entry',
    })
    if (ok) dispatch({ type: 'REMOVE_CUSTOM_ITEM', sectionId: section.id, itemId })
  }

  return (
    <div className="space-y-3">
      {section.items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{item.heading || `Entry ${index + 1}`}</span>
            <div className="flex items-center gap-0.5">
              <IconButton
                title="Move up"
                disabled={index === 0}
                onClick={() => dispatch({ type: 'MOVE_CUSTOM_ITEM', sectionId: section.id, itemId: item.id, direction: 'up' })}
              >
                <ChevronUp size={14} />
              </IconButton>
              <IconButton
                title="Move down"
                disabled={index === section.items.length - 1}
                onClick={() => dispatch({ type: 'MOVE_CUSTOM_ITEM', sectionId: section.id, itemId: item.id, direction: 'down' })}
              >
                <ChevronDown size={14} />
              </IconButton>
              <IconButton
                title="Remove entry"
                danger
                onClick={() => handleRemove(item.id, item.heading || `Entry ${index + 1}`)}
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field label="Heading" value={item.heading} onChange={(v) => update(item.id, 'heading', v)} placeholder="Project title / award name" />
            <Field label="Subheading" value={item.subheading} onChange={(v) => update(item.id, 'subheading', v)} placeholder="Organization" />
            <Field label="Date" value={item.date} onChange={(v) => update(item.id, 'date', v)} placeholder="2024" />
          </div>

          <div className="mt-2.5">
            <TextAreaField
              label="Details"
              value={item.bullets}
              rows={3}
              placeholder="One line per detail..."
              hint="One bullet per line."
              formatting
              onChange={(v) => update(item.id, 'bullets', v)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => dispatch({ type: 'ADD_CUSTOM_ITEM', sectionId: section.id })}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:border-indigo-400 hover:text-indigo-300"
      >
        <Plus size={14} /> Add entry
      </button>
    </div>
  )
}
