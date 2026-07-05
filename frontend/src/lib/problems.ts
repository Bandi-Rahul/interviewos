import api from '@/lib/api';
import type { Problem, PaginatedResponse } from '@/types';

export interface ProblemsFilter {
  topic_id?: string;
  difficulty?: string;
  platform?: string;
  status?: string;
  company_tag?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export const problemsApi = {
  list: (filters?: ProblemsFilter) =>
    api.get<PaginatedResponse<Problem>>('/problems', { params: filters }).then((r) => r.data),

  get: (id: string) =>
    api.get<Problem>(`/problems/${id}`).then((r) => r.data),

  create: (data: Partial<Problem>) =>
    api.post<Problem>('/problems', data).then((r) => r.data),

  update: (id: string, data: Partial<Problem>) =>
    api.patch<Problem>(`/problems/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/problems/${id}`).then((r) => r.data),
};
