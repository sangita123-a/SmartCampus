import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { DepartmentListPage } from '@/components/departments/DepartmentListPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Departments',

};



export default function DepartmentsPage() {

  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <DepartmentListPage />

    </DashboardLayoutShell>

  );

}

