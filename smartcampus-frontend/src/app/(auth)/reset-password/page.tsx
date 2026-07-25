import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Loading } from '@/components/Loading';

export const metadata: Metadata = {
  title: 'Reset Password | SmartCampus',
  description: 'Set a new SmartCampus password',
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loading label="Loading..." fullScreen />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
