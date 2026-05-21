import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import * as Icons from '../Icons'
import ModalShell from './ModalShell'

type AddLeadModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { name: string; company?: string; phone?: string }) => void
  isSubmitting?: boolean
  error?: string | null
}

const AddLeadModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  error,
}: AddLeadModalProps) => {
  const [name, setName]       = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone]     = useState('')
  const nameRef               = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setName('')
      setCompany('')
      setPhone('')
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 50)
    }
  }, [open])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      name:    name.trim(),
      company: company.trim() || undefined,
      phone:   phone.trim()   || undefined,
    })
  }

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add New Lead"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[13px] font-medium text-slate-500 transition hover:text-slate-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-lead-form"
            disabled={isSubmitting || !name.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-[13px] font-semibold text-white shadow-sm shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : null}
            {isSubmitting ? 'Saving…' : 'Save Lead'}
          </button>
        </div>
      }
    >
      <form id="add-lead-form" className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1.5">
          <label htmlFor="lead-name" className="block text-[12px] font-semibold text-slate-700">
            Full Name{' '}
            <span className="font-normal text-rose-500" aria-hidden="true">*</span>
          </label>
          <input
            ref={nameRef}
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah Connor"
            className={inputCls}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-company" className="block text-[12px] font-semibold text-slate-700">
            Company{' '}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          <input
            id="lead-company"
            name="company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Acme Corp"
            className={inputCls}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lead-phone" className="block text-[12px] font-semibold text-slate-700">
            Phone{' '}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 555-0123"
            className={inputCls}
            disabled={isSubmitting}
          />
        </div>

        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Icons.Dot className="h-3 w-3 flex-shrink-0" />
          Default status will be <span className="font-semibold">New</span>
        </p>

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600"
          >
            {error}
          </div>
        ) : null}
      </form>
    </ModalShell>
  )
}

export default AddLeadModal
