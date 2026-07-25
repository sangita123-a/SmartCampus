import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register | SmartCampus',
  description: 'Create a SmartCampus account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
