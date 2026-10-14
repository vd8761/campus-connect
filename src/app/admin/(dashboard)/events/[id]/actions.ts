'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { parseInputDateToUtcNoon, to12HourTime } from '@/lib/dateUtils';

export async function updateEventAction(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const type = formData.get('type') as string;
  const city = formData.get('city') as string;
  const venue = formData.get('venue') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const registrationOpen = formData.get('registrationOpen') as string;
  const registrationClose = formData.get('registrationClose') as string;
  const maxCapacity = formData.get('maxCapacity') as string;
  const startTime = formData.get('startTime') as string;
  const endTime = formData.get('endTime') as string;
  const shortDescription = formData.get('shortDescription') as string;
  const fullDescription = formData.get('fullDescription') as string;
  const whatToExpect = formData.get('whatToExpect') as string;
  const bannerUrl = formData.get('bannerUrl') as string;

  const universityIds = formData.getAll('universityIds') as string[];

  const parsedStartDate = parseInputDateToUtcNoon(startDate) || new Date();
  const parsedEndDate = parseInputDateToUtcNoon(endDate) || parsedStartDate;

  await prisma.$transaction([
    prisma.universityEvent.deleteMany({
      where: { eventId: id }
    }),
    prisma.event.update({
      where: { id },
      data: {
        title,
        slug,
        type,
        city,
        venue: venue || null,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        startTime: startTime ? to12HourTime(startTime) : null,
        endTime: endTime ? to12HourTime(endTime) : null,
        shortDescription: shortDescription || null,
        fullDescription: fullDescription || null,
        whatToExpect: whatToExpect || null,
        bannerUrl: bannerUrl || null,
        registrationOpen: parseInputDateToUtcNoon(registrationOpen),
        registrationClose: parseInputDateToUtcNoon(registrationClose),
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : 0,
        universityEvents: {
          create: universityIds.map(uid => ({
            universityId: uid
          }))
        }
      }
    })
  ]);

  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
}
