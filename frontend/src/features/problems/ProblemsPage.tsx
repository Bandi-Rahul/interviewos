import { useState } from 'react';
import { Plus, ExternalLink, Pencil, Trash2, Search, Code2 } from 'lucide-react';
import { useProblems, useCreateProblem, useUpdateProblem, useDeleteProblem } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, capitalize } from '@/lib/utils';
import type { Problem, Difficulty, ProblemStatus, Platform } from '@/types';

// ─── Options ─────────────────────────────────────────────────────────────────

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'attempted', label: 'Attempted' },
  { value: 'solved', label: 'Solved' },
  { value: 'needs_revision', label: 'Needs Revision' },
  { value: 'mastered', label: 'Mastered' },
];

const PLATFORM_OPTIONS = [
  { value: 'leetcode', label: 'LeetCode' },
  { value: 'hackerrank', label: 'HackerRank' },
  { value: 'codeforces', label: 'Codeforces' },
  { value: 'gfg', label: 'GeeksForGeeks' },
  { value: 'other', label: 'Other' },
];

// ─── Problem Form ─────────────────────────────────────────────────────────────

interface ProblemFormData {
  title: string;
  difficulty: Difficulty;
  platform: Platform;
  status: ProblemStatus;
  url: string;
  pattern: string;
  company_tags: string;
  time_taken_minutes: string;
  confidence_score: string;
  hint_used: boolean;
  notes: string;
}

const EMPTY_FORM: ProblemFormData = {
  title: '',
  difficulty: 'medium',
  platform: 'leetcode',
  status: 'solved',
  url: '',
  pattern: '',
  company_tags: '',
  time_taken_minutes: '',
  confidence_score: '3',
  hint_used: false,
  notes: '',
};

function ProblemForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: ProblemFormData;
  onSubmit: (data: ProblemFormData) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<ProblemFormData>(initial ?? EMPTY_FORM);

  const set = (key: keyof ProblemFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
      className="space-y-4"
    >
      <Input label="Title" required value={form.title} onChange={set('title')} placeholder="Two Sum" />

      <div className="grid grid-cols-2 gap-3">
        <Select label="Difficulty" required options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={set('difficulty')} />
        <Select label="Status" required options={STATUS_OPTIONS} value={form.status} onChange={set('status')} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Platform" options={PLATFORM_OPTIONS} value={form.platform} onChange={set('platform')} />
        <Input label="URL" type="url" value={form.url} onChange={set('url')} placeholder="https://leetcode.com/..." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Pattern" value={form.pattern} onChange={set('pattern')} placeholder="Sliding Window" />
        <Input label="Company Tags" value={form.company_tags} onChange={set('company_tags')} placeholder="Google, Meta" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Time Taken (min)" type="number" min="0" value={form.time_taken_minutes} onChange={set('time_taken_minutes')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Confidence <span className="text-gray-400 font-normal">(1–5)</span>
          </label>
          <input
            type="range" min="1" max="5" value={form.confidence_score}
            onChange={set('confidence_score')}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Shaky</span><span className="font-medium text-indigo-600">{form.confidence_score}</span><span>Solid</span>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" checked={form.hint_used} onChange={set('hint_used')} className="accent-indigo-600" />
        Used a hint
      </label>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={form.notes} onChange={set('notes')}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Key observations, approach, edge cases…"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={loading}>Save Problem</Button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useProblems({
    search: search || undefined,
    difficulty: filterDifficulty || undefined,
    status: filterStatus || undefined,
    page,
    page_size: 20,
  });

  const createMutation = useCreateProblem();
  const updateMutation = useUpdateProblem();
  const deleteMutation = useDeleteProblem();

  const formToPayload = (form: ProblemFormData) => ({
    title: form.title,
    difficulty: form.difficulty as Difficulty,
    platform: form.platform as Platform,
    status: form.status as ProblemStatus,
    url: form.url || undefined,
    pattern: form.pattern || undefined,
    company_tags: form.company_tags ? form.company_tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
    time_taken_minutes: form.time_taken_minutes ? Number(form.time_taken_minutes) : undefined,
    confidence_score: Number(form.confidence_score),
    hint_used: form.hint_used,
    notes: form.notes || undefined,
    date_solved: form.status === 'solved' || form.status === 'mastered' ? new Date().toISOString() : undefined,
  });

  const handleCreate = (form: ProblemFormData) => {
    createMutation.mutate(formToPayload(form), {
      onSuccess: () => setModalOpen(false),
    });
  };

  const handleUpdate = (form: ProblemFormData) => {
    if (!editingProblem) return;
    updateMutation.mutate(
      { id: editingProblem.id, data: formToPayload(form) },
      { onSuccess: () => setEditingProblem(null) }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, { onSuccess: () => setDeletingId(null) });
  };

  const editInitial = editingProblem
    ? {
        title: editingProblem.title,
        difficulty: editingProblem.difficulty,
        platform: editingProblem.platform,
        status: editingProblem.status,
        url: editingProblem.url ?? '',
        pattern: editingProblem.pattern ?? '',
        company_tags: editingProblem.company_tags.join(', '),
        time_taken_minutes: editingProblem.time_taken_minutes?.toString() ?? '',
        confidence_score: editingProblem.confidence_score.toString(),
        hint_used: editingProblem.hint_used,
        notes: editingProblem.notes ?? '',
      }
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Problem Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data?.total ?? 0} problems tracked
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Problem
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search problems…"
            className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
          />
        </div>
        <select
          value={filterDifficulty}
          onChange={(e) => { setFilterDifficulty(e.target.value); setPage(1); }}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading problems…</div>
        ) : !data?.items.length ? (
          <EmptyState
            icon={<Code2 size={48} />}
            title="No problems yet"
            description="Start tracking your coding practice by adding your first problem."
            action={
              <Button onClick={() => setModalOpen(true)}>
                <Plus size={14} /> Add your first problem
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500 w-8">#</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Problem</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Difficulty</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Platform</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Confidence</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Solved</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((p, idx) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{(page - 1) * 20 + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{p.title}</span>
                        {p.url && (
                          <a href={p.url} target="_blank" rel="noopener noreferrer"
                            className="text-gray-400 hover:text-indigo-600">
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      {p.pattern && <span className="text-xs text-gray-400">{p.pattern}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>
                        {capitalize(p.difficulty)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status as 'solved' | 'attempted' | 'not_started' | 'needs_revision' | 'mastered'}>
                        {capitalize(p.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{p.platform}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((n) => (
                          <div key={n} className={`w-2 h-2 rounded-full ${n <= p.confidence_score ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {p.date_solved ? formatDate(p.date_solved) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingProblem(p)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingId(p.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(data?.total ?? 0) > 20 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, data!.total)} of {data!.total}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={!data?.has_more} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Problem" size="lg">
        <ProblemForm onSubmit={handleCreate} loading={createMutation.isPending} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingProblem} onClose={() => setEditingProblem(null)} title="Edit Problem" size="lg">
        {editingProblem && (
          <ProblemForm initial={editInitial} onSubmit={handleUpdate} loading={updateMutation.isPending} />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Problem" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this problem? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => deletingId && handleDelete(deletingId)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
