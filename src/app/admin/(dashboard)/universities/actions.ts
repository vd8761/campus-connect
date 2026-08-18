'use server';

import sql from '@/lib/neon';
import { revalidatePath } from 'next/cache';

export async function createUniversityAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const city = formData.get('city') as string;
    const country = (formData.get('country') as string) || 'India';

    if (!name) return { error: "University name is required." };

    await sql`
      INSERT INTO "University" (id, name, city, country)
      VALUES (gen_random_uuid(), ${name}, ${city}, ${country})
    `;

    revalidatePath('/admin/universities');
    return { success: true };
  } catch (error: any) {
    console.error("Create University Error:", error);
    return { error: error.message || "Failed to create university." };
  }
}

export async function deleteUniversityAction(id: string) {
  try {
    await sql`DELETE FROM "University" WHERE id = ${id}`;
    revalidatePath('/admin/universities');
    return { success: true };
  } catch (error: any) {
    console.error("Delete University Error:", error);
    return { error: error.message || "Failed to delete university." };
  }
}
