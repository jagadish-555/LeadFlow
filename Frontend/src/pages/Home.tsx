import { useEffect, useMemo, useState } from 'react'
import * as Icons from '../components/Icons'
import AppLogo from '../components/AppLogo'
import { useAuth } from '../context/AuthContext'
import AddLeadModal from '../components/leads/AddLeadModal'
import FilterPills from '../components/leads/FilterPills'
import LeadCard from '../components/leads/LeadCard'
import LeadTimelineModal from '../components/leads/LeadTimelineModal'
import type { FilterValue } from '../components/leads/FilterPills'
import type { Lead } from '../lib/leadsApi'
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  createLead,
  createDiscussion,
  getLeadById,
  getLeads,
  getTodayFollowUps,
} from '../lib/leadsApi'
import { formatFollowUpLabel, formatRelativeTime, isOverdue, isToday } from '../lib/date'

const CardSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/5 rounded-full bg-slate-200" />
        <div className="h-3 w-4/5 rounded-full bg-slate-100" />
      </div>
      <div className="h-5 w-20 rounded-full bg-slate-200" />
    </div>
  </div>
)

const SkeletonList = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-400">
    {message}
  </div>
)

const SectionHeader = ({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="flex h-4 w-4 flex-shrink-0 items-center text-slate-400">
      {icon}
    </span>
    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
      {label}
    </span>
  </div>
)

const HomePage = () => {
  const { signOut } = useAuth()

  const [filter, setFilter] = useState<FilterValue>('All')
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)

  const [leads, setLeads] = useState<Lead[]>([])
  const [followUps, setFollowUps] = useState<Lead[]>([])
  const [activeLead, setActiveLead] = useState<Lead | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmittingLead, setIsSubmittingLead] = useState(false)
  const [leadFormError, setLeadFormError] = useState<string | null>(null)
  const [isTimelineLoading, setIsTimelineLoading] = useState(false)
  const [isSavingDiscussion, setIsSavingDiscussion] = useState(false)
  const [timelineError, setTimelineError] = useState<string | null>(null)

  const filterOptions = useMemo(
    () => [
      { value: 'All' as const, label: 'All' },
      ...LEAD_STATUSES.map((status) => ({
        value: status,
        label: LEAD_STATUS_LABELS[status],
      })),
    ],
    [],
  )

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearchQuery(search.trim())
    }, 300)
    return () => window.clearTimeout(handle)
  }, [search])

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    setError(null)

    const status = filter === 'All' ? undefined : filter
    const searchParam = searchQuery || undefined

    Promise.all([
      getLeads({ status, search: searchParam }),
      getTodayFollowUps(),
    ])
      .then(([leadData, followUpData]) => {
        if (!isActive) return
        setLeads(leadData)
        setFollowUps(followUpData)
      })
      .catch((err) => {
        if (!isActive) return
        setError(err instanceof Error ? err.message : 'Unable to load leads')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [filter, searchQuery])

  const normalizedSearch = searchQuery.toLowerCase()

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((lead) => {
      const matchesStatus = filter === 'All' || lead.status === filter
      const matchesSearch = normalizedSearch
        ? lead.name.toLowerCase().includes(normalizedSearch)
        : true
      return matchesStatus && matchesSearch
    })
  }, [filter, followUps, normalizedSearch])

  const mainLeads = useMemo(() => {
    const followUpIds = new Set(filteredFollowUps.map((l) => l.id))
    return leads.filter((l) => !followUpIds.has(l.id))
  }, [filteredFollowUps, leads])

  const handleSignOut = () => signOut()

  const handleAddLead = async (payload: {
    name: string
    company?: string
    phone?: string
  }) => {
    if (!payload.name.trim()) {
      setLeadFormError('Full name is required')
      return
    }

    setIsSubmittingLead(true)
    setLeadFormError(null)

    try {
      const newLead = await createLead({
        name: payload.name,
        company: payload.company,
        phone: payload.phone,
      })
      setLeads((prev) => [newLead, ...prev])
      if (newLead.followUpAt) {
        setFollowUps((prev) => [newLead, ...prev])
      }
      setIsAddOpen(false)
    } catch (err) {
      setLeadFormError(
        err instanceof Error ? err.message : 'Unable to create lead',
      )
    } finally {
      setIsSubmittingLead(false)
    }
  }

  const openTimeline = async (lead: Lead) => {
    setIsTimelineOpen(true)
    setIsTimelineLoading(true)
    setTimelineError(null)
    try {
      const fullLead = await getLeadById(lead.id)
      setActiveLead(fullLead)
    } catch (err) {
      setTimelineError(
        err instanceof Error ? err.message : 'Unable to load lead',
      )
    } finally {
      setIsTimelineLoading(false)
    }
  }

  const updateLeadInLists = (updated: Lead) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updated.id ? updated : lead)),
    )
    setFollowUps((prev) => {
      const hasFollowUpToday =
        updated.followUpAt != null && isToday(updated.followUpAt)
      const exists = prev.some((l) => l.id === updated.id)

      if (hasFollowUpToday && !exists) return [updated, ...prev]
      if (!hasFollowUpToday && exists) return prev.filter((l) => l.id !== updated.id)
      return prev.map((l) => (l.id === updated.id ? updated : l))
    })
  }

  const handleStatusChange = async (status: Lead['status']) => {
    if (!activeLead || status === activeLead.status) return

    setIsSavingDiscussion(true)
    setTimelineError(null)

    try {
      const response = await createDiscussion(activeLead.id, {
        note: `Status changed to ${LEAD_STATUS_LABELS[status]}`,
        status,
      })

      const updatedLead = response.lead
      const mergedLead: Lead = {
        ...activeLead,
        ...updatedLead,
        discussions: [response.discussion, ...activeLead.discussions],
      }

      setActiveLead(mergedLead)
      updateLeadInLists(updatedLead)
    } catch (err) {
      setTimelineError(
        err instanceof Error ? err.message : 'Unable to update status',
      )
    } finally {
      setIsSavingDiscussion(false)
    }
  }

  const handleDiscussionSubmit = async (payload: {
    note: string
    followUpAt?: string | null
  }) => {
    if (!activeLead) return

    setIsSavingDiscussion(true)
    setTimelineError(null)

    try {
      const response = await createDiscussion(activeLead.id, {
        note: payload.note,
        followUpAt: payload.followUpAt,
      })

      const updatedLead = response.lead
      const mergedLead: Lead = {
        ...activeLead,
        ...updatedLead,
        discussions: [response.discussion, ...activeLead.discussions],
      }

      setActiveLead(mergedLead)
      updateLeadInLists(updatedLead)
    } catch (err) {
      setTimelineError(
        err instanceof Error ? err.message : 'Unable to save discussion',
      )
    } finally {
      setIsSavingDiscussion(false)
    }
  }

  const renderCard = (lead: Lead, isFollowUp = false) => {
    const lastDiscussion = lead.discussions[0]
    const timeLabel = lastDiscussion
      ? formatRelativeTime(lastDiscussion.createdAt)
      : undefined
    const followUpLabel = lead.followUpAt
      ? formatFollowUpLabel(lead.followUpAt)
      : undefined
    const overdue = lead.followUpAt ? isOverdue(lead.followUpAt) : false

    return (
      <LeadCard
        key={lead.id}
        lead={lead}
        timeLabel={timeLabel}
        followUpLabel={followUpLabel}
        isFollowUp={isFollowUp}
        isOverdue={overdue}
        onClick={() => openTimeline(lead)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <AppLogo size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              id="add-lead-btn"
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-700 active:scale-[0.98]"
            >
              <Icons.Plus className="h-4 w-4 stroke-[2.5]" />
              Add New Lead
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="group flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
            >
              <Icons.ArrowRightOnRect className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>


      <main className="mx-auto w-full max-w-4xl px-6 py-7">

        <div className="mb-7 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Filters:
          </span>
          <FilterPills
            options={filterOptions}
            value={filter}
            onChange={setFilter}
          />
          <div className="ml-auto w-full max-w-[240px]">
            <div className="relative">
              <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 stroke-[1.75]" />
              <input
                id="lead-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads…"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        ) : null}

        <section aria-labelledby="followups-heading" className="mb-8">
          <SectionHeader icon={<Icons.Pin className="h-4 w-4" />} label="Today's Follow-ups" />
          <div id="followups-heading" className="sr-only">
            Today&apos;s Follow-ups
          </div>

          {isLoading ? (
            <SkeletonList count={1} />
          ) : filteredFollowUps.length === 0 ? (
            <EmptyState message="No follow-ups scheduled for today." />
          ) : (
            <div className="space-y-3">
              {filteredFollowUps.map((lead) => renderCard(lead, true))}
            </div>
          )}
        </section>

        <section aria-labelledby="all-leads-heading">
          <SectionHeader icon={<Icons.Users className="h-4 w-4" />} label="All Leads" />
          <div id="all-leads-heading" className="sr-only">
            All Leads
          </div>

          {isLoading ? (
            <SkeletonList count={3} />
          ) : mainLeads.length === 0 ? (
            <EmptyState
              message={
                searchQuery
                  ? `No leads found matching "${searchQuery}"`
                  : 'No leads yet — add your first one!'
              }
            />
          ) : (
            <div className="space-y-3">
              {mainLeads.map((lead) => renderCard(lead, false))}
            </div>
          )}
        </section>
      </main>

      <AddLeadModal
        open={isAddOpen}
        onClose={() => {
          setIsAddOpen(false)
          setLeadFormError(null)
        }}
        onSubmit={handleAddLead}
        isSubmitting={isSubmittingLead}
        error={leadFormError}
      />

      <LeadTimelineModal
        open={isTimelineOpen}
        lead={activeLead}
        onClose={() => {
          setIsTimelineOpen(false)
          setActiveLead(null)
          setTimelineError(null)
        }}
        onStatusChange={handleStatusChange}
        onSubmitDiscussion={handleDiscussionSubmit}
        isSubmitting={isSavingDiscussion}
        isLoading={isTimelineLoading}
        error={timelineError}
      />
    </div>
  )
}

export default HomePage
