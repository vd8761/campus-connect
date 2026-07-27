import prisma from '@/lib/prisma';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const eventsCount = await prisma.event.count();
  const registrationsCount = await prisma.eventRegistration.count();
  const recentRegistrations = await prisma.eventRegistration.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { 
      participant: true,
      event: true 
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-heading font-bold text-brand-navy mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-purple/10 text-brand-purple rounded-lg flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <div className="text-sm text-brand-muted font-medium">Total Events</div>
            <div className="text-2xl font-bold text-brand-navy">{eventsCount}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-turquoise/10 text-brand-turquoise rounded-lg flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <div className="text-sm text-brand-muted font-medium">Total Registrations</div>
            <div className="text-2xl font-bold text-brand-navy">{registrationsCount}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-sm text-brand-muted font-medium">System Status</div>
            <div className="text-2xl font-bold text-brand-navy">Online</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-border flex justify-between items-center">
          <h2 className="text-xl font-heading font-bold text-brand-navy">Recent Registrations</h2>
          <Link href="/admin/participants" className="text-brand-purple text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-brand-muted text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-navy">
                        {reg.participant.fullName}
                      </div>
                      <div className="text-sm text-brand-muted">{reg.participant.mobile}</div>
                    </td>
                    <td className="px-6 py-4 text-brand-muted">{reg.participant.email}</td>
                    <td className="px-6 py-4 text-brand-muted truncate max-w-[200px]">{reg.event.title}</td>
                    <td className="px-6 py-4 text-right text-brand-muted">
                        {new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-brand-muted">No registrations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
