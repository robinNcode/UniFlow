import axiosInstance from '../axiosInstance';
import type { AdmitCardResult } from '../types/meritList.types';

export const admitCardApi = {
  getAdmitCard: async (applicationId: string): Promise<AdmitCardResult> => {
    const response = await axiosInstance.get<AdmitCardResult>(
      `/applications/${applicationId}/admit-card`,
      {
        // The backend returns 202 for pending — Axios treats 2xx as success
        validateStatus: (status) => status === 200 || status === 202,
      }
    );
    return response.data;
  },
};
