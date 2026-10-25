import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getEventStatus } from '@/lib/event-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Clock, ArrowRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { to12HourTime } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Register for Campus Square™ | Select Fair Edition',
  description: 'Choose your city edition to register for Campus Square™ University Fair and receive a complimentary behavioral assessment report.',
};

export default async function UniversalRegisterPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
      include: {
        universityEvents: {
          include: {
            university: true
          }
        }
      }
    });
  } catch (error) {
    console.warn("Database error on universal register page:", error);
  }

  // Calculate dynamic open status for all events
  const openEvents = events.filter(e => {
    const dynamicStatus = getEventStatus(
      e.startDate ? new Date(e.startDate) : null,
      e.endDate ? new Date(e.endDate) : (e.startDate ? new Date(e.startDate) : null),
      e.registrationOpen ? new Date(e.registrationOpen) : null,
      e.registrationClose ? new Date(e.registrationClose) : null,
      e.status === 'DRAFT',
      e.isDateTba
    );

    let displayStatus: string;
    if (e.status === 'LIMITED_SEATS' && dynamicStatus === 'OPEN') {
      displayStatus = 'LIMITED_SEATS';
    } else {
      displayStatus = dynamicStatus;
    }
    return ['OPEN', 'LIMITED_SEATS'].includes(displayStatus);
  });

  // CASE 1: Exactly 1 event is currently open -> Instant zero-friction redirect to its registration page!
  if (openEvents.length === 1) {
    redirect(`/events/${openEvents[0].slug}/register`);
  }

  // CASE 2: No events are currently open -> Informative fallback screen
  if (openEvents.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border/80 shadow-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider mb-4">
              Registration Status
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy mb-3">
              Registrations Are Currently Closed
            </h1>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-8">
              There are no active fair editions accepting registrations right now. New school editions across Tamil Nadu (Coimbatore, Trichy, Chennai, Bengaluru) will open soon.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/events" className="w-full sm:w-auto">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto rounded-xl">
                  View Upcoming Editions & Dates
                </Button>
              </Link>
              <Link href="/#upcoming-editions" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CASE 3: More than 1 edition is currently open -> Render dedicated Multi-Edition Selector!
  return (
    <div className="min-h-screen bg-slate-50 py-14 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
            <Sparkles size={14} />
            <span>Select Your City Edition</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-navy mb-3">
            Choose Your Fair Edition to Register
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            Multiple Campus Square™ school editions are currently open for free student and parent registrations. Select your preferred city below:
          </p>
        </div>

        {/* Grid of Open Editions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {openEvents.map((event) => {
            const isDateTba = event.isDateTba || !event.startDate;
            const dateFormatted = isDateTba
              ? 'Date To Be Announced (TBA)'
              : new Date(event.startDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

            return (
              <div
                key={event.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-purple/20 shadow-md hover:shadow-xl hover:border-brand-purple transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-brand-turquoise/20 text-brand-navy text-xs font-extrabold uppercase tracking-wider">
                      {event.city} Edition
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Registration Open
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-brand-navy mb-3">
                    {event.title}
                  </h2>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-brand-purple shrink-0" />
                      <span className="font-medium text-slate-800">{dateFormatted}</span>
                    </div>
                    {(event.startTime || event.endTime) && (
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-brand-purple shrink-0" />
                        <span>
                          {isDateTba 
                            ? 'Timings To Be Announced' 
                            : `${to12HourTime(event.startTime)} - ${to12HourTime(event.endTime)}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="text-brand-purple shrink-0 mt-0.5" />
                      <span>{event.isVenueTba || !event.venue ? 'Venue To Be Announced (TBA)' : event.venue}</span>
                    </div>
                  </div>
                </div>

                <Link href={`/events/${event.slug}/register`} className="w-full">
                  <Button variant="gradient" size="lg" className="w-full rounded-xl py-5 text-sm font-bold flex items-center justify-center gap-2 shadow-md">
                    <span>Register Free for {event.city}</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Upcoming editions notice */}
        <div className="text-center text-xs text-slate-500">
          Looking for other locations? Campus Square™ is expanding to Coimbatore, Trichy, Chennai, and Bengaluru.{' '}
          <Link href="/events" className="text-brand-purple font-semibold hover:underline">
            View the complete multi-city schedule &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
