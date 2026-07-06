import { axiosInstance } from '@/api/axiosInstance'
import type { MeritListResponse } from '@/api/types/meritList.types'
import type { QuotaType } from '@/api/types/common.types'

export const meritListApi = {
    getMeritList: async (
        cycleId: string,
        quota: QuotaType = 'general',
        page = 1,
    ): Promise<MeritListResponse> => {
        const response = await axiosInstance.get<MeritListResponse>(
            `/cycles/${cycleId}/merit-list`,
            { params: { quota, page } },
        )
        return response.data
    },
}
