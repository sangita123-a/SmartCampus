import type { Metadata } from 'next';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';

import { AddCoursePage } from '@/components/courses/AddCoursePage';

import { Role } from '@/types/roles';



export const metadata: Metadata = {

  title: 'Add Course',

};



export default function NewCoursePage() {

  return (

    <DashboardLayoutShell allowedRoles={[Role.COLLEGE_ADMIN]}>

      <AddCoursePage />

    </DashboardLayoutShell>

  );

}

