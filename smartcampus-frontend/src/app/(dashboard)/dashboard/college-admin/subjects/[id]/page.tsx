import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { SubjectDetailsPage } from '@/components/subjects/SubjectDetailsPage';
import { Role } from '@/types/roles';

export const metadata: Metadata = {
  title: 'Subject Details',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubjectDetailsRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>
      <SubjectDetailsPage subjectId={id} />
    </DashboardLayoutShell>
  );
}
