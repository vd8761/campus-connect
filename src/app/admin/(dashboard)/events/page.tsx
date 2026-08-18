import prisma from '@/lib/prisma';
import { Calendar, Plus, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getEventStatus } from '@/lib/event-utils';
import { EventFilters } from './EventFilters';

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
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand-navy">Manage Events</h1>
          <p className="text-brand-muted mt-1">Create and manage your educational summits and fairs.</p>
        </div>
        <Link href="/admin/events/new">
          <Button variant="gradient" className="flex items-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Plus size={18} /> Create New Event
          </Button>
        </Link>
      </div>

      <EventFilters eventTypes={eventTypes} />

      <div className="grid grid-cols-1 gap-6">
        {events.length > 0 ? (
          events.map(event => {
            const dynamicStatus = getEventStatus(
              event.startDate, 
              event.endDate, 
              event.registrationOpen, 
              event.registrationClose,
              event.status === 'DRAFT'
            );

            return (
              <div key={event.id} className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col md:flex-row">
                {/* Visual Indicator Line */}
                <div className={`w-2 shrink-0 ${
                  dynamicStatus === 'OPEN' ? 'bg-green-500' :
                  dynamicStatus === 'OPENING_SOON' ? 'bg-yellow-500' :
                  dynamicStatus === 'CLOSED' ? 'bg-red-500' :
                  dynamicStatus === 'COMPLETED' ? 'bg-brand-navy' :
                  'bg-gray-300'
                }`}></div>
                
                <div className="p-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Event Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        dynamicStatus === 'OPEN' ? 'bg-green-100 text-green-700' :
                        dynamicStatus === 'OPENING_SOON' ? 'bg-yellow-100 text-yellow-700' :
                        dynamicStatus === 'CLOSED' ? 'bg-red-100 text-red-700' :
                        dynamicStatus === 'COMPLETED' ? 'bg-brand-navy/10 text-brand-navy' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {dynamicStatus === 'CLOSED' ? 'REGISTRATION CLOSED' : dynamicStatus.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-semibold text-brand-purple">{event.type}</span>
                    </div>
                    
                    <h2 className="text-xl font-heading font-bold text-brand-navy group-hover:text-brand-purple transition-colors">
                      {event.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-brand-muted font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-brand-purple/70" />
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-brand-purple/70" />
                        {event.city}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={16} className="text-brand-purple/70" />
                        {event._count.registrations} / {event.maxCapacity || '∞'} Registered
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                    <Link href={`/admin/events/${event.id}`} className="w-full">
                      <Button variant="outline" className="w-full justify-center">Manage</Button>
                    </Link>
                    <Link href={`/events/${event.slug}`} target="_blank" className="w-full">
                      <Button variant="ghost" className="w-full justify-center text-brand-muted hover:text-brand-navy">View Page</Button>
                    </Link>
                  </div>
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
