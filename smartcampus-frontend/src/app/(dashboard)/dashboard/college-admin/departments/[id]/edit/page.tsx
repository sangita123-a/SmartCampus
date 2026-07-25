import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { EditDepartmentPage } from '@/components/departments/EditDepartmentPage';

import { Role } from '@/types/roles';



export const runtime = 'edge';

export const metadata: Metadata = {

  title: 'Edit Department',

};



interface PageProps {

  params: Promise<{ id: string }>;

}



export default async function EditDepartmentRoute({ params }: PageProps) {

  const { id } = await params;



  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <EditDepartmentPage departmentId={id} />

    </DashboardLayoutShell>

  );

}

