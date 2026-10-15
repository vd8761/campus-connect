"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { registerForEvent } from '@/app/actions/register';
import { CheckCircle2, ChevronDown, AlertCircle, Printer, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import PhoneInput, { isValidPhoneNumber, getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 
import { getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { Turnstile } from '@marsidev/react-turnstile';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { OriginBIHighlightBox } from '@/components/OriginBIHighlightBox';

const formSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  gender: z.string().min(2, "Gender is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().refine((val) => val && isValidPhoneNumber(val), {
    message: "Invalid phone number for the selected country"
  }),
  turnstileToken: z.string().min(1, "Please complete the security check"),
  board: z.string().min(2, "Board is required"),
  schoolLevel: z.string().min(2, "School level is required"),
  stream: z.string().optional(),
  currentStandard: z.string().optional(),
  organizationName: z.string().min(2, "School name is required"),
  city: z.string().min(2, "Location (City) is required"),
  address: z.string().min(5, "Address is required"),
});

// Custom UI Select Dropdown to replace native <select>
function CustomSelect({ options, value, onChange, placeholder, hasError, disabled = false }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <div className={`relative w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} ref={dropdownRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-12 px-3 rounded-md border text-sm flex items-center justify-between cursor-pointer transition-all duration-200 shadow-sm
          ${hasError 
            ? 'border-status-error bg-red-50/30 text-brand-navy focus:ring-1 focus:ring-status-error' 
            : 'border-brand-border bg-white text-brand-navy hover:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple'}
          ${isOpen ? (hasError ? 'ring-1 ring-status-error border-status-error' : 'ring-1 ring-brand-purple border-brand-purple shadow-md') : ''}`}
      >
        <span className={!selectedOption ? (hasError ? 'text-status-error/80' : 'text-gray-400') : 'text-brand-navy font-medium'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${hasError ? 'text-status-error' : 'text-brand-muted'}`} />
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-brand-border rounded-md shadow-xl py-1 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option: any) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between
                ${value === option.value 
                  ? 'bg-brand-purple/5 text-brand-purple font-semibold' 
                  : 'text-brand-navy hover:bg-gray-50'}`}
            >
              {option.label}
              {value === option.value && <CheckCircle2 size={14} className="text-brand-purple" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="text-status-error text-xs mt-1.5 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1">
      <AlertCircle size={12} />
      {message}
    </p>
  );
};

const PhoneInputAdapter = React.forwardRef<HTMLInputElement, any>(
  ({ expectedDigits, onDigitsChange, selectedCountry, country, onChange, value, ...props }, ref) => {
    // Strip spaces from the formatted value passed down by the library
    let displayValue = typeof value === 'string' ? value.replace(/\s+/g, '') : value;

    const actualCountry = selectedCountry || country;

    // libphonenumber-js adds a '0' trunk prefix for Indian numbers in national format.
    // We strip it here so the user only sees the 10 digits they typed.
    if (actualCountry === 'IN' && typeof displayValue === 'string' && displayValue.startsWith('0')) {
      displayValue = displayValue.substring(1);
    }

    React.useEffect(() => {
      if (onDigitsChange) {
        onDigitsChange(displayValue ? displayValue.replace(/\D/g, '').length : 0);
      }
    }, [displayValue, onDigitsChange]);

    return (
      <input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={(e) => {
          if (expectedDigits) {
            const digits = e.target.value.replace(/\D/g, '').length;
            if (digits > expectedDigits) {
              return; 
            }
          }
          onChange(e);
        }}
      />
    );
  }
);
PhoneInputAdapter.displayName = 'PhoneInputAdapter';

export function RegistrationForm({ 
  eventId, 
  eventSlug, 
  eventTitle, 
  initialData 
}: { 
  eventId: string; 
  eventSlug: string; 
  eventTitle?: string; 
  initialData?: any; 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{
    ticketCode: string;
    studentName?: string;
    email?: string;
    phone?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState<any>('IN');
  const countryChangeFlag = useRef(false);

  useEffect(() => {
    if (successData) {
      const scrollToCard = () => {
        const cardElement = document.getElementById('registration-card');
        if (cardElement) {
          const headerOffset = 85;
          const elementPosition = cardElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };

      // Run on next tick after React DOM commit and resize
      const timer = setTimeout(scrollToCard, 60);
      return () => clearTimeout(timer);
    }
  }, [successData]);

  const handleCopyCode = (code: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: initialData?.studentName || initialData?.fullName || "",
      gender: initialData?.gender || "",
      email: initialData?.email || "",
      phone: (() => {
        const p = initialData?.phone || initialData?.mobile || "";
        if (!p) return "";
        
        if (p.startsWith("+")) {
          let digits = p.replace(/\D/g, "");
          if (digits.startsWith("910") && digits.length === 13) {
            digits = "91" + digits.substring(3);
          }
          return `+${digits}`;
        }

        let digits = p.replace(/\D/g, "");
        if (!digits) return "";
        
        if (digits.length === 11 && digits.startsWith("0")) {
          digits = digits.substring(1);
        }
        
        if (digits.length === 10) return `+91${digits}`;
        return `+${digits}`;
      })(),
      board: initialData?.board || "",
      schoolLevel: initialData?.schoolLevel || "",
      stream: initialData?.stream || "",
      currentStandard: initialData?.currentStandard || "",
      organizationName: initialData?.organizationName || initialData?.organization?.name || "",
      city: initialData?.city || initialData?.organization?.city || "",
      address: initialData?.address || initialData?.organization?.address || "",
      turnstileToken: "",
    }
  });

  const [typedLength, setTypedLength] = useState(0);

  const selectedBoard = watch("board");
  const selectedSchoolLevel = watch("schoolLevel");

  const exampleNum = phoneCountry ? getExampleNumber(phoneCountry, examples) : undefined;
  const requiredLength = exampleNum ? exampleNum.nationalNumber.length : 10;

  const handleAutoFetch = async (field: 'email' | 'mobile', value: string) => {
    if (!value || value.length < 5) return;
    try {
      const res = await fetch(`/api/participant?${field}=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (data.success && data.participant) {
        const p = data.participant;
        if (p.fullName) setValue('studentName', p.fullName);
        if (p.gender) setValue('gender', p.gender);
        if (field === 'mobile' && p.email) setValue('email', p.email);
        if (field === 'email' && p.mobile) setValue('phone', p.mobile);
        
        if (p.board) setValue('board', p.board);
        if (p.schoolLevel) setValue('schoolLevel', p.schoolLevel);
        if (p.stream) setValue('stream', p.stream);
        if (p.currentStandard) setValue('currentStandard', p.currentStandard);
        
        if (p.organization) {
          if (p.organization.name) setValue('organizationName', p.organization.name);
          if (p.organization.city) setValue('city', p.organization.city);
          if (p.organization.address) setValue('address', p.organization.address);
        }
      }
    } catch (e) {
      console.error('Failed to auto-fetch participant', e);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedSchoolLevel === "HSC" && !values.stream) {
      setError("Please select a stream for HSC level.");
      return;
    }
    if (selectedSchoolLevel === "HSC" && !values.currentStandard) {
      setError("Please select your current standard.");
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    const result = await registerForEvent({ ...values, eventId });
    
    if (result.success && result.ticketCode) {
      setSuccessData({ 
        ticketCode: result.ticketCode,
        studentName: values.studentName,
        email: values.email,
        phone: values.phone
      });
    } else {
      setError(result.error || 'Something went wrong.');
    }
    
    setIsSubmitting(false);
  };

  if (successData) {
    return (
      <div className="text-center py-6 sm:py-10 flex flex-col items-center bg-white rounded-xl shadow-xs border border-brand-border/80 p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 w-full">
        {/* Animated Checkmark Circle */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-8 ring-emerald-50/60 shadow-xs">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 drop-shadow-sm" />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-navy mb-2 sm:mb-3">
          Registration Confirmed!
        </h3>
        
        <p className="text-brand-muted mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed px-2">
          You have successfully registered for the event. Please save the QR code below for check-in at the venue.
        </p>

        {/* Attendee & Event Details Summary */}
        {(eventTitle || successData.studentName) && (
          <div className="w-full max-w-md bg-brand-light/60 border border-brand-border/80 rounded-xl p-3.5 sm:p-4 mb-6 text-left text-xs sm:text-sm">
            {eventTitle && (
              <div className="flex items-center justify-between py-1.5 border-b border-brand-border/40 gap-3">
                <span className="text-brand-muted font-medium shrink-0">Event</span>
                <span className="font-bold text-brand-navy text-right truncate">{eventTitle}</span>
              </div>
            )}
            {successData.studentName && (
              <div className="flex items-center justify-between py-1.5 border-b border-brand-border/40 gap-3">
                <span className="text-brand-muted font-medium shrink-0">Attendee</span>
                <span className="font-semibold text-brand-navy text-right truncate">{successData.studentName}</span>
              </div>
            )}
            {successData.email && (
              <div className="flex items-center justify-between py-1.5 gap-3">
                <span className="text-brand-muted font-medium shrink-0">Sent To</span>
                <span className="text-brand-navy text-right truncate font-medium">{successData.email}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Responsive QR Code Container */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-border inline-flex flex-col items-center mb-6 sm:mb-8 shadow-md relative overflow-hidden group max-w-full">
          <div className="absolute inset-0 bg-[image:var(--primary-gradient)] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
          
          <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-center">
            <QRCode 
              value={successData.ticketCode} 
              size={180}
              style={{ height: "auto", maxWidth: "100%", width: "100%", maxHeight: "180px" }}
              viewBox="0 0 256 256"
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 bg-gray-50 py-2 px-3 sm:px-4 rounded-lg border border-gray-100 max-w-full">
            <span className="text-xs font-mono text-brand-muted uppercase">Pass ID:</span>
            <span className="text-xs sm:text-sm font-mono text-brand-purple font-extrabold tracking-wider">
              {successData.ticketCode.substring(0, 8).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => handleCopyCode(successData.ticketCode)}
              className="ml-1 p-1 text-gray-400 hover:text-brand-purple transition-colors rounded cursor-pointer"
              title="Copy Full Pass ID"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <Button 
            type="button"
            variant="gradient" 
            size="lg" 
            onClick={() => window.print()} 
            className="w-full sm:w-auto cursor-pointer px-6 sm:px-8 shadow-lg shadow-brand-purple/20 flex items-center justify-center gap-2 text-sm sm:text-base h-12"
          >
            <Printer size={18} />
            Save & Print Pass
          </Button>
          
          <Link
            href={`/events/${eventSlug}`}
            className="w-full sm:w-auto text-center px-6 h-12 flex items-center justify-center rounded-lg border border-brand-border text-brand-navy font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            View Event Details
          </Link>
        </div>

        <p className="text-xs text-brand-muted mt-5 text-center max-w-sm leading-relaxed">
          Please keep this pass or take a screenshot to present at the registration desk for quick check-in.
        </p>
      </div>
    );
  }

  const baseInputClass = "w-full h-12 px-3 rounded-md border text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none placeholder:text-gray-400 placeholder:font-normal";
  const getErrorClass = (fieldError: any) => 
    fieldError 
      ? 'border-status-error bg-red-50/30 text-brand-navy focus:ring-1 focus:ring-status-error focus:border-status-error' 
      : 'border-brand-border bg-white text-brand-navy hover:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple focus:border-brand-purple';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
        <div className="space-y-2.5 md:col-span-2 relative group">
          <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
            Student Name <span className="text-status-error text-lg leading-none">*</span>
          </label>
          <input 
            {...register("studentName")}
            className={`${baseInputClass} ${getErrorClass(errors.studentName)}`}
            placeholder="e.g. John Doe" 
            autoFocus
          />
          <ErrorMessage message={errors.studentName?.message} />
        </div>
        
        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
            Gender <span className="text-status-error text-lg leading-none">*</span>
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <CustomSelect
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" }
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Gender"
                hasError={!!errors.gender}
              />
            )}
          />
          <ErrorMessage message={errors.gender?.message} />
        </div>

        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
            Email Address <span className="text-status-error text-lg leading-none">*</span>
          </label>
          <input 
            {...register("email")}
            type="email"
            className={`${baseInputClass} ${getErrorClass(errors.email)}`}
            placeholder="e.g. john@example.com" 
          />
          <ErrorMessage message={errors.email?.message} />
        </div>

        <div className="space-y-2.5 md:col-span-2">
          <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
            Mobile Number <span className="text-status-error text-lg leading-none">*</span>
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div className={`relative flex h-12 rounded-md border shadow-sm transition-all duration-200 bg-white ${
                errors.phone 
                  ? 'border-status-error focus-within:ring-1 focus-within:ring-status-error bg-red-50/30' 
                  : 'border-brand-border hover:border-brand-purple/50 focus-within:ring-1 focus-within:ring-brand-purple'
              }`}>
                <PhoneInput
                  {...field}
                  inputComponent={PhoneInputAdapter}
                  onCountryChange={(country) => {
                    countryChangeFlag.current = true;
                    setPhoneCountry(country);
                  }}
                  onChange={(val) => {
                    if (countryChangeFlag.current) {
                      countryChangeFlag.current = false;
                      field.onChange('');
                      return;
                    }
                    field.onChange(val);
                  }}
                  international={false}
                  defaultCountry="IN"
                  limitMaxLength={true}
                  countrySelectComponent={CountrySelect}
                  onBlur={() => {
                    field.onBlur();
                  }}
                  className="w-full flex"
                  numberInputProps={{
                    expectedDigits: requiredLength,
                    onDigitsChange: setTypedLength,
                    country: phoneCountry,
                    selectedCountry: phoneCountry,
                    className: "flex-1 h-full border-none focus:outline-none bg-transparent text-sm font-medium text-brand-navy px-4 placeholder:text-gray-400 placeholder:font-normal pr-16",
                    placeholder: exampleNum ? exampleNum.nationalNumber : "9876543210"
                  }}
                />
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 pointer-events-none flex items-center">
                  <span className={`${typedLength === requiredLength ? 'text-green-600' : 'text-gray-500'}`}>{typedLength}</span>
                  <span className="mx-0.5">/</span>
                  <span>{requiredLength}</span>
                </div>
              </div>
            )}
          />
          <ErrorMessage message={errors.phone?.message} />
        </div>
      </div>

      <div className="border-t border-brand-border/60 pt-8 mt-8">
        <h3 className="text-lg font-heading font-bold text-brand-navy mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 rounded-full bg-[image:var(--primary-gradient)]"></div>
          Educational Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
              Student Board <span className="text-status-error text-lg leading-none">*</span>
            </label>
            <Controller
              name="board"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={[
                    { value: "State Board", label: "State Board" },
                    { value: "CBSE", label: "CBSE" },
                    { value: "IGCSE", label: "IGCSE" }
                  ]}
                  value={field.value}
                  onChange={(val: any) => {
                    field.onChange(val);
                    setValue("schoolLevel", "");
                    setValue("stream", "");
                    setValue("currentStandard", "");
                  }}
                  placeholder="Select Board"
                  hasError={!!errors.board}
                />
              )}
            />
            <ErrorMessage message={errors.board?.message} />
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
              School Level <span className="text-status-error text-lg leading-none">*</span>
            </label>
            <Controller
              name="schoolLevel"
              control={control}
              render={({ field }) => {
                const getOptions = () => {
                  if (selectedBoard === "IGCSE") return [{ value: "GCSE", label: "GCSE" }];
                  return [
                    { value: "SSLC", label: "SSLC (10th)" },
                    { value: "HSC", label: "HSC (11th & 12th)" }
                  ];
                };
                return (
                  <CustomSelect
                    options={getOptions()}
                    value={field.value}
                    onChange={(val: any) => {
                      field.onChange(val);
                      setValue("stream", "");
                      setValue("currentStandard", "");
                    }}
                    placeholder="Select Level"
                    hasError={!!errors.schoolLevel}
                    disabled={!selectedBoard}
                  />
                );
              }}
            />
            <ErrorMessage message={errors.schoolLevel?.message} />
          </div>

          {selectedSchoolLevel === "HSC" && (
            <>
              <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
                  Stream <span className="text-status-error text-lg leading-none">*</span>
                </label>
                <Controller
                  name="stream"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      options={[
                        { value: "PCMB", label: "PCMB (Physics, Chemistry, Maths, Bio)" },
                        { value: "PCB", label: "PCB (Physics, Chemistry, Biology)" },
                        { value: "PCM", label: "PCM (Physics, Chemistry, Maths)" },
                        { value: "PCBZ", label: "PCBZ (Physics, Chemistry, Botany, Zoo)" },
                        { value: "COMMERCE", label: "COMMERCE Stream" },
                        { value: "HUMANITIES", label: "HUMANITIES / Arts" }
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select Stream"
                      hasError={!!errors.stream}
                    />
                  )}
                />
                <ErrorMessage message={errors.stream?.message} />
              </div>

              <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
                  Current Standard <span className="text-status-error text-lg leading-none">*</span>
                </label>
                <Controller
                  name="currentStandard"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      options={[
                        { value: "11th Standard", label: "11th Standard" },
                        { value: "12th Standard", label: "12th Standard" }
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select Grade"
                      hasError={!!errors.currentStandard}
                    />
                  )}
                />
                <ErrorMessage message={errors.currentStandard?.message} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-brand-border/60 pt-8 mt-8">
        <h3 className="text-lg font-heading font-bold text-brand-navy mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 rounded-full bg-[image:var(--secondary-gradient)]"></div>
          School Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
              School Name <span className="text-status-error text-lg leading-none">*</span>
            </label>
            <input 
              {...register("organizationName")}
              className={`${baseInputClass} ${getErrorClass(errors.organizationName)}`}
              placeholder="e.g. Delhi Public School" 
            />
            <ErrorMessage message={errors.organizationName?.message} />
          </div>
          
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
              Location (City) <span className="text-status-error text-lg leading-none">*</span>
            </label>
            <input 
              {...register("city")}
              className={`${baseInputClass} ${getErrorClass(errors.city)}`}
              placeholder="e.g. New Delhi" 
            />
            <ErrorMessage message={errors.city?.message} />
          </div>

          <div className="space-y-2.5 md:col-span-2">
            <label className="text-sm font-semibold text-brand-navy flex items-center gap-1">
              Full Address <span className="text-status-error text-lg leading-none">*</span>
            </label>
            <textarea 
              {...register("address")}
              className={`w-full min-h-[100px] p-3.5 rounded-md border text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none placeholder:text-gray-400 placeholder:font-normal resize-y ${getErrorClass(errors.address)}`}
              placeholder="e.g. Sector 12, RK Puram" 
            />
            <ErrorMessage message={errors.address?.message} />
          </div>
        </div>
      </div>

      <div className="pt-8">
        <div className="mb-6 flex flex-col items-center justify-center">
          <Turnstile 
            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAFWnYtjSIMm6bFZC'}
            onSuccess={(token) => setValue('turnstileToken', token)}
            onError={() => setError("Security check failed. Please refresh and try again.")}
            options={{
              theme: 'light',
              size: 'normal'
            }}
          />
          {errors.turnstileToken && <ErrorMessage message={errors.turnstileToken.message} />}
        </div>
        
        {error && (
          <div className="mb-6 bg-status-error/10 text-status-error px-4 py-4 rounded-lg text-sm font-semibold border border-status-error/20 flex items-center gap-3 animate-in shake">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Free OriginBI Assessment Highlight Box */}
        <OriginBIHighlightBox compact className="mb-6" />

        <Button type="submit" variant="gradient" size="lg" className="w-full h-14 text-lg font-semibold shadow-xl shadow-brand-purple/20 cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Complete Registration"}
        </Button>
        <p className="text-center text-xs font-medium text-brand-muted mt-5 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-turquoise block"></span>
          By registering, you agree to our Terms of Service. Secure & encrypted.
        </p>
      </div>
    </form>
  );
}
