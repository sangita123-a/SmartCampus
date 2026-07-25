import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { SubjectListPage } from '@/components/subjects/SubjectListPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Subjects',
};

export default function StudentSubjectsPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.STUDENT]}>
      <SubjectListPage
        basePath="/dashboard/student/subjects"
        showAdminActions={false}
        showAcademicFilters={false}
        title="Subjects"
        description="Active subjects for your course and semester."
      />
    </DashboardLayoutShell>
  );
}
