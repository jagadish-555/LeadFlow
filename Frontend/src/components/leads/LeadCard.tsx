import type { Lead } from '../../lib/leadsApi'
import * as Icons from '../Icons'
import StatusBadge from './StatusBadge'

type LeadCardProps = {
  lead: Lead
  timeLabel?: string
  followUpLabel?: string
  isFollowUp?: boolean
  isOverdue?: boolean
  onClick?: () => void
}

const truncateNote = (text: string, max = 90) =>
  text.length > max ? text.slice(0, max).trimEnd() + '…' : text

const LeadCard = ({
  lead,
  timeLabel,
  followUpLabel,
  isFollowUp = false,
  isOverdue = false,
  onClick,
}: LeadCardProps) => {
  const lastDiscussion = lead.discussions[0]
  const note = lastDiscussion?.note ?? 'No discussions yet.'

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex w-full flex-col gap-2.5 rounded-xl border p-4 text-left transition-all duration-150',
        'hover:shadow-md hover:-translate-y-px',
        isFollowUp
          ? 'border-blue-200 bg-blue-50/60 hover:border-blue-300'
          : 'border-slate-200 bg-white hover:border-slate-300',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-semibold text-slate-900 leading-snug">
            {lead.name}{' '}
            {lead.company ? (
              <span className="font-normal text-slate-500">({lead.company})</span>
            ) : null}
          </h3>

          <p className="mt-0.5 text-[12px] text-slate-500 line-clamp-1">
            <span className="font-medium text-slate-600">Last Note:</span>{' '}
            {truncateNote(note)}
            {timeLabel ? (
              <span className="ml-1.5 text-slate-400">{timeLabel}</span>
            ) : null}
          </p>
        </div>

        <StatusBadge status={lead.status} />
      </div>

      {followUpLabel ? (
        <p
          className={[
            'flex items-center gap-1.5 text-[12px] font-medium',
            isOverdue ? 'text-rose-600' : 'text-blue-600',
          ].join(' ')}
        >
          {isOverdue
            ? <Icons.Warning className="h-3.5 w-3.5 flex-shrink-0" />
            : <Icons.Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          }
          {followUpLabel}
        </p>
      ) : null}
    </button>
  )
}

export default LeadCard
