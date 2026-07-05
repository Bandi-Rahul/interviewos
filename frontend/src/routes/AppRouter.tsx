import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedLayout } from '@/routes/ProtectedLayout';
import SignInPage from '@/features/auth/SignInPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import RoadmapPage from '@/features/roadmap/RoadmapPage';
import ProblemsPage from '@/features/problems/ProblemsPage';
import PlannerPage from '@/features/planner/PlannerPage';
import AnalyticsPage from '@/features/analytics/AnalyticsPage';
import NotesPage from '@/features/notes/NotesPage';
import ResourcesPage from '@/features/resources/ResourcesPage';
import RevisionsPage from '@/features/revisions/RevisionsPage';
import ContestsPage from '@/features/contests/ContestsPage';
import MockInterviewsPage from '@/features/mock-interviews/MockInterviewsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/revisions" element={<RevisionsPage />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/mock-interviews" element={<MockInterviewsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
