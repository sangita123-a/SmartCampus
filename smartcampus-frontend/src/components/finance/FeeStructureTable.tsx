'use client';

import { useState } from 'react';
import { FeeCategory, FeeStructure } from '@/types/finance';
import { useCreateFeeStructure, useDeleteFeeStructure, useGenerateStudentFees } from '@/hooks/useFinance';
import { Plus, Trash2, Users, Loader2, Calendar } from 'lucide-react';

interface DepartmentItem {
  id: string;
  name: string;
}

interface CourseItem {
  id: string;
  name: string;
}

interface SemesterItem {
  id: string;
  name: string;
  semesterNumber: number;
}

interface Props {
  structures: FeeStructure[];
  categories: FeeCategory[];
  departments: DepartmentItem[];
  courses: CourseItem[];
  semesters: SemesterItem[];
  isLoading?: boolean;
}

export function FeeStructureTable({
  structures,
  categories,
  departments,
  courses,
  semesters,
  isLoading,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [feeCategoryId, setFeeCategoryId] = useState('');
  const [amount, setAmount] = useState<number>(15000);
  const [dueDate, setDueDate] = useState('');
  const [lateFeePerDay, setLateFeePerDay] = useState<number>(50);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const createMutation = useCreateFeeStructure();
  const deleteMutation = useDeleteFeeStructure();
  const generateMutation = useGenerateStudentFees();

  const handleOpenAdd = () => {
    setDepartmentId(departments[0]?.id || '');
    setCourseId(courses[0]?.id || '');
    setSemesterId(semesters[0]?.id || '');
    setFeeCategoryId(categories[0]?.id || '');
    setAmount(15000);
    setDueDate(new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]);
    setLateFeePerDay(50);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    createMutation.mutate(
      {
        departmentId,
        courseId,
        semesterId,
        feeCategoryId,
        amount,
        dueDate,
        lateFeePerDay,
      },
      {
        onSuccess: () => setIsModalOpen(false),
        onError: (err: unknown) =>
          setErrorMessage((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create fee structure.'),
      }
    );
  };

  const handleGenerate = (structureId: string) => {
    setSuccessMsg(null);
    generateMutation.mutate(
      { feeStructureId: structureId },
      {
        onSuccess: (res) => {
          setSuccessMsg(res.message);
          setTimeout(() => setSuccessMsg(null), 5000);
        },
        onError: (err: unknown) => {
          alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate student fees.');
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-[var(--foreground)]">Fee Structures</h3>
          <p className="text-xs text-[var(--muted)]">Configure semester fee amounts, due dates, and late fine rules per course.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 shadow-xs"
        >
          <Plus className="h-4 w-4" /> Create Fee Structure
        </button>
      </div>

      {successMsg && (
        <div className="rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          {successMsg}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Course / Semester</th>
              <th className="px-4 py-3 text-right">Amount (₹)</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3 text-right">Fine/Day (₹)</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="h-12 bg-slate-50/50 dark:bg-slate-800/50" />
                </tr>
              ))
            ) : structures.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-[var(--muted)]">
                  No fee structures configured yet. Click Create Fee Structure to add one.
                </td>
              </tr>
            ) : (
              structures.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-[var(--foreground)]">{st.feeCategory?.name}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">{st.department?.name}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    {st.course?.name} ({st.semester?.name})
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-bold text-teal-700 dark:text-teal-400">
                    ₹{Number(st.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    {new Date(st.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-rose-600 dark:text-rose-400 font-semibold">
                    ₹{Number(st.lateFeePerDay).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleGenerate(st.id)}
                        disabled={generateMutation.isPending}
                        className="flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-teal-700 shadow-2xs"
                        title="Generate student fees for enrolled roster"
                      >
                        <Users className="h-3.5 w-3.5" /> Issue Fees
                      </button>
                      <button
                        onClick={() => handleDelete(st.id)}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[var(--foreground)]">Create New Fee Structure</h3>

            {errorMessage && (
              <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Fee Category *</label>
                <select
                  value={feeCategoryId}
                  onChange={(e) => setFeeCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Department *</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Course *</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Semester *</label>
                  <select
                    value={semesterId}
                    onChange={(e) => setSemesterId(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    {semesters.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Fee Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Due Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Late Fee / Day (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={lateFeePerDay}
                    onChange={(e) => setLateFeePerDay(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
