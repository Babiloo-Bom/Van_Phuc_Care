/**
 * Support Requests API Composable
 * Uses Tickets API from backend with category/status mapping
 */

// ==================== Type Definitions ====================

export type SupportRequestCategory =
  | 'parent_support'
  | 'health_issue'
  | 'service'
  | 'course'
  | 'other'

export type SupportRequestStatus = 'pending' | 'processing' | 'completed'

type TicketCategory = 'technical' | 'billing' | 'general' | 'complaint' | 'feature_request'

type TicketStatus = 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Attachment {
  filename: string
  url: string
  uploadedAt: string
}

interface AdminUser {
  _id: string
  fullname: string
  email: string
  avatar?: string
}

export interface SupportRequest {
  id: string
  ticketNumber: string
  title: string
  description: string
  customerId: string
  category: SupportRequestCategory
  status: SupportRequestStatus
  priority?: TicketPriority
  attachments?: Attachment[]
  notes?: string
  assignedTo?: AdminUser
  resolvedAt?: string
  resolvedBy?: AdminUser
  createdAt: string
  updatedAt: string
}

interface BackendTicket {
  _id: string
  ticketNumber: string
  title: string
  description: string
  customerId: string
  assignedTo?: AdminUser
  priority: TicketPriority
  status: TicketStatus
  category: TicketCategory
  attachments?: Attachment[]
  notes?: string
  resolvedAt?: string
  resolvedBy?: AdminUser
  createdAt: string
  updatedAt: string
}

export interface CreateSupportRequestPayload {
  title: string
  description: string
  customerId: string
  category: SupportRequestCategory
  attachments?: Attachment[]
  priority?: TicketPriority
}

export interface UpdateSupportRequestPayload {
  title?: string
  description?: string
  category?: SupportRequestCategory
  status?: SupportRequestStatus
  attachments?: Attachment[]
  notes?: string
  priority?: TicketPriority
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

// ==================== Mapping Functions ====================

const mapCategoryToBackend = (category: SupportRequestCategory): TicketCategory => {
  const mapping: Record<SupportRequestCategory, TicketCategory> = {
    parent_support: 'general',
    health_issue: 'technical',
    service: 'billing',
    course: 'feature_request',
    other: 'general',
  }
  return mapping[category]
}

const mapCategoryToFrontend = (category: TicketCategory): SupportRequestCategory => {
  const mapping: Record<TicketCategory, SupportRequestCategory> = {
    technical: 'health_issue',
    billing: 'service',
    general: 'parent_support',
    complaint: 'other',
    feature_request: 'course',
  }
  return mapping[category]
}

const mapStatusToBackend = (status: SupportRequestStatus): TicketStatus => {
  const mapping: Record<SupportRequestStatus, TicketStatus> = {
    pending: 'open',
    processing: 'in_progress',
    completed: 'resolved',
  }
  return mapping[status]
}

const mapStatusToFrontend = (status: TicketStatus): SupportRequestStatus => {
  const mapping: Record<TicketStatus, SupportRequestStatus> = {
    open: 'pending',
    pending: 'pending',
    in_progress: 'processing',
    resolved: 'completed',
    closed: 'completed',
  }
  return mapping[status]
}

const transformTicketToSupportRequest = (ticket: BackendTicket): SupportRequest => {
  return {
    id: ticket._id,
    ticketNumber: ticket.ticketNumber,
    title: ticket.title,
    description: ticket.description,
    customerId: ticket.customerId,
    category: mapCategoryToFrontend(ticket.category),
    status: mapStatusToFrontend(ticket.status),
    priority: ticket.priority,
    attachments: ticket.attachments,
    notes: ticket.notes,
    assignedTo: ticket.assignedTo,
    resolvedAt: ticket.resolvedAt,
    resolvedBy: ticket.resolvedBy,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  }
}

// ==================== Composable ====================

export const useSupportRequestsApi = () => {
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiBaseUrl as string) || 'http://localhost:5002'

  const getSupportRequests = async (params?: {
    customerId?: string
    status?: SupportRequestStatus
    category?: SupportRequestCategory
    priority?: TicketPriority
    search?: string
    page?: number
    limit?: number
    sort?: string
  }): Promise<PaginatedResponse<SupportRequest>> => {
    try {
      const backendParams: Record<string, unknown> = { ...params }
      if (params?.status) {
        backendParams.status = mapStatusToBackend(params.status)
      }
      if (params?.category) {
        backendParams.category = mapCategoryToBackend(params.category)
      }

      const response = await $fetch<{
        data: BackendTicket[]
        pagination: { page: number; pageSize: number; total: number }
      }>('/api/a/tickets', {
        baseURL,
        method: 'GET',
        params: backendParams,
        headers: {
          Authorization: `Bearer ${useCookie('admin_token').value}`,
        },
      })

      return {
        data: response.data.map(transformTicketToSupportRequest),
        pagination: response.pagination,
      }
    } catch (error) {
      throw error
    }
  }

  const getSupportRequestById = async (id: string): Promise<SupportRequest> => {
    try {
      const response = await $fetch<{ ticket: BackendTicket }>(
        `/api/a/tickets/${id}`,
        {
          baseURL,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${useCookie('admin_token').value}`,
          },
        },
      )

      return transformTicketToSupportRequest(response.ticket)
    } catch (error) {
      throw error
    }
  }

  const createSupportRequest = async (
    payload: CreateSupportRequestPayload,
  ): Promise<SupportRequest> => {
    try {
      const backendPayload = {
        title: payload.title,
        description: payload.description,
        customerId: payload.customerId,
        category: mapCategoryToBackend(payload.category),
        attachments: payload.attachments,
        priority: payload.priority || 'medium',
      }

      const response = await $fetch<{ ticket: BackendTicket }>('/api/a/tickets', {
        baseURL,
        method: 'POST',
        body: backendPayload,
        headers: {
          Authorization: `Bearer ${useCookie('admin_token').value}`,
          'Content-Type': 'application/json',
        },
      })

      return transformTicketToSupportRequest(response.ticket)
    } catch (error) {
      throw error
    }
  }

  const updateSupportRequest = async (
    id: string,
    payload: UpdateSupportRequestPayload,
  ): Promise<SupportRequest> => {
    try {
      const backendPayload: Record<string, unknown> = { ...payload }
      if (payload.category) {
        backendPayload.category = mapCategoryToBackend(payload.category)
      }
      if (payload.status) {
        backendPayload.status = mapStatusToBackend(payload.status)
      }

      const response = await $fetch<{ ticket: BackendTicket }>(
        `/api/a/tickets/${id}`,
        {
          baseURL,
          method: 'PATCH',
          body: backendPayload,
          headers: {
            Authorization: `Bearer ${useCookie('admin_token').value}`,
            'Content-Type': 'application/json',
          },
        },
      )

      return transformTicketToSupportRequest(response.ticket)
    } catch (error) {
      throw error
    }
  }

  const deleteSupportRequest = async (id: string): Promise<void> => {
    try {
      await $fetch(`/api/a/tickets/${id}`, {
        baseURL,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${useCookie('admin_token').value}`,
        },
      })
    } catch (error) {
      throw error
    }
  }

  const getSupportRequestStatistics = async (): Promise<unknown> => {
    try {
      const response = await $fetch('/api/a/tickets/statistics', {
        baseURL,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${useCookie('admin_token').value}`,
        },
      })

      return response
    } catch (error) {
      throw error
    }
  }

  return {
    getSupportRequests,
    getSupportRequestById,
    createSupportRequest,
    updateSupportRequest,
    deleteSupportRequest,
    getSupportRequestStatistics,
  }
}
