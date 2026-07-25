import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { SemesterDetailsPage } from '@/components/semesters/SemesterDetailsPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Semester Details',

};



interface PageProps {

  params: Promise<{ id: string }>;

}



export default async function SemesterDetailsRoute({ params }: PageProps) {

  const { id } = await params;



  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <SemesterDetailsPage semesterId={id} />

    </DashboardLayoutShell>

  );

}

