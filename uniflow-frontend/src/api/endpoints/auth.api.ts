import { axiosInstance } from '@/api/axiosInstance';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/api/types/common.types';
import { normalizeBdPhoneNumber } from '@/utils/phoneValidation';

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const normalized = normalizeBdPhoneNumber(data.phone) ?? data.phone;
        const response = await axiosInstance.post<AuthResponse>('/auth/login', {
            ...data,
            phone: normalized,
        });
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const normalized = normalizeBdPhoneNumber(data.phone) ?? data.phone;
        const response = await axiosInstance.post<AuthResponse>('/auth/register', {
            ...data,
            phone: normalized,
        });
        return response.data;
    },
};
