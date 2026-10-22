import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Building2, MapPin, Calendar } from 'lucide-react';
import { BoothVisitClient } from '../BoothVisitClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    identifier?: string;
    mobile?: string;
    email?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    select: {
      id: true,
      title: true,
      city: true,
      slug: true,
    },
  });

  if (!event) {
    return {
      title: 'Fair Edition Not Found | Campus Square™',
    };
  }

  return {
    title: `Preferred Colleges & Fair Visit Plan | ${event.city} Edition | Campus Square™`,
    description: `Select the colleges and university booths you plan to visit at ${event.title} in ${event.city}, and download your tailored career pathway report.`,
    alternates: {
      canonical: `/booths/${event.id}`,
    },
  };
}

export default async function EditionBoothsPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const initialIdentifier = sParams.identifier || sParams.mobile || sParams.email || '';

  let event: any = null;
  let allEvents: any[] = [];

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
        isDateTba: true,
        isVenueTba: true,
        startDate: true,
        status: true,
        _count: {
          select: { universityEvents: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    allEvents = rawEvents.map((ev) => ({
      id: ev.id,
      title: ev.title,
      slug: ev.slug,
      city: ev.city,
      venue: ev.isVenueTba || !ev.venue ? `${ev.city} (Venue TBA)` : ev.venue,
      startDate: ev.startDate ? ev.startDate.toISOString() : null,
      status: ev.status,
      universitiesCount: ev._count.universityEvents,
    }));

    event = rawEvents.find((e) => e.slug === slug || e.id === slug);
  } catch (err) {
    console.error('Failed to load event for edition booth page:', err);
  }

  if (!event) {
    notFound();
  }

  const dateFormatted = event.isDateTba || !event.startDate
    ? 'Date To Be Announced (TBA)'
    : new Date(event.startDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  const venueFormatted = event.isVenueTba || !event.venue
    ? `${event.city} • Venue To Be Announced (TBA)`
    : event.venue;

  return (
    <div className="min-h-screen bg-[#FAF7FC] relative overflow-hidden">
      {/* Subtle Ambient Decorative Glowing Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-tr from-purple-200/40 via-purple-100/30 to-brand-turquoise/20 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute top-80 right-0 w-[400px] h-[400px] bg-indigo-100/30 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-purple-100/40 blur-[100px] pointer-events-none rounded-full" />

      {/* Breadcrumbs Banner */}
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-border/70 py-3 relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-xs sm:text-sm text-brand-muted">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-brand-purple transition-colors">Home</Link>
            <ChevronRight size={13} className="text-slate-400" />
            <Link href="/events" className="hover:text-brand-purple transition-colors">Events</Link>
            <ChevronRight size={13} className="text-slate-400" />
            <Link href={`/events/${event.slug}`} className="hover:text-brand-purple transition-colors font-semibold text-brand-navy truncate max-w-[180px] sm:max-w-none">
              {event.city} Edition
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-brand-purple font-bold">Colleges & Booths</span>
          </div>

          <Link
            href="/booths"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline"
          >
            <Building2 size={13} />
            <span>All Editions</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-24">
        {/* Edition Header Badge */}
        <div className="mb-6 bg-gradient-to-r from-purple-900 via-brand-purple to-indigo-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider mb-2 backdrop-blur-xs">
                <Building2 size={12} className="text-brand-turquoise" />
                <span>{event.city} Fair Edition</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-white/80 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-brand-turquoise" />
                  {dateFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-brand-turquoise" />
                  {venueFormatted}
                </span>
              </div>
            </div>

            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shrink-0 self-start sm:self-center"
            >
              View Fair Schedule →
            </Link>
          </div>
        </div>

        <BoothVisitClient
          initialIdentifier={initialIdentifier}
          initialEventId={event.id}
          availableEvents={allEvents}
          isEditionLocked={true}
        />
      </main>
    </div>
  );
}
