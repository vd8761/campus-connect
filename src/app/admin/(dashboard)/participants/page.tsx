import prisma from '@/lib/prisma';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ParticipantsTable } from './ParticipantsTable';

export default async function AdminParticipants() {
  const registrations = await prisma.eventRegistration.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      participant: {
        include: { organization: true }
      },
      event: true 
    }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-navy">Participants</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <ParticipantsTable registrations={registrations} />
    </div>
  );
}
