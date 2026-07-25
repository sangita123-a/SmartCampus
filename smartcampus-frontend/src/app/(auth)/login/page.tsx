import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | SmartCampus',
  description: 'Sign in to SmartCampus',
};

export default function LoginPage() {
  return <LoginForm />;
}
