import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { AddSubjectPage } from '@/components/subjects/AddSubjectPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Add Subject',
};

export default function AddSubjectRoute() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <AddSubjectPage />
    </DashboardLayoutShell>
  );
}
