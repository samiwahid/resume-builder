import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { IconButton } from '../ui/inputs'

interface SectionCardProps {
  id: string
  title: string
  visible: boolean
  onRename: (title: string) => void
  onToggleVisible: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  children: ReactNode
}

export function SectionCard({
  id,
  title,
  visible,
  onRename,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  children,
}: SectionCardProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      id={`section-${id}`}
      className={`scroll-mt-4 rounded-xl border bg-slate-900/60 transition ${
        visible ? 'border-slate-800' : 'border-slate-800/50 opacity-60'
      }`}
    >
      <div className="flex items-center gap-1.5 px-2 py-2.5 sm:gap-2 sm:px-3">
        <GripVertical size={15} className="hidden shrink-0 text-slate-600 sm:block" />
        <input
          value={title}
          onChange={(e) => onRename(e.target.value)}
          className="min-w-0 flex-1 truncate bg-transparent text-sm font-semibold text-slate-100 outline-none focus:text-white"
        />
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton title={visible ? 'Hide section' : 'Show section'} onClick={onToggleVisible}>
            {visible ? <Eye size={15} /> : <EyeOff size={15} />}
          </IconButton>
          <IconButton title="Move up" onClick={onMoveUp} disabled={!canMoveUp}>
            <ChevronUp size={15} />
          </IconButton>
          <IconButton title="Move down" onClick={onMoveDown} disabled={!canMoveDown}>
            <ChevronDown size={15} />
          </IconButton>
          <IconButton title="Delete section" onClick={onDelete} danger>
            <Trash2 size={15} />
          </IconButton>
          <IconButton title={collapsed ? 'Expand section' : 'Collapse section'} onClick={() => setCollapsed((c) => !c)}>
            <ChevronDown size={15} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </IconButton>
        </div>
      </div>
      {!collapsed && <div className="space-y-3 border-t border-slate-800/80 px-3 py-3">{children}</div>}
    </div>
  )
}
