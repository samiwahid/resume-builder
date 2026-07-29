import { v4 as uuid } from 'uuid'
import type {
  CustomEntry,
  EducationEntry,
  ExperienceEntry,
  ResumeData,
  Section,
  SectionKind,
} from './types'

export type ResumeAction =
  | { type: 'SET_CONTACT_FIELD'; field: keyof ResumeData['contact']; value: string }
  | { type: 'ADD_SECTION'; kind: SectionKind; title: string }
  | { type: 'REMOVE_SECTION'; id: string }
  | { type: 'TOGGLE_SECTION_VISIBLE'; id: string }
  | { type: 'RENAME_SECTION'; id: string; title: string }
  | { type: 'MOVE_SECTION'; id: string; direction: 'up' | 'down' }
  | { type: 'REORDER_SECTIONS'; ids: string[] }
  | { type: 'UPDATE_SUMMARY'; id: string; content: string }
  | { type: 'UPDATE_SKILLS'; id: string; skills: string }
  | { type: 'ADD_EXPERIENCE_ITEM'; sectionId: string }
  | { type: 'UPDATE_EXPERIENCE_ITEM'; sectionId: string; itemId: string; field: keyof ExperienceEntry; value: string | boolean }
  | { type: 'REMOVE_EXPERIENCE_ITEM'; sectionId: string; itemId: string }
  | { type: 'MOVE_EXPERIENCE_ITEM'; sectionId: string; itemId: string; direction: 'up' | 'down' }
  | { type: 'ADD_EDUCATION_ITEM'; sectionId: string }
  | { type: 'UPDATE_EDUCATION_ITEM'; sectionId: string; itemId: string; field: keyof EducationEntry; value: string }
  | { type: 'REMOVE_EDUCATION_ITEM'; sectionId: string; itemId: string }
  | { type: 'MOVE_EDUCATION_ITEM'; sectionId: string; itemId: string; direction: 'up' | 'down' }
  | { type: 'ADD_CUSTOM_ITEM'; sectionId: string }
  | { type: 'UPDATE_CUSTOM_ITEM'; sectionId: string; itemId: string; field: keyof CustomEntry; value: string }
  | { type: 'REMOVE_CUSTOM_ITEM'; sectionId: string; itemId: string }
  | { type: 'MOVE_CUSTOM_ITEM'; sectionId: string; itemId: string; direction: 'up' | 'down' }
  | { type: 'SET_FORMAT'; field: keyof ResumeData['format']; value: string | number | boolean }
  | { type: 'LOAD_RESUME'; data: ResumeData }

function moveInArray<T>(arr: T[], index: number, direction: 'up' | 'down'): T[] {
  const target = direction === 'up' ? index - 1 : index + 1
  if (target < 0 || target >= arr.length) return arr
  const copy = [...arr]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  return copy
}

const sectionDefaults: Record<SectionKind, () => Partial<Section>> = {
  summary: () => ({ kind: 'summary', content: '' }),
  experience: () => ({ kind: 'experience', items: [] }),
  education: () => ({ kind: 'education', items: [] }),
  skills: () => ({ kind: 'skills', skills: '' }),
  custom: () => ({ kind: 'custom', items: [] }),
}

export function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case 'SET_CONTACT_FIELD':
      return { ...state, contact: { ...state.contact, [action.field]: action.value } }

    case 'ADD_SECTION': {
      const base = sectionDefaults[action.kind]()
      const newSection = { id: uuid(), title: action.title, visible: true, ...base } as Section
      return { ...state, sections: [...state.sections, newSection] }
    }

    case 'REMOVE_SECTION':
      return { ...state, sections: state.sections.filter((s) => s.id !== action.id) }

    case 'TOGGLE_SECTION_VISIBLE':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.id ? { ...s, visible: !s.visible } : s
        ),
      }

    case 'RENAME_SECTION':
      return {
        ...state,
        sections: state.sections.map((s) => (s.id === action.id ? { ...s, title: action.title } : s)),
      }

    case 'MOVE_SECTION': {
      const index = state.sections.findIndex((s) => s.id === action.id)
      if (index === -1) return state
      return { ...state, sections: moveInArray(state.sections, index, action.direction) }
    }

    case 'REORDER_SECTIONS': {
      const byId = new Map(state.sections.map((s) => [s.id, s]))
      const reordered = action.ids.map((id) => byId.get(id)).filter((s): s is Section => !!s)
      return { ...state, sections: reordered }
    }

    case 'UPDATE_SUMMARY':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.id && s.kind === 'summary' ? { ...s, content: action.content } : s
        ),
      }

    case 'UPDATE_SKILLS':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.id && s.kind === 'skills' ? { ...s, skills: action.skills } : s
        ),
      }

    case 'ADD_EXPERIENCE_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'experience'
            ? {
                ...s,
                items: [
                  ...s.items,
                  {
                    id: uuid(),
                    role: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    bullets: '',
                  },
                ],
              }
            : s
        ),
      }

    case 'UPDATE_EXPERIENCE_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'experience'
            ? {
                ...s,
                items: s.items.map((it) =>
                  it.id === action.itemId ? { ...it, [action.field]: action.value } : it
                ),
              }
            : s
        ),
      }

    case 'REMOVE_EXPERIENCE_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'experience'
            ? { ...s, items: s.items.filter((it) => it.id !== action.itemId) }
            : s
        ),
      }

    case 'MOVE_EXPERIENCE_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) => {
          if (s.id !== action.sectionId || s.kind !== 'experience') return s
          const index = s.items.findIndex((it) => it.id === action.itemId)
          if (index === -1) return s
          return { ...s, items: moveInArray(s.items, index, action.direction) }
        }),
      }

    case 'ADD_EDUCATION_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'education'
            ? {
                ...s,
                items: [
                  ...s.items,
                  {
                    id: uuid(),
                    degree: '',
                    school: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    details: '',
                  },
                ],
              }
            : s
        ),
      }

    case 'UPDATE_EDUCATION_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'education'
            ? {
                ...s,
                items: s.items.map((it) =>
                  it.id === action.itemId ? { ...it, [action.field]: action.value } : it
                ),
              }
            : s
        ),
      }

    case 'REMOVE_EDUCATION_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'education'
            ? { ...s, items: s.items.filter((it) => it.id !== action.itemId) }
            : s
        ),
      }

    case 'MOVE_EDUCATION_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) => {
          if (s.id !== action.sectionId || s.kind !== 'education') return s
          const index = s.items.findIndex((it) => it.id === action.itemId)
          if (index === -1) return s
          return { ...s, items: moveInArray(s.items, index, action.direction) }
        }),
      }

    case 'ADD_CUSTOM_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'custom'
            ? {
                ...s,
                items: [
                  ...s.items,
                  { id: uuid(), heading: '', subheading: '', date: '', bullets: '' },
                ],
              }
            : s
        ),
      }

    case 'UPDATE_CUSTOM_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'custom'
            ? {
                ...s,
                items: s.items.map((it) =>
                  it.id === action.itemId ? { ...it, [action.field]: action.value } : it
                ),
              }
            : s
        ),
      }

    case 'REMOVE_CUSTOM_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId && s.kind === 'custom'
            ? { ...s, items: s.items.filter((it) => it.id !== action.itemId) }
            : s
        ),
      }

    case 'MOVE_CUSTOM_ITEM':
      return {
        ...state,
        sections: state.sections.map((s) => {
          if (s.id !== action.sectionId || s.kind !== 'custom') return s
          const index = s.items.findIndex((it) => it.id === action.itemId)
          if (index === -1) return s
          return { ...s, items: moveInArray(s.items, index, action.direction) }
        }),
      }

    case 'SET_FORMAT':
      return { ...state, format: { ...state.format, [action.field]: action.value } }

    case 'LOAD_RESUME':
      return action.data

    default:
      return state
  }
}
