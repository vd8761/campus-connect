'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

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

  if (!title || !slug || !type || !city || !startDateStr || !endDateStr) {
    throw new Error('Missing required fields');
  }

  // The dynamic status calculation treats "DRAFT" explicitly as DRAFT.
  // To allow automatic status, we will set it to "PUBLISHED" or similar so the helper uses dates.
  
  await prisma.event.create({
    data: {
      title,
      slug,
      type,
      city,
      venue: venue || null,
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
      startTime: startTime || null,
      endTime: endTime || null,
      shortDescription: shortDescription || null,
      fullDescription: fullDescription || null,
      whatToExpect: whatToExpect || null,
      bannerUrl: bannerUrl || null,
      registrationOpen: registrationOpenStr ? new Date(registrationOpenStr) : null,
      registrationClose: registrationCloseStr ? new Date(registrationCloseStr) : null,
      maxCapacity,
      status: 'PUBLISHED', 
    }
  });

  redirect('/admin/events');
}
