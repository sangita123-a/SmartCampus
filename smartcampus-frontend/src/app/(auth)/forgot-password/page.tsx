import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | SmartCampus',
  description: 'Reset your SmartCampus password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
