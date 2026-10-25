import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { SmartRegistration } from './SmartRegistration';
import Link from 'next/link';
import { ChevronRight, CalendarX, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getEventStatus } from '@/lib/event-utils';
import { OriginBIHighlightBox } from '@/components/OriginBIHighlightBox';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      select: {
        title: true,
        city: true,
        edition: true,
        bannerUrl: true,
      }
    });

    if (!event) {
      return {
        title: 'Register for Event | Campus Square™',
      };
    }

    const title = `Register: ${event.title} - ${event.city} ${event.edition || 'Edition'}`.trim();
    const description = `Reserve your free entry pass for ${event.title} in ${event.city}. Connect directly with premier universities, school leadership, and unlock complimentary DISC career profiling.`;
    const imageUrl = event.bannerUrl || '/campus-square-logo-main.jpg';

    return {
      title,
      description,
      alternates: {
        canonical: `/events/${slug}/register`,
      },
      openGraph: {
        title: `${title} | Campus Square™`,
        description,
        type: 'website',
        url: `/events/${slug}/register`,
        images: [{ url: imageUrl, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | Campus Square™`,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: 'Register for Event | Campus Square™',
    };
  }
}

export default async function RegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let event: any = null;
  try {
    event = await prisma.event.findUnique({
      where: { slug }
    });
  } catch (error) {
    console.warn("Database connection failed on Event register page (Network blocked).");
  }

  if (!event) {
    notFound();
  }
  
  const status = getEventStatus(
    event.startDate,
    event.endDate,
    event.registrationOpen,
    event.registrationClose,
    event.status === 'DRAFT',
    event.isDateTba
  );

  if (!['OPEN', 'LIMITED_SEATS'].includes(status)) {
    const isOpeningSoon = status === 'OPENING_SOON';

    return (
      <div className="bg-brand-light min-h-screen pb-20">
        <div className="bg-white border-b border-brand-border py-4">
          <div className="container mx-auto px-4 flex items-center text-sm text-brand-muted">
            <Link href="/" className="hover:text-brand-purple">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/events" className="hover:text-brand-purple">Events</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href={`/events/${event.slug}`} className="hover:text-brand-purple truncate max-w-[200px]">{event.title}</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-brand-navy font-medium">Registration Status</span>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 max-w-2xl">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-border/80 shadow-lg text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-5">
              <CalendarX size={32} />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
              {isOpeningSoon ? 'Registration Opening Soon' : 'Registration Concluded'}
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy mb-3">
              {isOpeningSoon 
                ? 'Registrations Will Open Soon' 
                : 'Registration is Closed for this Edition'}
            </h1>

            <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-6 max-w-lg mx-auto">
              {isOpeningSoon 
                ? <>Online registration for <strong className="text-brand-navy">{event.title}</strong> is opening soon. Event schedule and venue details are currently being finalized.</>
                : <>Online registrations for <strong className="text-brand-navy">{event.title}</strong> have concluded. Seating capacity has been reached or the event registration deadline has passed.</>}
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left mb-8 space-y-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2 text-brand-navy font-semibold">
                <MapPin size={16} className="text-brand-purple shrink-0" />
                <span>{event.isVenueTba || !event.venue ? `${event.city} • Venue To Be Announced` : event.venue}</span>
              </div>
              <p className="text-slate-500 text-xs pl-6">
                You can still browse the participating university booths, explore other upcoming editions across Tamil Nadu, or check back once dates are confirmed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/events" className="w-full sm:w-auto">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto rounded-xl">
                  Explore Upcoming Fair Editions
                </Button>
              </Link>
              <Link href={`/events/${event.slug}`} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl border-brand-purple/30 text-brand-purple">
                  View Exhibiting Universities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen pb-20">
      <div className="bg-white border-b border-brand-border py-4">
        <div className="container mx-auto px-4 flex items-center text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-purple">Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/events" className="hover:text-brand-purple">Events</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href={`/events/${event.slug}`} className="hover:text-brand-purple truncate max-w-[200px]">{event.title}</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-brand-navy font-medium">Register</span>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-brand-navy mb-4">Event Registration</h1>
          <p className="text-brand-muted">
            Registering for: <strong className="text-brand-navy">{event.title}</strong>
          </p>
        </div>

        {/* OriginBI Assessment Highlight Box */}
        <OriginBIHighlightBox className="mb-8" />

        <div id="registration-card" className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden scroll-mt-24 transition-all duration-300">
          <div className="bg-[image:var(--secondary-gradient)] p-4 sm:p-6 text-white">
            <h2 className="text-lg sm:text-xl font-heading font-bold">Participant Details</h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1">Please provide accurate information for your event pass.</p>
          </div>
          
          <div className="p-4 sm:p-6 md:p-8">
            <SmartRegistration eventId={event.id} eventSlug={event.slug} eventTitle={event.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
