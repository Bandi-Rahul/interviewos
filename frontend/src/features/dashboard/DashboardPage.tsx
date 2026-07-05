import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar,
} from 'recharts';
import { Flame, RefreshCcw, Target, BookOpen, Code2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardSummary, useTodayTasks, useRevisions } from '@/hooks/useApi';
import { StatCard } from '@/components/ui/StatCard';
import { formatRelativeDate } from '@/lib/utils';

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
};

const RADAR_TOPICS = [
  { topic: 'Arrays', score: 80 },
  { topic: 'Trees', score: 55 },
  { topic: 'DP', score: 30 },
  { topic: 'Graphs', score: 45 },
  { topic: 'Strings', score: 70 },
  { topic: 'Greedy', score: 60 },
];

const ACTIVITY_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  solved: Math.floor(Math.random() * 5),
}));

function ReadinessRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} stroke="#e5e7eb" strokeWidth="10" fill="none" />
          <circle
            cx="70" cy="70" r={radius} stroke="#6366f1" strokeWidth="10" fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600">Interview Readiness</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: todayData, isLoading: todayLoading } = useTodayTasks();
  const { data: revisions } = useRevisions({ completed: false });

  const difficultyPieData = summary
    ? [
        { name: 'Easy', value: summary.easy_solved ?? 0, color: DIFFICULTY_COLORS.easy },
        { name: 'Medium', value: summary.medium_solved ?? 0, color: DIFFICULTY_COLORS.medium },
        { name: 'Hard', value: summary.hard_solved ?? 0, color: DIFFICULTY_COLORS.hard },
      ].filter((d) => d.value > 0)
    : [];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your interview preparation at a glance.</p>
      </div>

      {/* Stat cards */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <StatCard title="Problems Solved" value={summaryLoading ? '—' : (summary?.problems_solved ?? 0)}
            subtitle="all time" icon={<Code2 size={16} />} accent="indigo" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Current Streak" value={summaryLoading ? '—' : `${summary?.current_streak ?? 0}d`}
            subtitle={`Best: ${summary?.longest_streak ?? 0} days`} icon={<Flame size={16} />} accent="orange" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="XP" value={summaryLoading ? '—' : (summary?.current_xp ?? 0).toLocaleString()}
            subtitle={`Level ${summary?.current_level ?? 1}`} icon={<Zap size={16} />} accent="purple" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="Revisions Due" value={summaryLoading ? '—' : (summary?.upcoming_revisions_count ?? 0)}
            subtitle="need review" icon={<RefreshCcw size={16} />} accent="red" />
        </motion.div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Problems Solved — Last 14 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ACTIVITY_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="solved" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Readiness ring */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center">
          <ReadinessRing score={summary?.interview_readiness_score ?? 0} />
        </div>

        {/* Difficulty pie */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Difficulty Breakdown</h2>
          {difficultyPieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={difficultyPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {difficultyPieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {difficultyPieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm">No solved problems yet</div>
          )}
        </div>

        {/* Topic radar */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Topic Coverage</h2>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={RADAR_TOPICS} cx="50%" cy="50%" outerRadius={65}>
              <PolarGrid stroke="#f3f4f6" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10 }} />
              <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Today's tasks */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Target size={14} className="text-indigo-500" /> Today's Tasks
          </h2>
          {todayLoading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (todayData as { tasks?: Array<{ id: string; title: string; due_date: string }> })?.tasks?.length ? (
            <ul className="space-y-3">
              {(todayData as { tasks: Array<{ id: string; title: string; due_date: string }> }).tasks.map((task) => (
                <li key={task.id} className="flex items-start gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-400">{formatRelativeDate(task.due_date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">All caught up for today!</p>
          )}
        </div>
      </div>

      {/* Due revisions banner */}
      {(revisions?.length ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <RefreshCcw size={14} /> Revisions Due
          </h2>
          <div className="flex flex-wrap gap-2">
            {revisions?.slice(0, 8).map((r) => (
              <span key={r.id} className="text-xs bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-gray-700">
                {r.problem_title ?? 'Problem'} — <span className="text-amber-600">{formatRelativeDate(r.due_date)}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weekly bar chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <BookOpen size={14} className="text-indigo-500" /> Weekly Study Hours
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => ({ day: d, hours: +(Math.random() * 3).toFixed(1) }))}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="hours" fill="#818cf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
