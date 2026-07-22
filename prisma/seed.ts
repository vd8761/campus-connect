import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create Super Admin
  const adminPassword = 'nayira@2026'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@campusconnect.com' },
    update: {},
    create: {
      email: 'admin@campusconnect.com',
      passwordHash: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // Create sample events
  const event1 = await prisma.event.upsert({
    where: { slug: 'school-leaders-conclave-trichy-2026' },
    update: {},
    create: {
      slug: 'school-leaders-conclave-trichy-2026',
      title: 'School Leaders Conclave 2026',
      edition: 'Trichy Edition',
      type: 'School Leaders Conclave',
      shortDescription: 'A focused leadership conclave bringing together school principals, correspondents, academic leaders, universities and education-sector organizations to explore future readiness, institutional transformation and emerging opportunities in education.',
      fullDescription: 'Join us for a transformative day of insights and networking. Explore future readiness, institutional transformation, and emerging opportunities in education with leading experts.',
      city: 'Trichy',
      state: 'Tamil Nadu',
      venue: 'Grand Trichy Convention Center',
      venueAddress: '123 Main Road, Trichy, Tamil Nadu',
      startDate: new Date('2026-08-15T09:00:00Z'),
      endDate: new Date('2026-08-15T17:00:00Z'),
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      registrationOpen: new Date('2026-01-01T00:00:00Z'),
      registrationClose: new Date('2026-08-10T23:59:59Z'),
      maxCapacity: 500,
      status: 'OPEN',
      featured: true,
    },
  })
  console.log(`Created event: ${event1.title}`)

  const event2 = await prisma.event.upsert({
    where: { slug: 'university-fair-coimbatore-2026' },
    update: {},
    create: {
      slug: 'university-fair-coimbatore-2026',
      title: 'Campus Connect University Fair 2026',
      edition: 'Coimbatore Edition',
      type: 'University Fair',
      shortDescription: 'Connecting students and schools with top universities across India.',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      venue: 'Coimbatore Trade Centre',
      startDate: new Date('2026-09-20T10:00:00Z'),
      endDate: new Date('2026-09-21T18:00:00Z'),
      maxCapacity: 2000,
      status: 'OPENING_SOON',
    },
  })
  console.log(`Created event: ${event2.title}`)

  const event3 = await prisma.event.upsert({
    where: { slug: 'international-education-fair-chennai-2027' },
    update: {},
    create: {
      slug: 'international-education-fair-chennai-2027',
      title: 'Campus Connect International Education Fair 2027',
      edition: 'Chennai Edition',
      type: 'International University Fair',
      shortDescription: 'Explore global education opportunities with representatives from leading international universities.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      venue: 'Chennai Convention Center',
      startDate: new Date('2027-01-10T09:00:00Z'),
      endDate: new Date('2027-01-11T17:00:00Z'),
      maxCapacity: 5000,
      status: 'OPENING_SOON',
    },
  })
  console.log(`Created event: ${event3.title}`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
