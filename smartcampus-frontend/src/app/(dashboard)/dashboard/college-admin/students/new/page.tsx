import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { AddStudentPage } from '@/components/students/AddStudentPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Add Student',
};

export default function NewStudentPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <AddStudentPage />
    </DashboardLayoutShell>
  );
}
