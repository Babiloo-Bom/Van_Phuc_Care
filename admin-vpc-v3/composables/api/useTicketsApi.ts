/**
 * ====================================
 * Tickets API Composable
 * ====================================
 * All ticket-related API calls
 */

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed'
export type TicketCategory = 'technical' | 'billing' | 'general' | 'complaint' | 'feature_request'

export interface TicketAttachment {
  filename: string
  url: string
  uploadedAt: string
}

export interface TicketUser {
  _id: string
  fullname?: string
  email?: string
  phoneNumber?: string
  address?: string
}

export interface TicketAdmin {
  _id: string
  fullname?: string
  email?: string
  avatar?: string
}

export interface Ticket {
  _id: string
  ticketNumber: string
  title: string
  description: string
  userId: string | TicketUser
  assignedTo?: string | TicketAdmin
  priority: TicketPriority
  status: TicketStatus
  category: TicketCategory
  attachments?: TicketAttachment[]
  notes?: string
  resolvedAt?: string
  resolvedBy?: string | TicketAdmin
  createdAt: string
  updatedAt: string
}

export interface BaseQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: TicketStatus
  priority?: TicketPriority
  category?: TicketCategory
  userId?: string
  assignedTo?: string
  sort?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export interface TicketStatistics {
  total: number
  active: number
  pending: number
  resolved: number
  closed: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  byCategory: Record<string, number>
  latest: Ticket[]
}

export const useTicketsApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get tickets list
     */
    async getTickets(params?: BaseQueryParams) {
      return apiClient.get<PaginatedResponse<Ticket>>('/api/a/tickets', {
        params,
        showError: false
      })
    },

    /**
     * Get ticket by ID
     */
    async getTicket(id: string) {
      return apiClient.get<{ ticket: Ticket }>(`/api/a/tickets/${id}`)
    },

    /**
     * Create new ticket
     */
    async createTicket(data: Partial<Ticket>) {
      return apiClient.post<{ ticket: Ticket }>('/api/a/tickets', data, {
        errorMessage: 'Không thể tạo ticket'
      })
    },

    /**
     * Update ticket
     */
    async updateTicket(id: string, data: Partial<Ticket>) {
      return apiClient.patch<{ ticket: Ticket }>(`/api/a/tickets/${id}`, data, {
        errorMessage: 'Không thể cập nhật ticket'
      })
    },

    /**
     * Delete ticket
     */
    async deleteTicket(id: string) {
      return apiClient.delete(`/api/a/tickets/${id}`, {
        errorMessage: 'Không thể xóa ticket'
      })
    },

    /**
     * Bulk delete tickets
     */
    async bulkDeleteTickets(ids: string[]) {
      return apiClient.post('/api/a/tickets/bulk-delete', { ids }, {
        errorMessage: 'Không thể xóa tickets'
      })
    },

    /**
     * Get ticket statistics
     */
    async getTicketStatistics() {
      return apiClient.get<{ statistics: TicketStatistics }>('/api/a/tickets/statistics', {
        showError: false
      })
    },

    /**
     * Get comments for a ticket
     */
    async getComments(ticketId: string) {
      return apiClient.get<{ comments: any[] }>(`/api/a/tickets/${ticketId}/comments`, {
        showError: false
      })
    },

    /**
     * Add a comment/reply to a ticket
     */
    async addComment(ticketId: string, data: { content: string; attachments?: any[] }) {
      return apiClient.post<{ comment: any }>(`/api/a/tickets/${ticketId}/comments`, data, {
        errorMessage: 'Không thể thêm bình luận'
      })
    },

    /**
     * Add a comment/reply with file uploads using FormData
     */
    async addCommentWithFiles(ticketId: string, formData: FormData) {
      return apiClient.post<{ comment: any }>(`/api/a/tickets/${ticketId}/comments`, formData, {
        errorMessage: 'Không thể thêm bình luận',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    /**
     * Delete a comment
     */
    async deleteComment(ticketId: string, commentId: string) {
      return apiClient.delete(`/api/a/tickets/${ticketId}/comments/${commentId}`, {
        errorMessage: 'Không thể xóa bình luận'
      })
    },

    /**
     * Assign ticket to an admin/manager
     */
    async assignTicket(ticketId: string, assignedTo: string | null) {
      return apiClient.post<{ ticket: Ticket }>(`/api/a/tickets/${ticketId}/assign`, { assignedTo }, {
        errorMessage: 'Không thể phân công ticket'
      })
    },

    /**
     * Get list of admins/managers who can be assigned to tickets
     */
    async getAssignableAdmins() {
      return apiClient.get<{ admins: any[] }>('/api/a/tickets/assignable-admins', {
        showError: false
      })
    }
  }
}

