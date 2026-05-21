import type { LeadStatus } from '../../lib/leadsApi'
import { LEAD_STATUS_LABELS } from '../../lib/leadsApi'

type StatusBadgeProps = {
  status: LeadStatus
  size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  New:           'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Contacted:     'bg-amber-100  text-amber-700  ring-amber-200',
  Qualified:     'bg-blue-100   text-blue-700   ring-blue-200',
  Proposal_Sent: 'bg-purple-100 text-purple-700 ring-purple-200',
  Won:           'bg-slate-900  text-white       ring-slate-800',
  Lost:          'bg-rose-100   text-rose-700   ring-rose-200',
}

const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
  const sizeClass =
    size === 'md'
      ? 'px-2.5 py-0.5 text-[11px]'
      : 'px-2 py-0.5 text-[10px]'

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-[0.06em] ring-1 ring-inset ${sizeClass} ${STATUS_STYLES[status]}`}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  )
}

export default StatusBadge
