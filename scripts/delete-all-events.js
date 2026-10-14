const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function deleteAllEvents() {
  try {
    const events = await sql`SELECT id, title, city, "startDate" FROM "Event"`;
    console.log(`Found ${events.length} existing Conclaves:`);
    events.forEach(e => console.log(`- ${e.title} (${e.city}) [${e.id}]`));

    if (events.length === 0) {
      console.log("No conclaves to delete.");
      return;
    }

    console.log("\nDeleting all dependent relations for all conclaves...");

    // 1. Delete Booth Visits linked to events
    const delVisits = await sql`DELETE FROM "BoothVisit" RETURNING id`;
    console.log(`Deleted ${delVisits.length} booth visits.`);

    // 2. Delete University Event associations
    const delUniEvents = await sql`DELETE FROM "UniversityEvent" RETURNING id`;
    console.log(`Deleted ${delUniEvents.length} university-event associations.`);

    // 3. Delete Group Registrations
    const delGroupRegs = await sql`DELETE FROM "GroupRegistration" RETURNING id`;
    console.log(`Deleted ${delGroupRegs.length} group registrations.`);

    // 4. Delete Event Registrations
    const delRegs = await sql`DELETE FROM "EventRegistration" RETURNING id`;
    console.log(`Deleted ${delRegs.length} event registrations.`);

    // 5. Delete Event Partners
    const delPartners = await sql`DELETE FROM "EventPartner" RETURNING id`;
    console.log(`Deleted ${delPartners.length} event partners.`);

    // 6. Delete Event FAQs
    const delFaqs = await sql`DELETE FROM "Faq" RETURNING id`;
    console.log(`Deleted ${delFaqs.length} FAQs.`);

    // 7. Delete Event Agendas
    const delAgendas = await sql`DELETE FROM "EventAgenda" RETURNING id`;
    console.log(`Deleted ${delAgendas.length} event agendas.`);

    // 8. Delete Event Speakers
    const delSpeakers = await sql`DELETE FROM "EventSpeaker" RETURNING id`;
    console.log(`Deleted ${delSpeakers.length} event speakers.`);

    // 9. Delete All Events
    const delEvents = await sql`DELETE FROM "Event" RETURNING id, title`;
    console.log(`\nSuccessfully deleted ${delEvents.length} Conclaves:`);
    delEvents.forEach(e => console.log(`- Deleted: ${e.title}`));

    // Verify
    const countCheck = await sql`SELECT count(*) as count FROM "Event"`;
    console.log(`\nRemaining Conclaves in database: ${countCheck[0].count}`);
  } catch (err) {
    console.error("Error deleting events:", err);
  }
}

deleteAllEvents();
