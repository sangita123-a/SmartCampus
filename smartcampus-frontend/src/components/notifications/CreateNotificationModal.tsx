'use client';

import { useState } from 'react';
import { CreateNotificationPayload, NotificationPriority, NotificationType, TargetAudience } from '@/types/notification';
import { Send, X, Bell } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateNotificationPayload) => Promise<void>;
  isLoading?: boolean;
}

export function CreateNotificationModal({ isOpen, onClose, onSubmit, isLoading }: Props) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType>('ANNOUNCEMENT');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('ALL_USERS');
  const [targetId, setTargetId] = useState('');
  const [priority, setPriority] = useState<NotificationPriority>('MEDIUM');
  const [scheduledAt, setScheduledAt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      message,
      notificationType,
      targetAudience,
      targetId: targetId ? targetId : undefined,
      priority,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="text-lg font-bold text-[var(--foreground)] font-[family-name:var(--font-display)] flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal-600" /> Dispatch New Notification Broadcast
          </h3>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-rose-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Notification Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mid-Semester Exam Time Table Announcement"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Notification Type</label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value as NotificationType)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
              >
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="CIRCULAR">Circular</option>
                <option value="FEE_REMINDER">Fee Reminder</option>
                <option value="ATTENDANCE_ALERT">Attendance Alert</option>
                <option value="EXAM_NOTICE">Exam Notice</option>
                <option value="HOLIDAY_NOTICE">Holiday Notice</option>
                <option value="ASSIGNMENT_NOTICE">Assignment Notice</option>
                <option value="EMERGENCY_ALERT">Emergency Alert</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
              >
                <option value="ALL_USERS">All Users (Students, Faculty, Parents)</option>
                <option value="STUDENTS">Students Only</option>
                <option value="FACULTY">Faculty Only</option>
                <option value="PARENTS">Parents Only</option>
                <option value="COLLEGE_ADMIN">College Administrators</option>
                <option value="DEPARTMENT">Specific Department ID</option>
                <option value="COURSE">Specific Course ID</option>
                <option value="SEMESTER">Specific Semester ID</option>
                <option value="INDIVIDUAL_USER">Individual User ID</option>
              </select>
            </div>

            {['DEPARTMENT', 'COURSE', 'SEMESTER', 'INDIVIDUAL_USER'].includes(targetAudience) && (
              <div>
                <label className="font-semibold block mb-1">Target ID *</label>
                <input
                  type="text"
                  required
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="Enter Target ID"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs font-mono text-[var(--foreground)] outline-hidden focus:border-teal-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-1">Schedule Dispatch (Optional for future broadcast)</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Message Body *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write circular content or notification announcement body..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5 text-xs text-[var(--foreground)] outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {scheduledAt ? 'Schedule Dispatch' : 'Send Broadcast Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
