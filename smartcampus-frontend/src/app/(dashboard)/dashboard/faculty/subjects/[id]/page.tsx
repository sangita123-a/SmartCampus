import type { Metadata } from 'next';
import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { SubjectDetailsPage } from '@/components/subjects/SubjectDetailsPage';
import { Role } from '@/types/roles';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Subject Details',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FacultySubjectDetailsRoute({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayoutShell allowedRoles={[Role.FACULTY]}>
      <SubjectDetailsPage
        subjectId={id}
        basePath="/dashboard/faculty/subjects"
        showAdminActions={false}
      />
    </DashboardLayoutShell>
  );
}
