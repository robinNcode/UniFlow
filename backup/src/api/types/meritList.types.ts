import type { ApplicationStatus, QuotaType } from './common.types';

export interface MeritListEntry {
  rank: number;
  studentId: string;
  meritScore: number;
  status: ApplicationStatus;
  studentName?: string;
}

export interface MeritListResponse {
  quota: QuotaType;
  totalCandidates: number;
  results: MeritListEntry[];
  page: number;
  totalPages: number;
}

export interface AdmitCardResponse {
  pdfUrl: string;
  rollNumber: string;
  examDate: string;
}

export interface AdmitCardPendingResponse {
  status: 'PENDING';
  message: string;
}

export type AdmitCardResult = AdmitCardResponse | AdmitCardPendingResponse;

export function isAdmitCardReady(result: AdmitCardResult): result is AdmitCardResponse {
  return 'pdfUrl' in result;
}

export interface Notification {
  id: string;
  type: 'sms' | 'email';
  subject: string;
  message: string;
  sentAt: string;
  read: boolean;
}
