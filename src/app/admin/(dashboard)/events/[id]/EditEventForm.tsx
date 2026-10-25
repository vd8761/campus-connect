'use client';

import { useState, useEffect } from 'react';
import { updateEventAction } from './actions';
import { getActiveEventTypesAction } from '../../event-types/actions';
import { Button } from '@/components/ui/Button';
import { SubmitButton } from '@/components/ui/SubmitButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { ValidatedForm } from '@/components/ui/ValidatedForm';
import { InputError } from '@/components/ui/InputError';
import { ParticipatingUniversitiesSelector } from '../ParticipatingUniversitiesSelector';
import { to24HourTime, formatDateToInput, parseInitialDate } from '@/lib/dateUtils';
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react';

export function EditEventForm({ event }: { event: any }) {
  const [slug, setSlug] = useState(event.slug);
  const [copiedBoothUrl, setCopiedBoothUrl] = useState(false);
  const [isDateTba, setIsDateTba] = useState<boolean>(!!event.isDateTba);
  const [isVenueTba, setIsVenueTba] = useState<boolean>(!!event.isVenueTba);
  const [startDate, setStartDate] = useState<Date | null>(parseInitialDate(event.startDate));
  const [endDate, setEndDate] = useState<Date | null>(parseInitialDate(event.endDate));
  const [regOpenDate, setRegOpenDate] = useState<Date | null>(parseInitialDate(event.registrationOpen));
  const [regCloseDate, setRegCloseDate] = useState<Date | null>(parseInitialDate(event.registrationClose));
  const [eventTypes, setEventTypes] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    getActiveEventTypesAction().then(setEventTypes);
  }, []);

  const generateSlug = (title: string) => {
    setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const updateActionWithId = updateEventAction.bind(null, event.id);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-navy">Edit Event</h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">Update the details for this summit or fair.</p>
        </div>
      </div>

      <ValidatedForm action={updateActionWithId} className="space-y-6 sm:space-y-8">
        
        {/* Basic Details Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-bold text-brand-navy">Basic Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">Event Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="title" 
                defaultValue={event.title}
                required 
                onChange={(e) => generateSlug(e.target.value)}
                placeholder="e.g. University Fair 2026"
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all placeholder:text-gray-400"
              />
              <InputError message="Event Title is required." />
            </div>
            
            <div className="form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">Event Type <span className="text-red-500">*</span></label>
              <SearchableDropdown 
                name="type"
                options={eventTypes}
                defaultValue={event.type}
                placeholder="Search Event Type..."
                required
              />
              <InputError message="Event Type is required." />
            </div>
            
            <div className="md:col-span-2 form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">URL Slug <span className="text-red-500">*</span></label>
              <div className="flex flex-col sm:flex-row">
                <span className="inline-flex items-center h-9 sm:h-11 px-3 sm:px-4 rounded-t-xl sm:rounded-t-none sm:rounded-l-xl border border-b-0 sm:border-b sm:border-r-0 border-brand-border/80 bg-gray-50 text-gray-500 text-xs sm:text-sm select-none truncate">
                  campussquare.originbi.com/events/
                </span>
                <input 
                  type="text" 
                  name="slug" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required 
                  placeholder="university-fair-2026"
                  className="flex-1 h-10 sm:h-11 px-3 sm:px-4 rounded-b-xl sm:rounded-b-none sm:rounded-r-xl border border-brand-border/80 text-xs sm:text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all"
                />
              </div>
              <InputError message="URL Slug is required." />
            </div>

            {/* Edition Booth Visits UUID Link (For QR Codes & Signage) */}
            <div className="md:col-span-2 p-4 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-purple mb-1">
                    <QrCode size={15} />
                    <span>Unique Edition Booths URL (For Signage & QR Codes)</span>
                  </div>
                  <div className="text-xs text-brand-muted">
                    Students scanning this URL are automatically locked to this edition&apos;s college booth visits and checklists.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/booths/${event.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-brand-purple hover:underline bg-white px-3 py-1.5 rounded-lg border border-purple-200 shadow-2xs flex items-center gap-1 shrink-0"
                  >
                    <span>/booths/{event.id.slice(0, 8)}...</span>
                    <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const fullUrl = `${window.location.origin}/booths/${event.id}`;
                      navigator.clipboard.writeText(fullUrl);
                      setCopiedBoothUrl(true);
                      setTimeout(() => setCopiedBoothUrl(false), 2000);
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-brand-purple text-white hover:bg-brand-purple/90 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedBoothUrl ? (
                      <>
                        <Check size={12} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></div>
            <h2 className="text-xl font-bold text-brand-navy">Location Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">City <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="city" 
                defaultValue={event.city}
                required 
                placeholder="e.g. Trichy"
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all placeholder:text-gray-400"
              />
              <InputError message="City is required." />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-brand-navy">Venue</label>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-purple cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    name="isVenueTba" 
                    checked={isVenueTba} 
                    onChange={(e) => setIsVenueTba(e.target.checked)} 
                    className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple/20 h-4 w-4"
                  />
                  <span>Venue to be announced (TBA)</span>
                </label>
              </div>
              <input 
                type="text" 
                name="venue" 
                defaultValue={event.venue || ''}
                disabled={isVenueTba}
                placeholder={isVenueTba ? "To Be Announced (TBA)" : "e.g. SRM Hotel, Trichy"}
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Capacity Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></div>
              <h2 className="text-xl font-bold text-brand-navy">Schedule & Capacity</h2>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-brand-purple bg-brand-light px-3 py-1.5 rounded-lg cursor-pointer border border-brand-border/60 select-none">
              <input 
                type="checkbox" 
                name="isDateTba" 
                checked={isDateTba} 
                onChange={(e) => setIsDateTba(e.target.checked)} 
                className="rounded border-gray-300 text-brand-purple focus:ring-brand-purple/20 h-4 w-4"
              />
              <span>Date to be announced (TBA)</span>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">
                Event Start Date {!isDateTba && <span className="text-red-500">*</span>}
                {isDateTba && <span className="text-xs text-brand-muted font-normal ml-2">(Optional / Tentative)</span>}
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input type="hidden" name="startDate" value={formatDateToInput(startDate)} />
                  <DatePicker 
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={isDateTba ? "TBA (Select tentative date or leave empty)" : "Select date"}
                    required={!isDateTba}
                    className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all"
                    wrapperClassName="w-full"
                  />
                </div>
                <input 
                  type="time" 
                  name="startTime" 
                  defaultValue={to24HourTime(event.startTime)}
                  disabled={isDateTba}
                  className="w-full sm:w-auto flex-1 h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all disabled:bg-gray-100" 
                />
              </div>
              {!isDateTba && <InputError message="Start Date is required." />}
            </div>
            
            <div className="form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">
                Event End Date {!isDateTba && <span className="text-red-500">*</span>}
                {isDateTba && <span className="text-xs text-brand-muted font-normal ml-2">(Optional / Tentative)</span>}
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input type="hidden" name="endDate" value={formatDateToInput(endDate)} />
                  <DatePicker 
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={isDateTba ? "TBA (Select tentative date or leave empty)" : "Select date"}
                    required={!isDateTba}
                    className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all"
                    wrapperClassName="w-full"
                  />
                </div>
                <input 
                  type="time" 
                  name="endTime" 
                  defaultValue={to24HourTime(event.endTime)}
                  disabled={isDateTba}
                  className="w-full sm:w-auto flex-1 h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all disabled:bg-gray-100" 
                />
              </div>
              {!isDateTba && <InputError message="End Date is required." />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-navy mb-2">Registration Opens</label>
              <input type="hidden" name="registrationOpen" value={formatDateToInput(regOpenDate)} />
              <DatePicker 
                selected={regOpenDate}
                onChange={(date: Date | null) => setRegOpenDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all"
                wrapperClassName="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-navy mb-2">Registration Closes</label>
              <input type="hidden" name="registrationClose" value={formatDateToInput(regCloseDate)} />
              <DatePicker 
                selected={regCloseDate}
                onChange={(date: Date | null) => setRegCloseDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all"
                wrapperClassName="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-navy mb-2">Max Capacity</label>
              <input 
                type="number" 
                name="maxCapacity"
                defaultValue={event.maxCapacity || ''}
                placeholder="e.g. 500"
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Participating Universities Section */}
        <ParticipatingUniversitiesSelector initialSelectedIds={event.universityIds || []} />

        {/* Media & Content Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></div>
            <h2 className="text-xl font-bold text-brand-navy">Media & Content</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-navy mb-2">Event Picture (Banner URL)</label>
            <ImageUpload name="bannerUrl" defaultValue={event.bannerUrl || ''} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-navy mb-2">Short Description</label>
            <RichTextEditor 
              name="shortDescription" 
              defaultValue={event.shortDescription || ''}
              placeholder="A brief 1-2 sentence summary of the event."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-navy mb-2">About The Event (Full Description)</label>
            <RichTextEditor 
              name="fullDescription" 
              defaultValue={event.fullDescription || ''}
              placeholder="Detailed description of the event. Feel free to use formatting."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-navy mb-2">What to Expect (Bullet Points)</label>
            <RichTextEditor 
              name="whatToExpect" 
              defaultValue={event.whatToExpect || ''}
              placeholder="Create a bulleted list of what attendees can expect."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end gap-4">
          <SubmitButton
            loadingText="Saving Changes..."
            className="bg-gradient-to-r from-brand-purple to-brand-turquoise hover:from-brand-navy hover:to-brand-purple text-white px-12 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all h-12"
          >
            Save Changes
          </SubmitButton>
        </div>
      </ValidatedForm>
    </div>
  );
}
