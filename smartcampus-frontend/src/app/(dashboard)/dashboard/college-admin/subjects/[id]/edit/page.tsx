import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { EditSubjectPage } from '@/components/subjects/EditSubjectPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Edit Subject',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSubjectRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <EditSubjectPage subjectId={id} />
    </DashboardLayoutShell>
  );
}
