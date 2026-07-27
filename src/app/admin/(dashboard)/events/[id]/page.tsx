import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EditEventForm } from './EditEventForm';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id }
  });

  if (!event) {
    notFound();
  }

  // Convert dates to string format expected by input[type=date]
  const serializeDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const serializedEvent = {
    ...event,
    startDate: serializeDate(event.startDate),
    endDate: serializeDate(event.endDate),
    registrationOpen: serializeDate(event.registrationOpen),
    registrationClose: serializeDate(event.registrationClose),
  };

  return <EditEventForm event={serializedEvent} />;
}
