const { neon } = require('@neondatabase/serverless');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function seedTheniConclave() {
  try {
    console.log("Checking EventType and Universities...");
    const eventTypes = await sql`SELECT id, name FROM "EventType" WHERE name = 'University Fair' LIMIT 1`;
    const eventTypeId = eventTypes.length > 0 ? eventTypes[0].name : 'University Fair';

    const universities = await sql`SELECT id, name, city FROM "University" ORDER BY name ASC`;
    console.log(`Found ${universities.length} universities available for participation.`);

    const conclaveId = uuidv4();
    const title = 'University Fair 2026';
    const slug = 'university-fair-2026-theni';
    const city = 'Theni';
    const venue = 'The Little Kingdom School, Theni';
    
    // Saturday, 24 October 2026: 1:00 PM to 4:00 PM
    const startDate = new Date('2026-10-24T13:00:00.000Z');
    const endDate = new Date('2026-10-24T16:00:00.000Z');
    const registrationOpen = new Date('2026-10-01T00:00:00.000Z');
    const registrationClose = new Date('2026-10-24T16:00:00.000Z');
    const startTime = '1:00 PM';
    const endTime = '4:00 PM';

    const shortDescription = 'Official University Fair 2026 hosted at The Little Kingdom School, Theni. Connect directly with admissions representatives and deans from 19 premier Indian and global institutions.';
    const fullDescription = `<p>Welcome to <strong>University Fair 2026</strong> at <strong>The Little Kingdom School, Theni</strong>.</p>
<p>This exclusive educational summit brings together prospective students, parents, and school leaders for direct interaction with admissions officers and academic heads across 19 leading universities and professional institutes.</p>
<h3>Key Highlights</h3>
<ul>
  <li>Direct one-on-one admissions counseling for undergraduate and postgraduate degree courses.</li>
  <li>Origin BI DISC Psychometric Assessment mapping to tailor career pathways with optimal course choices.</li>
  <li>Comprehensive guidance on engineering, architecture, commerce, business management, emerging technologies, and global study options.</li>
  <li>Scholarship opportunities, entrance examination briefings, and spot application guidance.</li>
</ul>`;

    const whatToExpect = `<ul>
  <li>One-on-one sessions with university deans and admissions counselors across 19 top institutions.</li>
  <li>Live DISC Career & Psychometric profile assessment analysis.</li>
  <li>Detailed course curriculum brochures, fee structures, and campus facility guides.</li>
  <li>Spot scholarship evaluations and registration guidance for 2027/2028 academic admissions.</li>
</ul>`;

    // 1. Insert Event
    await sql`
      INSERT INTO "Event" (
        id, title, slug, type, city, venue, "startDate", "endDate", "startTime", "endTime",
        "shortDescription", "fullDescription", "whatToExpect",
        "registrationOpen", "registrationClose", "maxCapacity", status,
        "bannerUrl", "createdAt", "updatedAt"
      )
      VALUES (
        ${conclaveId}, ${title}, ${slug}, ${eventTypeId}, ${city}, ${venue}, ${startDate}, ${endDate}, ${startTime}, ${endTime},
        ${shortDescription}, ${fullDescription}, ${whatToExpect},
        ${registrationOpen}, ${registrationClose}, 500, 'OPEN',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
        NOW(), NOW()
      )
    `;
    console.log(`Created Conclave: ${title} (${conclaveId})`);

    // 2. Link all 19 universities via UniversityEvent
    let linkedCount = 0;
    for (let i = 0; i < universities.length; i++) {
      const u = universities[i];
      const ueId = uuidv4();
      const boothNumber = `Booth #${i + 1}`;
      await sql`
        INSERT INTO "UniversityEvent" (id, "eventId", "universityId", "boothNumber", "createdAt")
        VALUES (${ueId}, ${conclaveId}, ${u.id}, ${boothNumber}, NOW())
      `;
      linkedCount++;
    }

    console.log(`Successfully linked all ${linkedCount} participating universities to ${title}!`);

    // 3. Link students to this event with booth visits and registrations so testing works seamlessly
    const participants = await sql`SELECT id, "fullName" FROM "Participant" LIMIT 3`;
    for (const p of participants) {
      const regId = uuidv4();
      const regCode = 'CC-' + Math.floor(100000 + Math.random() * 900000);
      await sql`
        INSERT INTO "EventRegistration" (id, "registrationId", "eventId", "participantId", "secureToken", status, "createdAt", "updatedAt")
        VALUES (${regId}, ${regCode}, ${conclaveId}, ${p.id}, ${uuidv4()}, 'CONFIRMED', NOW(), NOW())
      `;

      // Add booth visits to 3 universities in this event
      for (let j = 0; j < Math.min(3, universities.length); j++) {
        const bvId = uuidv4();
        await sql`
          INSERT INTO "BoothVisit" (id, "eventId", "universityId", "participantId", status, "visitedAt", notes)
          VALUES (${bvId}, ${conclaveId}, ${universities[j].id}, ${p.id}, 'PRESENT', NOW(), 'Inquired about program eligibility and admissions')
        `;
      }
    }

    console.log(`Registered ${participants.length} delegates and populated booth visits for ${title}.`);
    console.log("Conclave setup finished successfully!");
  } catch (err) {
    console.error("Error seeding Theni conclave:", err);
  }
}

seedTheniConclave();
