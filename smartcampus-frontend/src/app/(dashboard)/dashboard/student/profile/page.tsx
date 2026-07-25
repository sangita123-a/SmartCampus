import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { StudentOwnProfilePage } from '@/components/students/StudentOwnProfilePage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default function StudentProfileRoute() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.STUDENT]}>
      <StudentOwnProfilePage />
    </DashboardLayoutShell>
  );
}
