import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { RoleDashboard } from '@/components/dashboard/RoleDashboard';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Student Dashboard',
};

export default function StudentDashboardPage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.STUDENT]}>
      <RoleDashboard
        title="Student Dashboard"
        description="Your personal academic workspace. Access is limited to your own dashboard."
      />
    </DashboardLayoutShell>
  );
}
