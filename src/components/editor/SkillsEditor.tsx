import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useResume } from '../../ResumeContext'
import type { SkillCategory, SkillsSection } from '../../types'
import { Field, IconButton, TextAreaField } from '../ui/inputs'

export function SkillsEditor({ section }: { section: SkillsSection }) {
  const { dispatch } = useResume()

  function update(categoryId: string, field: keyof SkillCategory, value: string) {
    dispatch({ type: 'UPDATE_SKILL_CATEGORY', sectionId: section.id, categoryId, field, value })
  }

  return (
    <div className="space-y-3">
      {section.categories.map((cat, index) => (
        <div key={cat.id} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{cat.name || `Category ${index + 1}`}</span>
            <div className="flex items-center gap-0.5">
              <IconButton
                title="Move up"
                disabled={index === 0}
                onClick={() => dispatch({ type: 'MOVE_SKILL_CATEGORY', sectionId: section.id, categoryId: cat.id, direction: 'up' })}
              >
                <ChevronUp size={14} />
              </IconButton>
              <IconButton
                title="Move down"
                disabled={index === section.categories.length - 1}
                onClick={() => dispatch({ type: 'MOVE_SKILL_CATEGORY', sectionId: section.id, categoryId: cat.id, direction: 'down' })}
              >
                <ChevronDown size={14} />
              </IconButton>
              <IconButton
                title="Remove category"
                danger
                onClick={() => dispatch({ type: 'REMOVE_SKILL_CATEGORY', sectionId: section.id, categoryId: cat.id })}
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>

          <Field
            label="Category name (optional)"
            value={cat.name}
            onChange={(v) => update(cat.id, 'name', v)}
            placeholder="Technical Skills"
          />

          <div className="mt-2.5">
            <TextAreaField
              label="Skills"
              value={cat.skills}
              rows={3}
              placeholder={'SQL\nFigma\nProject Management'}
              hint="One skill per line."
              onChange={(v) => update(cat.id, 'skills', v)}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => dispatch({ type: 'ADD_SKILL_CATEGORY', sectionId: section.id })}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-700 py-2 text-xs font-semibold text-slate-400 hover:border-indigo-400 hover:text-indigo-300"
      >
        <Plus size={14} /> Add category
      </button>
    </div>
  )
}
