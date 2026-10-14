const { neon } = require('@neondatabase/serverless');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function seedAiData() {
  try {
    console.log("Checking existing events and universities...");
    const events = await sql`SELECT id, title, city FROM "Event" LIMIT 5`;
    const unis = await sql`SELECT id, name FROM "University" LIMIT 10`;
    const existingParticipants = await sql`SELECT id, "fullName", email, mobile FROM "Participant"`;

    console.log(`Found ${events.length} events, ${unis.length} universities, ${existingParticipants.length} participants.`);

    if (events.length === 0 || unis.length === 0) {
      console.log("No events or universities found. Skipping.");
      return;
    }

    const eventId = events[0].id;

    // Students to have in DB with realistic DISC profiles & booth visits
    const studentProfiles = [
      {
        fullName: 'Ariya',
        email: 'ariyappan@touchmarkdes.com',
        mobile: '+919856321774',
        gender: 'Male',
        stream: 'PCMB',
        currentStandard: '12th Standard',
        schoolLevel: 'HSC',
        board: 'State Board',
        disc: {
          scoreD: 25.0,
          scoreI: 45.0,
          scoreS: 18.0,
          scoreC: 12.0,
          primaryTrait: 'Influence',
          profileType: 'Influencer / Communicator'
        },
        uniIndexes: [0, 1, 2] // Amrita, SRM, SASTRA
      },
      {
        fullName: 'Kavya S.',
        email: 'kavya.s@example.com',
        mobile: '+919842104523',
        gender: 'Female',
        stream: 'Computer Science',
        currentStandard: '12th Standard',
        schoolLevel: 'HSC',
        board: 'CBSE',
        disc: {
          scoreD: 40.0,
          scoreI: 22.0,
          scoreS: 15.0,
          scoreC: 23.0,
          primaryTrait: 'Dominance',
          profileType: 'Captain / Driver'
        },
        uniIndexes: [1, 3, 4]
      },
      {
        fullName: 'Karthik Raja',
        email: 'karthik.raja@example.com',
        mobile: '+919789234561',
        gender: 'Male',
        stream: 'Pure Science',
        currentStandard: '12th Standard',
        schoolLevel: 'HSC',
        board: 'CBSE',
        disc: {
          scoreD: 12.0,
          scoreI: 16.0,
          scoreS: 28.0,
          scoreC: 44.0,
          primaryTrait: 'Compliance',
          profileType: 'Analyst / Thinker'
        },
        uniIndexes: [0, 2, 4]
      }
    ];

    for (const sp of studentProfiles) {
      // Find or insert participant
      let pId;
      const matched = existingParticipants.find(p => p.email === sp.email || p.fullName === sp.fullName);
      if (matched) {
        pId = matched.id;
        console.log(`Using existing participant: ${sp.fullName} (${pId})`);
      } else {
        pId = uuidv4();
        await sql`
          INSERT INTO "Participant" (id, "fullName", email, mobile, gender, stream, "currentStandard", "schoolLevel", board, country, category, "createdAt", "updatedAt")
          VALUES (${pId}, ${sp.fullName}, ${sp.email}, ${sp.mobile}, ${sp.gender}, ${sp.stream}, ${sp.currentStandard}, ${sp.schoolLevel}, ${sp.board}, 'India', 'Student', NOW(), NOW())
        `;
        console.log(`Created new participant: ${sp.fullName} (${pId})`);

        // Register for event
        const regId = uuidv4();
        const regCode = 'CC-' + Math.floor(100000 + Math.random() * 900000);
        await sql`
          INSERT INTO "EventRegistration" (id, "registrationId", "eventId", "participantId", "secureToken", status, "createdAt", "updatedAt")
          VALUES (${regId}, ${regCode}, ${eventId}, ${pId}, ${uuidv4()}, 'CONFIRMED', NOW(), NOW())
        `;
      }

      // Upsert Assessment Result
      const existingAssessment = await sql`SELECT id FROM "AssessmentResult" WHERE "participantId" = ${pId}`;
      if (existingAssessment.length > 0) {
        await sql`
          UPDATE "AssessmentResult"
          SET "scoreD" = ${sp.disc.scoreD}, "scoreI" = ${sp.disc.scoreI}, "scoreS" = ${sp.disc.scoreS}, "scoreC" = ${sp.disc.scoreC},
              "primaryTrait" = ${sp.disc.primaryTrait}, "profileType" = ${sp.disc.profileType}, "completedAt" = NOW()
          WHERE "participantId" = ${pId}
        `;
        console.log(`Updated Assessment for ${sp.fullName}`);
      } else {
        const assessId = uuidv4();
        await sql`
          INSERT INTO "AssessmentResult" (id, "participantId", "scoreD", "scoreI", "scoreS", "scoreC", "primaryTrait", "profileType", "completedAt")
          VALUES (${assessId}, ${pId}, ${sp.disc.scoreD}, ${sp.disc.scoreI}, ${sp.disc.scoreS}, ${sp.disc.scoreC}, ${sp.disc.primaryTrait}, ${sp.disc.profileType}, NOW())
        `;
        console.log(`Inserted Assessment for ${sp.fullName}`);
      }

      // Ensure Booth Visits
      for (const idx of sp.uniIndexes) {
        if (unis[idx]) {
          const uniId = unis[idx].id;
          const visitCheck = await sql`
            SELECT id FROM "BoothVisit"
            WHERE "eventId" = ${eventId} AND "universityId" = ${uniId} AND "participantId" = ${pId}
          `;
          if (visitCheck.length === 0) {
            const bvId = uuidv4();
            await sql`
              INSERT INTO "BoothVisit" (id, "eventId", "universityId", "participantId", status, "visitedAt", notes)
              VALUES (${bvId}, ${eventId}, ${uniId}, ${pId}, 'PRESENT', NOW(), 'Interested in engineering and technical programs')
            `;
            console.log(`Added booth visit for ${sp.fullName} at ${unis[idx].name}`);
          }
        }
      }
    }

    console.log("AI Demo seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding AI data:", err);
  }
}

seedAiData();
