import prisma from '@/lib/prisma';
import { ParticipantsTable } from './ParticipantsTable';

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-navy">Participants</h1>
      </div>

      <ParticipantsTable registrations={registrations} />
    </div>
  );
}
