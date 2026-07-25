import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { EditCollegePage } from '@/components/colleges/EditCollegePage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Edit College',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCollegeRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.SUPER_ADMIN]}>
      <EditCollegePage collegeId={id} />
    </DashboardLayoutShell>
  );
}
