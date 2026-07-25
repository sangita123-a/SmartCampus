'use client';

import { useState } from 'react';
import { Classroom, RoomType, ClassroomStatus } from '@/types/classroom';
import { useCreateClassroom, useDeleteClassroom, useUpdateClassroom } from '@/hooks/useClassroom';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';

interface Props {
  classrooms: Classroom[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  isLoading?: boolean;
}

export function ClassroomTable({
  classrooms,
  onSearchChange,
  isLoading,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  const [roomNumber, setRoomNumber] = useState('');
  const [roomName, setRoomName] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState(1);
  const [capacity, setCapacity] = useState(60);
  const [roomType, setRoomType] = useState<RoomType>('LECTURE_HALL');
  const [status, setStatus] = useState<ClassroomStatus>('AVAILABLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateClassroom();
  const updateMutation = useUpdateClassroom();
  const deleteMutation = useDeleteClassroom();

  const handleOpenAdd = () => {
    setEditingClassroom(null);
    setRoomNumber('');
    setRoomName('');
    setBuilding('');
    setFloor(1);
    setCapacity(60);
    setRoomType('LECTURE_HALL');
    setStatus('AVAILABLE');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cr: Classroom) => {
    setEditingClassroom(cr);
    setRoomNumber(cr.roomNumber);
    setRoomName(cr.roomName);
    setBuilding(cr.building);
    setFloor(cr.floor);
    setCapacity(cr.capacity);
    setRoomType(cr.roomType);
    setStatus(cr.status);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const payload = {
      roomNumber,
      roomName,
      building,
      floor,
      capacity,
      roomType,
      status,
    };

    if (editingClassroom) {
      updateMutation.mutate(
        { id: editingClassroom.id, data: payload },
        {
          onSuccess: () => setIsModalOpen(false),
          onError: (err: unknown) =>
            setErrorMessage(
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to update classroom.'
            ),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
        onError: (err: unknown) =>
          setErrorMessage(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Failed to create classroom.'
          ),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this classroom?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search room, building..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearchChange(e.target.value);
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Add Classroom
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Room Number</th>
              <th className="px-4 py-3">Room Name</th>
              <th className="px-4 py-3">Building</th>
              <th className="px-4 py-3">Floor</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Room Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="h-12 bg-slate-50/50 dark:bg-slate-800/50" />
                </tr>
              ))
            ) : classrooms.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-sm text-[var(--muted)]">
                  {"No classrooms found. Click 'Add Classroom' to create one."}
                </td>
              </tr>
            ) : (
              classrooms.map((cr) => (
                <tr key={cr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-mono text-xs font-bold">{cr.roomNumber}</td>
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{cr.roomName}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">{cr.building}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">Floor {cr.floor}</td>
                  <td className="px-4 py-3 text-xs font-semibold">{cr.capacity} seats</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {cr.roomType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        cr.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : cr.status === 'OCCUPIED'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {cr.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(cr)}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cr.id)}
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
          <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              {editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}
            </h3>

            {errorMessage && (
              <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Room Number *</label>
                <input
                  type="text"
                  placeholder="e.g. LH-101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Room Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Main Lecture Hall A"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Building *</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Block"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Floor *</label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(parseInt(e.target.value, 10))}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Capacity (Seats) *</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="LECTURE_HALL">LECTURE_HALL</option>
                    <option value="LABORATORY">LABORATORY</option>
                    <option value="SEMINAR_HALL">SEMINAR_HALL</option>
                    <option value="AUDITORIUM">AUDITORIUM</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ClassroomStatus)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
