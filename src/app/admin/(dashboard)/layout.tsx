import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/AdminShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  async function logout() {
    'use server'
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
  }

  return (
    <AdminShell onLogout={logout}>
      {children}
    </AdminShell>
  );
}
