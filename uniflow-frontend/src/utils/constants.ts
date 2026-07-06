/**
 * Application-wide constants.
 */

export const QUOTA_LABELS: Record<string, string> = {
  general: 'General',
  freedom_fighter: 'Freedom Fighter',
  tribal: 'Tribal',
  district_quota: 'District Quota',
  physically_challenged: 'Physically Challenged',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  seat_reserved: 'Seat Reserved',
  payment_pending: 'Payment Pending',
  confirmed: 'Confirmed',
  expired: 'Expired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  confirmed: 'Confirmed',
  failed: 'Failed',
};

export const BOARD_NAMES = [
  'Dhaka',
  'Rajshahi',
  'Jessore',
  'Comilla',
  'Chittagong',
  'Barisal',
  'Sylhet',
  'Dinajpur',
  'Mymensingh',
  'Madrasah',
  'Technical',
] as const;
