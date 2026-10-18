'use client';

import { useState, useEffect } from 'react';
import { createEventAction } from './actions';
import { getActiveEventTypesAction } from '../../event-types/actions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { ValidatedForm } from '@/components/ui/ValidatedForm';
import { InputError } from '@/components/ui/InputError';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { ParticipatingUniversitiesSelector } from '../ParticipatingUniversitiesSelector';
import { formatDateToInput } from '@/lib/dateUtils';

export default function NewEventPage() {
  const [slug, setSlug] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [regOpenDate, setRegOpenDate] = useState<Date | null>(null);
  const [regCloseDate, setRegCloseDate] = useState<Date | null>(null);
  const [eventTypes, setEventTypes] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    getActiveEventTypesAction().then(setEventTypes);
  }, []);

  const generateSlug = (title: string) => {
    setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-navy">Create New Event</h1>
        <p className="text-brand-muted mt-1">Fill out the details to launch a new summit or fair.</p>
      </div>

      <ValidatedForm action={createEventAction} className="space-y-8">
        
        {/* Basic Details Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></div>
            <h2 className="text-xl font-bold text-brand-navy">Basic Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">Event Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="title" 
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
                placeholder="Search Event Type..."
                required
              />
              <InputError message="Event Type is required." />
            </div>
            
            <div className="md:col-span-2 form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">URL Slug <span className="text-red-500">*</span></label>
              <div className="flex">
                <span className="inline-flex items-center h-11 px-4 rounded-l-xl border border-r-0 border-brand-border/80 bg-gray-50 text-gray-500 text-sm select-none">
                  campussquare.originbi.com/events/
                </span>
                <input 
                  type="text" 
                  name="slug" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required 
                  placeholder="university-fair-2026"
                  className="flex-1 h-11 px-4 rounded-r-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all"
                />
              </div>
              <InputError message="URL Slug is required." />
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
                required 
                placeholder="e.g. Trichy"
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all placeholder:text-gray-400"
              />
              <InputError message="City is required." />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-navy mb-2">Venue</label>
              <input 
                type="text" 
                name="venue" 
                placeholder="e.g. SRM Hotel, Trichy"
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Capacity Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></div>
            <h2 className="text-xl font-bold text-brand-navy">Schedule & Capacity</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">Event Start Date <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input type="hidden" name="startDate" value={formatDateToInput(startDate)} />
                  <DatePicker 
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all"
                    wrapperClassName="w-full"
                  />
                </div>
                <input 
                  type="time" 
                  name="startTime" 
                  className="w-full sm:w-auto flex-1 h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all" 
                />
              </div>
              <InputError message="Start Date is required." />
            </div>
            
            <div className="form-field">
              <label className="block text-sm font-bold text-brand-navy mb-2">Event End Date <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input type="hidden" name="endDate" value={formatDateToInput(endDate)} />
                  <DatePicker 
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all"
                    wrapperClassName="w-full"
                  />
                </div>
                <input 
                  type="time" 
                  name="endTime" 
                  className="w-full sm:w-auto flex-1 h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all" 
                />
              </div>
              <InputError message="End Date is required." />
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
                placeholder="e.g. 500"
                className="w-full h-11 px-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
            <strong>Note:</strong> Event Status (Opening Soon, Open, Closed) will automatically be calculated based on the Registration Opens and Closes dates you select.
          </div>
        </div>

        {/* Participating Universities Section */}
        <ParticipatingUniversitiesSelector />

        {/* Media & Content Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></div>
            <h2 className="text-xl font-bold text-brand-navy">Media & Content</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-navy mb-2">Event Picture (Banner URL)</label>
            <ImageUpload name="bannerUrl" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-navy mb-2">Short Description</label>
            <RichTextEditor 
              name="shortDescription" 
              placeholder="A brief 1-2 sentence summary of the event."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-navy mb-2">About The Event (Full Description)</label>
            <RichTextEditor 
              name="fullDescription" 
              placeholder="Detailed description of the event. Feel free to use formatting."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-brand-navy mb-2">What to Expect (Bullet Points)</label>
            <RichTextEditor 
              name="whatToExpect" 
              placeholder="Create a bulleted list of what attendees can expect."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <SubmitButton
            loadingText="Creating Event..."
            className="bg-gradient-to-r from-brand-purple to-brand-turquoise hover:from-brand-navy hover:to-brand-purple text-white px-12 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all h-12"
          >
            Create Event
          </SubmitButton>
        </div>
      </ValidatedForm>
    </div>
  );
}
