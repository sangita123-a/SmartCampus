'use client';

import { useState } from 'react';
import { useCreateQRSession } from '@/hooks/useAttendance';
import { QRSession } from '@/types/attendance';
import { QrCode, Timer, Copy, Check, Loader2 } from 'lucide-react';

interface Props {
  departmentId: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  facultyId: string;
  onClose: () => void;
}

export function QRSessionModal({
  departmentId,
  courseId,
  semesterId,
  subjectId,
  facultyId,
  onClose,
}: Props) {
  const [session, setSession] = useState<QRSession | null>(null);
  const [copied, setCopied] = useState(false);
  const createQRMutation = useCreateQRSession();

  const handleStartSession = () => {
    createQRMutation.mutate(
      {
        departmentId,
        courseId,
        semesterId,
        subjectId,
        facultyId,
        durationMinutes: 15,
      },
      {
        onSuccess: (res) => {
          setSession(res);
        },
      }
    );
  };

  const handleCopyCode = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-teal-600" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">Dynamic QR Attendance Session</h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Close
          </button>
        </div>

        <div className="my-6 text-center">
          {!session ? (
            <div className="space-y-4 py-4">
              <p className="text-xs text-[var(--muted)]">
                Generate a live 15-minute QR session. Students can scan this session code from their portal to instantly mark attendance.
              </p>
              <button
                onClick={handleStartSession}
                disabled={createQRMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-teal-700 disabled:opacity-50"
              >
                {createQRMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <QrCode className="h-4 w-4" />
                )}
                Generate Live QR Code
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-2xl border-4 border-dashed border-teal-500 bg-teal-50/50 dark:bg-teal-950/30">
                <QrCode className="h-20 w-20 text-teal-600 dark:text-teal-400" />
                <p className="mt-2 font-mono text-2xl font-black tracking-widest text-teal-900 dark:text-teal-200">
                  {session.sessionCode}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                <Timer className="h-4 w-4 animate-pulse" /> Valid until:{' '}
                {new Date(session.expiresAt).toLocaleTimeString()}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied to Clipboard' : 'Copy Session Code'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
