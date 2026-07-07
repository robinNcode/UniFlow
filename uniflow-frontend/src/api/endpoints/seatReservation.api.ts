import { axiosInstance } from '../axiosInstance';
import type { SeatReservationResponse, SeatReservationStatus } from '../types/application.types';

export const seatReservationApi = {
  reserveSeat: async (applicationId: string): Promise<SeatReservationResponse> => {
    const response = await axiosInstance.post<SeatReservationResponse>(
      `/applications/${applicationId}/reserve-seat`
    );
    return response.data;
  },

  getReservationStatus: async (applicationId: string): Promise<SeatReservationStatus> => {
    // TODO: confirm with backend — exact endpoint for checking reservation status
    const response = await axiosInstance.get<SeatReservationStatus>(
      `/applications/${applicationId}/reservation-status`
    );
    return response.data;
  },
};
