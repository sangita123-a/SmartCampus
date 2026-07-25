import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { CollegeAdminDashboardPage } from '@/components/dashboard/CollegeAdminDashboardPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'College Admin Dashboard',

};



export default function CollegeAdminPage() {

  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <CollegeAdminDashboardPage />

    </DashboardLayoutShell>

  );

}

