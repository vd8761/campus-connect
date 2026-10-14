import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopBar } from '@/components/AdminTopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  async function logout() {
    'use server'
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
  }

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <AdminSidebar onLogout={logout} />
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden bg-white">
        <AdminTopBar onLogout={logout} />
        <main className="flex-1 overflow-y-auto bg-slate-50/80">
          {children}
        </main>
      </div>
    </div>
  );
}
