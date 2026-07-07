/**
 * Common API types shared across domain modules.
 */

export interface ApiError {
  error: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type QuotaType =
  | 'general'
  | 'freedom_fighter'
  | 'tribal'
  | 'district_quota'
  | 'physically_challenged';

export type ApplicationStatus =
  | 'pending'
  | 'seat_reserved'
  | 'payment_pending'
  | 'confirmed'
  | 'expired'
  | 'rejected'
  | 'withdrawn';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'failed';

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  role: 'student' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  password: string;
}
