import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { SemesterListPage } from '@/components/semesters/SemesterListPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Semesters',

};



export default function SemestersPage() {

  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <SemesterListPage />

    </DashboardLayoutShell>

  );

}

