export interface Lead {
  _id: string
  userId: string
  serviceId: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  address?: string
  notes?: string
  status: 'registered' | 'cancelled' | 'completed'
  leadStatus: 'new' | 'contacted' | 'in_crm'
  service?: {
    _id: string
    title: string
    slug?: string
    thumbnail?: string
  }
  createdAt: string
  updatedAt: string
}

export interface LeadStats {
  total: number
  new: number
  contacted: number
  inCrm: number
}

export interface LeadListResponse {
  leads: Lead[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const useLeadsApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get all leads
     */
    async getLeads(params?: {
      page?: number
      limit?: number
      search?: string
      leadStatus?: string
      serviceId?: string
    }) {
      return apiClient.get<LeadListResponse>('/api/a/leads', {
        params,
        errorMessage: 'Không thể tải danh sách khách hàng đăng ký'
      })
    },

    /**
     * Get lead by ID
     */
    async getLeadById(id: string) {
      return apiClient.get<{ lead: Lead }>(`/api/a/leads/${id}`, {
        errorMessage: 'Không thể tải thông tin khách hàng'
      })
    },

    /**
     * Update lead status
     */
    async updateLeadStatus(id: string, data: { leadStatus: 'new' | 'contacted' | 'in_crm', notes?: string }) {
      return apiClient.put(`/api/a/leads/${id}/status`, data, {
        errorMessage: 'Không thể cập nhật trạng thái'
      })
    },

    /**
     * Delete lead
     */
    async deleteLead(id: string) {
      return apiClient.delete(`/api/a/leads/${id}`, {
        errorMessage: 'Không thể xóa khách hàng'
      })
    },

    /**
     * Get lead statistics
     */
    async getLeadStats() {
      return apiClient.get<{ stats: LeadStats }>('/api/a/leads/stats', {
        errorMessage: 'Không thể tải thống kê'
      })
    }
  }

}

