# InterviewOS Requirements Document

## 1. Project Overview

### 1.1 Product Name

InterviewOS is the working name for a full-stack interview preparation platform.

### 1.2 Tagline

Your personal operating system for coding interview preparation.

### 1.3 Purpose

InterviewOS helps software engineers prepare for technical interviews through structured DSA learning, problem tracking, study planning, spaced revision, analytics, notes, resources, mock interviews, contests, gamification, and future AI coaching.

The product is intended to replace fragmented preparation workflows that currently require separate tools such as LeetCode, spreadsheets, calendars, notes apps, YouTube playlists, and manual revision trackers.

### 1.4 Product Vision

InterviewOS should become a unified preparation companion that tells users what to study next, tracks their progress, identifies weak areas, schedules revision, measures consistency, and estimates interview readiness.

The long-term vision is to combine:

- GitHub-like preparation history.
- Duolingo-like motivation and streak mechanics.
- Notion-like organization for notes and resources.
- AI mentor-like personalized guidance.

### 1.5 Target Users

Primary users:

- College students preparing for placements.
- Fresh graduates preparing for software engineering interviews.
- Software engineers preparing for job switches.
- AI/ML students who need strong DSA fundamentals.

Secondary users:

- Coding bootcamp participants.
- Competitive programmers.
- Interview mentors.
- Universities and training institutes.

## 2. Goals and Success Criteria

### 2.1 Product Goals

The platform must help users:

- Learn DSA systematically through a topic-based roadmap.
- Track every solved, attempted, and revised coding problem.
- Generate and follow daily, weekly, and monthly study plans.
- Maintain consistency through streaks, goals, and gamification.
- Review solved problems using spaced repetition.
- Understand strengths and weaknesses using analytics.
- Prepare for interviews using mock interview tracking.
- Store notes, resources, and personal learning material in one place.
- Eventually receive AI-generated study recommendations and coaching.

### 2.2 Business and Portfolio Goals

The project should demonstrate:

- Modern React and TypeScript frontend engineering.
- FastAPI backend development.
- PostgreSQL data modeling.
- Authentication and authorization.
- Analytics dashboards and data visualization.
- Scalable system design.
- AI-ready architecture.
- Production-quality deployment practices.

### 2.3 Success Metrics

The platform should be evaluated using:

- Daily active users.
- Weekly active users.
- Weekly study consistency rate.
- Number of problems solved per user.
- Number of problems revised per user.
- Revision completion rate.
- Average interview readiness score.
- Improvement in mock interview scores.
- User retention rate.
- User satisfaction score.
- Average dashboard load time.

## 3. Scope

### 3.1 MVP Scope

The MVP must include:

- User authentication.
- User dashboard.
- DSA roadmap.
- Problem tracker.
- Study planner.
- Basic analytics.
- Notes system.
- Resource library.

### 3.2 Phase 2 Scope

Phase 2 should include:

- Spaced repetition revision engine.
- Advanced analytics.
- Gamification.
- Contest tracking.
- Mock interview tracking.
- Notifications.

### 3.3 Phase 3 Scope

Phase 3 should include:

- AI study coach.
- AI interview simulator.
- Predictive analytics.
- Social features.
- Team workspaces.
- Mobile app.

### 3.4 Out of Scope for MVP

The MVP should not include:

- Full AI interview simulation.
- Public leaderboards.
- Mobile native applications.
- Team or classroom management.
- Payment/subscription systems.
- Browser extension integrations.
- Automatic LeetCode sync unless explicitly added later.

## 4. User Roles and Permissions

### 4.1 Anonymous Visitor

Anonymous visitors can:

- View landing or sign-in page.
- Read limited public product information.
- Sign up or sign in.

Anonymous visitors cannot:

- Access the dashboard.
- Create problems, plans, notes, or resources.
- View user-specific analytics.

### 4.2 Authenticated User

Authenticated users can:

- Manage their profile.
- View dashboard metrics.
- Track coding problems.
- Follow the DSA roadmap.
- Create and edit study plans.
- Create and edit notes.
- Add and organize resources.
- Track revisions, contests, and mock interviews when available.
- View analytics.

### 4.3 Admin, Future

Admins may eventually be able to:

- Manage global roadmap content.
- Manage shared resources.
- Review reported content.
- Manage users.
- View platform-level analytics.

## 5. Functional Requirements

## 5.1 Authentication and User Management

### 5.1.1 Sign Up

The system must allow users to create an account using:

- Email and password.
- OAuth providers such as Google or GitHub.

Acceptance criteria:

- A new user can create an account successfully.
- Duplicate email registrations are rejected.
- Required fields are validated.
- The user is redirected to onboarding or dashboard after signup.

### 5.1.2 Sign In

The system must allow existing users to sign in.

Acceptance criteria:

- Valid credentials grant access.
- Invalid credentials show a clear error.
- Authenticated users remain signed in across page refreshes.
- Unauthenticated users are redirected away from protected pages.

### 5.1.3 Sign Out

The system must allow users to sign out.

Acceptance criteria:

- Session is cleared.
- User is redirected to the public entry page.
- Protected routes become inaccessible after sign out.

### 5.1.4 User Profile

The system must store user profile information.

Profile fields should include:

- User ID.
- Name.
- Email.
- Avatar URL.
- Target role.
- Target companies.
- Interview date, optional.
- Daily study goal.
- Weekly problem goal.
- Current level.
- XP.
- Created date.
- Updated date.

## 5.2 Onboarding

### 5.2.1 Initial Setup

After signup, the system should guide users through onboarding.

The onboarding flow should collect:

- Experience level.
- Target interview timeline.
- Daily available study time.
- Current DSA confidence.
- Preferred platforms.
- Target companies.
- Current weak topics.

Acceptance criteria:

- Users can complete onboarding in under three minutes.
- Users can skip optional fields.
- Onboarding results generate initial study recommendations.
- Users can edit onboarding preferences later.

## 5.3 Dashboard

### 5.3.1 Dashboard Summary

The dashboard must serve as the central hub of the product.

It must display:

- Overall progress.
- Problems solved.
- Problems remaining.
- Daily study hours.
- Current streak.
- Weekly goals.
- Monthly goals.
- Interview readiness score.
- XP and level.
- Upcoming revisions.
- Today's tasks.
- Recent achievements.

Acceptance criteria:

- Dashboard loads user-specific data after authentication.
- Dashboard shows empty states for new users.
- Metrics update after the user adds or updates problems.
- Dashboard is responsive on desktop, tablet, and mobile.

### 5.3.2 Dashboard Visualizations

The dashboard should include visualizations such as:

- Progress line chart.
- Topic completion pie or donut chart.
- Difficulty distribution bar chart.
- Study activity heatmap.
- Interview readiness radar chart.
- Recent activity timeline.

Acceptance criteria:

- Charts use real user data where available.
- Charts show meaningful empty states when no data exists.
- Visualizations are accessible with labels or textual summaries.

### 5.3.3 Today's Tasks

The dashboard must show a prioritized task list for the current day.

Tasks may include:

- Problems to solve.
- Topics to study.
- Problems due for revision.
- Notes to review.
- Mock interview preparation.

Acceptance criteria:

- Completed tasks can be marked done.
- Missed tasks can be carried forward or rescheduled.
- Task priority is determined by plan, revision due date, and weak topics.

## 5.4 DSA Roadmap

### 5.4.1 Topic Structure

The DSA roadmap must be organized by topics including:

- Arrays.
- Strings.
- Hashing.
- Linked Lists.
- Stacks.
- Queues.
- Trees.
- Binary Search Trees.
- Heap.
- Graphs.
- Dynamic Programming.
- Greedy.
- Backtracking.
- Bit Manipulation.
- Tries.
- Segment Trees.
- Advanced Algorithms.

Each topic must support:

- Description.
- Difficulty level.
- Estimated duration.
- Learning resources.
- Recommended problems.
- Completion progress.
- Topic status.

Topic statuses should include:

- Not started.
- In progress.
- Completed.
- Needs revision.

Acceptance criteria:

- Users can view all roadmap topics.
- Users can expand a topic to see resources and recommended problems.
- User progress is calculated from completed subtopics and problems.
- Topic status updates based on user activity.

### 5.4.2 Roadmap Progress

The system must calculate roadmap progress.

Progress should consider:

- Problems solved per topic.
- Learning resources completed.
- Notes created.
- Revision completion.

Acceptance criteria:

- Overall roadmap completion is shown as a percentage.
- Topic-level progress is shown clearly.
- Progress updates automatically when related records change.

## 5.5 Problem Tracker

### 5.5.1 Add Problem

Users must be able to add coding problems manually.

Problem fields must include:

- Title.
- Difficulty.
- Topic.
- Pattern.
- Company tags.
- Platform.
- URL.
- Status.
- Date attempted.
- Date solved.
- Time taken.
- Number of attempts.
- Hint usage.
- Confidence score.
- Notes.
- Revision schedule.

Valid difficulty values:

- Easy.
- Medium.
- Hard.

Valid status values:

- Not started.
- Attempted.
- Solved.
- Needs revision.
- Mastered.

Acceptance criteria:

- Required fields are validated.
- URL format is validated when provided.
- Time taken must be a non-negative value.
- Confidence score must be within the allowed range.
- New solved problems can trigger revision scheduling.

### 5.5.2 Edit Problem

Users must be able to edit problem records.

Acceptance criteria:

- Updates are saved persistently.
- Related analytics refresh after updates.
- Changing status to solved can set solved date.
- Changing confidence can affect weak-area analytics.

### 5.5.3 Delete Problem

Users must be able to delete problem records.

Acceptance criteria:

- Users receive a confirmation before deletion.
- Deleted problems no longer appear in trackers or analytics.
- Dependent revision records are handled safely.

### 5.5.4 Filter and Search Problems

Users must be able to filter and search problems.

Supported filters:

- Topic.
- Difficulty.
- Platform.
- Status.
- Company tag.
- Pattern.
- Date range.
- Confidence score.

Acceptance criteria:

- Search supports problem title and notes.
- Multiple filters can be combined.
- Results update without full page reload.
- Empty results show a helpful empty state.

### 5.5.5 Problem Notes

Users must be able to attach notes to problem records.

Acceptance criteria:

- Notes support Markdown.
- Notes can include code snippets.
- Notes are saved automatically or with explicit save feedback.

## 5.6 Study Planner

### 5.6.1 Daily Plan

The system must support daily study plans.

A daily plan may include:

- Topics to learn.
- Problems to solve.
- Problems to revise.
- Notes to review.
- Estimated study time.

Acceptance criteria:

- Users can create daily plans manually.
- The system can generate a suggested daily plan.
- Users can mark tasks complete.
- Daily completion rate is calculated.

### 5.6.2 Weekly Plan

The system must support weekly planning.

A weekly plan should include:

- Target topics.
- Number of problems by difficulty.
- Study hour target.
- Revision target.
- Mock interview target.

Acceptance criteria:

- Users can define weekly goals.
- Weekly progress is visible on the dashboard.
- Missed goals can be carried forward.

### 5.6.3 Monthly Milestones

The system must support monthly milestones.

Monthly milestones may include:

- Complete selected roadmap topics.
- Solve a target number of problems.
- Complete a number of revisions.
- Complete mock interviews.
- Reach a target readiness score.

Acceptance criteria:

- Users can create, edit, and complete milestones.
- Milestones appear in dashboard summaries.
- Milestone progress is calculated automatically where possible.

### 5.6.4 Adaptive Planning

The study planner should adapt plans based on:

- Remaining topics.
- Weak topics.
- Missed study sessions.
- Upcoming interviews.
- Revision backlog.
- User availability.

Acceptance criteria:

- Users can regenerate a plan.
- Generated plans prioritize weak areas and upcoming deadlines.
- The system explains why certain tasks were recommended.

## 5.7 Revision Engine

### 5.7.1 Revision Scheduling

After a user solves a problem, the system should schedule spaced revision.

Default intervals:

- 1 day.
- 3 days.
- 7 days.
- 14 days.
- 30 days.
- 90 days.

Acceptance criteria:

- Solved problems generate revision records.
- Due revisions appear on dashboard and planner.
- Users can mark a revision as completed.
- Revision dates are timezone-aware.

### 5.7.2 Revision Performance

Users must be able to record revision performance.

Revision result values should include:

- Solved easily.
- Solved with effort.
- Needed hint.
- Could not solve.

Acceptance criteria:

- Poor revision performance schedules an earlier follow-up revision.
- Strong revision performance can keep or extend the next interval.
- Revision success contributes to analytics and readiness score.

### 5.7.3 Revision Backlog

The system must show overdue revisions.

Acceptance criteria:

- Overdue revisions are clearly marked.
- Users can filter revisions by topic, difficulty, and due date.
- Users can reschedule overdue items.

## 5.8 Analytics

### 5.8.1 Progress Analytics

The analytics module must show:

- Problems solved over time.
- Topic-wise completion.
- Difficulty distribution.
- Average solve time.
- Hint usage.
- Study consistency.
- Weekly study hours.
- Revision success.
- Contest performance.
- Interview readiness trends.

Acceptance criteria:

- Analytics are user-specific.
- Charts support date ranges.
- Users can view high-level summaries and detailed breakdowns.

### 5.8.2 Weakness Analysis

The system should identify weak areas using:

- Low confidence scores.
- High solve time.
- High hint usage.
- Failed revisions.
- Repeated attempts.
- Low topic completion.

Acceptance criteria:

- Weak topics are ranked.
- Dashboard shows top weak areas.
- Planner can use weak areas to recommend tasks.

### 5.8.3 Interview Readiness Score

The system must calculate an interview readiness score.

The score should consider:

- Roadmap completion.
- Problem count.
- Difficulty distribution.
- Topic coverage.
- Revision success.
- Recent consistency.
- Mock interview performance.
- Contest performance, optional.

Acceptance criteria:

- Score is displayed as a percentage or 0-100 value.
- Score trend is visible over time.
- The system explains the major factors affecting the score.
- New users receive a clear explanation instead of a misleading score.

## 5.9 Gamification

### 5.9.1 XP System

The system should award XP for preparation activities.

Example XP events:

- Solve easy problem.
- Solve medium problem.
- Solve hard problem.
- Complete revision.
- Complete daily plan.
- Maintain streak.
- Complete mock interview.
- Complete roadmap topic.

Acceptance criteria:

- XP is awarded consistently.
- Duplicate XP is prevented for the same one-time action.
- XP history is auditable.

### 5.9.2 Levels

The system should convert XP into levels.

Acceptance criteria:

- User level appears on dashboard and profile.
- Level increases when XP threshold is reached.
- Level changes can trigger achievements.

### 5.9.3 Streaks

The system must track daily study streaks.

Acceptance criteria:

- Completing at least one meaningful study action counts toward the streak.
- Streak resets after a missed day unless freeze mechanics are later added.
- Current streak and longest streak are stored.

### 5.9.4 Achievements

The system should award badges for milestones.

Example achievements:

- First problem solved.
- Seven-day streak.
- First hard problem solved.
- First topic completed.
- 100 problems solved.
- Revision master.
- Mock interview completed.

Acceptance criteria:

- Achievements are displayed on dashboard or profile.
- Achievements are awarded once per user.
- Recently earned achievements are highlighted.

## 5.10 Mock Interviews

### 5.10.1 Schedule Mock Interview

Users should be able to schedule mock interviews.

Fields should include:

- Interview date.
- Interview type.
- Target company.
- Interviewer, optional.
- Topics covered.
- Notes.

Acceptance criteria:

- Scheduled mock interviews appear in planner and dashboard.
- Users can edit or cancel scheduled interviews.

### 5.10.2 Record Mock Interview Result

Users should be able to record mock interview performance.

Fields should include:

- Overall score.
- Problem-solving score.
- Communication score.
- Coding score.
- Debugging score.
- Feedback.
- Action items.

Acceptance criteria:

- Mock interview results appear in analytics.
- Action items can become study tasks.
- Mock scores affect interview readiness score.

## 5.11 Contest Tracker

### 5.11.1 Add Contest

Users should be able to track coding contests.

Fields should include:

- Contest name.
- Platform.
- Date.
- Rating before.
- Rating after.
- Rank.
- Problems solved.
- Total problems.
- Notes.

Acceptance criteria:

- Contest entries can be created, edited, and deleted.
- Rating changes are calculated where possible.
- Contest performance appears in analytics.

### 5.11.2 Contest Trends

The system should show contest performance over time.

Acceptance criteria:

- Users can view rating trend.
- Users can view rank trend.
- Users can view problems solved per contest.

## 5.12 Notes System

### 5.12.1 Create Notes

Users must be able to create Markdown notes.

Notes should support:

- Title.
- Topic.
- Tags.
- Markdown content.
- Code snippets.
- Linked problems.
- Linked resources.

Acceptance criteria:

- Notes can be created, edited, and deleted.
- Markdown preview is available.
- Notes can be filtered by topic or tag.

### 5.12.2 Organize Notes

Users should be able to organize notes by:

- Topic.
- Tag.
- Problem.
- Roadmap section.

Acceptance criteria:

- Notes are searchable.
- Notes can be linked from roadmap topics and problems.
- Empty states guide users to create their first note.

## 5.13 Resource Library

### 5.13.1 Add Resource

Users must be able to save learning resources.

Resource fields should include:

- Title.
- Type.
- Topic.
- URL.
- Description.
- Source.
- Estimated duration.
- Completion status.
- Rating.

Resource types should include:

- Video.
- Article.
- Book.
- Cheat sheet.
- Practice sheet.
- Course.

Acceptance criteria:

- Users can create, edit, and delete resources.
- URLs are validated.
- Resources can be filtered by topic, type, and status.

### 5.13.2 Resource Completion

Users should be able to mark resources as completed.

Acceptance criteria:

- Completed resources contribute to roadmap progress.
- Completion date is stored.

## 5.14 Notifications

### 5.14.1 In-App Notifications

The system should notify users about:

- Due revisions.
- Missed study sessions.
- Upcoming mock interviews.
- Weekly goal progress.
- Achievements.

Acceptance criteria:

- Notifications can be marked as read.
- Notifications link to relevant pages.
- Users can view recent notifications.

### 5.14.2 Email Notifications, Future

The system may send email notifications for:

- Revision reminders.
- Weekly summaries.
- Upcoming interviews.

Acceptance criteria:

- Users can opt in or out.
- Emails respect timezone and frequency settings.

## 5.15 AI Features, Future

### 5.15.1 Personalized Study Plan

The AI coach should generate study plans based on:

- User goals.
- Available study time.
- Weak areas.
- Interview timeline.
- Past performance.

Acceptance criteria:

- AI output is converted into editable planner tasks.
- Recommendations include a short explanation.
- Users can accept, edit, or reject generated plans.

### 5.15.2 Weakness Analysis

The AI coach should summarize weak areas using analytics data.

Acceptance criteria:

- AI identifies likely causes of weak performance.
- AI suggests specific topics and problems to review.
- AI avoids claiming certainty when data is limited.

### 5.15.3 AI Interview Coach

The AI interview coach should help users practice interviews.

Acceptance criteria:

- Users can start a mock interview session.
- AI can ask coding or behavioral questions.
- AI can provide feedback after the session.
- Session results can be saved to mock interview history.

### 5.15.4 Daily Summary

The AI coach should generate daily summaries.

Acceptance criteria:

- Summary includes completed work, missed work, and next recommendation.
- Summary is concise and actionable.

## 6. Non-Functional Requirements

## 6.1 Performance

The system must be fast under normal usage.

Requirements:

- Dashboard should load in under two seconds for typical users.
- API responses for common dashboard queries should complete in under 500 ms under normal load.
- Lists should support pagination or virtualization when needed.
- Expensive analytics should be cached or precomputed where appropriate.

## 6.2 Scalability

The system should support growth to thousands of concurrent users.

Requirements:

- Backend must be stateless where possible.
- PostgreSQL queries must use indexes for common filters.
- Analytics endpoints should avoid full-table scans for large users.
- Background jobs should handle scheduled revision and notification work.
- Redis should be used for caching and job coordination where appropriate.

## 6.3 Reliability

Requirements:

- User data must be persisted reliably.
- Critical actions should return clear success or failure states.
- Background jobs should be retryable.
- Database backups should be enabled in production.
- The system should fail gracefully when third-party services are unavailable.

## 6.4 Security

Requirements:

- All production traffic must use HTTPS.
- Authentication must be handled using Clerk or Auth.js.
- Protected APIs must verify authenticated user identity.
- Users must not access another user's data.
- Sensitive configuration must be stored in environment variables.
- Password handling must be delegated to the auth provider when possible.
- Input must be validated on both client and server.
- Markdown rendering must sanitize unsafe HTML.

## 6.5 Accessibility

The system should meet WCAG 2.1 AA where practical.

Requirements:

- Keyboard navigation must work for primary flows.
- Form controls must have accessible labels.
- Color contrast must meet accessibility guidelines.
- Charts must include accessible descriptions or data summaries.
- Focus states must be visible.
- Components must work with screen readers where possible.

## 6.6 Responsiveness

The UI must support:

- Desktop.
- Tablet.
- Mobile.

Requirements:

- Dashboard cards must reflow on smaller screens.
- Tables must become responsive using horizontal scroll, stacked cards, or compact views.
- Navigation must adapt for mobile.
- Touch targets must be large enough for mobile interaction.

## 6.7 Maintainability

Requirements:

- Frontend code must be modular and component-based.
- Backend code must separate routes, services, models, schemas, and data access.
- Shared domain constants should be centralized.
- Tests should cover critical business logic.
- API contracts should be documented.
- TypeScript types should be used consistently.

## 6.8 Observability

Requirements:

- Backend should log important application events.
- Errors should include enough context for debugging without leaking secrets.
- Production should support error monitoring.
- Background job failures should be visible.

## 7. Technical Requirements

## 7.1 Frontend Stack

Required technologies:

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- shadcn/ui.
- Recharts.
- Framer Motion.

Frontend responsibilities:

- Render responsive user interface.
- Manage authenticated routes.
- Fetch data from backend APIs.
- Display charts and analytics.
- Provide form validation and useful error states.
- Support Markdown editing and preview.

Recommended frontend structure:

```text
src/
  app/
  components/
  features/
    dashboard/
    roadmap/
    problems/
    planner/
    analytics/
    notes/
    resources/
  hooks/
  lib/
  routes/
  styles/
  types/
```

## 7.2 Backend Stack

Required technologies:

- Python.
- FastAPI.
- Pydantic.
- SQLAlchemy or SQLModel.
- Alembic.
- PostgreSQL.
- Redis.
- Celery or equivalent background task queue.

Backend responsibilities:

- Expose REST APIs.
- Validate input and output schemas.
- Enforce user data ownership.
- Persist application data.
- Calculate analytics.
- Schedule revisions and notifications.
- Integrate with authentication provider.

Recommended backend structure:

```text
backend/
  app/
    api/
    core/
    db/
    models/
    schemas/
    services/
    workers/
    tests/
```

## 7.3 Database

Database:

- PostgreSQL.

Production database provider:

- Neon PostgreSQL or equivalent.

Database requirements:

- Use migrations for schema changes.
- Use foreign keys for relational integrity.
- Use indexes for common query filters.
- Store timestamps with timezone awareness.
- Use soft deletes only where required by product behavior.

## 7.4 Caching

Caching technology:

- Redis.

Caching candidates:

- Dashboard summary.
- Analytics aggregates.
- Session-independent reference data.
- Rate limiting metadata.

## 7.5 Background Jobs

Background job technology:

- Celery, RQ, Dramatiq, or equivalent.

Background jobs should handle:

- Revision schedule generation.
- Notification generation.
- Weekly summary generation.
- Analytics precomputation, future.
- AI summary generation, future.

## 7.6 Authentication

Supported options:

- Clerk.
- Auth.js.

Authentication requirements:

- OAuth support is required.
- Backend must verify authenticated requests.
- User identity must be mapped to internal user records.
- Protected resources must be scoped to the authenticated user.

## 7.7 Deployment

Frontend:

- Vercel.

Backend:

- Railway or Render.

Database:

- Neon PostgreSQL.

Storage:

- Cloudinary or S3-compatible storage.

Deployment requirements:

- Environment variables must be documented.
- Production and development environments must be separate.
- Database migrations must be part of deployment workflow.
- CORS must be configured explicitly.

## 8. Data Model Requirements

## 8.1 Core Entities

The system should include these core entities:

- User.
- UserProfile.
- RoadmapTopic.
- RoadmapSubtopic.
- Problem.
- ProblemAttempt.
- Revision.
- StudyPlan.
- StudyTask.
- Note.
- Resource.
- Achievement.
- UserAchievement.
- XPEvent.
- MockInterview.
- Contest.
- Notification.

## 8.2 User

Fields:

- id.
- auth_provider_user_id.
- email.
- name.
- avatar_url.
- created_at.
- updated_at.

Relationships:

- Has one profile.
- Has many problems.
- Has many notes.
- Has many study plans.
- Has many revisions.

## 8.3 UserProfile

Fields:

- id.
- user_id.
- target_role.
- target_companies.
- interview_date.
- experience_level.
- daily_study_goal_minutes.
- weekly_problem_goal.
- current_xp.
- current_level.
- current_streak.
- longest_streak.
- timezone.
- created_at.
- updated_at.

## 8.4 RoadmapTopic

Fields:

- id.
- name.
- slug.
- description.
- sort_order.
- difficulty_level.
- estimated_hours.
- created_at.
- updated_at.

## 8.5 Problem

Fields:

- id.
- user_id.
- title.
- difficulty.
- topic_id.
- pattern.
- company_tags.
- platform.
- url.
- status.
- date_attempted.
- date_solved.
- time_taken_minutes.
- attempts_count.
- hint_used.
- confidence_score.
- notes.
- created_at.
- updated_at.

Indexes:

- user_id.
- topic_id.
- difficulty.
- status.
- platform.
- date_solved.

## 8.6 Revision

Fields:

- id.
- user_id.
- problem_id.
- due_date.
- completed_at.
- interval_days.
- revision_number.
- result.
- notes.
- created_at.
- updated_at.

Indexes:

- user_id.
- problem_id.
- due_date.
- completed_at.

## 8.7 StudyPlan

Fields:

- id.
- user_id.
- plan_type.
- title.
- start_date.
- end_date.
- status.
- generated_by.
- created_at.
- updated_at.

Plan types:

- Daily.
- Weekly.
- Monthly.

Generated by values:

- User.
- System.
- AI.

## 8.8 StudyTask

Fields:

- id.
- study_plan_id.
- user_id.
- task_type.
- title.
- description.
- topic_id.
- problem_id.
- resource_id.
- note_id.
- due_date.
- estimated_minutes.
- priority.
- status.
- completed_at.
- created_at.
- updated_at.

Task types:

- Learn topic.
- Solve problem.
- Revise problem.
- Review note.
- Complete resource.
- Mock interview.

## 8.9 Note

Fields:

- id.
- user_id.
- title.
- topic_id.
- tags.
- content_markdown.
- created_at.
- updated_at.

## 8.10 Resource

Fields:

- id.
- user_id.
- title.
- resource_type.
- topic_id.
- url.
- description.
- source.
- estimated_minutes.
- status.
- rating.
- completed_at.
- created_at.
- updated_at.

## 8.11 Achievement

Fields:

- id.
- code.
- name.
- description.
- icon.
- xp_reward.
- created_at.
- updated_at.

## 8.12 UserAchievement

Fields:

- id.
- user_id.
- achievement_id.
- earned_at.

## 8.13 XPEvent

Fields:

- id.
- user_id.
- event_type.
- xp_amount.
- source_type.
- source_id.
- created_at.

## 8.14 MockInterview

Fields:

- id.
- user_id.
- scheduled_at.
- completed_at.
- interview_type.
- target_company.
- topics.
- overall_score.
- problem_solving_score.
- communication_score.
- coding_score.
- debugging_score.
- feedback.
- action_items.
- created_at.
- updated_at.

## 8.15 Contest

Fields:

- id.
- user_id.
- name.
- platform.
- contest_date.
- rating_before.
- rating_after.
- rank.
- problems_solved.
- total_problems.
- notes.
- created_at.
- updated_at.

## 8.16 Notification

Fields:

- id.
- user_id.
- type.
- title.
- body.
- link_url.
- read_at.
- created_at.

## 9. API Requirements

## 9.1 API Style

The backend should expose REST APIs using JSON.

General requirements:

- All protected endpoints require authentication.
- API responses should use consistent shapes.
- Validation errors should be clear and field-specific.
- Pagination should be supported for list endpoints.
- Filtering and sorting should be supported where needed.

## 9.2 Suggested API Endpoints

Authentication and user:

- `GET /api/me`
- `PATCH /api/me/profile`
- `POST /api/onboarding`

Dashboard:

- `GET /api/dashboard/summary`
- `GET /api/dashboard/today`
- `GET /api/dashboard/activity`

Roadmap:

- `GET /api/roadmap/topics`
- `GET /api/roadmap/topics/{topic_id}`
- `PATCH /api/roadmap/topics/{topic_id}/progress`

Problems:

- `GET /api/problems`
- `POST /api/problems`
- `GET /api/problems/{problem_id}`
- `PATCH /api/problems/{problem_id}`
- `DELETE /api/problems/{problem_id}`

Revisions:

- `GET /api/revisions`
- `POST /api/revisions/{revision_id}/complete`
- `PATCH /api/revisions/{revision_id}/reschedule`

Study planner:

- `GET /api/study-plans`
- `POST /api/study-plans`
- `GET /api/study-plans/{plan_id}`
- `PATCH /api/study-plans/{plan_id}`
- `DELETE /api/study-plans/{plan_id}`
- `POST /api/study-plans/generate`
- `PATCH /api/study-tasks/{task_id}`

Analytics:

- `GET /api/analytics/overview`
- `GET /api/analytics/topics`
- `GET /api/analytics/difficulty`
- `GET /api/analytics/consistency`
- `GET /api/analytics/readiness`

Notes:

- `GET /api/notes`
- `POST /api/notes`
- `GET /api/notes/{note_id}`
- `PATCH /api/notes/{note_id}`
- `DELETE /api/notes/{note_id}`

Resources:

- `GET /api/resources`
- `POST /api/resources`
- `GET /api/resources/{resource_id}`
- `PATCH /api/resources/{resource_id}`
- `DELETE /api/resources/{resource_id}`

Mock interviews:

- `GET /api/mock-interviews`
- `POST /api/mock-interviews`
- `PATCH /api/mock-interviews/{mock_interview_id}`
- `DELETE /api/mock-interviews/{mock_interview_id}`

Contests:

- `GET /api/contests`
- `POST /api/contests`
- `PATCH /api/contests/{contest_id}`
- `DELETE /api/contests/{contest_id}`

Notifications:

- `GET /api/notifications`
- `POST /api/notifications/{notification_id}/read`

## 10. UX and UI Requirements

## 10.1 Design Principles

The application should feel:

- Focused.
- Modern.
- Motivating.
- Calm and organized.
- Data-rich without being overwhelming.

## 10.2 Navigation

Primary navigation should include:

- Dashboard.
- Roadmap.
- Problems.
- Planner.
- Analytics.
- Notes.
- Resources.
- Revisions, Phase 2.
- Contests, Phase 2.
- Mock Interviews, Phase 2.

Requirements:

- Desktop should use a sidebar or top navigation.
- Mobile should use a compact navigation pattern.
- Active section should be clearly visible.

## 10.3 Dashboard UX

Dashboard must prioritize:

- Today's tasks.
- Current progress.
- Upcoming revisions.
- Weak areas.
- Streak and goals.

New users should see onboarding-oriented empty states instead of blank charts.

## 10.4 Forms

Forms must include:

- Required field indicators.
- Inline validation.
- Clear submit and cancel actions.
- Loading states.
- Error states.
- Success feedback.

## 10.5 Accessibility UX

UI components must support:

- Keyboard navigation.
- Visible focus indicators.
- Screen reader labels.
- Sufficient contrast.
- Reduced motion preference where applicable.

## 11. Analytics and Calculation Requirements

## 11.1 Topic Completion

Topic completion may be calculated as:

```text
topic_completion = completed_topic_items / total_topic_items
```

The exact formula can include:

- Recommended problems solved.
- Resources completed.
- Subtopics marked complete.
- Revisions completed.

## 11.2 Interview Readiness Score

Initial formula recommendation:

```text
readiness_score =
  0.30 * roadmap_completion +
  0.25 * topic_coverage +
  0.20 * revision_success +
  0.15 * consistency_score +
  0.10 * mock_interview_score
```

If mock interview data is missing, the score should either:

- Reweight available signals, or
- Display an incomplete score explanation.

## 11.3 Consistency Score

Consistency score should consider:

- Study days completed in the last 7 days.
- Study days completed in the last 30 days.
- Current streak.
- Weekly goal completion.

## 11.4 Weak Topic Ranking

Weak topics should be ranked using:

- Low confidence.
- High average solve time.
- Failed revisions.
- High hint usage.
- Low solve count.
- Recent inactivity.

## 12. Testing Requirements

## 12.1 Frontend Testing

The frontend should include:

- Component tests for reusable UI components.
- Feature tests for forms and dashboards.
- Route protection tests.
- Accessibility checks for core pages.

Recommended tools:

- Vitest.
- React Testing Library.
- Playwright for end-to-end tests.

## 12.2 Backend Testing

The backend should include:

- Unit tests for services.
- API tests for routes.
- Database tests for models and migrations.
- Authorization tests to prevent cross-user data access.
- Background job tests for revision scheduling.

Recommended tools:

- Pytest.
- HTTPX test client.
- Factory Boy or equivalent.

## 12.3 Critical Test Cases

Critical flows to test:

- User signup and onboarding.
- Add, edit, delete problem.
- Mark problem solved and generate revisions.
- Complete revision and update next schedule.
- Generate daily study plan.
- Complete daily tasks.
- Dashboard metrics update after problem changes.
- Analytics correctly aggregate problem data.
- User cannot access another user's data.

## 13. Deployment and Environment Requirements

## 13.1 Environments

The project should support:

- Local development.
- Preview or staging.
- Production.

## 13.2 Environment Variables

Expected frontend variables:

- `VITE_API_BASE_URL`
- `VITE_AUTH_PUBLIC_KEY`

Expected backend variables:

- `DATABASE_URL`
- `REDIS_URL`
- `AUTH_SECRET`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `CORS_ALLOWED_ORIGINS`
- `CLOUD_STORAGE_URL`
- `AI_PROVIDER_API_KEY`, future.

## 13.3 CI/CD

The project should eventually include CI checks for:

- Frontend lint.
- Frontend type check.
- Frontend tests.
- Backend lint.
- Backend tests.
- Database migration validation.

## 14. Risks and Assumptions

## 14.1 Risks

Key risks:

- Scope may become too large for MVP.
- Analytics and AI features may require more data than early users have.
- Manual problem tracking may feel tedious.
- Revision scheduling can become noisy if not prioritized well.
- Dashboard can become cluttered if too many metrics are shown.
- Third-party auth and deployment services may add integration complexity.

## 14.2 Mitigations

Mitigation strategies:

- Keep MVP focused on dashboard, roadmap, tracker, planner, notes, and resources.
- Use strong empty states for new users.
- Make problem entry fast with reusable defaults and templates.
- Introduce AI and advanced analytics only after core data model is stable.
- Keep dashboard customizable or prioritized.
- Build APIs with clear ownership checks from the start.

## 14.3 Assumptions

Assumptions:

- Users are willing to manually track at least some problem-solving activity.
- OAuth authentication is preferred over building custom auth from scratch.
- PostgreSQL is sufficient for the primary relational data model.
- Redis and background jobs will be added once revision and notification features mature.
- AI features are future-facing and do not block the MVP.

## 15. MVP Acceptance Criteria

The MVP is complete when:

- A user can sign up, sign in, and complete onboarding.
- A user can view a personalized dashboard.
- A user can browse the DSA roadmap.
- A user can add, edit, filter, and delete coding problems.
- Problem data updates dashboard and analytics metrics.
- A user can create daily and weekly study plans.
- A user can create and edit Markdown notes.
- A user can save and organize resources.
- The application is responsive on desktop and mobile.
- Protected routes and APIs require authentication.
- Core backend APIs are tested.
- The app can be deployed with documented environment variables.

## 16. Suggested Delivery Milestones

### Milestone 1: Project Foundation

Deliverables:

- Frontend Vite React TypeScript app.
- Backend FastAPI app.
- PostgreSQL connection.
- Basic CI checks.
- Shared environment documentation.

### Milestone 2: Authentication and Onboarding

Deliverables:

- Auth provider integration.
- Protected frontend routes.
- Backend auth verification.
- User profile model.
- Onboarding flow.

### Milestone 3: Problem Tracker and Roadmap

Deliverables:

- Roadmap topic model and UI.
- Problem CRUD APIs.
- Problem tracker UI.
- Filtering and search.
- Topic progress calculation.

### Milestone 4: Dashboard and Basic Analytics

Deliverables:

- Dashboard summary cards.
- Basic charts.
- Activity timeline.
- Topic and difficulty analytics.
- Empty states.

### Milestone 5: Planner, Notes, and Resources

Deliverables:

- Study plan CRUD.
- Study task completion.
- Markdown notes.
- Resource library.
- Dashboard integration.

### Milestone 6: Revision and Gamification

Deliverables:

- Revision scheduling.
- Revision completion flow.
- XP events.
- Levels.
- Streaks.
- Achievements.

### Milestone 7: Mock Interviews and Contests

Deliverables:

- Mock interview tracking.
- Contest tracking.
- Performance trend charts.
- Readiness score improvements.

### Milestone 8: AI Features

Deliverables:

- AI-generated study recommendations.
- AI daily summary.
- AI weakness analysis.
- AI mock interview prototype.

## 17. Open Questions

Questions to decide before implementation:

- Should the first version use Clerk or Auth.js?
- Should roadmap content be global, user-customizable, or both?
- Should LeetCode import/sync be included later?
- Should problem templates be seeded from a standard sheet such as Blind 75, NeetCode 150, or Striver A2Z?
- Should AI features use OpenAI, Azure OpenAI, or another provider?
- Should users be able to make notes and resources public?
- Should gamification be private-only in MVP?
- Should the app include a landing page or start directly with auth and dashboard?

## 18. Recommended MVP Feature Priority

Priority 0, foundation:

- Authentication.
- User profile.
- Database schema.
- Protected routing.

Priority 1, core value:

- Dashboard.
- Problem tracker.
- DSA roadmap.
- Basic analytics.

Priority 2, learning organization:

- Study planner.
- Notes.
- Resource library.

Priority 3, retention:

- Revision engine.
- Streaks.
- XP and levels.

Priority 4, advanced preparation:

- Mock interviews.
- Contest tracker.
- AI coach.

## 19. Definition of Done

A feature is considered done when:

- It satisfies the functional requirements and acceptance criteria.
- It has responsive UI behavior.
- It handles loading, empty, error, and success states.
- It validates user input.
- It enforces authenticated user ownership.
- It has relevant frontend or backend tests.
- It is documented where needed.
- It does not introduce known accessibility regressions.
- It can be deployed without manual code changes.
