// ─── Auth / User ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  target_role?: string;
  target_companies?: string[];
  interview_date?: string;
  experience_level?: ExperienceLevel;
  daily_study_goal_minutes: number;
  weekly_problem_goal: number;
  current_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

// ─── Roadmap ─────────────────────────────────────────────────────────────────

export interface RoadmapTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  difficulty_level: Difficulty;
  estimated_hours: number;
  completion_percentage: number;
  status: TopicStatus;
  created_at: string;
  updated_at: string;
}

export type TopicStatus = "not_started" | "in_progress" | "completed" | "needs_revision";

// ─── Problem ─────────────────────────────────────────────────────────────────

export interface Problem {
  id: string;
  user_id: string;
  title: string;
  difficulty: Difficulty;
  topic_id?: string;
  topic_name?: string;
  pattern?: string;
  company_tags: string[];
  platform: Platform;
  url?: string;
  status: ProblemStatus;
  date_attempted?: string;
  date_solved?: string;
  time_taken_minutes?: number;
  attempts_count: number;
  hint_used: boolean;
  confidence_score: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type Difficulty = "easy" | "medium" | "hard";
export type Platform = "leetcode" | "hackerrank" | "codeforces" | "gfg" | "other";
export type ProblemStatus = "not_started" | "attempted" | "solved" | "needs_revision" | "mastered";

// ─── Revision ────────────────────────────────────────────────────────────────

export interface Revision {
  id: string;
  user_id: string;
  problem_id: string;
  problem_title?: string;
  problem_difficulty?: Difficulty;
  due_date: string;
  completed_at?: string;
  interval_days: number;
  revision_number: number;
  result?: RevisionResult;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type RevisionResult = "solved_easily" | "solved_with_effort" | "needed_hint" | "could_not_solve";

// ─── Study Plan ───────────────────────────────────────────────────────────────

export interface StudyPlan {
  id: string;
  user_id: string;
  plan_type: PlanType;
  title: string;
  start_date: string;
  end_date: string;
  status: PlanStatus;
  generated_by: PlanGenerator;
  tasks: StudyTask[];
  created_at: string;
  updated_at: string;
}

export interface StudyTask {
  id: string;
  study_plan_id: string;
  user_id: string;
  task_type: TaskType;
  title: string;
  description?: string;
  topic_id?: string;
  problem_id?: string;
  resource_id?: string;
  note_id?: string;
  due_date: string;
  estimated_minutes?: number;
  priority: TaskPriority;
  status: TaskStatus;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export type PlanType = "daily" | "weekly" | "monthly";
export type PlanStatus = "active" | "completed" | "missed" | "cancelled";
export type PlanGenerator = "user" | "system" | "ai";
export type TaskType = "learn_topic" | "solve_problem" | "revise_problem" | "review_note" | "complete_resource" | "mock_interview";
export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped";
export type TaskPriority = "low" | "medium" | "high";

// ─── Note ─────────────────────────────────────────────────────────────────────

export interface Note {
  id: string;
  user_id: string;
  title: string;
  topic_id?: string;
  topic_name?: string;
  tags: string[];
  content_markdown: string;
  created_at: string;
  updated_at: string;
}

// ─── Resource ─────────────────────────────────────────────────────────────────

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  resource_type: ResourceType;
  topic_id?: string;
  topic_name?: string;
  url: string;
  description?: string;
  source?: string;
  estimated_minutes?: number;
  status: ResourceStatus;
  rating?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export type ResourceType = "video" | "article" | "book" | "cheat_sheet" | "practice_sheet" | "course";
export type ResourceStatus = "not_started" | "in_progress" | "completed";

// ─── Mock Interview ───────────────────────────────────────────────────────────

export interface MockInterview {
  id: string;
  user_id: string;
  scheduled_at: string;
  completed_at?: string;
  interview_type: InterviewType;
  target_company?: string;
  topics: string[];
  overall_score?: number;
  problem_solving_score?: number;
  communication_score?: number;
  coding_score?: number;
  debugging_score?: number;
  feedback?: string;
  action_items?: string[];
  created_at: string;
  updated_at: string;
}

export type InterviewType = "technical" | "behavioral" | "system_design" | "mixed";

// ─── Contest ──────────────────────────────────────────────────────────────────

export interface Contest {
  id: string;
  user_id: string;
  name: string;
  platform: ContestPlatform;
  contest_date: string;
  rating_before?: number;
  rating_after?: number;
  rank?: number;
  problems_solved?: number;
  total_problems?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ContestPlatform = "leetcode" | "codeforces" | "atcoder" | "hackerrank" | "codechef" | "other";

// ─── Achievement ──────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement: Achievement;
  earned_at: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  problems_solved: number;
  problems_remaining: number;
  current_streak: number;
  longest_streak: number;
  current_xp: number;
  current_level: number;
  interview_readiness_score: number;
  weekly_goal_progress: number;
  monthly_goal_progress: number;
  daily_study_minutes: number;
  upcoming_revisions_count: number;
  weak_topics: string[];
}

export interface AnalyticsOverview {
  total_problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  topics_completed: number;
  total_topics: number;
  avg_solve_time_minutes: number;
  hint_usage_rate: number;
  revision_success_rate: number;
  consistency_score: number;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link_url?: string;
  read_at?: string;
  created_at: string;
}

export type NotificationType = "revision_due" | "streak_alert" | "achievement" | "weekly_goal" | "mock_interview" | "general";

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface ApiError {
  detail: string;
  field_errors?: Record<string, string[]>;
}
