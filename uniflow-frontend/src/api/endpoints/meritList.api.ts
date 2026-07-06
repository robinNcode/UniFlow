import axiosInstance from '../axiosInstance';
import type { MeritListResponse } from '../types/meritList.types';
import type { QuotaType } from '../types/common.types';

export const meritListApi = {
  getMeritList: async (
    cycleId: string,
    quota?: QuotaType,
    page: number = 1
  ): Promise<MeritListResponse> => {
    const params: Record<string, string | number> = { page };
    if (quota) params.quota = quota;

    const response = await axiosInstance.get<MeritListResponse>(
      `/cycles/${cycleId}/merit-list`,
      { params }
    );
    return response.data;
  },
};
