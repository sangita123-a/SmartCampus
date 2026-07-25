'use client';

import { useState } from 'react';
import { useScanQRAttendance } from '@/hooks/useAttendance';
import { QrCode, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  studentId: string;
  onClose: () => void;
}

export function QRScanModal({ studentId, onClose }: Props) {
  const [sessionCode, setSessionCode] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const scanMutation = useScanQRAttendance();

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionCode.trim()) return;

    scanMutation.mutate(
      {
        sessionCode: sessionCode.trim().toUpperCase(),
        studentId,
      },
      {
        onSuccess: (record) => {
          setSuccessMessage(`Attendance marked as PRESENT for ${record.subject?.subjectName || 'subject'}!`);
          setTimeout(() => {
            onClose();
          }, 2000);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-teal-600" />
            <h3 className="text-base font-semibold text-[var(--foreground)]">Scan QR Code Attendance</h3>
          </div>
          <button onClick={onClose} className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)]">
            Cancel
          </button>
        </div>

        <form onSubmit={handleScanSubmit} className="mt-6 space-y-4">
          <p className="text-xs text-[var(--muted)]">
            Scan or enter the 12-character Session Code displayed by your professor to record your attendance.
          </p>

          {successMessage ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              {successMessage}
            </div>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">QR Session Code *</label>
                <input
                  type="text"
                  placeholder="e.g. 4F8B2C9A1E"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                  className="w-full font-mono uppercase rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {scanMutation.isError && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  {(scanMutation.error as unknown as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid or expired QR code session.'}
                </div>
              )}

              <button
                type="submit"
                disabled={scanMutation.isPending || !sessionCode.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-teal-700 disabled:opacity-50"
              >
                {scanMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
                Confirm & Mark Attendance
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
