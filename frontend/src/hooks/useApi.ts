import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/dashboard';
import { problemsApi, type ProblemsFilter } from '@/lib/problems';
import {
  roadmapApi,
  revisionsApi,
  plannerApi,
  notesApi,
  resourcesApi,
  mockInterviewsApi,
  contestsApi,
} from '@/lib/services';
import type { Problem, Note, Resource, StudyPlan, MockInterview, Contest } from '@/types';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 60_000,
  });
}

export function useTodayTasks() {
  return useQuery({
    queryKey: ['dashboard', 'today'],
    queryFn: dashboardApi.getTodayTasks,
    staleTime: 60_000,
  });
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export function useRoadmapTopics() {
  return useQuery({
    queryKey: ['roadmap', 'topics'],
    queryFn: roadmapApi.list,
    staleTime: 5 * 60_000,
  });
}

// ─── Problems ─────────────────────────────────────────────────────────────────

export function useProblems(filters?: ProblemsFilter) {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: () => problemsApi.list(filters),
  });
}

export function useCreateProblem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Problem>) => problemsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['problems'] }),
  });
}

export function useUpdateProblem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Problem> }) =>
      problemsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['problems'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteProblem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => problemsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['problems'] }),
  });
}

// ─── Revisions ────────────────────────────────────────────────────────────────

export function useRevisions(params?: { completed?: boolean; topic_id?: string }) {
  return useQuery({
    queryKey: ['revisions', params],
    queryFn: () => revisionsApi.list(params),
  });
}

export function useCompleteRevision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, result, notes }: { id: string; result: string; notes?: string }) =>
      revisionsApi.complete(id, { result, notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['revisions'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ─── Planner ──────────────────────────────────────────────────────────────────

export function useStudyPlans() {
  return useQuery({
    queryKey: ['study-plans'],
    queryFn: plannerApi.list,
  });
}

export function useCreateStudyPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<StudyPlan>) => plannerApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['study-plans'] }),
  });
}

export function useGenerateStudyPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { plan_type: string; days?: number }) =>
      plannerApi.generate(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['study-plans'] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      plannerApi.updateTask(taskId, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['study-plans'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export function useNotes(params?: { topic_id?: string; tag?: string; search?: string }) {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => notesApi.list(params),
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Note>) => notesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Note> }) =>
      notesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });
}

// ─── Resources ────────────────────────────────────────────────────────────────

export function useResources(params?: { topic_id?: string; resource_type?: string; status?: string }) {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => resourcesApi.list(params),
  });
}

export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Resource>) => resourcesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resources'] }),
  });
}

export function useUpdateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resource> }) =>
      resourcesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resources'] }),
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resourcesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resources'] }),
  });
}

// ─── Mock Interviews ──────────────────────────────────────────────────────────

export function useMockInterviews() {
  return useQuery({
    queryKey: ['mock-interviews'],
    queryFn: mockInterviewsApi.list,
  });
}

export function useCreateMockInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MockInterview>) => mockInterviewsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mock-interviews'] }),
  });
}

// ─── Contests ─────────────────────────────────────────────────────────────────

export function useContests() {
  return useQuery({
    queryKey: ['contests'],
    queryFn: contestsApi.list,
  });
}

export function useCreateContest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Contest>) => contestsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contests'] }),
  });
}
