import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { BoothVisitClient } from './BoothVisitClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Plan & Record University Booth Visits | Campus Square™',
  description:
    'Choose your university fair edition, select the university booths you plan to visit, confirm your visits, and download your official 1-page visit report.',
  alternates: {
    canonical: '/booths',
  },
};

interface PageProps {
  searchParams: Promise<{
    identifier?: string;
    mobile?: string;
    email?: string;
    eventId?: string;
    event?: string;
  }>;
}

export default async function BoothsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialIdentifier = params.identifier || params.mobile || params.email || '';
  const initialEventId = params.eventId || params.event || '';

  let availableEvents: any[] = [];
  try {
    const rawEvents = await prisma.event.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        city: true,
        venue: true,
        startDate: true,
        status: true,
        _count: {
          select: { universityEvents: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    availableEvents = rawEvents.map((ev) => ({
      id: ev.id,
      title: ev.title,
      slug: ev.slug,
      city: ev.city,
      venue: ev.venue || ev.city,
      startDate: ev.startDate ? ev.startDate.toISOString() : null,
      status: ev.status,
      universitiesCount: ev._count.universityEvents,
    }));
  } catch (err) {
    console.error('Failed to load active events for booths page:', err);
  }

  return (
    <div className="min-h-screen bg-[#FAF7FC] relative overflow-hidden">
      {/* Subtle Ambient Decorative Glowing Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-tr from-purple-200/40 via-purple-100/30 to-brand-turquoise/20 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute top-80 right-0 w-[400px] h-[400px] bg-indigo-100/30 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-purple-100/40 blur-[100px] pointer-events-none rounded-full" />

      {/* Main Interactive Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24">
        <BoothVisitClient
          initialIdentifier={initialIdentifier}
          initialEventId={initialEventId}
          availableEvents={availableEvents}
        />
      </main>
    </div>
  );
}
