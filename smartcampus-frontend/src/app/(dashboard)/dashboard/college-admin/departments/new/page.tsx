import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { AddDepartmentPage } from '@/components/departments/AddDepartmentPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Add Department',

};



export default function NewDepartmentPage() {

  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <AddDepartmentPage />

    </DashboardLayoutShell>

  );

}

