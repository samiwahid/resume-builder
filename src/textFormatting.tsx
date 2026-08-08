import type { ReactNode } from 'react'

const FORMAT_REGEX = /\*\*(.+?)\*\*|\*(.+?)\*|::(.+?)::/g

/** Parses **bold**, *italic*, and ::caps:: markers into safe React nodes (never uses raw HTML injection). */
export function renderFormattedText(text: string): ReactNode {
  if (!text) return text
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null
  FORMAT_REGEX.lastIndex = 0
  while ((match = FORMAT_REGEX.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>)
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key++}>{match[2]}</em>)
    } else if (match[3] !== undefined) {
      nodes.push(
        <span key={key++} style={{ textTransform: 'uppercase' }}>
          {match[3]}
        </span>
      )
    }
    lastIndex = FORMAT_REGEX.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

export type FormatMarker = 'bold' | 'italic' | 'caps'

const MARKER_WRAP: Record<FormatMarker, string> = {
  bold: '**',
  italic: '*',
  caps: '::',
}

export interface SelectionEdit {
  value: string
  selectionStart: number
  selectionEnd: number
}

/** Wraps the current selection with a marker, or unwraps it if already wrapped (toggle behavior). Returns null if nothing is selected. */
export function toggleFormatMarker(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  marker: FormatMarker
): SelectionEdit | null {
  if (selectionStart === selectionEnd) return null
  const wrap = MARKER_WRAP[marker]
  const before = value.slice(0, selectionStart)
  const selected = value.slice(selectionStart, selectionEnd)
  const after = value.slice(selectionEnd)

  if (before.endsWith(wrap) && after.startsWith(wrap)) {
    const newValue = before.slice(0, before.length - wrap.length) + selected + after.slice(wrap.length)
    return {
      value: newValue,
      selectionStart: selectionStart - wrap.length,
      selectionEnd: selectionEnd - wrap.length,
    }
  }

  const newValue = `${before}${wrap}${selected}${wrap}${after}`
  return {
    value: newValue,
    selectionStart: selectionStart + wrap.length,
    selectionEnd: selectionEnd + wrap.length,
  }
}

/**
 * Auto-capitalizes freshly-inserted letters that land at the start of a line (position 0, or right
 * after \n). Diffs oldValue/newValue to find exactly what was inserted (works for a single keystroke,
 * a paste, or any bulk insertion) and only touches that inserted range — text elsewhere is left alone,
 * so deliberately-lowercase text you typed earlier (e.g. "iOS") never gets re-forced to caps.
 */
export function autoCapitalizeOnInput(oldValue: string, newValue: string): string {
  if (newValue.length <= oldValue.length) return newValue

  let prefixLen = 0
  const maxPrefix = Math.min(oldValue.length, newValue.length)
  while (prefixLen < maxPrefix && oldValue[prefixLen] === newValue[prefixLen]) prefixLen++

  const insertStart = prefixLen
  const insertEnd = insertStart + (newValue.length - oldValue.length)

  // Only handle a clean insertion (nothing deleted); skip complex edits like replacing a selection.
  if (newValue.slice(insertEnd) !== oldValue.slice(insertStart)) return newValue

  const chars = newValue.split('')
  let changed = false
  for (let i = insertStart; i < insertEnd; i++) {
    const isLineStart = i === 0 || chars[i - 1] === '\n'
    if (isLineStart && /[a-z]/.test(chars[i])) {
      chars[i] = chars[i].toUpperCase()
      changed = true
    }
  }
  return changed ? chars.join('') : newValue
}
