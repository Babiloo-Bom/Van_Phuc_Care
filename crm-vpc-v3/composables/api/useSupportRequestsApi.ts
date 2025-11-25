/**
 * Support Requests API Composable
 * Uses Tickets API from backend with category/status mapping
 * Uses useApiClient for HTTP requests
 */

// ==================== Type Definitions ====================

export type SupportRequestCategory =
  | "parent_support"
  | "health_issue"
  | "service"
  | "course"
  | "other";

export type SupportRequestStatus = "pending" | "processing" | "completed";

type TicketCategory =
  | "technical"
  | "billing"
  | "general"
  | "complaint"
  | "feature_request";

type TicketStatus = "open" | "pending" | "in_progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Attachment {
  filename: string;
  url: string;
  uploadedAt: string;
}

interface AdminUser {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
}

export interface SupportRequest {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  customerId: string;
  category: SupportRequestCategory;
  status: SupportRequestStatus;
  priority?: TicketPriority;
  attachments?: Attachment[];
  notes?: string;
  assignedTo?: AdminUser;
  resolvedAt?: string;
  resolvedBy?: AdminUser;
  createdAt: string;
  updatedAt: string;
}

interface BackendTicket {
  _id: string;
  ticketNumber: string;
  title: string;
  description: string;
  customerId: string;
  assignedTo?: AdminUser;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  attachments?: Attachment[];
  notes?: string;
  resolvedAt?: string;
  resolvedBy?: AdminUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportRequestPayload {
  title: string;
  description: string;
  customerId?: string;
  category: SupportRequestCategory;
  attachments?: Attachment[];
  priority?: TicketPriority;
}

export interface UpdateSupportRequestPayload {
  title?: string;
  description?: string;
  category?: SupportRequestCategory;
  status?: SupportRequestStatus;
  attachments?: Attachment[];
  notes?: string;
  priority?: TicketPriority;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// ==================== Mapping Functions ====================

const mapCategoryToBackend = (
  category: SupportRequestCategory
): TicketCategory => {
  const mapping: Record<SupportRequestCategory, TicketCategory> = {
    parent_support: "general",
    health_issue: "technical",
    service: "billing",
    course: "feature_request",
    other: "general",
  };
  return mapping[category];
};

const mapCategoryToFrontend = (
  category: TicketCategory
): SupportRequestCategory => {
  const mapping: Record<TicketCategory, SupportRequestCategory> = {
    technical: "health_issue",
    billing: "service",
    general: "parent_support",
    complaint: "other",
    feature_request: "course",
  };
  return mapping[category];
};

const mapStatusToBackend = (status: SupportRequestStatus): TicketStatus => {
  const mapping: Record<SupportRequestStatus, TicketStatus> = {
    pending: "open",
    processing: "in_progress",
    completed: "resolved",
  };
  return mapping[status];
};

const mapStatusToFrontend = (status: TicketStatus): SupportRequestStatus => {
  const mapping: Record<TicketStatus, SupportRequestStatus> = {
    open: "pending",
    pending: "pending",
    in_progress: "processing",
    resolved: "completed",
    closed: "completed",
  };
  return mapping[status];
};

const transformTicketToSupportRequest = (
  ticket: BackendTicket
): SupportRequest => {
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
  };
};

// ==================== Composable ====================

export const useSupportRequestsApi = () => {
  const apiClient = useApiClient();

  const getSupportRequests = async (params?: {
    customerId?: string;
    status?: SupportRequestStatus;
    category?: SupportRequestCategory;
    priority?: TicketPriority;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<PaginatedResponse<SupportRequest>> => {
    const backendParams: Record<string, unknown> = { ...params };
    // Remove customerId as user API auto-filters by logged-in user
    delete backendParams.customerId;

    if (params?.status) {
      backendParams.status = mapStatusToBackend(params.status);
    }
    if (params?.category) {
      backendParams.category = mapCategoryToBackend(params.category);
    }

    const response = await apiClient.get<{
      data: {
        data: BackendTicket[];
        pagination: { page: number; pageSize: number; total: number };
      };
    }>("/api/u/tickets", { params: backendParams, showError: false });

    if (!response.status || !response.data?.data?.data) {
      return { data: [], pagination: { page: 1, pageSize: 10, total: 0 } };
    }

    return {
      data: response.data.data.data.map(transformTicketToSupportRequest),
      pagination: response.data.data.pagination,
    };
  };

  const getSupportRequestById = async (
    id: string
  ): Promise<SupportRequest | null> => {
    const response = await apiClient.get<{ data: { ticket: BackendTicket } }>(
      `/api/u/tickets/${id}`
    );

    if (!response.status || !response.data?.data?.ticket) {
      return null;
    }

    return transformTicketToSupportRequest(response.data.data.ticket);
  };

  const createSupportRequest = async (
    payload: CreateSupportRequestPayload
  ): Promise<SupportRequest | null> => {
    // User API auto-sets userId from logged-in user, no need to send customerId
    const backendPayload = {
      title: payload.title,
      description: payload.description,
      category: mapCategoryToBackend(payload.category),
      attachments: payload.attachments,
      priority: payload.priority || "medium",
    };

    const response = await apiClient.post<{ data: { ticket: BackendTicket } }>(
      "/api/u/tickets",
      backendPayload
    );

    if (!response.status || !response.data?.data?.ticket) {
      throw new Error(response.message || "Không thể tạo yêu cầu hỗ trợ");
    }

    return transformTicketToSupportRequest(response.data.data.ticket);
  };

  const updateSupportRequest = async (
    id: string,
    payload: UpdateSupportRequestPayload
  ): Promise<SupportRequest | null> => {
    const backendPayload: Record<string, unknown> = { ...payload };
    if (payload.category) {
      backendPayload.category = mapCategoryToBackend(payload.category);
    }
    if (payload.status) {
      backendPayload.status = mapStatusToBackend(payload.status);
    }

    const response = await apiClient.patch<{ data: { ticket: BackendTicket } }>(
      `/api/u/tickets/${id}`,
      backendPayload
    );

    if (!response.status || !response.data?.data?.ticket) {
      throw new Error(response.message || "Không thể cập nhật yêu cầu hỗ trợ");
    }

    return transformTicketToSupportRequest(response.data.data.ticket);
  };

  const deleteSupportRequest = async (id: string): Promise<boolean> => {
    const response = await apiClient.delete(`/api/u/tickets/${id}`);
    return response.status;
  };

  const getSupportRequestStatistics = async (): Promise<unknown> => {
    const response = await apiClient.get("/api/a/tickets/statistics");
    return response.data;
  };

  return {
    getSupportRequests,
    getSupportRequestById,
    createSupportRequest,
    updateSupportRequest,
    deleteSupportRequest,
    getSupportRequestStatistics,
  };
};
