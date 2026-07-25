import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { SubjectListPage } from '@/components/subjects/SubjectListPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Subjects',
};

export default function SubjectsPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <SubjectListPage />
    </DashboardLayoutShell>
  );
}
