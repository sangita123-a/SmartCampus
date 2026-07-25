import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { AddSemesterPage } from '@/components/semesters/AddSemesterPage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Add Semester',

};



export default function NewSemesterPage() {

  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <AddSemesterPage />

    </DashboardLayoutShell>

  );

}

