import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { AddCollegePage } from '@/components/colleges/AddCollegePage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Add College',
};

export default function NewCollegePage() {
  return (
    <DashboardLayoutShell allowedRoles={[Role.SUPER_ADMIN]}>
      <AddCollegePage />
    </DashboardLayoutShell>
  );
}
