"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitUniversityPartnershipEnquiry } from '@/app/actions/enquiries';
import { CheckCircle2, AlertCircle, Building2, User, Mail, Phone, Globe, MapPin, Send, ArrowRight } from 'lucide-react';

interface FormState {
  universityName: string;
  contactPerson: string;
  designation: string;
  officialEmail: string;
  phoneNumber: string;
  website: string;
  preferredLocations: string;
  partnershipInterests: string;
}

export function UniversityPartnershipForm() {
  const [formData, setFormData] = useState<FormState>({
    universityName: '',
    contactPerson: '',
    designation: '',
    officialEmail: '',
    phoneNumber: '',
    website: '',
    preferredLocations: '',
    partnershipInterests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; enquiryId?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateField = (name: keyof FormState, value: string): string => {
    switch (name) {
      case 'universityName':
        if (!value.trim()) return 'University or institution name is required.';
        if (value.trim().length < 2) return 'Institution name must be at least 2 characters.';
        return '';
      case 'contactPerson':
        if (!value.trim()) return 'Contact person name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      case 'designation':
        if (!value.trim()) return 'Designation or department is required.';
        return '';
      case 'officialEmail':
        if (!value.trim()) return 'Official email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address (e.g. admissions@university.edu.in).';
        }
        return '';
      case 'phoneNumber': {
        if (!value.trim()) return 'Phone number is required.';
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) return 'Please enter a valid 10-digit mobile or phone number.';
        return '';
      }
      case 'website':
        if (value.trim() && !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i.test(value.trim())) {
          return 'Please enter a valid website URL (e.g. https://example.edu.in).';
        }
        return '';
      case 'preferredLocations':
        if (!value.trim()) return 'Please enter preferred event locations or cities.';
        return '';
      case 'partnershipInterests':
        if (!value.trim()) return 'Please tell us about your courses or partnership interests.';
        if (value.trim().length < 5) return 'Please provide more details on your courses/interests.';
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

    // If there's an existing error on this field, clear it as user types
    if (errors[name]) {
      const fieldError = validateField(name as keyof FormState, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Run client validation
    const validationErrors = validateAll(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all fields touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach(k => { allTouched[k] = true; });
      setTouched(allTouched);

      // Scroll to first invalid input
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
      const refSource = urlParams ? (urlParams.get('utm_source') || urlParams.get('ref') || 'Website Partnerships Page') : 'Website Partnerships Page';

      const res = await submitUniversityPartnershipEnquiry({
        ...formData,
        referralSource: refSource,
      });

      if (res.success) {
        setSuccessData({
          message: res.message || "Thank you! Your partnership enquiry has been submitted.",
          enquiryId: res.enquiryId,
        });
        setFormData({
          universityName: '',
          contactPerson: '',
          designation: '',
          officialEmail: '',
          phoneNumber: '',
          website: '',
          preferredLocations: '',
          partnershipInterests: '',
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
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border/80 shadow-xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider mb-3">
          <Building2 size={14} />
          <span>Partnership Application</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy">
          University Partnership Enquiry
        </h3>
        <p className="text-brand-muted text-sm mt-1">
          Complete this short form and our institutional partnerships team will connect with your admissions office.
        </p>
      </div>

      {successData ? (
        <div className="py-10 px-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center flex flex-col items-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-3">
            Enquiry Sent Successfully
          </span>
          <h4 className="text-2xl font-heading font-extrabold text-emerald-950 mb-2">
            Partnership Enquiry Received!
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
              <strong className="text-slate-900">University Relations Desk</strong>
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
            Submit Another University Enquiry
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
            {/* University Name */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                University / Institution Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Apex Global University"
                  className={getInputClass('universityName', true)}
                />
                <Building2 size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.universityName ? 'text-red-400' : 'text-brand-muted'}`} />
              </div>
              {errors.universityName && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.universityName}</span>
                </p>
              )}
            </div>

            {/* Official Website */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Official Website
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://example.edu.in"
                  className={getInputClass('website', true)}
                />
                <Globe size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.website ? 'text-red-400' : 'text-brand-muted'}`} />
              </div>
              {errors.website && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={13} className="shrink-0" />
                  <span>{errors.website}</span>
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
                  placeholder="e.g. Dr. Rajesh Kumar"
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
                Designation / Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Director of Admissions / Dean"
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
                  placeholder="admissions@university.edu.in"
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

          {/* Preferred Locations */}
          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Preferred Event Locations / Cities <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="preferredLocations"
                value={formData.preferredLocations}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Theni, Coimbatore, Trichy, Chennai, Bangalore, All Upcoming"
                className={getInputClass('preferredLocations', true)}
              />
              <MapPin size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.preferredLocations ? 'text-red-400' : 'text-brand-muted'}`} />
            </div>
            {errors.preferredLocations && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={13} className="shrink-0" />
                <span>{errors.preferredLocations}</span>
              </p>
            )}
          </div>

          {/* Partnership Interests */}
          <div>
            <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
              Partnership Interests & Program Offerings <span className="text-red-500">*</span>
            </label>
            <textarea
              name="partnershipInterests"
              rows={3}
              value={formData.partnershipInterests}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tell us about the courses you want to showcase (e.g. Engineering, Management, Liberal Arts, Design) and your preferred mode of participation..."
              className={getTextareaClass('partnershipInterests')}
            ></textarea>
            {errors.partnershipInterests && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={13} className="shrink-0" />
                <span>{errors.partnershipInterests}</span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="gradient"
            size="lg"
            className="w-full rounded-xl py-6 text-base font-bold shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.99]"
          >
            {loading ? "Submitting Partnership Enquiry..." : "Submit University Enquiry"}
            <Send size={18} />
          </Button>

          <p className="text-center text-xs text-brand-muted pt-2">
            By submitting, you agree to receive communications regarding Campus Square partnership editions.
          </p>
        </form>
      )}
    </div>
  );
}
