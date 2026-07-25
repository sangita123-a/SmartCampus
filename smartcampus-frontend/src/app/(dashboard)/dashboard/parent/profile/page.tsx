'use client';

import { useParentStudents } from '@/hooks/useParent';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function ParentProfilePage() {
  const { data: students = [] } = useParentStudents();
  const primaryChild = students[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
          Parent Account Profile
        </h1>
        <p className="text-xs text-[var(--muted)]">Manage primary guardian information, contact details, and linked student accounts.</p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-[var(--border)] pb-4">
          <div className="h-16 w-16 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center font-black text-2xl border-2 border-teal-500">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] font-[family-name:var(--font-display)]">
              {primaryChild?.guardianName || 'Parent Account'}
            </h2>
            <p className="text-xs text-[var(--muted)] flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verified Guardian Account
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <Mail className="h-5 w-5 text-[var(--muted)]" />
            <div>
              <span className="text-[11px] text-[var(--muted)] block">Guardian Email</span>
              <span className="font-semibold">{primaryChild?.guardianEmail || 'parent@smartcampus.edu'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <Phone className="h-5 w-5 text-[var(--muted)]" />
            <div>
              <span className="text-[11px] text-[var(--muted)] block">Emergency Contact Phone</span>
              <span className="font-semibold">{primaryChild?.guardianPhone || '+91 98765 43210'}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Linked Children Accounts</h3>
          <div className="space-y-2">
            {students.map((st) => (
              <div key={st.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                <div>
                  <p className="font-bold text-sm text-[var(--foreground)]">{st.firstName} {st.lastName}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {st.department?.name} • {st.course?.name} ({st.semester?.name})
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded dark:bg-teal-950/50">
                  {st.rollNumber}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
