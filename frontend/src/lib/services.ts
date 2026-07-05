import api from '@/lib/api';
import type { Note, Resource, Revision, StudyPlan, MockInterview, Contest, RoadmapTopic } from '@/types';

export const roadmapApi = {
  list: () =>
    api.get<RoadmapTopic[]>('/roadmap/topics').then((r) => r.data),

  get: (id: string) =>
    api.get<RoadmapTopic>(`/roadmap/topics/${id}`).then((r) => r.data),

  updateProgress: (id: string, data: { status: string }) =>
    api.patch(`/roadmap/topics/${id}/progress`, data).then((r) => r.data),
};

export const revisionsApi = {
  list: (params?: { completed?: boolean; topic_id?: string }) =>
    api.get<Revision[]>('/revisions', { params }).then((r) => r.data),

  complete: (id: string, data: { result: string; notes?: string }) =>
    api.post(`/revisions/${id}/complete`, data).then((r) => r.data),

  reschedule: (id: string, data: { due_date: string }) =>
    api.patch(`/revisions/${id}/reschedule`, data).then((r) => r.data),
};

export const plannerApi = {
  list: () =>
    api.get<StudyPlan[]>('/study-plans').then((r) => r.data),

  get: (id: string) =>
    api.get<StudyPlan>(`/study-plans/${id}`).then((r) => r.data),

  create: (data: Partial<StudyPlan>) =>
    api.post<StudyPlan>('/study-plans', data).then((r) => r.data),

  update: (id: string, data: Partial<StudyPlan>) =>
    api.patch<StudyPlan>(`/study-plans/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/study-plans/${id}`).then((r) => r.data),

  generate: (params: { plan_type: string; days?: number }) =>
    api.post<StudyPlan>('/study-plans/generate', params).then((r) => r.data),

  updateTask: (taskId: string, data: { status: string }) =>
    api.patch(`/study-tasks/${taskId}`, data).then((r) => r.data),
};

export const notesApi = {
  list: (params?: { topic_id?: string; tag?: string; search?: string }) =>
    api.get<Note[]>('/notes', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<Note>(`/notes/${id}`).then((r) => r.data),

  create: (data: Partial<Note>) =>
    api.post<Note>('/notes', data).then((r) => r.data),

  update: (id: string, data: Partial<Note>) =>
    api.patch<Note>(`/notes/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/notes/${id}`).then((r) => r.data),
};

export const resourcesApi = {
  list: (params?: { topic_id?: string; resource_type?: string; status?: string }) =>
    api.get<Resource[]>('/resources', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<Resource>(`/resources/${id}`).then((r) => r.data),

  create: (data: Partial<Resource>) =>
    api.post<Resource>('/resources', data).then((r) => r.data),

  update: (id: string, data: Partial<Resource>) =>
    api.patch<Resource>(`/resources/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/resources/${id}`).then((r) => r.data),
};

export const mockInterviewsApi = {
  list: () =>
    api.get<MockInterview[]>('/mock-interviews').then((r) => r.data),

  create: (data: Partial<MockInterview>) =>
    api.post<MockInterview>('/mock-interviews', data).then((r) => r.data),

  update: (id: string, data: Partial<MockInterview>) =>
    api.patch<MockInterview>(`/mock-interviews/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/mock-interviews/${id}`).then((r) => r.data),
};

export const contestsApi = {
  list: () =>
    api.get<Contest[]>('/contests').then((r) => r.data),

  create: (data: Partial<Contest>) =>
    api.post<Contest>('/contests', data).then((r) => r.data),

  update: (id: string, data: Partial<Contest>) =>
    api.patch<Contest>(`/contests/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/contests/${id}`).then((r) => r.data),
};
