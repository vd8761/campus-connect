"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Search, 
  Filter, 
  Sparkles
} from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { to12HourTime } from '@/lib/dateUtils';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  edition?: string | null;
  type: string;
  shortDescription?: string | null;
  city: string;
  state: string;
  venue?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  startTime?: string | null;
  endTime?: string | null;
  status: string;
  displayStatus: 'OPEN' | 'LIMITED_SEATS' | 'OPENING_SOON' | 'CLOSED' | 'COMPLETED';
  bannerUrl?: string | null;
}

interface EventsExplorerProps {
  events: EventItem[];
}

export function EventsExplorer({ events }: EventsExplorerProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'OPEN' | 'UPCOMING' | 'PAST'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');

  // Available cities
  const cities = useMemo(() => {
    const list = Array.from(new Set(events.map(e => e.city).filter(Boolean)));
    return ['ALL', ...list];
  }, [events]);

  // City options for modern searchable dropdown
  const cityOptions = useMemo(() => [
    { id: 'ALL', name: 'All Locations' },
    ...cities.filter(c => c !== 'ALL').map(c => ({ id: c, name: c }))
  ], [cities]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      ALL: events.length,
      OPEN: events.filter(e => ['OPEN', 'LIMITED_SEATS'].includes(e.displayStatus)).length,
      UPCOMING: events.filter(e => ['OPENING_SOON', 'CLOSED'].includes(e.displayStatus)).length,
      PAST: events.filter(e => e.displayStatus === 'COMPLETED').length,
    };
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Tab filter
      if (activeTab === 'OPEN' && !['OPEN', 'LIMITED_SEATS'].includes(e.displayStatus)) return false;
      if (activeTab === 'UPCOMING' && !['OPENING_SOON', 'CLOSED'].includes(e.displayStatus)) return false;
      if (activeTab === 'PAST' && e.displayStatus !== 'COMPLETED') return false;

      // City filter
      if (selectedCity !== 'ALL' && e.city !== selectedCity) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = e.title.toLowerCase().includes(q);
        const matchCity = e.city.toLowerCase().includes(q);
        const matchType = e.type.toLowerCase().includes(q);
        const matchVenue = (e.venue || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchType && !matchVenue) return false;
      }

      return true;
    });
  }, [events, activeTab, selectedCity, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Controls Bar: Tabs + Search + City */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-brand-border space-y-4">
        {/* Top: Tabs & Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/60 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Editions', count: counts.ALL },
              { id: 'OPEN', label: 'Open for Registration', count: counts.OPEN, highlight: true },
              { id: 'UPCOMING', label: 'Opening Soon', count: counts.UPCOMING },
              { id: 'PAST', label: 'Past Editions', count: counts.PAST },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-navy text-white shadow-md'
                    : 'bg-brand-light text-brand-muted hover:text-brand-navy hover:bg-brand-border/40'
                }`}
              >
                {tab.highlight && counts.OPEN > 0 && (
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                )}
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-brand-border/60 text-brand-navy'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-brand-muted font-medium">
            Showing <span className="font-bold text-brand-navy">{filteredEvents.length}</span> event{filteredEvents.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Bottom: Search & City Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-8 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by event title, city, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-brand-light/50 focus:bg-white text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <SearchableDropdown
              options={cityOptions}
              value={selectedCity}
              onChange={(val) => setSelectedCity(val)}
              placeholder="All Locations"
              searchPlaceholder="Search locations..."
              noOptionsMessage="No locations found"
              icon={MapPin}
              buttonClassName="bg-brand-light/50 hover:bg-white"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <EventItemCard key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        /* Clean Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-brand-border shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-brand-light text-brand-purple flex items-center justify-center mx-auto mb-4 border border-brand-border/60">
            <Search size={28} />
          </div>
          <h3 className="text-xl font-heading font-bold text-brand-navy mb-2">
            {activeTab === 'PAST' ? 'No Past Editions in the Archive' : 'No Matching Events Found'}
          </h3>
          <p className="text-sm text-brand-muted mb-6 leading-relaxed">
            {activeTab === 'PAST' 
              ? 'All currently scheduled editions are upcoming or open for registration. You can explore photo highlights from previous editions in our gallery.'
              : 'We couldn’t find any events matching your selected criteria. Try resetting your search or view all available editions.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setActiveTab('ALL');
                setSearchQuery('');
                setSelectedCity('ALL');
              }}
            >
              Reset Filters
            </Button>
            {activeTab === 'PAST' && (
              <Link href="/gallery">
                <Button variant="gradient">
                  View Past Gallery Photos
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EventItemCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  const eventImages: Record<string, string> = {
    'school-leaders-conclave-trichy-2026': '/images/event-1.jpg',
    'university-fair-coimbatore-2026': '/images/event-2.jpg',
    'international-education-fair-chennai-2027': '/images/event-3.jpg',
  };
  const imageSrc = event.bannerUrl || eventImages[event.slug] || `/images/event-${(index % 3) + 1}.jpg`;

  const isOpen = ['OPEN', 'LIMITED_SEATS'].includes(event.displayStatus);
  const isOpeningSoon = event.displayStatus === 'OPENING_SOON';
  const isCompleted = event.displayStatus === 'COMPLETED';

  const dateObj = new Date(event.startDate);
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNum = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
  const yearNum = dateObj.getFullYear();

  return (
    <div className={`bg-white rounded-3xl border border-brand-border/80 overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:border-brand-purple/40 hover:-translate-y-1 transition-all duration-300 group ${isCompleted ? 'opacity-85' : ''}`}>
      {/* Banner Area */}
      <div className="h-52 relative overflow-hidden bg-brand-navy/5">
        <Image
          src={imageSrc}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Date Badge (Top-Left) */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-2xl p-2.5 shadow-lg text-center min-w-[54px] border border-white/40">
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-brand-purple leading-tight">
            {monthName}
          </span>
          <span className="block text-2xl font-heading font-black text-brand-navy leading-none my-0.5">
            {dayNum}
          </span>
          <span className="block text-[9px] font-semibold text-brand-muted">
            {yearNum}
          </span>
        </div>

        {/* Status Pill (Top-Right) */}
        <div className="absolute top-4 right-4 z-10">
          {isOpen ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-status-success text-white shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {event.displayStatus === 'LIMITED_SEATS' ? 'Limited Seats' : 'Registration Open'}
            </span>
          ) : isOpeningSoon ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-purple text-white shadow-md">
              <Sparkles size={12} />
              Opening Soon
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-700/90 text-white backdrop-blur shadow-md">
              {isCompleted ? 'Completed Edition' : 'Registration Closed'}
            </span>
          )}
        </div>

        {/* City & Type Overlay on Banner Bottom */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
          <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg">
            <MapPin size={12} className="text-brand-turquoise" /> {event.city}
          </span>
          <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg">
            <GraduationCap size={12} className="text-brand-turquoise" /> {event.type}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-heading font-extrabold text-brand-navy mb-3 leading-snug group-hover:text-brand-purple transition-colors">
            {event.title}
          </h3>

          {event.shortDescription && (
            <p className="text-sm text-brand-muted line-clamp-2 mb-4 leading-relaxed">
              {event.shortDescription.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()}
            </p>
          )}

          {/* Time & Venue Info */}
          <div className="space-y-2 py-3 border-y border-brand-border/60 text-xs text-brand-muted mb-5">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-brand-purple shrink-0" />
              <span>{to12HourTime(event.startTime) || '09:00 AM'} - {to12HourTime(event.endTime) || '05:00 PM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-brand-purple shrink-0" />
              <span className="line-clamp-1">{event.venue || event.city}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link href={`/events/${event.slug}`} className="w-full">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl text-sm font-semibold border-brand-border hover:border-brand-purple/50 text-brand-navy"
            >
              Event Details
            </Button>
          </Link>

          {isOpen ? (
            <Link href={`/events/${event.slug}/register`} className="w-full">
              <Button
                variant="gradient"
                className="w-full h-11 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Register Now
              </Button>
            </Link>
          ) : (
            <Link href={`/events/${event.slug}`} className="w-full">
              <Button
                variant={isCompleted ? "outline" : "default"}
                disabled={!isOpeningSoon && !isCompleted}
                className={`w-full h-11 rounded-xl text-sm font-semibold ${
                  isCompleted 
                    ? 'border-brand-purple/40 text-brand-purple hover:bg-brand-light' 
                    : isOpeningSoon 
                      ? 'bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white' 
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isCompleted ? 'View Recap' : isOpeningSoon ? 'Opening Soon' : 'Closed'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
