'use client';

import React, { Suspense } from 'react';
import { AIDashboard } from '@/components/AIDashboard';
import { FloatingAIAssistant } from '@/components/FloatingAIAssistant';

export default function AIDashboardPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <AIDashboard />
      <FloatingAIAssistant />
    </div>
  );
}
