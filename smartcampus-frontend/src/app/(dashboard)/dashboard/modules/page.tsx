'use client';

import { DashboardLayoutShell } from '@/layouts/DashboardLayout';
import { ModulesPageContent } from '@/components/modules/ModulesPageContent';

export const runtime = 'edge';

export default function DashboardModulesPage() {
  return (
    <DashboardLayoutShell>
      <ModulesPageContent variant="dashboard" />
    </DashboardLayoutShell>
  );
}
