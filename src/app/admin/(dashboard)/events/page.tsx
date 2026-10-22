import prisma from '@/lib/prisma';
import { Calendar, Plus, MapPin, Users, ExternalLink, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getEventStatus } from '@/lib/event-utils';
import { EventFilters } from './EventFilters';
import { DeleteEventButton } from './DeleteEventButton';

export const dynamic = 'force-dynamic';

export default async function AdminEvents({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const { type, status } = await searchParams;
  
  let allEvents: any[] = [];
  let eventTypes: any[] = [];

  try {
    allEvents = await prisma.event.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    eventTypes = await prisma.eventType.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.warn("Database connection failed on Admin Events page (Network blocked). Showing empty state.");
  }

  // Filter in JS since status is dynamically calculated
  const events = allEvents.filter(event => {
    let matchesType = true;
    let matchesStatus = true;

    if (type && typeof type === 'string') {
      matchesType = event.type === type;
    }

    if (status && typeof status === 'string') {
      const dynamicStatus = getEventStatus(
        event.startDate, 
        event.endDate, 
        event.registrationOpen, 
        event.registrationClose,
        event.status === 'DRAFT'
      );
      matchesStatus = dynamicStatus === status;
    }

    return matchesType && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 md:p-8 rounded-2xl border border-brand-border/80 shadow-2xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy tracking-tight">
            Manage Fair Editions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, schedule, and oversee your summits, education fairs, and booth venues.
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button variant="gradient" className="rounded-xl font-bold gap-2 h-11 px-5 shadow-sm hover:shadow-md transition-all">
            <Plus size={16} />
            <span>Create New Edition</span>
          </Button>
        </Link>
      </div>

      <EventFilters eventTypes={eventTypes} />

      <div className="grid grid-cols-1 gap-4">
        {events.length > 0 ? (
          events.map(event => {
            const dynamicStatus = getEventStatus(
              event.startDate, 
              event.endDate, 
              event.registrationOpen, 
              event.registrationClose,
              event.status === 'DRAFT',
              event.isDateTba
            );

            const isOpeningSoon = dynamicStatus === 'OPENING_SOON';
            const isOpen = dynamicStatus === 'OPEN';
            const isClosed = dynamicStatus === 'CLOSED';
            const isCompleted = dynamicStatus === 'COMPLETED';

            const statusConfig = isOpen 
              ? { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500', label: 'Registration Open' }
              : isOpeningSoon 
              ? { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500', label: 'Opening Soon' }
              : isClosed 
              ? { bg: 'bg-rose-50 text-rose-700 border-rose-200/80', dot: 'bg-rose-500', label: 'Registration Closed' }
              : isCompleted 
              ? { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500', label: 'Completed' }
              : { bg: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: 'Draft' };

            return (
              <div 
                key={event.id} 
                className="bg-white rounded-2xl border border-brand-border/80 p-5 md:p-6 shadow-2xs hover:shadow-md hover:border-brand-purple/30 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                {/* Event Details */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusConfig.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${isOpen ? 'animate-pulse' : ''}`} />
                      {statusConfig.label}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-light text-brand-purple border border-brand-border/60">
                      {event.type}
                    </span>
                  </div>
                  
                  <h2 className="text-lg md:text-xl font-heading font-bold text-brand-navy group-hover:text-brand-purple transition-colors truncate">
                    {event.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-brand-purple shrink-0" />
                      <span>{event.isDateTba || !event.startDate ? 'Date TBA' : new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-brand-purple shrink-0" />
                      <span>{event.isVenueTba || !event.venue ? `${event.city} (Venue TBA)` : `${event.city} - ${event.venue}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-brand-purple shrink-0" />
                      <span>{event._count.registrations} / {event.maxCapacity || '∞'} Delegates</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link href={`/events/${event.slug}`} target="_blank">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-xl border-brand-border/80 text-brand-navy hover:bg-brand-light h-9 text-xs font-semibold gap-1.5"
                    >
                      <span>Live Page</span>
                      <ExternalLink size={12} className="text-brand-purple" />
                    </Button>
                  </Link>

                  <Link href={`/booths/${event.id}`} target="_blank">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-xl border-purple-200 text-brand-purple hover:bg-purple-50 h-9 text-xs font-semibold gap-1.5"
                      title="Direct Edition Booths Page"
                    >
                      <QrCode size={12} className="text-brand-purple" />
                      <span>Booths</span>
                    </Button>
                  </Link>

                  <Link href={`/admin/events/${event.id}`}>
                    <Button 
                      variant="gradient" 
                      size="sm"
                      className="rounded-xl font-bold h-9 px-4 text-xs shadow-2xs hover:shadow-sm"
                    >
                      Manage
                    </Button>
                  </Link>

                  <DeleteEventButton id={event.id} title={event.title} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-purple mx-auto mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-heading font-bold text-brand-navy mb-2">No Events Found</h3>
            <p className="text-brand-muted mb-6 max-w-md mx-auto">Get started by creating your first educational summit or university fair.</p>
            <Link href="/admin/events/new">
              <Button variant="gradient" className="rounded-xl px-8">Create First Event</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
