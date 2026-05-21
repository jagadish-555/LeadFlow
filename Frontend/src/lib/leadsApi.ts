import { apiRequest } from './apiClient'

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal_Sent',
  'Won',
  'Lost',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  New: 'New',
  Contacted: 'Contacted',
  Qualified: 'Qualified',
  Proposal_Sent: 'Proposal Sent',
  Won: 'Won',
  Lost: 'Lost',
}

export type Discussion = {
  id: number
  note: string
  followUpAt: string | null
  leadId: number
  createdAt: string
}

export type Lead = {
  id: number
  name: string
  company: string | null
  phone: string | null
  status: LeadStatus
  followUpAt: string | null
  createdAt: string
  updatedAt: string
  discussions: Discussion[]
}


export type CreateLeadPayload = {
  name: string
  company?: string
  phone?: string
  status?: LeadStatus
}

export type CreateDiscussionPayload = {
  note: string
  followUpAt?: string | null
  status?: LeadStatus
}

export type CreateDiscussionResponse = {
  discussion: Discussion
  lead: Lead
}

export const getLeads = async (params?: { status?: LeadStatus; search?: string }) => {
  const searchParams = new URLSearchParams()

  if (params?.status) {
    searchParams.set('status', params.status)
  }

  if (params?.search) {
    searchParams.set('search', params.search)
  }

  const query = searchParams.toString()
  const path = query ? `/api/leads?${query}` : '/api/leads'

  return apiRequest<Lead[]>(path, { auth: true, errorMessage: 'Unable to load leads' })
}

export const getLeadById = async (leadId: number) => {
  return apiRequest<Lead>(`/api/leads/${leadId}`, {
    auth: true,
    errorMessage: 'Unable to load lead details',
  })
}

export const getTodayFollowUps = async () => {
  return apiRequest<Lead[]>('/api/leads/follow-ups/today', {
    auth: true,
    errorMessage: 'Unable to load follow-ups',
  })
}

export const createLead = async (payload: CreateLeadPayload) => {
  return apiRequest<Lead>('/api/leads', {
    method: 'POST',
    auth: true,
    body: {
      name: payload.name.trim(),
      company: payload.company?.trim() || undefined,
      phone: payload.phone?.trim() || undefined,
      status: payload.status,
    },
    errorMessage: 'Unable to create lead',
  })
}

export const createDiscussion = async (leadId: number, payload: CreateDiscussionPayload) => {
  return apiRequest<CreateDiscussionResponse>(`/api/leads/${leadId}/discussions`, {
    method: 'POST',
    auth: true,
    body: {
      note: payload.note,
      followUpAt: payload.followUpAt ?? null,
      status: payload.status,
    },
    errorMessage: 'Unable to save discussion',
  })
}
