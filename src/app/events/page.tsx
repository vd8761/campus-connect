import React from 'react';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { getEventStatus } from '@/lib/event-utils';
import { EventsExplorer, EventItem } from './EventsExplorer';
import { Sparkles, MapPin, Building2, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editions & University Fairs | Campus Square',
  description: 'Campus Square is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.',
};

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' }
    });
  } catch (error) {
    console.warn("Database connection failed. Showing empty state.");
  }

  // Consistent status calculation
  const displayEvents: EventItem[] = events.map(e => {
    let displayStatus: 'OPEN' | 'LIMITED_SEATS' | 'OPENING_SOON' | 'CLOSED' | 'COMPLETED';

    if (e.status === 'LIMITED_SEATS') {
      displayStatus = 'LIMITED_SEATS';
    } else if (e.status === 'OPEN') {
      displayStatus = 'OPEN';
    } else {
      const dynamicStatus = getEventStatus(
        new Date(e.startDate),
        new Date(e.endDate),
        e.registrationOpen ? new Date(e.registrationOpen) : null,
        e.registrationClose ? new Date(e.registrationClose) : null,
        e.status === 'DRAFT'
      );
      displayStatus = dynamicStatus as any;
    }

    return {
      id: e.id,
      title: e.title,
      slug: e.slug,
      edition: e.edition,
      type: e.type,
      shortDescription: e.shortDescription,
      city: e.city,
      state: e.state,
      venue: e.venue,
      startDate: e.startDate,
      endDate: e.endDate,
      startTime: e.startTime,
      endTime: e.endTime,
      status: e.status,
      displayStatus,
      bannerUrl: e.bannerUrl,
    };
  });

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      {/* Premium Hero Banner */}
      <section className="bg-brand-navy text-white pt-10 sm:pt-14 pb-16 px-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-turquoise/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/20 text-brand-turquoise text-xs font-bold uppercase tracking-wider mb-5 border border-white/10">
            <Building2 size={14} className="text-brand-turquoise" />
            <span>Campus Square Editions</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-4">
            Where Education <span className="text-transparent bg-clip-text bg-[image:var(--primary-gradient)]">Meets Opportunity</span>
          </h1>

          <p className="text-sm font-semibold text-brand-turquoise mb-4 uppercase tracking-wider">
            Connect Campuses. Schools. Universities. Students. Opportunities.
          </p>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Campus Square is a multi-location education and university fair series hosted at different schools, bringing together school leaders, students, parents, universities, educators and education partners.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <MapPin size={16} className="text-brand-turquoise" />
              <span className="font-bold text-white">First Edition:</span> Theni (Oct 24, 2026)
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Building2 size={16} className="text-brand-turquoise" />
              <span className="font-bold text-white">19+</span> University Partners
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Users size={16} className="text-brand-turquoise" />
              <span className="font-bold text-white">Free</span> OriginBI Assessment
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Explorer Container */}
      <main className="container mx-auto px-4 -mt-8 relative z-20">
        <EventsExplorer events={displayEvents} />
      </main>
    </div>
  );
}
