import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { CollegeDetailsPage } from '@/components/colleges/CollegeDetailsPage';
import { Role } from '@/types/roles';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'College Details',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollegeDetailsRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.SUPER_ADMIN]}>
      <CollegeDetailsPage collegeId={id} />
    </DashboardLayoutShell>
  );
}
