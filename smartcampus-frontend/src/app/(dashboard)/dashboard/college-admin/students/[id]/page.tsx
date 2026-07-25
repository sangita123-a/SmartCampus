import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { StudentDetailsPage } from '@/components/students/StudentDetailsPage';
import { Role } from '@/types/roles';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Student Details',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailsRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <StudentDetailsPage studentId={id} />
    </DashboardLayoutShell>
  );
}
