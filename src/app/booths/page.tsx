import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Building2, Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Choose Fair Edition | Preferred Colleges & Booths | Campus Square™',
  description:
    'Select your university fair edition to explore exhibiting colleges, customize your booth visit checklist, and receive your tailored career pathway report.',
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

export default async function BoothsHubPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialIdentifier = params.identifier || params.mobile || params.email || '';
  const initialEventParam = params.eventId || params.event || '';

  // 1. If an event slug or ID was supplied via query params, forward directly to its edition-specific URL
  if (initialEventParam) {
    const matched = await prisma.event.findFirst({
      where: {
        OR: [{ slug: initialEventParam }, { id: initialEventParam }],
      },
      select: { id: true },
    });

    if (matched) {
      const q = initialIdentifier ? `?identifier=${encodeURIComponent(initialIdentifier)}` : '';
      redirect(`/booths/${matched.id}${q}`);
    }
  }

  // 2. Fetch all active events
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
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
  } catch (err) {
    console.error('Failed to load events for booths hub:', err);
  }

  // CASE 1: Exactly 1 event exists -> Instant zero-friction redirect to its dedicated edition URL!
  if (events.length === 1) {
    const q = initialIdentifier ? `?identifier=${encodeURIComponent(initialIdentifier)}` : '';
    redirect(`/booths/${events[0].id}${q}`);
  }

  // CASE 2: No active events available
  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl text-center bg-white rounded-3xl p-8 sm:p-12 border border-brand-border/80 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-4 text-brand-purple">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy mb-3">
            No Active Fair Editions
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-8">
            There are no fair editions currently accepting booth visit planning. New school editions will be announced soon.
          </p>
          <Link href="/events">
            <Button variant="gradient" size="lg" className="rounded-xl">
              Explore Upcoming Editions & Dates
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // CASE 3: Multiple editions -> Render Multi-Edition Selector
  return (
    <div className="min-h-screen bg-[#FAF7FC] relative overflow-hidden py-14 px-4 sm:px-6 lg:px-8">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-tr from-purple-200/40 via-purple-100/30 to-brand-turquoise/20 blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute top-80 right-0 w-[400px] h-[400px] bg-indigo-100/30 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider mb-3 border border-brand-purple/15">
            <Building2 size={14} />
            <span>Select Your Fair Edition</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-navy mb-3">
            Choose Edition to Plan College Visits
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            Campus Square™ university fairs are hosted across regional school campuses. Select your edition to view participating university booths and plan your visit checklist:
          </p>
        </div>

        {/* Grid of Edition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {events.map((ev) => {
            const isDateTba = ev.isDateTba || !ev.startDate;
            const dateFormatted = isDateTba
              ? 'Date To Be Announced (TBA)'
              : new Date(ev.startDate).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

            const venueFormatted = ev.isVenueTba || !ev.venue
              ? `${ev.city} • Venue To Be Announced (TBA)`
              : ev.venue;

            const q = initialIdentifier ? `?identifier=${encodeURIComponent(initialIdentifier)}` : '';
            const targetUrl = `/booths/${ev.id}${q}`;

            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-purple/20 shadow-md hover:shadow-xl hover:border-brand-purple transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-brand-turquoise/20 text-brand-navy text-xs font-extrabold uppercase tracking-wider">
                      {ev.city} Edition
                    </span>
                    <span className="text-xs font-bold text-brand-purple bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {ev._count.universityEvents} Universities
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-brand-navy group-hover:text-brand-purple transition-colors mb-3">
                    {ev.title}
                  </h2>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-brand-purple shrink-0" />
                      <span className="font-medium text-slate-800">{dateFormatted}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="text-brand-purple shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{venueFormatted}</span>
                    </div>
                  </div>
                </div>

                <Link href={targetUrl} className="w-full">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full rounded-xl py-5 text-sm font-bold flex items-center justify-center gap-2 shadow-md group-hover:shadow-lg transition-all"
                  >
                    <span>Plan Visits for {ev.city}</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Note */}
        <div className="text-center text-xs text-brand-muted">
          Looking for a different city?{' '}
          <Link href="/events" className="text-brand-purple font-bold hover:underline">
            View full upcoming editions tour →
          </Link>
        </div>
      </div>
    </div>
  );
}
