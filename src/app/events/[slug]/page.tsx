import React, { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Clock, GraduationCap, FileText, CheckCircle2, ChevronRight, Building2 } from 'lucide-react';
import { getEventStatus } from '@/lib/event-utils';
import { to12HourTime } from '@/lib/dateUtils';
import Image from 'next/image';
import { Metadata } from 'next';
import { OriginBIBenefitsSection } from '@/components/OriginBIBenefitsSection';
import { OriginBIHighlightBox } from '@/components/OriginBIHighlightBox';
import { AboutOriginBISection } from '@/components/AboutOriginBISection';

export const dynamic = 'force-dynamic';

const getEvent = cache(async (slug: string) => {
  try {
    return await prisma.event.findUnique({
      where: { slug },
      include: {
        universityEvents: {
          include: {
            university: {
              include: {
                courses: true
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.warn("Database connection issue fetching event:", error);
    return null;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await getEvent(slug);

    if (!event) {
      return {
        title: 'Event Not Found',
      };
    }

    const title = event.seoTitle || `${event.title} – ${event.city} ${event.edition || 'Edition'}`.trim();
    const cleanDesc = event.shortDescription?.replace(/<[^>]+>/g, '').trim() || '';
    const description = event.seoDescription || cleanDesc || `Register for ${event.title} in ${event.city}. Connect with premier universities, school leaders, and explore undergraduate & postgraduate opportunities.`;
    const imageUrl = event.bannerUrl || '/images/event-1.jpg';

    return {
      title,
      description,
      alternates: {
        canonical: `/events/${slug}`,
      },
      openGraph: {
        title: `${title} | Campus Square`,
        description,
        type: 'website',
        url: `/events/${slug}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: event.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | Campus Square`,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: 'University Fair & Conclave | Campus Square',
    };
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const dynamicStatus = getEventStatus(
    event.startDate,
    event.endDate,
    event.registrationOpen,
    event.registrationClose,
    event.status === 'DRAFT'
  );
  const displayStatus = event.status === 'LIMITED_SEATS' ? 'LIMITED_SEATS' : dynamicStatus;
  const isRegistrationOpen = ['OPEN', 'LIMITED_SEATS'].includes(displayStatus);

  const imageSrc = event.bannerUrl || '/images/event-1.jpg';

  const sortedInstitutions = [...(event.universityEvents || [])].sort((a: any, b: any) => {
    const isWoxsenA = a.university?.name?.toLowerCase().includes('woxsen');
    const isWoxsenB = b.university?.name?.toLowerCase().includes('woxsen');
    if (isWoxsenA && !isWoxsenB) return -1;
    if (!isWoxsenA && isWoxsenB) return 1;
    return (a.university?.name || '').localeCompare(b.university?.name || '');
  });

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: (event as any).subtitle || event.shortDescription || event.title,
    startDate: event.startDate ? new Date(event.startDate).toISOString() : undefined,
    endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue || `${event.city} Venue`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressRegion: event.state,
        addressCountry: 'IN',
      },
    },
    image: [imageSrc],
    organizer: {
      '@type': 'Organization',
      name: 'Campus Square',
      url: process.env.NEXT_PUBLIC_APP_URL || '/',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: isRegistrationOpen ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: `/events/${event.slug}/register`,
    },
  };

  return (
    <div className="bg-brand-light min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {/* Breadcrumbs & Simple Header */}
      <div className="bg-white border-b border-brand-border py-2.5 relative z-20">
        <div className="container mx-auto px-4 flex items-center text-sm text-brand-muted">
          <Link href="/" className="hover:text-brand-purple transition-colors">Home</Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <Link href="/events" className="hover:text-brand-purple transition-colors">Events</Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <span className="text-brand-navy font-medium truncate">{event.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative text-white pt-8 md:pt-12 pb-12 md:pb-16 overflow-hidden">
        {/* Background Image with Premium Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={imageSrc} 
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-navy/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <div className="inline-block bg-white/10 backdrop-blur border border-white/20 text-brand-turquoise px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3.5">
              {event.type}
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-4 leading-tight">
              {event.title}
            </h1>
            <div 
              className="text-lg text-white/80 max-w-2xl mb-8 text-balance [&_p]:inline"
              dangerouslySetInnerHTML={{ __html: event.shortDescription || '' }}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              {isRegistrationOpen ? (
                <Link href={`/events/${event.slug}/register`}>
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto px-10">Register Now</Button>
                </Link>
              ) : (
                <Button variant="outline" size="lg" disabled className="bg-white/10 text-white border-white/20">
                  Registration {displayStatus === 'OPENING_SOON' ? 'Opening Soon' : 'Closed'}
                </Button>
              )}
            </div>

            {/* Short Version Highlight Box Near Registration Button */}
            <OriginBIHighlightBox variant="hero" className="mt-6 max-w-xl" />
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <h3 className="font-heading font-semibold text-xl mb-4">Event Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Calendar className="text-brand-turquoise mt-1" size={20} />
                  <div>
                    <div className="text-sm text-white/70">Date</div>
                    <div className="font-medium">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-brand-turquoise mt-1" size={20} />
                  <div>
                    <div className="text-sm text-white/70">Time</div>
                    <div className="font-medium">
                      {to12HourTime(event.startTime) || '10:00 AM'} - {to12HourTime(event.endTime) || '5:00 PM'}
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-brand-turquoise mt-1" size={20} />
                  <div>
                    <div className="text-sm text-white/70">Venue</div>
                    <div className="font-medium">{event.venue}</div>
                    <div className="text-sm text-white/80">{event.city}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/3 p-8 md:p-12 md:border-r border-brand-border">
            <h2 className="text-2xl font-heading font-bold text-brand-navy mb-6 flex items-center gap-2">
              <FileText className="text-brand-purple" /> About The Event
            </h2>
            <div 
              className="text-slate-600 text-sm leading-normal max-w-none break-words [&_*]:!max-w-full [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:my-2 [&_p]:mb-2.5 [&_p]:leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-2.5 [&_h3]:text-base [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-brand-navy [&_h3]:mt-4 [&_h3]:mb-2.5 [&_a]:text-brand-purple [&_a]:underline [&_ul]:list-none [&_ul]:p-0 [&_ul]:my-2.5 [&_ul]:space-y-2.5 [&_ul_li]:flex [&_ul_li]:items-start [&_ul_li]:leading-snug [&_ul_li::before]:content-[''] [&_ul_li::before]:flex-none [&_ul_li::before]:w-1.5 [&_ul_li::before]:h-1.5 [&_ul_li::before]:rounded-full [&_ul_li::before]:bg-brand-purple [&_ul_li::before]:ring-2 [&_ul_li::before]:ring-purple-100/80 [&_ul_li::before]:mt-1.5 [&_ul_li::before]:mr-2.5"
              dangerouslySetInnerHTML={{ __html: event.fullDescription || 'Detailed description coming soon.' }}
            />

            {event.whatToExpect && (
              <>
                <h2 className="text-xl font-heading font-bold text-brand-navy mt-8 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-brand-purple" size={20} /> What to Expect
                </h2>
                <div 
                  className="text-slate-600 text-sm leading-normal max-w-none break-words [&_*]:!max-w-full [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-2 [&_p]:mb-2.5 [&_p]:leading-relaxed [&_ul]:list-none [&_ul]:p-0 [&_ul]:my-2.5 [&_ul]:space-y-2.5 [&_ul_li]:flex [&_ul_li]:items-start [&_ul_li]:leading-snug [&_ul_li::before]:content-[''] [&_ul_li::before]:flex-none [&_ul_li::before]:w-1.5 [&_ul_li::before]:h-1.5 [&_ul_li::before]:rounded-full [&_ul_li::before]:bg-brand-purple [&_ul_li::before]:ring-2 [&_ul_li::before]:ring-purple-100/80 [&_ul_li::before]:mt-1.5 [&_ul_li::before]:mr-2.5"
                  dangerouslySetInnerHTML={{ __html: event.whatToExpect }}
                />
              </>
            )}
          </div>
          
          <div className="md:w-1/3 bg-brand-light p-8 md:p-12 flex flex-col justify-center">
            <div className="text-center">
              <GraduationCap className="w-16 h-16 text-brand-turquoise mx-auto mb-6 opacity-80" />
              <h3 className="text-xl font-heading font-bold text-brand-navy mb-4">Secure Your Attendance</h3>
              <p className="text-brand-muted text-sm mb-8">
                Registrations are required for entry. A unique QR code will be generated for your check-in.
              </p>
              {isRegistrationOpen ? (
                <Link href={`/events/${event.slug}/register`}>
                  <Button variant="gradient" size="lg" className="w-full">Proceed to Registration</Button>
                </Link>
              ) : (
                <Button variant="outline" size="lg" className="w-full" disabled>
                  Registration {displayStatus === 'OPENING_SOON' ? 'Opening Soon' : 'Closed'}
                </Button>
              )}

              {/* Highlight Box Near Registration Button */}
              <OriginBIHighlightBox compact className="mt-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmed Participating Universities Section */}
      {event.universityEvents && event.universityEvents.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-8 md:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold mb-2">
                  <GraduationCap size={14} />
                  <span>Approved Academic Partner Booths</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy">
                  Confirmed Participating Institutions ({event.universityEvents.length})
                </h2>
                <p className="text-sm text-brand-muted mt-1">
                  Meet directly with admissions officers and explore undergraduate & postgraduate courses at these verified booths.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedInstitutions.map(({ university }: any) => (
                <div 
                  key={university.id} 
                  className="rounded-2xl border border-brand-border/80 hover:border-brand-purple/40 bg-white hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
                >
                  {/* Logo Showcase Area */}
                  <div className="h-24 w-full bg-slate-50/70 p-3.5 flex items-center justify-center border-b border-slate-100 group-hover:bg-purple-50/20 transition-colors">
                    {university.logoUrl ? (
                      <img 
                        src={university.logoUrl} 
                        alt={university.name} 
                        className="max-h-full max-w-[90%] object-contain group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-brand-purple/60" />
                    )}
                  </div>

                  {/* Institution Details */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-heading font-bold text-brand-navy text-xs leading-snug group-hover:text-brand-purple transition-colors line-clamp-2 min-h-[32px]">
                        {university.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5">
                        <MapPin size={12} className="text-brand-purple shrink-0" />
                        <span className="truncate">{university.city ? `${university.city}, ${university.country}` : university.country}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 font-semibold text-brand-purple">
                        <GraduationCap size={13} />
                        {university.courses?.length || 0} Programs
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 group-hover:text-brand-purple transition-colors">
                        Verified Booth
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* How Students Benefit Section */}
      <div className="mt-14">
        <OriginBIBenefitsSection eventSlug={event.slug} isRegistrationOpen={isRegistrationOpen} />
      </div>

      {/* About OriginBI Mindworks Section */}
      <div className="mt-4">
        <AboutOriginBISection />
      </div>
    </div>
  );
}
