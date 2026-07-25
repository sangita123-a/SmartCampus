import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { DepartmentDetailsPage } from '@/components/departments/DepartmentDetailsPage';

import { Role } from '@/types/roles';



export const runtime = 'edge';

export const metadata: Metadata = {

  title: 'Department Details',

};



interface PageProps {

  params: Promise<{ id: string }>;

}



export default async function DepartmentDetailsRoute({ params }: PageProps) {

  const { id } = await params;



  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <DepartmentDetailsPage departmentId={id} />

    </DashboardLayoutShell>

  );

}

