import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EditEventForm } from './EditEventForm';
import { formatDateToInput } from '@/lib/dateUtils';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let event: any = null;
  try {
    event = await prisma.event.findUnique({
      where: { id },
      include: {
        universityEvents: true
      }
    });
  } catch (error) {
    console.warn("Database connection failed on Admin Event details page (Network blocked).");
  }

  if (!event) {
    notFound();
  }

  // Convert dates to string format expected by input[type=date]
  const serializeDate = (date: Date | null) => {
    if (!date) return '';
    return formatDateToInput(new Date(date));
  };

  const serializedEvent = {
    ...event,
    startDate: serializeDate(event.startDate),
    endDate: serializeDate(event.endDate),
    registrationOpen: serializeDate(event.registrationOpen),
    registrationClose: serializeDate(event.registrationClose),
    universityIds: event.universityEvents?.map((ue: any) => ue.universityId) || [],
  };

  return <EditEventForm event={serializedEvent} />;
}
