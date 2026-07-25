import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { FacultyOwnProfilePage } from '@/components/faculty/FacultyOwnProfilePage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default function FacultyProfileRoute() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.FACULTY]}>
      <FacultyOwnProfilePage />
    </DashboardLayoutShell>
  );
}
