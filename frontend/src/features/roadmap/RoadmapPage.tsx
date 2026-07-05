import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapTopics } from '@/hooks/useApi';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn, capitalize } from '@/lib/utils';
import type { RoadmapTopic } from '@/types';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 size={18} className="text-green-500" />,
  in_progress: <Clock size={18} className="text-indigo-500" />,
  needs_revision: <Clock size={18} className="text-amber-500" />,
  not_started: <Circle size={18} className="text-gray-300" />,
};

function TopicCard({ topic }: { topic: RoadmapTopic }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          {STATUS_ICONS[topic.status]}
          <div>
            <p className="font-semibold text-gray-900">{topic.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">~{topic.estimated_hours}h estimated</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={topic.difficulty_level as 'easy' | 'medium' | 'hard'}>
            {capitalize(topic.difficulty_level)}
          </Badge>
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${topic.completion_percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-8">{topic.completion_percentage}%</span>
          </div>
          {open ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-gray-100 space-y-3">
              {topic.description && (
                <p className="text-sm text-gray-600">{topic.description}</p>
              )}
              <div className="sm:hidden flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${topic.completion_percentage}%` }} />
                </div>
                <span className="text-xs text-gray-400">{topic.completion_percentage}%</span>
              </div>
              <p className="text-xs text-gray-400">
                Status: <span className={cn(
                  'font-medium',
                  topic.status === 'completed' ? 'text-green-600' :
                  topic.status === 'in_progress' ? 'text-indigo-600' :
                  topic.status === 'needs_revision' ? 'text-amber-600' : 'text-gray-500'
                )}>{capitalize(topic.status)}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoadmapPage() {
  const { data: topics, isLoading } = useRoadmapTopics();

  const completed = topics?.filter((t) => t.status === 'completed').length ?? 0;
  const total = topics?.length ?? 0;
  const overallPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DSA Roadmap</h1>
          <p className="text-gray-500 text-sm mt-1">Your structured path through every core DSA topic.</p>
        </div>
        {total > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">{overallPct}%</p>
            <p className="text-xs text-gray-400">{completed}/{total} topics</p>
          </div>
        )}
      </div>

      {/* Overall progress bar */}
      {total > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className="text-gray-500">{completed} of {total} topics completed</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Topics list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : !topics?.length ? (
        <EmptyState
          icon={<Map size={48} />}
          title="Roadmap not loaded"
          description="The DSA roadmap topics will appear here once the backend is connected."
        />
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
        </div>
      )}
    </div>
  );
}
