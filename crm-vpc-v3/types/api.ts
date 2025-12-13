// Vaccination Schedule API types
export interface VaccinationScheduleItem {
  _id: string;
  name: string;
  description?: string;
  age?: string;
  ageInMonths?: number;
  order?: number;
  status?: string;
  thumbnail?: string;
  numberOfInjections?: string;
  category?: string;
  detailLink?: string; // Link to related article/content
  // Merged fields from vaccination records (if customerId is provided)
  vaccinationRecord?: VaccinationRecord | null;
  injectionStatus?: 'completed' | 'pending' | 'scheduled' | 'skipped';
  injectionDate?: string | null;
  scheduledDate?: string | null;
  location?: string | null;
  notes?: string | null;
  [key: string]: any;
}

export interface VaccinationScheduleResponse {
  scheduleVaccin: VaccinationScheduleItem[];
  pagination?: PaginationMeta;
  [key: string]: any;
}

// Vaccination Record API types
export interface VaccinationRecord {
  _id: string;
  customerId: string;
  healthBookId: string;
  vaccineId: string;
  scheduledDate?: string;
  injectionDate?: string;
  status: 'completed' | 'pending' | 'scheduled' | 'skipped';
  location?: string;
  notes?: string;
  injectionNumber?: number;
  sideEffects?: string;
  nextDoseDate?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface VaccinationRecordResponse {
  vaccinationRecord: VaccinationRecord;
  message?: string;
}

export interface VaccinationRecordsListResponse {
  vaccinationRecords: VaccinationRecord[];
  pagination?: PaginationMeta;
  [key: string]: any;
}
// Lịch sử nhiệt độ trong tháng cho Bar Chart
export interface HealthBookTemperatureHistoryItem {
  date: string; // yyyy-MM-dd
  temperature: number;
}

export interface HealthBookTemperatureHistory {
  month: string; // yyyy-MM
  data: HealthBookTemperatureHistoryItem[];
}
// ============================================
// Health Record Types
// ============================================

export interface HealthRecordVaccination {
  date: string;
  dose: string;
  _id?: string;
}

export interface HealthRecord {
  _id: string;
  date: string;
  healthBookId: string;
  userId?: string;
  temperature?: number;
  height?: number;
  weight?: number;
  
  // Tình trạng da
  skinCondition?: string;
  skinConditionNote?: string;
  
  // Sức khỏe răng miệng
  oralHealth?: string;
  oralHealthNote?: string;
  
  // Dinh dưỡng
  nutrition?: string;
  nutritionNote?: string;
  
  // Giấc ngủ
  sleep?: string;
  sleepNote?: string;
  
  // Tiêu hóa
  stoolFrequency?: string;
  stoolCondition?: string;
  digestiveIssues?: string;
  
  // Lịch sinh hoạt
  schedule?: string;
  
  // Ghi chú
  notes?: string;
  
  // Mốc phát triển
  developmentMilestone?: string;
  
  // Vận động thô
  grossMotorSkills?: string;
  
  // Vận động tinh
  fineMotorSkills?: string;
  
  // Thị giác và nhận thức
  visualCognition?: string;
  
  // Giao tiếp và cảm xúc
  communicationEmotion?: string;
  
  // Dấu hiệu cảnh báo sớm
  earlyWarning?: string;
  
  // Legacy fields
  method?: string;
  motorSkills?: string;
  vaccination?: HealthRecordVaccination | null;
  healthStatus?: string;
  
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface HealthRecordResponse {
  message?: string;
  data: {
    data: HealthRecord | Record<string, never>;
    temperatureHistory?: HealthBookTemperatureHistoryItem[];
  };
}
/**
 * ====================================
 * API Types & Interfaces
 * ====================================
 * Centralized type definitions for API responses
 */

// ============================================
// Common Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  status: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: PaginationMeta;
}

// ============================================
// Request Options
// ============================================

export interface ApiRequestOptions {
  // Query parameters
  params?: Record<string, string | number | boolean | undefined>;

  // Request body
  body?: Record<string, unknown>;

  // Custom headers
  headers?: Record<string, string>;

  // Timeout in milliseconds
  timeout?: number;

  // Retry configuration
  retry?:
    | number
    | {
        limit: number;
        delay: number;
        statusCodes?: number[];
      };

  // Show loading indicator
  showLoading?: boolean;

  // Show error message
  showError?: boolean;

  // Custom error message
  errorMessage?: string;

  // Cache response
  cache?:
    | boolean
    | {
        key: string;
        ttl: number;
      };
}

// ============================================
// Entity Types
// ============================================

export interface Customer {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  address?: string;
  city?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  status: "active" | "inactive";
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  priceDiscount?: number;
  discount?: number;
  typeDiscount?: "percentage" | "fixed";
  thumbnail?: string;
  images?: string[];
  description?: string;
  shortDescription?: string;
  category?: Category[];
  quantityInStock: number;
  quantitySelled?: number;
  isOutOfStock: boolean;
  showHome?: boolean;
  status: "active" | "inactive";
  gtin?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  type: "product" | "blog";
  postCount?: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  discount?: number;
  tax?: number;
  shippingFee?: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  shippingAddress?: Address;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface Course {
  _id: string;
  code: string;
  name: string;
  thumbnail?: string;
  shortDescription?: string;
  description?: string;
  order?: number;
  status: "active" | "inactive";
  notes?: string;
  createdAt: string;
}

export interface HealthBook {
  _id: string;
  customerId: string;
  customerEmail?: string;
  name: string;
  dob: string;
  avatar?: string;
  gender: "male" | "female";
  weight?: string;
  height?: string;
  skinConditions?: string;
  tooth?: {
    count: string;
    descriptions: string;
  };
  nutrition?: {
    count: string;
    descriptions: string;
  };
  sleep?: {
    time: string;
    descriptions: string;
  };
  frequencyOfDefecation?: string;
  fecalCondition?: string;
  digestiveProblems?: string;
  healthCondition?: string;
  vaccination?: string;
  vaccinationDate?: string;
  vaccinationContent?: string;
  exerciseAndSkills?: string;
  method?: {
    status: string;
    descriptions: string;
  };
  note?: string;
  temperature?: string;
  recordedAt?: string;
  isAcceptedHealthBook?: boolean;
  createdBy?: {
    name: string;
  };
  domain: string;
  origin?: string;
  createdAt: string;
  updatedAt: string;
}

// Temperature History Item from aggregate query
export interface TemperatureRecord {
  _id: string;
  temperature: string;
  recordedAt: string;
  createdAt: string;
}

// Health Book API Responses
export interface HealthBookResponse {
  message?: string;
  data: {
    data: HealthBook | Record<string, never>;
  };
}

export interface HealthBooksListResponse {
  message?: string;
  data: {
    pagination: PaginationMeta;
    healthBooks: HealthBook[];
  };
}

export interface TemperatureHistoryResponse {
  message?: string;
  data: TemperatureRecord[];
}

export interface Transaction {
  _id: string;
  origin: string;
  type: "payment" | "refund" | "deposit";
  title: string;
  total: number;
  status: "pending" | "success" | "denied";
  createdAt: string;
}

export interface FAQ {
  _id: string;
  title: string;
  content: string;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Feedback {
  _id: string;
  fullname: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  position?: string;
  content: string;
  createdBy: "admin" | "customer";
  status: "active" | "inactive";
  createdAt: string;
}

// ============================================
// Query Filters
// ============================================

export interface BaseQueryParams {
  page?: number;
  limit?: number;
  searchKey?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CustomerQueryParams extends BaseQueryParams {
  city?: string;
  gender?: string;
}

export interface HealthBookQueryParams extends BaseQueryParams {
  category?: string;
  date?: string;
}

export interface ProductQueryParams extends BaseQueryParams {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface OrderQueryParams extends BaseQueryParams {
  customerId?: string;
  status?: string;
  paymentStatus?: string;
  from?: string;
  to?: string;
}

// ============================================
// Upload Types
// ============================================

export interface UploadResponse {
  url: string;
  urls?: string[];
}

export interface FileUploadOptions {
  maxSize?: number; // in MB
  allowedTypes?: string[];
  folder?: string;
}
