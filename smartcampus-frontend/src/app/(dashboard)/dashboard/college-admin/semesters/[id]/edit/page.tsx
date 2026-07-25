import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { EditSemesterPage } from '@/components/semesters/EditSemesterPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Edit Semester',

};



interface PageProps {

  params: Promise<{ id: string }>;

}



export default async function EditSemesterRoute({ params }: PageProps) {

  const { id } = await params;



  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <EditSemesterPage semesterId={id} />

    </DashboardLayoutShell>

  );

}

