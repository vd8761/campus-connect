'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

import { parseInputDateToUtcNoon, to12HourTime } from '@/lib/dateUtils';

export async function createEventAction(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const type = formData.get('type') as string;
  const city = formData.get('city') as string;
  const venue = formData.get('venue') as string;
  const startDateStr = formData.get('startDate') as string;
  const endDateStr = formData.get('endDate') as string;
  const registrationOpenStr = formData.get('registrationOpen') as string;
  const registrationCloseStr = formData.get('registrationClose') as string;
  const maxCapacity = parseInt(formData.get('maxCapacity') as string) || 0;

  const startTime = formData.get('startTime') as string;
  const endTime = formData.get('endTime') as string;
  const shortDescription = formData.get('shortDescription') as string;
  const fullDescription = formData.get('fullDescription') as string;
  const whatToExpect = formData.get('whatToExpect') as string;
  const bannerUrl = formData.get('bannerUrl') as string;

  const isDateTba = formData.get('isDateTba') === 'on' || formData.get('isDateTba') === 'true';
  const isVenueTba = formData.get('isVenueTba') === 'on' || formData.get('isVenueTba') === 'true';

  const universityIds = formData.getAll('universityIds') as string[];

  const parsedStartDate = parseInputDateToUtcNoon(startDateStr);
  const parsedEndDate = parseInputDateToUtcNoon(endDateStr) || parsedStartDate;

  if (!title || !slug || !type || !city) {
    throw new Error('Missing required fields');
  }

  if (!isDateTba && (!parsedStartDate || !parsedEndDate)) {
    throw new Error('Event dates are required unless marked as TBA');
  }

  // The dynamic status calculation treats "DRAFT" explicitly as DRAFT.
  // To allow automatic status, we will set it to "PUBLISHED" or similar so the helper uses dates.
  
  await prisma.event.create({
    data: {
      title,
      slug,
      type,
      city,
      venue: isVenueTba ? (venue || 'To Be Announced') : (venue || null),
      isDateTba,
      isVenueTba,
      startDate: parsedStartDate || null,
      endDate: parsedEndDate || null,
      startTime: startTime ? to12HourTime(startTime) : null,
      endTime: endTime ? to12HourTime(endTime) : null,
      shortDescription: shortDescription || null,
      fullDescription: fullDescription || null,
      whatToExpect: whatToExpect || null,
      bannerUrl: bannerUrl || null,
      registrationOpen: parseInputDateToUtcNoon(registrationOpenStr),
      registrationClose: parseInputDateToUtcNoon(registrationCloseStr),
      maxCapacity,
      status: 'PUBLISHED', 
      universityEvents: {
        create: universityIds.map(uid => ({
          universityId: uid
        }))
      }
    }
  });

  redirect('/admin/events');
}
