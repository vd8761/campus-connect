'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Building2,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Download,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  Calendar,
  ChevronDown,
  X,
  Compass,
  GraduationCap,
  Printer,
  FileCheck2,
  Layers,
} from 'lucide-react';
import { lookupParticipantForBooths, saveBoothVisits } from '@/app/actions/booths';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';
import { getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';

// Country flag icon component matching SmartRegistration
const FlagIcon = ({ country, label, className }: any) => {
  return (
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
      alt={label}
      className={className}
    />
  );
};

export interface EventOption {
  id: string;
  title: string;
  slug: string;
  city: string;
  venue?: string | null;
  startDate?: string | null;
  status?: string | null;
  universitiesCount?: number;
}

interface University {
  id: string;
  name: string;
  city: string;
  logoUrl?: string | null;
  description?: string | null;
  boothNumber?: string | null;
  coursesCount?: number;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  venue?: string | null;
  city?: string | null;
  startDate?: Date | string | null;
  participatingUniversities: University[];
  visitedUniIds: string[];
}

interface ParticipantData {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  schoolLevel?: string | null;
  currentStandard?: string | null;
  stream?: string | null;
}

interface BoothVisitClientProps {
  initialIdentifier?: string;
  initialEventId?: string;
  availableEvents?: EventOption[];
}

export function BoothVisitClient({
  initialIdentifier = '',
  initialEventId = '',
  availableEvents = [],
}: BoothVisitClientProps) {
  // Step 1: Event Searchable Autocomplete state
  const initialEvent = useMemo(() => {
    if (initialEventId) {
      return (
        availableEvents.find((e) => e.id === initialEventId || e.slug === initialEventId) ||
        availableEvents[0] ||
        null
      );
    }
    return availableEvents.length === 1 ? availableEvents[0] : null;
  }, [initialEventId, availableEvents]);

  const [selectedEvent, setSelectedEvent] = useState<EventOption | null>(initialEvent);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [highlightedEventIdx, setHighlightedEventIdx] = useState(0);
  const eventDropdownRef = useRef<HTMLDivElement>(null);
  const eventInputRef = useRef<HTMLInputElement>(null);

  // Step 1: Identifier input with smart keyword-based detection (matching registration form)
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [country, setCountry] = useState<any>('IN');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Keyword-based automatic detection: if contains letters or @, it's an email; otherwise mobile
  const isEmail = identifier.length > 0 && /[a-zA-Z@]/.test(identifier);

  // Dynamic country-specific expected mobile digit length
  const exampleNum = useMemo(() => {
    if (!country) return undefined;
    try {
      return getExampleNumber(country, examples);
    } catch {
      return undefined;
    }
  }, [country]);

  const requiredLength = useMemo(() => {
    return exampleNum ? exampleNum.nationalNumber.length : 10;
  }, [exampleNum]);

  const typedLength = useMemo(() => {
    if (isEmail) return 0;
    return identifier.replace(/\D/g, '').length;
  }, [identifier, isEmail]);

  // Handle switching country in country select
  const handleCountryChange = (newCountry: any) => {
    setCountry(newCountry);
    if (searchError) setSearchError('');
    if (newCountry) {
      try {
        const newEx = getExampleNumber(newCountry, examples);
        const newReq = newEx ? newEx.nationalNumber.length : 10;
        if (!/[a-zA-Z@]/.test(identifier)) {
          const digits = identifier.replace(/\D/g, '');
          if (digits.length > newReq) {
            setIdentifier(digits.slice(0, newReq));
          }
        }
      } catch {
        // ignore
      }
    }
  };

  // Handle typing in identifier input with country code digit capping
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (searchError) setSearchError('');

    // Check if input contains email-indicative characters (letters or @)
    if (/[a-zA-Z@]/.test(raw)) {
      setIdentifier(raw);
      return;
    }

    // Phone mode: strip country calling code prefix if user pasted it
    let clean = raw;
    const callingCode = country ? getCountryCallingCode(country) : '';
    if (callingCode && clean.startsWith(`+${callingCode}`)) {
      clean = clean.slice(callingCode.length + 1);
    }

    // Retain only digits and enforce max digit cap equal to requiredLength
    const digitsOnly = clean.replace(/\D/g, '');
    const capped = digitsOnly.slice(0, requiredLength);
    setIdentifier(capped);
  };

  // Step 2: Loaded Participant & Event
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>('');

  // Step 3: University Selection
  const [selectedUniIds, setSelectedUniIds] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Step 4: Confirmed State
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedVisits, setConfirmedVisits] = useState<
    { id: string; universityId: string; universityName: string; universityCity: string; universityLogo?: string | null }[]
  >([]);

  // Close event dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(e.target as Node)) {
        setIsEventDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter available events based on autocomplete search
  const filteredEvents = useMemo(() => {
    if (!eventSearchQuery.trim()) return availableEvents;
    const q = eventSearchQuery.toLowerCase().trim();
    return availableEvents.filter(
      (ev) =>
        ev.title.toLowerCase().includes(q) ||
        ev.city.toLowerCase().includes(q) ||
        (ev.venue && ev.venue.toLowerCase().includes(q)) ||
        ev.slug.toLowerCase().includes(q)
    );
  }, [availableEvents, eventSearchQuery]);

  // Handle participant lookup
  async function handleLookup(valToSearch?: string, eventIdToUse?: string) {
    let rawQuery = (valToSearch || identifier).trim();
    const targetEventId = eventIdToUse || selectedEvent?.id;

    if (!selectedEvent && !targetEventId) {
      setSearchError('Please select the University Fair edition you are attending.');
      setIsEventDropdownOpen(true);
      return;
    }

    if (!rawQuery) {
      setSearchError('Please enter your registered mobile number or email ID.');
      return;
    }

    let finalQuery = rawQuery;

    if (isEmail) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rawQuery)) {
        setSearchError('Please enter a valid email address.');
        return;
      }
      finalQuery = rawQuery.toLowerCase();
    } else {
      // Validate mobile number with exact country requiredLength
      const digits = rawQuery.replace(/\D/g, '');
      if (digits.length !== requiredLength) {
        const countryName = country && (en as any)[country] ? (en as any)[country] : 'the selected country';
        setSearchError(`Please enter a valid ${requiredLength}-digit mobile number for ${countryName}.`);
        return;
      }
      if (country) {
        finalQuery = `+${getCountryCallingCode(country)}${digits}`;
      } else {
        finalQuery = digits;
      }
    }

    setIsSearching(true);
    setSearchError('');
    setSaveError('');

    try {
      const res = await lookupParticipantForBooths(finalQuery, targetEventId);
      if (!res.success || !res.participant) {
        setSearchError(res.error || 'No university fair registration found with these details.');
        setParticipant(null);
        setEvents([]);
      } else {
        setParticipant(res.participant);
        setEvents(res.events || []);

        if (res.events && res.events.length > 0) {
          const currentEv =
            res.events.find((e: any) => e.id === targetEventId) || res.events[0];
          setActiveEventId(currentEv.id);

          // Pre-populate any existing visited booth IDs for this event
          const existing = new Set<string>(currentEv.visitedUniIds || []);
          setSelectedUniIds(existing);

          // Prepare confirmed visits list
          const alreadyVisited = currentEv.participatingUniversities
            .filter((u: any) => existing.has(u.id))
            .map((u: any) => ({
              id: u.id,
              universityId: u.id,
              universityName: u.name,
              universityCity: u.city,
              universityLogo: u.logoUrl,
            }));
          setConfirmedVisits(alreadyVisited);

          // Always stay on selection screen initially to ask the plan to visit universities
          setIsConfirmed(false);
        }
      }
    } catch (err: any) {
      setSearchError('Network or server error verifying registration. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  // Active event currently loaded
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === activeEventId) || events[0] || null;
  }, [events, activeEventId]);

  // Unique cities list for fast filter chips
  const availableCities = useMemo(() => {
    if (!currentEvent) return [];
    const set = new Set<string>();
    currentEvent.participatingUniversities.forEach((u) => {
      if (u.city) set.add(u.city);
    });
    return Array.from(set).sort();
  }, [currentEvent]);

  // Filtered universities based on search box and city filter
  const filteredUniversities = useMemo(() => {
    if (!currentEvent) return [];
    let list = currentEvent.participatingUniversities || [];

    if (cityFilter !== 'ALL') {
      list = list.filter((u) => u.city === cityFilter);
    }

    if (!searchFilter.trim()) return list;

    const term = searchFilter.toLowerCase().trim();
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.city.toLowerCase().includes(term) ||
        (u.boothNumber && u.boothNumber.toLowerCase().includes(term))
    );
  }, [currentEvent, searchFilter, cityFilter]);

  // Toggle university selection
  function toggleUniversity(uniId: string) {
    setSelectedUniIds((prev) => {
      const next = new Set(prev);
      if (next.has(uniId)) {
        next.delete(uniId);
      } else {
        next.add(uniId);
      }
      return next;
    });
  }

  // Select all or clear all
  function selectAll() {
    if (!currentEvent) return;
    const allIds = new Set(currentEvent.participatingUniversities.map((u) => u.id));
    setSelectedUniIds(allIds);
  }

  function clearAll() {
    setSelectedUniIds(new Set());
  }

  // Save selected booths
  async function handleConfirmVisits() {
    if (!participant || !currentEvent) return;

    if (selectedUniIds.size === 0) {
      setSaveError('Please select at least one university booth to confirm your visit.');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      const res = await saveBoothVisits({
        participantId: participant.id,
        eventId: currentEvent.id,
        universityIds: Array.from(selectedUniIds),
      });

      if (!res.success) {
        setSaveError(res.error || 'Failed to save visits.');
      } else {
        setConfirmedVisits(res.boothVisits || []);
        setIsConfirmed(true);
      }
    } catch (err) {
      setSaveError('Failed to record university booth visits. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  // Reset to search another user
  function handleReset() {
    setParticipant(null);
    setEvents([]);
    setActiveEventId('');
    setSelectedUniIds(new Set());
    setConfirmedVisits([]);
    setIsConfirmed(false);
    setIdentifier('');
    setSearchError('');
    setSaveError('');
    setSearchFilter('');
    setCityFilter('ALL');
  }

  // Calculate current step number (1 = Identify, 2 = Select, 3 = Confirmed)
  const currentStep = !participant ? 1 : !isConfirmed ? 2 : 3;

  return (
    <div className="w-full space-y-8">
      {/* ----------------- ELEGANT HEADER & 3-STEP PROGRESS ----------------- */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur shadow-xs border border-purple-100 text-brand-purple">
          <Sparkles size={13} className="text-brand-purple" />
          <span>Campus Square™ • Digital Booth Passport</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-navy tracking-tight">
          Plan & Record University Booths
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          Select your fair edition, verify your attendee details, and mark the universities you explore to generate your official one-page participation record.
        </p>

        {/* 3-Step Breadcrumb / Status Tracker */}
        <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 text-xs font-bold">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${currentStep === 1
              ? 'bg-brand-purple text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
          >
            {currentStep > 1 ? <Check size={12} className="stroke-[3]" /> : <span>1</span>}
            <span>Fair & Attendee</span>
          </div>

          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${currentStep === 2
              ? 'bg-brand-purple text-white shadow-xs'
              : currentStep > 2
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-400'
              }`}
          >
            {currentStep > 2 ? <Check size={12} className="stroke-[3]" /> : <span>2</span>}
            <span>Curate Booths</span>
          </div>

          <span className="text-slate-300">→</span>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${currentStep === 3
              ? 'bg-brand-purple text-white shadow-xs'
              : 'bg-slate-100 text-slate-400'
              }`}
          >
            <span>3</span>
            <span>Verified Report</span>
          </div>
        </div>
      </div>

      {/* ----------------- STATE 1: SEARCHABLE AUTOCOMPLETE & IDENTIFIER FORM ----------------- */}
      {!participant && (
        <div className="max-w-xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-[0_16px_50px_rgba(34,5,44,0.06)] border border-purple-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="space-y-6"
          >
            {/* FIELD 1: SEARCHABLE AUTOCOMPLETE EVENT SELECTOR */}
            <div ref={eventDropdownRef} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] flex items-center justify-center font-bold">
                    1
                  </span>
                  <span>Select University Fair Edition</span>
                </label>
                {selectedEvent && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEvent(null);
                      setEventSearchQuery('');
                      setIsEventDropdownOpen(true);
                      setTimeout(() => eventInputRef.current?.focus(), 60);
                    }}
                    className="text-[11px] font-bold text-brand-purple hover:underline lowercase cursor-pointer"
                  >
                    Change Edition
                  </button>
                )}
              </div>

              {/* Chosen Event Card (when selected) */}
              {selectedEvent && !isEventDropdownOpen ? (
                <div
                  onClick={() => {
                    setIsEventDropdownOpen(true);
                    setEventSearchQuery('');
                  }}
                  className="group p-4 rounded-2xl border-2 border-brand-purple/30 bg-purple-50/30 hover:bg-purple-50/60 hover:border-brand-purple transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-purple to-purple-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Calendar size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-brand-navy text-sm sm:text-base leading-tight group-hover:text-brand-purple transition-colors">
                          {selectedEvent.title}
                        </p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                          <Check size={10} className="stroke-[3]" />
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 truncate">
                        <MapPin size={12} className="shrink-0 text-brand-purple" />
                        <span className="font-semibold text-slate-800">{selectedEvent.city}</span>
                        {selectedEvent.venue && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="truncate text-slate-500">{selectedEvent.venue}</span>
                          </>
                        )}
                      </p>
                      {selectedEvent.universitiesCount !== undefined && (
                        <p className="text-[11px] text-brand-purple font-bold mt-1">
                          {selectedEvent.universitiesCount} Participating Universities
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl border border-brand-purple/20 bg-white text-xs font-bold text-brand-purple flex items-center gap-1 shrink-0 group-hover:bg-brand-purple group-hover:text-white transition-all shadow-2xs">
                    <span>Change</span>
                    <ChevronDown size={13} />
                  </div>
                </div>
              ) : (
                /* Search Input & Dropdown */
                <div className="relative">
                  <div className="relative">
                    <input
                      ref={eventInputRef}
                      type="text"
                      value={eventSearchQuery}
                      onChange={(e) => {
                        setEventSearchQuery(e.target.value);
                        setIsEventDropdownOpen(true);
                      }}
                      onFocus={() => setIsEventDropdownOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setHighlightedEventIdx((prev) =>
                            prev < filteredEvents.length - 1 ? prev + 1 : prev
                          );
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setHighlightedEventIdx((prev) => (prev > 0 ? prev - 1 : 0));
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          if (filteredEvents[highlightedEventIdx]) {
                            setSelectedEvent(filteredEvents[highlightedEventIdx]);
                            setIsEventDropdownOpen(false);
                            setEventSearchQuery('');
                          }
                        } else if (e.key === 'Escape') {
                          setIsEventDropdownOpen(false);
                        }
                      }}
                      placeholder="Search fair edition or city (e.g. Theni, University Fair)..."
                      className="w-full px-4 py-3.5 pl-11 pr-10 text-sm sm:text-base text-brand-navy bg-slate-50/80 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search size={18} />
                    </div>
                    {eventSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEventSearchQuery('');
                          eventInputRef.current?.focus();
                        }}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    ) : (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
                      </div>
                    )}
                  </div>

                  {/* Autocomplete Dropdown List */}
                  {isEventDropdownOpen && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                        <span>Select Fair Edition ({filteredEvents.length} available)</span>
                        <span className="text-[10px] lowercase font-normal text-slate-400">
                          Use ↑↓ keys & Enter
                        </span>
                      </div>

                      {filteredEvents.map((ev, idx) => {
                        const isHighlighted = idx === highlightedEventIdx;
                        const isCurrent = selectedEvent?.id === ev.id;

                        return (
                          <div
                            key={ev.id}
                            onMouseEnter={() => setHighlightedEventIdx(idx)}
                            onClick={() => {
                              setSelectedEvent(ev);
                              setIsEventDropdownOpen(false);
                              setEventSearchQuery('');
                              if (searchError) setSearchError('');
                            }}
                            className={`p-3.5 border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors flex items-start gap-3.5 ${isHighlighted
                              ? 'bg-purple-50/70 text-brand-purple'
                              : isCurrent
                                ? 'bg-purple-50/30'
                                : 'hover:bg-slate-50'
                              }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${isCurrent
                                ? 'bg-brand-purple text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                              <Calendar size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-bold text-brand-navy text-sm leading-snug">
                                  {ev.title}
                                </p>
                                {ev.universitiesCount !== undefined && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-brand-purple shrink-0">
                                    {ev.universitiesCount} Universities
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 truncate">
                                <MapPin size={11} className="shrink-0 text-slate-400" />
                                <span className="font-semibold text-slate-700">{ev.city}</span>
                                {ev.venue && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate">{ev.venue}</span>
                                  </>
                                )}
                              </p>
                              {ev.startDate && (
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {new Date(ev.startDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>

                            {isCurrent && (
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 self-center" />
                            )}
                          </div>
                        );
                      })}

                      {filteredEvents.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-500">
                          <p className="font-semibold text-brand-navy">No fair edition found</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            No edition matches &quot;{eventSearchQuery}&quot;.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* FIELD 2: REGISTERED CONTACT IDENTIFIER */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>Registered Mobile Number or Email ID</span>
              </label>
              <div className="relative flex h-14 rounded-2xl border border-slate-300 bg-slate-50/80 shadow-2xs transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-purple/40 focus-within:border-brand-purple focus-within:bg-white hover:border-brand-purple/50">
                <div className="flex-shrink-0 transition-all duration-300 h-full">
                  {identifier.length > 0 ? (
                    isEmail ? (
                      <div className="flex items-center justify-center w-14 bg-purple-50/80 border-r border-slate-200 h-full text-brand-purple rounded-l-[15px] animate-in slide-in-from-left-2 fade-in">
                        <Mail size={18} className="text-brand-purple" />
                      </div>
                    ) : (
                      <div className="h-full rounded-l-[15px] animate-in slide-in-from-left-2 fade-in">
                        <CountrySelect
                          value={country}
                          onChange={handleCountryChange}
                          labels={en}
                          options={getCountries().map((c) => ({ value: c, label: (en as any)[c] }))}
                          iconComponent={FlagIcon}
                          className="rounded-l-[15px] bg-slate-100/70 hover:bg-slate-200/60 border-slate-200"
                        />
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center w-12 h-full text-slate-400 pl-3">
                      <Phone size={18} />
                    </div>
                  )}
                </div>
                <input
                  type={isEmail ? 'email' : 'tel'}
                  value={identifier}
                  onChange={handleIdentifierChange}
                  className="flex-1 h-full pl-4 pr-16 text-sm sm:text-base text-brand-navy bg-transparent outline-none placeholder:text-gray-400 font-medium"
                  placeholder={
                    isEmail
                      ? 'e.g. ariya@touchmarkdes.com'
                      : identifier.length > 0
                      ? (exampleNum ? `e.g. ${exampleNum.nationalNumber}` : '9876543210')
                      : 'e.g. 9876543210 or yourname@example.com'
                  }
                />

                {/* Digit counter indicator matching RegistrationForm concept (10/10) */}
                {identifier.length > 0 && !isEmail && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none flex items-center select-none">
                    <span
                      className={
                        typedLength === requiredLength
                          ? 'text-emerald-600 font-bold'
                          : 'text-slate-400 font-medium'
                      }
                    >
                      {typedLength}
                    </span>
                    <span className="mx-0.5 text-slate-300 font-normal">/</span>
                    <span className="text-slate-500 font-medium">{requiredLength}</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Enter the mobile number or email submitted during university fair registration.
              </p>
            </div>

            {searchError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{searchError}</p>
                  <p className="mt-1 font-semibold text-red-800">
                    Not registered yet?{' '}
                    <Link href="/events" className="underline hover:text-red-950">
                      Explore university fair editions & register here
                    </Link>
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSearching || !identifier.trim() || !selectedEvent}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple via-[#7e1c9a] to-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Registration...</span>
                </>
              ) : (
                <>
                  <span>Continue to Booth Selection</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Helper Highlights */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100">
              <span className="block font-bold text-brand-purple">
                {selectedEvent ? (selectedEvent.universitiesCount ? `${selectedEvent.universitiesCount} Booths` : 'University Booths') : 'All Booths'}
              </span>
              <span className="text-[10px] text-slate-500">Official Fair</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <span className="block font-bold text-indigo-700">Live Pass</span>
              <span className="text-[10px] text-slate-500">Instant Access</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="block font-bold text-emerald-700">1-Page PDF</span>
              <span className="text-[10px] text-slate-500">Summary Report</span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- STATE 2 & 3: PARTICIPANT LOADED ----------------- */}
      {participant && currentEvent && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Attendee Profile Header Badge */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                {participant.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-brand-navy">{participant.fullName}</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck size={11} />
                    Verified Attendee
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-brand-purple">{currentEvent.title}</span>
                  <span>•</span>
                  <span>{currentEvent.venue || currentEvent.city}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-brand-purple font-semibold flex items-center gap-1.5 transition-colors self-end sm:self-center px-3.5 py-2 rounded-xl border border-slate-200 hover:border-brand-purple/40 bg-slate-50 hover:bg-white cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Change Student / Fair</span>
            </button>
          </div>

          {/* ----------------- CONFIRMED STATE: SHOW EXACT VISITED UNIVERSITY BOOTHS CARD ----------------- */}
          {isConfirmed && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Success Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-emerald-900 text-sm sm:text-base">
                    University Booth Visits Confirmed!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-700 mt-0.5 leading-relaxed">
                    Your visited university booths have been securely saved. Only these {confirmedVisits.length} selected universities are recorded in your event profile and report.
                  </p>
                </div>
              </div>

              {/* Exact "VISITED UNIVERSITY BOOTHS" Card Matching Reference Screenshot */}
              <div className="bg-[#f8fafd] rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                    VISITED UNIVERSITY BOOTHS ({confirmedVisits.length})
                  </h4>
                  <button
                    onClick={() => setIsConfirmed(false)}
                    className="text-xs text-brand-purple hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Edit / Select More Booths</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {confirmedVisits.map((visit) => (
                    <div
                      key={visit.id || visit.universityId}
                      className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-brand-purple/30 transition-all"
                    >
                      {/* Green circle checkmark matching screenshot */}
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.2] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#1e153b] text-sm leading-snug truncate">
                          {visit.universityName}
                        </p>
                        <p className="text-xs text-slate-500 font-normal mt-0.5 truncate">
                          {visit.universityCity || 'India'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Page Report Download Card */}
              <div className="bg-gradient-to-br from-brand-navy via-[#1e153b] to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur border border-white/20 text-brand-turquoise">
                    <Sparkles size={12} />
                    <span>Official Participation Document</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
                    1-Page University Fair Visit Summary
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Download or print your official one-page report featuring verified booth visits, participant credentials, and university fair certification.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3.5 rounded-xl bg-white text-brand-navy hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Download 1-Page Report</span>
                  </button>
                  <button
                    onClick={() => setIsConfirmed(false)}
                    className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Update Selection</span>
                  </button>
                </div>
              </div>

              {/* Printable 1-Page Report Format (Shown in browser print / PDF export) */}
              <div
                id="printable-booth-report"
                className="hidden print:block bg-white text-black p-8 max-w-3xl mx-auto border border-slate-300 rounded-lg text-xs leading-normal"
              >
                <div className="flex justify-between items-start border-b-2 border-purple-900 pb-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-purple-950 font-heading">CAMPUS SQUARE™ - UNIVERSITY FAIR</h1>
                    <p className="text-sm font-semibold text-purple-700">Official Student Booth Visit Report</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-900">{currentEvent.title}</p>
                    <p className="text-slate-500">{currentEvent.venue || currentEvent.city}</p>
                    <p className="text-slate-400 text-[10px] mt-1">Generated: {new Date().toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                {/* Student Details Card */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                  <div>
                    <p><strong className="text-slate-600">Student Name:</strong> {participant.fullName}</p>
                    <p className="mt-1"><strong className="text-slate-600">Registered Mobile:</strong> {participant.mobile}</p>
                    {participant.schoolLevel && (
                      <p className="mt-1"><strong className="text-slate-600">Grade / Standard:</strong> {participant.schoolLevel} {participant.currentStandard || ''}</p>
                    )}
                  </div>
                  <div>
                    <p><strong className="text-slate-600">Email ID:</strong> {participant.email || 'N/A'}</p>
                    <p className="mt-1"><strong className="text-slate-600">Verified Visited Booths:</strong> {confirmedVisits.length} Universities</p>
                    <p className="mt-1"><strong className="text-slate-600">Status:</strong> <span className="text-emerald-700 font-bold">Checked-In / Verified</span></p>
                  </div>
                </div>

                {/* Visited Booths Grid */}
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 border-b pb-1">
                    Verified Visited University Booths ({confirmedVisits.length})
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {confirmedVisits.map((v, idx) => (
                      <div key={v.universityId} className="p-3 border border-slate-200 rounded-md flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-xs">{v.universityName}</p>
                          <p className="text-slate-500 text-[10px]">{v.universityCity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Certification */}
                <div className="border-t border-slate-200 pt-4 mt-8 flex justify-between items-center text-[10px] text-slate-500">
                  <p>&copy; {new Date().getFullYear()} Campus Square™ • Atom Infinity & OriginBI Partner Network</p>
                  <p className="font-semibold text-slate-700">Official University Fair Participation Record</p>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- SELECTION VIEW: ASK PLAN TO VISIT UNIVERSITIES ----------------- */}
          {!isConfirmed && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-purple-100 space-y-6">
              {/* Header & Instructions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-brand-purple border border-purple-200/60 mb-2">
                    <Sparkles size={12} />
                    <span>Exhibiting Universities at {currentEvent.city || 'Your Fair'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-brand-navy">
                    Plan Your University Booth Visits
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Select the institutions you plan to visit or have explored at <strong>{currentEvent.title}</strong>.
                  </p>
                </div>

                {/* Counter & Bulk Actions */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-100 text-brand-purple">
                    {selectedUniIds.size} Selected
                  </span>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs text-brand-purple hover:underline font-semibold px-2 py-1 cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-slate-500 hover:text-slate-700 font-semibold px-2 py-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Previously Saved Note if any */}
              {confirmedVisits.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-brand-purple shrink-0" />
                    <span>
                      You currently have <strong>{confirmedVisits.length} booths</strong> recorded. You can adjust your selection below or confirm to generate your report.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsConfirmed(true)}
                    className="text-xs font-bold text-brand-purple hover:underline shrink-0 cursor-pointer"
                  >
                    View Current Report &rarr;
                  </button>
                </div>
              )}

              {/* Search & City Filter Bar */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search university by name or city (e.g. Amity, Pune, VIT, RV)..."
                    className="w-full px-4 py-3.5 pl-11 text-xs sm:text-sm text-brand-navy bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple"
                  />
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  {searchFilter && (
                    <button
                      type="button"
                      onClick={() => setSearchFilter('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* City Filter Pills */}
                {availableCities.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setCityFilter('ALL')}
                      className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${cityFilter === 'ALL'
                        ? 'bg-brand-purple text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      All Locations ({currentEvent.participatingUniversities.length})
                    </button>
                    {availableCities.map((c) => {
                      const count = currentEvent.participatingUniversities.filter((u) => u.city === c).length;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCityFilter(c)}
                          className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${cityFilter === c
                            ? 'bg-brand-purple text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          {c} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* University Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredUniversities.map((uni) => {
                  const isChecked = selectedUniIds.has(uni.id);

                  return (
                    <div
                      key={uni.id}
                      onClick={() => toggleUniversity(uni.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${isChecked
                        ? 'border-brand-purple bg-purple-50/50 shadow-xs ring-2 ring-brand-purple/20'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs bg-white'
                        }`}
                    >
                      {/* Checkbox button */}
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isChecked
                          ? 'bg-brand-purple border-brand-purple text-white'
                          : 'border-slate-300 bg-white'
                          }`}
                      >
                        {isChecked && <Check size={14} className="stroke-[3]" />}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs sm:text-sm font-bold leading-tight ${isChecked ? 'text-brand-purple' : 'text-brand-navy'
                            }`}
                        >
                          {uni.name}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                          <MapPin size={11} className="shrink-0 text-slate-400" />
                          <span>{uni.city}</span>
                          {uni.boothNumber && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="font-semibold text-slate-600">Booth #{uni.boothNumber}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {filteredUniversities.length === 0 && (
                  <div className="col-span-full py-12 text-center text-xs text-slate-400">
                    No participating universities match your filter.
                  </div>
                )}
              </div>

              {saveError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Bottom Confirm Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600 text-center sm:text-left">
                  <strong className="text-brand-navy font-bold">{selectedUniIds.size}</strong> of{' '}
                  {currentEvent.participatingUniversities.length} eligible booths selected
                </div>

                <button
                  type="button"
                  onClick={handleConfirmVisits}
                  disabled={isSaving || selectedUniIds.size === 0}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-purple via-[#7e1c9a] to-purple-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Recording Booth Visits...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Confirm & Record Visited Booths</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
