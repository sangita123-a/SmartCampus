import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { AddFacultyPage } from '@/components/faculty/AddFacultyPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Add Faculty',
};

export default function NewFacultyPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <AddFacultyPage />
    </DashboardLayoutShell>
  );
}
