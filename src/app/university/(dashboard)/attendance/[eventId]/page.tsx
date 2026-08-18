import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, School, Search } from 'lucide-react';
import { CheckInButton } from './CheckInButton';

export const dynamic = 'force-dynamic';

export default async function UniversityEventAttendancePage({ params }: { params: { eventId: string } }) {
  const { eventId } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user.universityId) {
    redirect('/admin/login');
  }

  const universityId = session.user.universityId;

  let event = null;
  let registrations: any[] = [];
  let visits: any[] = [];
  
  try {
    // Check if university is assigned to this event
    const uniEvent = await prisma.universityEvent.findUnique({
      where: {
        eventId_universityId: {
          eventId,
          universityId
        }
      },
      include: {
        event: true
      }
    });

    if (!uniEvent) {
      return notFound();
    }
    
    event = uniEvent.event;

    // Get all registrations for this event
    registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: {
        participant: {
          include: {
            organization: true
          }
        }
      },
      orderBy: {
        participant: {
          fullName: 'asc'
        }
      }
    });

    // Get visits for this university at this event
    visits = await prisma.boothVisit.findMany({
      where: {
        eventId,
        universityId
      }
    });
  } catch (error) {
    console.warn("Database connection failed on University Attendance page (Network blocked). Showing empty state.");
    event = { id: eventId, title: "Unknown Event (Offline)" };
  }

  // Create a map of participantId -> isPresent
  const presentMap = new Map();
  visits.forEach(visit => {
    presentMap.set(visit.participantId, visit.status === 'PRESENT');
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/university/attendance" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-navy mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to My Events
      </Link>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand-navy">{event.title}</h1>
          <p className="text-brand-muted mt-1">Mark student attendance at your booth.</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search student name..." 
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 text-brand-muted text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Student Name</th>
              <th className="px-6 py-4 font-medium">Gender</th>
              <th className="px-6 py-4 font-medium">School Name</th>
              <th className="px-6 py-4 font-medium text-right">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {registrations.length > 0 ? (
              registrations.map(reg => {
                const p = reg.participant;
                const isPresent = presentMap.get(p.id) || false;
                const schoolName = p.organization?.name || p.board || "Not Specified";
                
                return (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-navy flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-purple shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      {p.fullName}
                    </td>
                    <td className="px-6 py-4 text-brand-muted capitalize">
                      {p.gender || "Not Specified"}
                    </td>
                    <td className="px-6 py-4 text-brand-muted">
                      <div className="flex items-center gap-1.5 text-sm">
                        <School className="w-4 h-4 text-gray-400" />
                        <span className="truncate max-w-[200px] block" title={schoolName}>{schoolName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CheckInButton 
                        eventId={event.id}
                        participantId={p.id}
                        initialIsPresent={isPresent}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-brand-muted">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium text-brand-navy mb-1">No Students Registered</p>
                  <p className="text-sm">There are no students registered for this event yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Need to import Users for the empty state
import { Users } from 'lucide-react';
