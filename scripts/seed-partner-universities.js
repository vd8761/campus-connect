const { neon } = require('@neondatabase/serverless');
const { randomUUID } = require('crypto');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

const PARTNER_UNIVERSITIES_DATA = [
  {
    name: 'Indian Institute of Commerce Lakshya',
    city: 'Kochi',
    country: 'India',
    logoUrl: '/university/1. Indian Institute of Commerce Lakshya.webp',
    description: 'Premier Commerce & Professional Accounting Education',
    courses: [
      { name: 'B.Com Professional with ACCA', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 20000 },
      { name: 'CA Foundation & Intermediate Coaching', category: 'Commerce', level: 'Certification', marginType: 'FIXED', marginValue: 15000 },
      { name: 'Certified Management Accountant (CMA US)', category: 'Commerce', level: 'Certification', marginType: 'FIXED', marginValue: 18000 }
    ]
  },
  {
    name: 'Karpagam Academy of Higher Education',
    city: 'Coimbatore',
    country: 'India',
    logoUrl: '/university/2. Karpagam Academy of Higher Education.webp',
    description: 'Deemed to be University with NAAC A+ Accreditation',
    courses: [
      { name: 'B.Tech Computer Science & Engineering', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'B.Tech Artificial Intelligence & Data Science', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'MBA Business Analytics & Finance', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Sc Biotechnology', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 15000 }
    ]
  },
  {
    name: 'GOS Institution',
    city: 'Chennai',
    country: 'India',
    logoUrl: '/university/3. GOS Institution.webp',
    description: 'Excellence in Skill-based & Higher Education',
    courses: [
      { name: 'Diploma in Advanced AI & Machine Learning', category: 'Engineering', level: 'Diploma', marginType: 'FIXED', marginValue: 12000 },
      { name: 'Professional Certificate in Digital Marketing', category: 'Management', level: 'Certification', marginType: 'FIXED', marginValue: 10000 }
    ]
  },
  {
    name: 'Dr. Vishwanath Karad MIT World Peace University',
    city: 'Pune',
    country: 'India',
    logoUrl: '/university/4. MIT-WPU.webp',
    description: 'Pioneering Higher Education for Peace, Innovation & Tech',
    courses: [
      { name: 'B.Tech Computer Science & Engineering', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Tech Robotics & Automation', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MBA International Business', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'B.Des User Experience Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 30000 }
    ]
  },
  {
    name: 'Sunstone School of Technology & Management',
    city: 'Pan-India',
    country: 'India',
    logoUrl: '/university/5. Sunstone School of Technology & Management.webp',
    description: 'Career-Oriented Higher Education & Management Programs',
    courses: [
      { name: 'B.Tech with Sunstone Career Advantage', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'MBA with Global Immersion Program', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'BBA Digital Business', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 20000 }
    ]
  },
  {
    name: 'Sai University',
    city: 'Chennai',
    country: 'India',
    logoUrl: '/university/6. SAI University.webp',
    description: 'International University for Liberal Arts, Law & Computing',
    courses: [
      { name: 'B.Tech Computing & Data Science', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.A. (Hons) Liberal Arts & Humanities', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.A. LL.B. (Hons) Integrated Law', category: 'Law', level: 'UG', marginType: 'FIXED', marginValue: 30000 }
    ]
  },
  {
    name: 'Amity University',
    city: 'Coimbatore',
    country: 'India',
    logoUrl: '/university/7. Amity University.webp',
    description: 'Leading Research & Innovation Driven University',
    courses: [
      { name: 'B.Tech Computer Science & Engineering', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'MBA Dual Specialization', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'BBA International Business', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 25000 }
    ]
  },
  {
    name: 'Woxsen University',
    city: 'Hyderabad',
    country: 'India',
    logoUrl: '/university/8. Woxsen University.webp',
    description: 'Top Ranked Private University for Tech, Business & Design',
    courses: [
      { name: 'B.Tech Computer Science & AI', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'MBA Business Analytics & AI', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Des Product & Industrial Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'BBA E-Commerce & Digital Marketing', category: 'Management', level: 'UG', marginType: 'FIXED', marginValue: 30000 }
    ]
  },
  {
    name: 'PSG Institute of Advanced Studies',
    city: 'Coimbatore',
    country: 'India',
    logoUrl: '/university/9. PSG Institute of Advanced Studies.webp',
    description: 'International Credit Transfer & Advanced Research',
    courses: [
      { name: 'International Credit Transfer B.S. Engineering', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'M.S. Data Analytics (Dual Degree)', category: 'Science', level: 'PG', marginType: 'FIXED', marginValue: 45000 }
    ]
  },
  {
    name: 'RV University',
    city: 'Bengaluru',
    country: 'India',
    logoUrl: '/university/10. RV University.webp',
    description: 'New-Age Global University for Liberal Arts, Design & Tech',
    courses: [
      { name: 'B.Tech Computer Science & Design', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Des Communication & Interactive Media', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Sc (Hons) Psychology & Neuroscience', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 25000 }
    ]
  },
  {
    name: 'Strate School of Design',
    city: 'Bengaluru',
    country: 'India',
    logoUrl: '/university/11. Strate School of Design.webp',
    description: 'Premier French Design School in India',
    courses: [
      { name: 'B.Des Transportation & Mobility Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Des Product & Spatial Design', category: 'Design', level: 'UG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'M.Des Design Strategy & Innovation', category: 'Design', level: 'PG', marginType: 'FIXED', marginValue: 50000 }
    ]
  },
  {
    name: 'Shiv Nadar University Chennai',
    city: 'Chennai',
    country: 'India',
    logoUrl: '/university/12. Shiv Nadar University Chennai.webp',
    description: 'Leading Global Research-Led Institution',
    courses: [
      { name: 'B.Tech Computer Science (IoT & Cyber Security)', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Tech Artificial Intelligence & Data Science', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Com (Professional Accounting)', category: 'Commerce', level: 'UG', marginType: 'FIXED', marginValue: 25000 }
    ]
  },
  {
    name: 'Plaksha University',
    city: 'Mohali',
    country: 'India',
    logoUrl: '/university/13. Plaksha University.webp',
    description: 'Reimagining Tech Education & Future Research',
    courses: [
      { name: 'B.Tech Computer Science & Artificial Intelligence', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Tech Robotics & Cyber-Physical Systems', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 45000 },
      { name: 'B.Tech Biological Systems Engineering', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 40000 }
    ]
  },
  {
    name: 'PPG Group of Institutions',
    city: 'Coimbatore',
    country: 'India',
    logoUrl: '/university/14. PPG Group of Institutions.webp',
    description: 'Multi-disciplinary Higher Education & Healthcare',
    courses: [
      { name: 'B.Sc Nursing & Allied Health Sciences', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 20000 },
      { name: 'B.Tech Biomedical Engineering', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 25000 },
      { name: 'MBA Healthcare & Hospital Administration', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 25000 }
    ]
  },
  {
    name: 'Krea University',
    city: 'Sri City',
    country: 'India',
    logoUrl: '/university/15. Krea University.webp',
    description: 'Pioneering Interwoven Learning & Thought Leadership',
    courses: [
      { name: 'B.A. (Hons) Interwoven Arts & Humanities', category: 'Arts', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'B.Sc (Hons) Environmental Studies & Data', category: 'Science', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MBA at IFMR Graduate School of Business', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 40000 }
    ]
  },
  {
    name: 'I-Arch NATA-JEE (B.Arch) Institute',
    city: 'National',
    country: 'India',
    logoUrl: '/university/16. I-Arch NATA-JEE (B.Arch) Institute.webp',
    description: 'No. 1 Architecture & Design Entrance Academy',
    courses: [
      { name: 'Comprehensive B.Arch & NATA Masterclass', category: 'Design', level: 'Certification', marginType: 'FIXED', marginValue: 15000 },
      { name: 'JEE Paper 2 Architecture & Planning Prep', category: 'Design', level: 'Certification', marginType: 'FIXED', marginValue: 18000 }
    ]
  },
  {
    name: 'Vellore Institute of Technology (VIT)',
    city: 'Vellore',
    country: 'India',
    logoUrl: '/university/17. VIT University.webp',
    description: 'Institution of Eminence & Premier Engineering University',
    courses: [
      { name: 'B.Tech Computer Science & Engineering', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 40000 },
      { name: 'B.Tech Information Technology', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'M.Tech Software Engineering (Integrated 5 Years)', category: 'Engineering', level: 'PG', marginType: 'FIXED', marginValue: 35000 },
      { name: 'MBA Master of Business Administration', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 35000 }
    ]
  },
  {
    name: 'Amity University, Bangalore',
    city: 'Bengaluru',
    country: 'India',
    logoUrl: '/university/18. Amity University, Bangalore.webp',
    description: 'State-of-the-Art Global Campus in Tech Hub',
    courses: [
      { name: 'B.Tech Cloud Computing & DevOps', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'B.Tech Cyber Security & Digital Forensics', category: 'Engineering', level: 'UG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'MBA Fintech & Quantitative Finance', category: 'Management', level: 'PG', marginType: 'FIXED', marginValue: 35000 }
    ]
  },
  {
    name: 'Edwise International',
    city: 'Pan-India',
    country: 'India',
    logoUrl: '/university/19. Edwise-logo.webp',
    description: 'Overseas Education & Global Admissions Consultant',
    courses: [
      { name: 'Global University Admissions Counseling', category: 'Global Studies', level: 'Certification', marginType: 'FIXED', marginValue: 25000 },
      { name: 'UK & Australia Master’s Direct Pathway', category: 'Global Studies', level: 'PG', marginType: 'FIXED', marginValue: 30000 },
      { name: 'US STEM Program Placement & Visa Training', category: 'Global Studies', level: 'UG', marginType: 'FIXED', marginValue: 35000 }
    ]
  }
];

async function seedUniversities() {
  console.log("Starting Partner Universities & Courses synchronization...");
  let createdCount = 0;
  let updatedCount = 0;
  let coursesCount = 0;

  for (const uniData of PARTNER_UNIVERSITIES_DATA) {
    // Check if university already exists by name
    const existing = await sql`
      SELECT id, name FROM "University" 
      WHERE LOWER(name) = LOWER(${uniData.name})
      LIMIT 1
    `;

    let universityId;

    if (existing && existing.length > 0) {
      universityId = existing[0].id;
      // Update logoUrl and description if missing
      await sql`
        UPDATE "University"
        SET "logoUrl" = ${uniData.logoUrl},
            description = ${uniData.description},
            city = ${uniData.city},
            country = ${uniData.country},
            "updatedAt" = NOW()
        WHERE id = ${universityId}
      `;
      updatedCount++;
    } else {
      universityId = randomUUID();
      await sql`
        INSERT INTO "University" (id, name, city, country, "logoUrl", description, "createdAt", "updatedAt")
        VALUES (${universityId}, ${uniData.name}, ${uniData.city}, ${uniData.country}, ${uniData.logoUrl}, ${uniData.description}, NOW(), NOW())
      `;
      createdCount++;
    }

    // Insert or update courses
    for (const c of uniData.courses) {
      const existingCourse = await sql`
        SELECT id FROM "Course"
        WHERE "universityId" = ${universityId} AND LOWER(name) = LOWER(${c.name})
        LIMIT 1
      `;

      if (!existingCourse || existingCourse.length === 0) {
        await sql`
          INSERT INTO "Course" (id, "universityId", name, category, level, "marginType", "marginValue", "isActive")
          VALUES (${randomUUID()}, ${universityId}, ${c.name}, ${c.category}, ${c.level}, ${c.marginType}, ${c.marginValue}, true)
        `;
        coursesCount++;
      }
    }
  }

  console.log(`Synchronization complete!`);
  console.log(`- Created ${createdCount} universities`);
  console.log(`- Updated ${updatedCount} existing universities`);
  console.log(`- Added ${coursesCount} courses across all partner institutions.`);
}

seedUniversities().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
