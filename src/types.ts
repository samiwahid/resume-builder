export interface ContactInfo {
  name: string
  title: string
  location: string
  email: string
  phone: string
  linkedin: string
  website: string
}

export interface ExperienceEntry {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string
}

export interface EducationEntry {
  id: string
  degree: string
  school: string
  location: string
  startDate: string
  endDate: string
  details: string
}

export interface CustomEntry {
  id: string
  heading: string
  subheading: string
  date: string
  bullets: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: string
}

export type SectionKind = 'summary' | 'experience' | 'education' | 'skills' | 'custom'

interface BaseSection {
  id: string
  title: string
  visible: boolean
}

export interface SummarySection extends BaseSection {
  kind: 'summary'
  content: string
}

export interface ExperienceSection extends BaseSection {
  kind: 'experience'
  items: ExperienceEntry[]
}

export interface EducationSection extends BaseSection {
  kind: 'education'
  items: EducationEntry[]
}

export interface SkillsSection extends BaseSection {
  kind: 'skills'
  categories: SkillCategory[]
}

export interface CustomSection extends BaseSection {
  kind: 'custom'
  items: CustomEntry[]
}

export type Section =
  | SummarySection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | CustomSection

export type TemplateId = 'classic' | 'modern' | 'compact'

export interface FormatSettings {
  template: TemplateId
  fontFamily: string
  fontSize: number
  lineHeight: number
  margin: number
  pageSize: 'letter' | 'a4'
  accentColor: string
  atsMode: boolean
  /** id of the section that should start on a new page, or null for no manual break */
  pageBreakSectionId: string | null
}

export interface ResumeData {
  contact: ContactInfo
  sections: Section[]
  format: FormatSettings
}

export const FONT_OPTIONS = [
  { label: 'Merriweather', value: '"Merriweather", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Lora', value: '"Lora", serif' },
  { label: 'Inter', value: '"Inter", sans-serif' },
  { label: 'Helvetica', value: '"Helvetica Neue", Arial, sans-serif' },
  { label: 'Roboto', value: '"Roboto", sans-serif' },
]

export const ACCENT_COLORS = [
  '#1e293b',
  '#1d4ed8',
  '#0f766e',
  '#7e22ce',
  '#b91c1c',
  '#a16207',
  '#334155',
]
