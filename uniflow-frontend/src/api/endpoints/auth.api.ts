import { axiosInstance } from '@/api/axiosInstance'
import type { Student } from '@/api/types/application.types'
import { normalizeBdPhoneNumber } from '@/utils/phoneValidation'

export interface LoginRequest {
    phone: string
    password: string
}

export interface LoginResponse {
    token: string
    student: Pick<Student, 'id' | 'fullName' | 'phone'>
}

export interface RegisterRequest {
    fullName: string
    phone: string
    email?: string
    password: string
}

export interface RegisterResponse {
    message: string
    studentId: string
}

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const normalized = normalizeBdPhoneNumber(data.phone) ?? data.phone
        const response = await axiosInstance.post<LoginResponse>('/auth/login', {
            ...data,
            phone: normalized,
        })
        return response.data
    },

    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const normalized = normalizeBdPhoneNumber(data.phone) ?? data.phone
        const response = await axiosInstance.post<RegisterResponse>('/auth/register', {
            ...data,
            phone: normalized,
        })
        return response.data
    },
}
