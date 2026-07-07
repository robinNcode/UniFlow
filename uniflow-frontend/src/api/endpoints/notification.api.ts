import { axiosInstance } from '../axiosInstance';
import type { Notification } from '../types/meritList.types';

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await axiosInstance.get<Notification[]>('/notifications');
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await axiosInstance.patch(`/notifications/${notificationId}/read`);
  },
};
