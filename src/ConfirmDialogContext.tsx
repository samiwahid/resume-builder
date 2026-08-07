import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmDialogContext = createContext<ConfirmFn | null>(null)

interface PendingConfirm {
  options: ConfirmOptions
  resolve: (result: boolean) => void
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ options, resolve })
    })
  }, [])

  function settle(result: boolean) {
    pending?.resolve(result)
    setPending(null)
  }

  useEffect(() => {
    if (!pending) return
    confirmButtonRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') settle(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending])

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:hidden"
          onClick={() => settle(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              {pending.options.danger !== false && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <AlertTriangle size={17} />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">{pending.options.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{pending.options.message}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => settle(false)}
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                {pending.options.cancelLabel ?? 'Cancel'}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => settle(true)}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold text-white shadow transition ${
                  pending.options.danger !== false
                    ? 'bg-red-500 shadow-red-900/40 hover:bg-red-400'
                    : 'bg-indigo-500 shadow-indigo-900/40 hover:bg-indigo-400'
                }`}
              >
                {pending.options.confirmLabel ?? 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmDialogContext)
  if (!ctx) throw new Error('useConfirm must be used within a ConfirmDialogProvider')
  return ctx
}
