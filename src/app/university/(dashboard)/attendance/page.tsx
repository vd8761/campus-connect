import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Calendar, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function UniversityEventsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user.universityId) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: No University Profile linked to your account.
      </div>
    );
  }

  const universityId = session.user.universityId;
  let universityEvents: any[] = [];
  
  try {
    universityEvents = await prisma.universityEvent.findMany({
      where: { universityId },
      include: {
        event: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.warn("Database connection failed on University Events page (Network blocked). Showing empty state.");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-navy">My Events</h1>
        <p className="text-brand-muted mt-1">Select an event to view and check-in attendees at your booth.</p>
      </div>

      <div className="grid gap-4">
        {universityEvents.length > 0 ? (
          universityEvents.map((ue) => (
            <Link 
              href={`/university/attendance/${ue.eventId}`}
              key={ue.id} 
              className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-brand-navy group-hover:text-brand-purple transition-colors">{ue.event.title}</h3>
                  <div className="flex gap-3 text-sm text-brand-muted mt-1">
                    <span>{ue.event.startDate ? new Date(ue.event.startDate).toLocaleDateString() : 'Date TBA'}</span>
                    <span>•</span>
                    <span>{ue.event.city}</span>
                    {ue.boothNumber && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-brand-teal">Booth {ue.boothNumber}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-brand-purple bg-brand-purple/5 px-4 py-2 rounded-lg font-medium">
                <Users className="w-4 h-4" /> Check-in Students
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-brand-navy mb-1">No Events Found</h3>
            <p className="text-brand-muted text-sm max-w-sm mx-auto">Your university has not been assigned to any upcoming events yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
