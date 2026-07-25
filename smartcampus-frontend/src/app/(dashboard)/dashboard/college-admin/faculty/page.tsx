import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { FacultyListPage } from '@/components/faculty/FacultyListPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Faculty',
};

export default function FacultyPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <FacultyListPage />
    </DashboardLayoutShell>
  );
}
