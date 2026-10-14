const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function check() {
  try {
    const unis = await sql`
      SELECT u.id, u.name, u.city, u."logoUrl", COUNT(c.id) AS courses
      FROM "University" u
      LEFT JOIN "Course" c ON c."universityId" = u.id
      GROUP BY u.id, u.name, u.city, u."logoUrl"
      ORDER BY u.name ASC
    `;
    console.log(`Total Universities in Database: ${unis.length}`);
    unis.forEach((u, i) => {
      console.log(`${i + 1}. ${u.name} (${u.city}) - ${u.courses} courses, Logo: ${u.logoUrl ? 'YES' : 'NO'}`);
    });
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
}

check();
