import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/dashboard';
import { StatCard } from '@/components/ui/StatCard';
import { formatDuration } from '@/lib/utils';
import { TrendingUp, Clock, Lightbulb, Target } from 'lucide-react';

const TOPIC_DATA = [
  { topic: 'Arrays', solved: 24 },
  { topic: 'Trees', solved: 14 },
  { topic: 'DP', solved: 8 },
  { topic: 'Graphs', solved: 10 },
  { topic: 'Strings', solved: 18 },
  { topic: 'Greedy', solved: 12 },
  { topic: 'Heap', solved: 6 },
  { topic: 'Linked List', solved: 9 },
];

const READINESS_TREND = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  score: Math.min(100, 20 + i * 8 + Math.floor(Math.random() * 5)),
}));

export default function AnalyticsPage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsApi.getOverview,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Deep insights into your preparation progress.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Solved"
          value={isLoading ? '—' : (overview?.total_problems_solved ?? 0)}
          icon={<Target size={16} />}
          accent="indigo"
        />
        <StatCard
          title="Avg Solve Time"
          value={isLoading || !overview?.avg_solve_time_minutes ? '—' : formatDuration(Math.round(overview.avg_solve_time_minutes))}
          icon={<Clock size={16} />}
          accent="green"
        />
        <StatCard
          title="Hint Usage"
          value={isLoading ? '—' : `${Math.round((overview?.hint_usage_rate ?? 0) * 100)}%`}
          icon={<Lightbulb size={16} />}
          accent="orange"
        />
        <StatCard
          title="Revision Success"
          value={isLoading ? '—' : `${Math.round((overview?.revision_success_rate ?? 0) * 100)}%`}
          icon={<TrendingUp size={16} />}
          accent="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic bar chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Problems Solved by Topic</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={TOPIC_DATA} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Bar dataKey="solved" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Readiness trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Interview Readiness Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={READINESS_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`${v}/100`, 'Readiness']} />
              <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty pie */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Difficulty Distribution</h2>
          {overview ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Easy', value: overview.easy_solved, color: '#22c55e' },
                      { name: 'Medium', value: overview.medium_solved, color: '#f59e0b' },
                      { name: 'Hard', value: overview.hard_solved, color: '#ef4444' },
                    ].filter((d) => d.value > 0)}
                    cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {[
                      { name: 'Easy', value: overview.easy_solved, color: '#22c55e' },
                      { name: 'Medium', value: overview.medium_solved, color: '#f59e0b' },
                      { name: 'Hard', value: overview.hard_solved, color: '#ef4444' },
                    ].map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
        </div>

        {/* Consistency placeholder */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Study Consistency — Last 30 Days</h2>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const intensity = Math.floor(Math.random() * 5);
              const colors = ['bg-gray-100', 'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600'];
              return (
                <div
                  key={i}
                  title={`Day ${i + 1}`}
                  className={`aspect-square rounded-sm ${colors[intensity]}`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <span>Less</span>
            {['bg-gray-100','bg-indigo-100','bg-indigo-200','bg-indigo-400','bg-indigo-600'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
