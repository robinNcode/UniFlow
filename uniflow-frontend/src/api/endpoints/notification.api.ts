import { axiosInstance } from '@/api/axiosInstance'
import type { NotificationLog } from '@/api/types/application.types'

export const notificationApi = {
    getMyNotifications: async (): Promise<NotificationLog[]> => {
        const response = await axiosInstance.get<NotificationLog[]>('/notifications/my')
        return response.data
    },
}
