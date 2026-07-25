import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { SubjectListPage } from '@/components/subjects/SubjectListPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'My Subjects',
};

export default function FacultySubjectsPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.FACULTY]}>
      <SubjectListPage
        basePath="/dashboard/faculty/subjects"
        showAdminActions={false}
        showAcademicFilters
        title="My Subjects"
        description="Subjects assigned to you by your college admin."
      />
    </DashboardLayoutShell>
  );
}
