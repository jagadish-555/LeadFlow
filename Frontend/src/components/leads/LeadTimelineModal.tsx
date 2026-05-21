import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Discussion, Lead, LeadStatus } from '../../lib/leadsApi'
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from '../../lib/leadsApi'
import {
  formatDiscussionDate,
  formatFollowUpDisplay,
  isOverdue,
} from '../../lib/date'
import * as Icons from '../Icons'
import ModalShell from './ModalShell'

type LeadTimelineModalProps = {
  open: boolean
  lead: Lead | null
  onClose: () => void
  onStatusChange?: (status: LeadStatus) => void
  onSubmitDiscussion?: (payload: {
    note: string
    followUpAt?: string | null
    status?: LeadStatus
  }) => void
  isSubmitting?: boolean
  isLoading?: boolean
  error?: string | null
}


const DiscussionItem = ({
  discussion,
  isFirst,
}: {
  discussion: Discussion
  isFirst: boolean
}) => {
  const { formatted, relative } = formatDiscussionDate(discussion.createdAt)
  const hasFollowUp = !!discussion.followUpAt
  const followUpOverdue = hasFollowUp ? isOverdue(discussion.followUpAt!) : false

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div className="relative flex w-5 flex-shrink-0 flex-col items-center">
        <span
          className={[
            'relative z-10 mt-[2px] h-2.5 w-2.5 rounded-full ring-2 ring-white',
            isFirst ? 'bg-blue-600' : 'bg-slate-300',
          ].join(' ')}
        />
        <span className="absolute top-3 bottom-0 left-[9px] w-px bg-slate-200" />
      </div>

      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-baseline gap-x-2 text-[12px] text-slate-400">
          <span className="font-medium text-slate-600">{formatted}</span>
          <span>({relative})</span>
        </div>

        <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
          <p className="text-[13px] leading-relaxed text-slate-700">
            {discussion.note}
          </p>

          {hasFollowUp ? (
            <p
              className={[
                'mt-2 flex items-center gap-1.5 text-[12px] font-medium',
                followUpOverdue ? 'text-rose-600' : 'text-blue-600',
              ].join(' ')}
            >
              {followUpOverdue
                ? <Icons.Warning className="h-3.5 w-3.5 flex-shrink-0" />
                : <Icons.Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              }
              Follow-up set for:{' '}
              <span className="font-semibold">
                {formatFollowUpDisplay(discussion.followUpAt!)}
              </span>
              {followUpOverdue ? ' — Overdue' : ''}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const LeadTimelineModal = ({
  open,
  lead,
  onClose,
  onStatusChange,
  onSubmitDiscussion,
  isSubmitting = false,
  isLoading = false,
  error,
}: LeadTimelineModalProps) => {
  const [note, setNote] = useState('')
  const [setFollowUp, setSetFollowUp] = useState(false)
  const [followUpAt, setFollowUpAt] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open) {
      setNote('')
      setSetFollowUp(false)
      setFollowUpAt('')
    }
  }, [open])

  useEffect(() => {
    if (open && lead && !isLoading) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open, lead, isLoading])

  if (!open) return null

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!onSubmitDiscussion || !note.trim()) return

    onSubmitDiscussion({
      note: note.trim(),
      followUpAt:
        setFollowUp && followUpAt ? new Date(followUpAt).toISOString() : null,
    })

    setNote('')
    setSetFollowUp(false)
    setFollowUpAt('')
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Lead Timeline"
      size="lg"
    >
      {isLoading || !lead ? (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-400">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600/20 border-t-blue-600" />
          Loading details…
        </div>
      ) : (
        <div className="space-y-6">

          <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
            <div className="min-w-0">
              <h3 className="text-[18px] font-bold text-slate-900 leading-tight">
                {lead.name}
                {lead.company ? (
                  <span className="ml-1.5 text-[15px] font-normal text-slate-500">
                    ({lead.company})
                  </span>
                ) : null}
              </h3>
              {lead.phone ? (
                <div className="mt-1 flex items-center gap-1.5">
                  <Icons.Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                  <span className="text-[13px] text-slate-500">
                    {lead.phone}
                  </span>
                </div>
              ) : null}
            </div>

            <div>
              <select
                id="lead-status-select"
                aria-label="Update lead status"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
                value={lead.status}
                onChange={(e) =>
                  onStatusChange?.(e.target.value as LeadStatus)
                }
                disabled={isSubmitting}
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {LEAD_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600"
            >
              {error}
            </div>
          ) : null}

          <div>
            {lead.discussions.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                No discussions yet — log your first note below.
              </p>
            ) : (
              <div className="relative">
                {lead.discussions.map((discussion, index) => (
                  <DiscussionItem
                    key={discussion.id}
                    discussion={discussion}
                    isFirst={index === 0}
                  />
                ))}
              </div>
            )}
          </div>

          <form
            id="discussion-form"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="discussion-note"
              className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500"
            >
              Log a new note
            </label>

            <textarea
              id="discussion-note"
              ref={textareaRef}
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Log a new discussion…"
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              required
              disabled={isSubmitting}
            />

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-slate-600 select-none">
                <input
                  id="set-followup-checkbox"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
                  checked={setFollowUp}
                  onChange={(e) => {
                    setSetFollowUp(e.target.checked)
                    if (!e.target.checked) setFollowUpAt('')
                  }}
                  disabled={isSubmitting}
                />
                Set Follow-up
              </label>

              {setFollowUp ? (
                <input
                  id="followup-datetime"
                  type="datetime-local"
                  value={followUpAt}
                  onChange={(e) => setFollowUpAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  required={setFollowUp}
                  disabled={isSubmitting}
                />
              ) : null}

              <div className="ml-auto">
                <button
                  type="submit"
                  form="discussion-form"
                  id="save-note-btn"
                  disabled={isSubmitting || !note.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : null}
                  {isSubmitting ? 'Saving…' : 'Save Note'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </ModalShell>
  )
}

export default LeadTimelineModal
