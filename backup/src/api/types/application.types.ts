import type { ApplicationStatus, QuotaType } from './common.types';

export interface AdmissionCycle {
  id: string;
  name: string;
  opensAt: string;
  closesAt: string;
  isActive: boolean;
}

export interface Program {
  id: string;
  name: string;
  department: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
  cycleId: string;
  requirements: string;
}

export interface Application {
  id: string;
  studentId: string;
  programId: string;
  programName: string;
  status: ApplicationStatus;
  quotaType: QuotaType;
  submittedAt: string;
  updatedAt: string;
  reservationExpiresAt?: string;
  meritScore?: number;
  meritRank?: number;
}

export interface ApplicationFormData {
  // Personal info
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  address: string;

  // Academic history
  sscGpa: number;
  hscGpa: number;
  boardName: string;
  passingYear: number;

  // Quota
  quotaType: QuotaType;
  supportingDocumentUrl?: string;

  // Program
  programId: string;
}

export interface SeatReservationResponse {
  reservationId: string;
  quotaType: QuotaType;
  expiresAt: string;
  paymentDeadlineMinutes: number;
}

export interface SeatReservationStatus {
  reservationId: string;
  status: 'active' | 'expired' | 'completed';
  expiresAt: string;
  quotaType: QuotaType;
}
