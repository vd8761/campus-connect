import { UniversitySidebar } from '@/components/UniversitySidebar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function UniversityDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'UNIVERSITY_REP') {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-brand-navy">
      <UniversitySidebar />
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
