import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../ResumeContext'
import type { EducationEntry, EducationSection } from '../../types'
import { Field, IconButton, TextAreaField } from '../ui/inputs'

export function EducationEditor({ section }: { section: EducationSection }) {
  const { dispatch } = useResume()

  function update(itemId: string, field: keyof EducationEntry, value: string) {
    dispatch({ type: 'UPDATE_EDUCATION_ITEM', sectionId: section.id, itemId, field, value })
  }

  return (
    <div className="space-y-3">
      {section.items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              {item.degree || item.school ? `${item.degree || 'Degree'} · ${item.school || 'School'}` : `Entry ${index + 1}`}
            </span>
            <div className="flex items-center gap-0.5">
              <IconButton
                title="Move up"
                disabled={index === 0}
                onClick={() => dispatch({ type: 'MOVE_EDUCATION_ITEM', sectionId: section.id, itemId: item.id, direction: 'up' })}
              >
                <ChevronUp size={14} />
              </IconButton>
              <IconButton
                title="Move down"
                disabled={index === section.items.length - 1}
                onClick={() => dispatch({ type: 'MOVE_EDUCATION_ITEM', sectionId: section.id, itemId: item.id, direction: 'down' })}
              >
                <ChevronDown size={14} />
              </IconButton>
              <IconButton
                title="Remove entry"
                danger
                onClick={() => dispatch({ type: 'REMOVE_EDUCATION_ITEM', sectionId: section.id, itemId: item.id })}
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field label="Degree / Program" value={item.degree} onChange={(v) => update(item.id, 'degree', v)} placeholder="B.A. Information Technology" />
            <Field label="School" value={item.school} onChange={(v) => update(item.id, 'school', v)} placeholder="York University" />
            <Field label="Location" value={item.location} onChange={(v) => update(item.id, 'location', v)} placeholder="Toronto, ON" />
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Start" value={item.startDate} onChange={(v) => update(item.id, 'startDate', v)} placeholder="2022" />
              <Field label="End" value={item.endDate} onChange={(v) => update(item.id, 'endDate', v)} placeholder="2026" />
            </div>
          </div>

          <div className="mt-2.5">
            <TextAreaField
              label="Details (optional)"
              value={item.details}
              rows={2}
              placeholder="Relevant courses, honors, GPA..."
              onChange={(v) => update(item.id, 'details', v)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => dispatch({ type: 'ADD_EDUCATION_ITEM', sectionId: section.id })}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:border-indigo-400 hover:text-indigo-300"
      >
        <Plus size={14} /> Add education
      </button>
    </div>
  )
}
