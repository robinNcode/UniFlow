import axiosInstance from '../axiosInstance';
import type { Application, ApplicationFormData, Program } from '../types/application.types';

export const applicationApi = {
  getPrograms: async (cycleId?: string): Promise<Program[]> => {
    const params = cycleId ? { cycleId } : {};
    const response = await axiosInstance.get<Program[]>('/programs', { params });
    return response.data;
  },

  getProgramById: async (id: string): Promise<Program> => {
    const response = await axiosInstance.get<Program>(`/programs/${id}`);
    return response.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
    const response = await axiosInstance.get<Application[]>('/applications');
    return response.data;
  },

  getApplicationById: async (id: string): Promise<Application> => {
    const response = await axiosInstance.get<Application>(`/applications/${id}`);
    return response.data;
  },

  submitApplication: async (data: ApplicationFormData): Promise<Application> => {
    const response = await axiosInstance.post<Application>('/applications', data);
    return response.data;
  },
};
