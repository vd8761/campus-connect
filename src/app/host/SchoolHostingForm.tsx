"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitSchoolHostingEnquiry } from '@/app/actions/enquiries';
import { CheckCircle2, AlertCircle, School, User, Mail, Phone, MapPin, Calendar, Users, Send, ChevronDown } from 'lucide-react';

interface FormState {
  schoolName: string;
  location: string;
  contactPerson: string;
  designation: string;
  officialEmail: string;
  phoneNumber: string;
  expectedStudentAudience: string;
  preferredDates: string;
  notes: string;
}

export function SchoolHostingForm() {
  const [formData, setFormData] = useState<FormState>({
    schoolName: '',
    location: '',
    contactPerson: '',
    designation: '',
    officialEmail: '',
    phoneNumber: '',
    expectedStudentAudience: '250-500 Students',
    preferredDates: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; enquiryId?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateField = (name: keyof FormState, value: string): string => {
    switch (name) {
      case 'schoolName':
        if (!value.trim()) return 'School or institution name is required.';
        if (value.trim().length < 2) return 'School name must be at least 2 characters.';
        return '';
      case 'location':
        if (!value.trim()) return 'School location (City, State) is required.';
        return '';
      case 'contactPerson':
        if (!value.trim()) return 'Principal or coordinator name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      case 'designation':
        if (!value.trim()) return 'Designation is required (e.g. Principal, Director).';
        return '';
      case 'officialEmail':
        if (!value.trim()) return 'Official school email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address (e.g. principal@school.edu.in).';
        }
        return '';
      case 'phoneNumber': {
        if (!value.trim()) return 'Phone number is required.';
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) return 'Please enter a valid 10-digit mobile number.';
        return '';
      }
      case 'expectedStudentAudience':
        if (!value.trim()) return 'Please select expected student audience.';
        return '';
      case 'preferredDates':
        if (!value.trim()) return 'Please specify preferred month, term, or tentative dates.';
        return '';
      default:
        return '';
    }
  };

  const validateAll = (data: FormState): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    (Object.keys(data) as Array<keyof FormState>).forEach(key => {
      const err = validateField(key, data[key]);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      const fieldError = validateField(name as keyof FormState, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldError = validateField(name as keyof FormState, value);
    if (fieldError) {
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validationErrors = validateAll(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach(k => { allTouched[k] = true; });
      setTouched(allTouched);

      const firstInvalidField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstInvalidField}"]`) as HTMLElement;
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);

    try {
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const refSource = urlParams ? (urlParams.get('utm_source') || urlParams.get('ref') || 'Website Host Page') : 'Website Host Page';

      const res = await submitSchoolHostingEnquiry({
        ...formData,
        referralSource: refSource,
      });

      if (res.success) {
        setSuccessData({
          message: res.message || "Thank you! Your school hosting enquiry has been submitted.",
          enquiryId: res.enquiryId,
        });
        setFormData({
          schoolName: '',
          location: '',
          contactPerson: '',
          designation: '',
          officialEmail: '',
          phoneNumber: '',
          expectedStudentAudience: '250-500 Students',
          preferredDates: '',
          notes: '',
        });
        setErrors({});
        setTouched({});
      } else {
        if (res.fieldErrors) {
          setErrors(res.fieldErrors);
        }
        setErrorMessage(res.error || "Failed to submit enquiry. Please check your inputs.");
      }
    } catch (err: any) {
      setErrorMessage("An unexpected error occurred. Please try again or reach out on WhatsApp at 8056134455.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessData(null);
    setErrorMessage(null);
    setErrors({});
    setTouched({});
  };

  const getInputClass = (fieldName: string, hasIcon: boolean = false) => {
    const hasError = Boolean(errors[fieldName]);
    return `w-full h-12 ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 rounded-xl border text-sm text-brand-navy outline-none transition-all ${
      hasError
        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
        : 'border-brand-border bg-slate-50/50 hover:border-brand-purple/40 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15'
    }`;
  };

  const getTextareaClass = (fieldName: string) => {
    const hasError = Boolean(errors[fieldName]);
    return `w-full p-4 rounded-xl border text-sm text-brand-navy outline-none transition-all ${
      hasError
        ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
        : 'border-brand-border bg-slate-50/50 hover:border-brand-purple/40 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15'
    }`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border/80 shadow-xl" id="host-form">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-turquoise/20 text-brand-navy text-xs font-bold uppercase tracking-wider mb-3">
          <School size={14} className="text-brand-purple" />
          <span>School Host Application</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy">
          Host a Campus Square Edition
        </h3>
        <p className="text-brand-muted text-sm mt-1">
          Provide your school details to schedule a preliminary discussion with our school partnerships director.
        </p>
      </div>

      {successData ? (
        <div className="py-10 px-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center flex flex-col items-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-3">
            Hosting Proposal Received
          </span>
          <h4 className="text-2xl font-heading font-extrabold text-emerald-950 mb-2">
            School Hosting Enquiry Received!
          </h4>
          <p className="text-emerald-800 text-sm max-w-md leading-relaxed mb-6">
            {successData.message}
          </p>

          {successData.enquiryId && (
            <div className="text-xs font-mono text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 mb-6">
              Reference ID: #{successData.enquiryId.slice(0, 8).toUpperCase()}
            </div>
          )}

          <div className="w-full max-w-md bg-white p-4 rounded-xl border border-emerald-200/80 text-xs text-slate-700 space-y-2 mb-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Direct Coordinator:</span>
              <strong className="text-slate-900">School Partnerships Director</strong>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">WhatsApp Helpline:</span>
              <a href="https://wa.me/918056134455" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">
                +91 80561 34455
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Email:</span>
              <a href="mailto:interact@atom-infinity.com" className="text-brand-purple font-bold hover:underline">
                interact@atom-infinity.com
              </a>
            </div>
          </div>

          <Button
            onClick={resetForm}
            variant="outline"
            className="rounded-xl font-bold text-xs px-6 py-2.5 cursor-pointer"
          >
            Submit Another School Hosting Proposal
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* School Name */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                School Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. The Little Kingdom School"
                  className={getInputClass('schoolName', true)}
                />
                <School size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.schoolName ? 'text-red-400' : 'text-brand-muted'}`} />
              </div>
              {errors.schoolName && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.schoolName}</span>
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                City / Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Theni, Tamil Nadu"
                  className={getInputClass('location', true)}
                />
                <MapPin size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.location ? 'text-red-400' : 'text-brand-muted'}`} />
              </div>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.location}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Contact Person */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Dr. K. Meenakshi"
                  className={getInputClass('contactPerson', true)}
                />
                <User size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.contactPerson ? 'text-red-400' : 'text-brand-muted'}`} />
              </div>
              {errors.contactPerson && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.contactPerson}</span>
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Principal / Correspondent / Dean"
                  className={getInputClass('designation', false)}
                />
              </div>
              {errors.designation && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.designation}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Official Email */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Official Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="officialEmail"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="principal@school.edu.in"
                  className={getInputClass('officialEmail', true)}
                />
                <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.officialEmail ? 'text-red-400' : 'text-brand-muted'}`} />
              </div>
              {errors.officialEmail && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.officialEmail}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Phone Number / Mobile <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+91 98765 43210"
                  className={getInputClass('phoneNumber', true)}
                />
                <Phone size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.phoneNumber ? 'text-red-400' : 'text-brand-muted'}`} />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.phoneNumber}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Expected Student Audience */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Expected Student Audience (Grades 9–12) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="expectedStudentAudience"
                  value={formData.expectedStudentAudience}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${getInputClass('expectedStudentAudience', true)} !pr-10 appearance-none cursor-pointer bg-white`}
                >
                  <option value="100-250 Students">100–250 Students</option>
                  <option value="250-500 Students">250–500 Students (Recommended)</option>
                  <option value="500-1000 Students">500–1,000 Students</option>
                  <option value="1000+ Students">1,000+ Students (Mega Edition)</option>
                </select>
                <Users size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${errors.expectedStudentAudience ? 'text-red-400' : 'text-brand-muted'}`} />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronDown size={16} className={`transition-colors ${errors.expectedStudentAudience ? 'text-red-400' : 'text-brand-muted'}`} />
                </div>
              </div>
              {errors.expectedStudentAudience && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.expectedStudentAudience}</span>
                </p>
              )}
            </div>

            {/* Preferred Dates */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Preferred Month / Term / Dates <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="preferredDates"
                  value={formData.preferredDates}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. October–November 2026, or Weekends"
                  className={getInputClass('preferredDates', true)}
                />
                <Calendar size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.preferredDates ? 'text-red-400' : 'text-brand-muted'}`} />
              </div>
              {errors.preferredDates && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.preferredDates}</span>
                </p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Campus Facilities & Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us about your campus auditorium, sports hall, or any specific clusters of neighboring schools to invite..."
              className={getTextareaClass('notes')}
            ></textarea>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="default"
            size="lg"
            className="w-full bg-brand-navy text-white hover:bg-brand-purple rounded-xl py-6 text-base font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.99]"
          >
            {loading ? "Submitting Host Application..." : "Submit School Hosting Proposal"}
            <Send size={18} />
          </Button>

          <p className="text-center text-xs text-brand-muted pt-2">
            Our school partnerships coordinator will review your campus profile and schedule a call.
          </p>
        </form>
      )}
    </div>
  );
}
