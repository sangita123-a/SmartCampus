import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { EditFacultyPage } from '@/components/faculty/EditFacultyPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Edit Faculty',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFacultyRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <EditFacultyPage facultyId={id} />
    </DashboardLayoutShell>
  );
}
