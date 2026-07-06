import { axiosInstance } from '@/api/axiosInstance'
import type { Application, Program, AdmissionCycle } from '@/api/types/application.types'

export interface ApplicationFormData {
    // Step 1: Personal Info
    fullName: string
    fatherName: string
    motherName: string
    dateOfBirth: string
    nidOrBirthReg: string
    // Step 2: Academic
    sscGpa: number
    hscGpa: number
    boardName: string
    passingYear: number
    // Step 3: Quota
    quotaType: string
    supportingDocumentUrl?: string
    // Step 4 (resolved by backend)
    cycleId: string
}

export const applicationApi = {
    getMyApplications: async (): Promise<Application[]> => {
        const response = await axiosInstance.get<Application[]>('/applications/my')
        return response.data
    },

    getApplicationById: async (id: string): Promise<Application> => {
        const response = await axiosInstance.get<Application>(`/applications/${id}`)
        return response.data
    },

    submitApplication: async (data: ApplicationFormData): Promise<Application> => {
        const response = await axiosInstance.post<Application>('/applications', data)
        return response.data
    },

    getPrograms: async (): Promise<Program[]> => {
        const response = await axiosInstance.get<Program[]>('/programs')
        return response.data
    },

    getProgramById: async (id: string): Promise<Program> => {
        const response = await axiosInstance.get<Program>(`/programs/${id}`)
        return response.data
    },

    getActiveCycle: async (): Promise<AdmissionCycle> => {
        const response = await axiosInstance.get<AdmissionCycle>('/cycles/active')
        return response.data
    },
}
