const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function deleteAnnaUniversity() {
  try {
    const unis = await sql`SELECT id, name FROM "University" WHERE name ILIKE '%anna%'`;
    console.log('Matching universities:', unis);

    for (const uni of unis) {
      console.log(`Deleting relations for ${uni.name} (${uni.id})...`);
      
      // 1. Delete Courses
      const delCourses = await sql`DELETE FROM "Course" WHERE "universityId" = ${uni.id} RETURNING id, name`;
      console.log(`Deleted ${delCourses.length} courses:`, delCourses.map(c => c.name));

      // 2. Delete Booth Visits
      const delVisits = await sql`DELETE FROM "BoothVisit" WHERE "universityId" = ${uni.id} RETURNING id`;
      console.log(`Deleted ${delVisits.length} booth visits`);

      // 3. Delete University Events
      const delEvents = await sql`DELETE FROM "UniversityEvent" WHERE "universityId" = ${uni.id} RETURNING id`;
      console.log(`Deleted ${delEvents.length} event links`);

      // 4. Delete Admin links if any
      const delAdmins = await sql`DELETE FROM "Admin" WHERE "universityId" = ${uni.id} RETURNING id`;
      console.log(`Deleted ${delAdmins.length} admin links`);

      // 5. Delete University
      await sql`DELETE FROM "University" WHERE id = ${uni.id}`;
      console.log(`Successfully deleted university ${uni.name} (${uni.id})!`);
    }

    // Verify remaining universities
    const remaining = await sql`SELECT count(*) as count FROM "University"`;
    const remainingCourses = await sql`SELECT count(*) as count FROM "Course"`;
    console.log(`Remaining Universities: ${remaining[0].count}, Remaining Courses: ${remainingCourses[0].count}`);
  } catch (err) {
    console.error("Error during deletion:", err);
  }
}

deleteAnnaUniversity();
