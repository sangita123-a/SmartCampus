import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { EditStudentPage } from '@/components/students/EditStudentPage';
import { Role } from '@/types/roles';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Edit Student',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStudentRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <EditStudentPage studentId={id} />
    </DashboardLayoutShell>
  );
}
