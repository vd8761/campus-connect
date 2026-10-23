import prisma from '@/lib/prisma';
import { ParticipantsTable } from './ParticipantsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminParticipants() {
  let registrations: any[] = [];

  try {
    registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        participant: {
          include: { organization: true }
        },
        event: true 
      }
    });
  } catch (error) {
    console.warn("Database connection failed on Admin Participants page (Network blocked). Showing empty state.");
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-navy tracking-tight">
            Registered Delegates
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Complete registry of all registered students, delegates, and event attendees.
          </p>
        </div>
      </div>

      <ParticipantsTable registrations={registrations} />
    </div>
  );
}

