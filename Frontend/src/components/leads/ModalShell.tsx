import type { ReactNode } from 'react'
import { useEffect } from 'react'
import * as Icons from '../Icons'

type ModalShellProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}

const ModalShell = ({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
}: ModalShellProps) => {
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const widthClass = size === 'lg' ? 'max-w-[680px]' : 'max-w-[480px]'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 animate-fade-in"
      style={{ backgroundColor: 'rgb(15 23 42 / 0.45)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className={`relative w-full ${widthClass} flex flex-col rounded-2xl bg-white shadow-2xl animate-slide-up overflow-hidden`}
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2
            id="modal-title"
            className="text-[15px] font-semibold text-slate-900"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <Icons.XMark className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 modal-scroll">
          {children}
        </div>

        {footer ? (
          <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ModalShell
