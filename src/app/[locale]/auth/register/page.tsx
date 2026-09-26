import { setRequestLocale } from 'next-intl/server';
import RegisterForm from './register-form';

export default async function RegisterPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <RegisterForm />;
}