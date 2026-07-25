import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { FacultyDetailsPage } from '@/components/faculty/FacultyDetailsPage';
import { Role } from '@/types/roles';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Faculty Details',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FacultyDetailsRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <FacultyDetailsPage facultyId={id} />
    </DashboardLayoutShell>
  );
}
