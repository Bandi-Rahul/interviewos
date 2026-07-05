import api from '@/lib/api';
import type { DashboardSummary, AnalyticsOverview } from '@/types';

export const dashboardApi = {
  getSummary: () =>
    api.get<DashboardSummary>('/dashboard/summary').then((r) => r.data),

  getTodayTasks: () =>
    api.get('/dashboard/today').then((r) => r.data),

  getActivity: (days = 30) =>
    api.get('/dashboard/activity', { params: { days } }).then((r) => r.data),
};

export const analyticsApi = {
  getOverview: () =>
    api.get<AnalyticsOverview>('/analytics/overview').then((r) => r.data),

  getTopics: () =>
    api.get('/analytics/topics').then((r) => r.data),

  getDifficulty: () =>
    api.get('/analytics/difficulty').then((r) => r.data),

  getConsistency: () =>
    api.get('/analytics/consistency').then((r) => r.data),

  getReadiness: () =>
    api.get('/analytics/readiness').then((r) => r.data),
};
