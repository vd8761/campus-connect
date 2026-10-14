const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function testCoursesPage() {
  const r = await sql`SELECT id, name FROM "University" WHERE name ILIKE '%Karpagam%' LIMIT 1`;
  console.log("Testing university:", r[0].name, r[0].id);
  const res = await fetch(`http://localhost:3000/admin/universities/${r[0].id}/courses`);
  console.log("Courses page HTTP response status:", res.status);
}

testCoursesPage().catch(console.error);
