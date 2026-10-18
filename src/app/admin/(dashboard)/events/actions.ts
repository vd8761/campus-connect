'use server';

import sql from '@/lib/neon';
import { revalidatePath } from 'next/cache';

export async function deleteEventAction(id: string) {
  try {
    // 1. Delete dependent booth visits
    await sql`DELETE FROM "BoothVisit" WHERE "eventId" = ${id}`;

    // 2. Delete university event associations
    await sql`DELETE FROM "UniversityEvent" WHERE "eventId" = ${id}`;

    // 3. Delete group registrations
    await sql`DELETE FROM "GroupRegistration" WHERE "eventId" = ${id}`;

    // 4. Delete event registrations
    await sql`DELETE FROM "EventRegistration" WHERE "eventId" = ${id}`;

    // 5. Delete event partners
    await sql`DELETE FROM "EventPartner" WHERE "eventId" = ${id}`;

    // 6. Delete FAQs
    await sql`DELETE FROM "Faq" WHERE "eventId" = ${id}`;

    // 7. Delete event agendas
    await sql`DELETE FROM "EventAgenda" WHERE "eventId" = ${id}`;

    // 8. Delete event speakers
    await sql`DELETE FROM "EventSpeaker" WHERE "eventId" = ${id}`;

    // 9. Delete Event
    await sql`DELETE FROM "Event" WHERE id = ${id}`;

    revalidatePath('/admin/events');
    revalidatePath('/admin');
    revalidatePath('/events');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Event Error:", error);
    return { error: error.message || "Failed to delete edition." };
  }
}

export async function getUniversitiesListAction() {
  try {
    const list = await sql`
      SELECT u.id, u.name, u.city, u.country, u."logoUrl", COUNT(c.id)::int as courses
      FROM "University" u
      LEFT JOIN "Course" c ON c."universityId" = u.id
      GROUP BY u.id, u.name, u.city, u.country, u."logoUrl"
      ORDER BY u.name ASC
    `;
    return list;
  } catch (error) {
    console.error("Get Universities Error:", error);
    return [];
  }
}
