'use server';

import sql from '@/lib/neon';
import { revalidatePath } from 'next/cache';

export async function createCourseAction(universityId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const level = formData.get('level') as string;
    const marginType = (formData.get('marginType') as string) || 'FIXED';
    const marginValue = parseFloat(formData.get('marginValue') as string);

    if (!name || !category || !level || isNaN(marginValue)) {
      return { error: "All fields are required and Margin Value must be a number." };
    }

    await sql`
      INSERT INTO "Course" (id, "universityId", name, category, level, "marginType", "marginValue")
      VALUES (gen_random_uuid(), ${universityId}, ${name}, ${category}, ${level}, ${marginType}, ${marginValue})
    `;

    revalidatePath(`/admin/universities/${universityId}/courses`);
    return { success: true };
  } catch (error: any) {
    console.error("Create Course Error:", error);
    return { error: error.message || "Failed to create course." };
  }
}

export async function deleteCourseAction(universityId: string, id: string) {
  try {
    await sql`DELETE FROM "Course" WHERE id = ${id}`;
    revalidatePath(`/admin/universities/${universityId}/courses`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete Course Error:", error);
    return { error: error.message || "Failed to delete course." };
  }
}
