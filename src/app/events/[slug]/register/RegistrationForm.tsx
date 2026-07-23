"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { registerForEvent } from '@/app/actions/register';
import { CheckCircle2, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  organizationName: z.string().min(2, "Organization/School name is required"),
  organizationType: z.string().min(2, "Type is required"),
  city: z.string().min(2, "City is required"),
});

export function RegistrationForm({ eventId, eventSlug }: { eventId: string, eventSlug: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ticketCode: string} | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError('');
    
    const result = await registerForEvent({ ...values, eventId });
    
    if (result.success && result.ticketCode) {
      setSuccessData({ ticketCode: result.ticketCode });
    } else {
      setError(result.error || 'Something went wrong.');
    }
    
    setIsSubmitting(false);
  };

  if (successData) {
    return (
      <div className="text-center py-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-status-success/10 text-status-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-heading font-bold text-brand-navy mb-2">Registration Confirmed!</h3>
        <p className="text-brand-muted mb-8 max-w-md mx-auto">
          You have successfully registered for the event. Please save the QR code below, as it will be required for check-in at the venue.
        </p>
        
        <div className="bg-white p-6 rounded-2xl border-2 border-brand-border inline-block mb-8 shadow-sm">
          <QRCode value={successData.ticketCode} size={200} />
          <div className="mt-4 text-xs font-mono text-brand-muted uppercase tracking-widest bg-brand-light py-2 rounded">
            {successData.ticketCode.substring(0, 8)}
          </div>
        </div>
        
        <Button variant="outline" onClick={() => window.print()} className="mb-4">
          Save / Print Pass
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-status-error/10 text-status-error px-4 py-3 rounded-lg text-sm font-medium border border-status-error/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-navy">First Name</label>
          <input 
            {...register("firstName")}
            className="w-full h-10 px-3 rounded-md border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent" 
            placeholder="John" 
          />
          {errors.firstName && <p className="text-status-error text-xs">{errors.firstName.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-navy">Last Name</label>
          <input 
            {...register("lastName")}
            className="w-full h-10 px-3 rounded-md border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent" 
            placeholder="Doe" 
          />
          {errors.lastName && <p className="text-status-error text-xs">{errors.lastName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-navy">Email Address</label>
          <input 
            {...register("email")}
            type="email"
            className="w-full h-10 px-3 rounded-md border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent" 
            placeholder="john@school.edu" 
          />
          {errors.email && <p className="text-status-error text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-navy">Phone Number</label>
          <input 
            {...register("phone")}
            className="w-full h-10 px-3 rounded-md border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent" 
            placeholder="+91 98765 43210" 
          />
          {errors.phone && <p className="text-status-error text-xs">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="border-t border-brand-border pt-6 mt-6">
        <h3 className="font-heading font-semibold text-brand-navy mb-4">Professional Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Job Title</label>
            <input 
              {...register("jobTitle")}
              className="w-full h-10 px-3 rounded-md border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent" 
              placeholder="Principal / Director" 
            />
            {errors.jobTitle && <p className="text-status-error text-xs">{errors.jobTitle.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Organization Name</label>
            <input 
              {...register("organizationName")}
              className="w-full h-10 px-3 rounded-md border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent" 
              placeholder="Delhi Public School" 
            />
            {errors.organizationName && <p className="text-status-error text-xs">{errors.organizationName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Organization Type</label>
            <select 
              {...register("organizationType")}
              className="w-full h-10 px-3 rounded-md border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent" 
            >
              <option value="">Select Type...</option>
              <option value="K-12 School">K-12 School</option>
              <option value="University">University</option>
              <option value="EdTech Company">EdTech Company</option>
              <option value="Consultancy">Consultancy</option>
              <option value="Other">Other</option>
            </select>
            {errors.organizationType && <p className="text-status-error text-xs">{errors.organizationType.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">City</label>
            <input 
              {...register("city")}
              className="w-full h-10 px-3 rounded-md border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent" 
              placeholder="New Delhi" 
            />
            {errors.city && <p className="text-status-error text-xs">{errors.city.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing Registration..." : "Complete Registration"}
        </Button>
        <p className="text-center text-xs text-brand-muted mt-4">
          By registering, you agree to our Terms of Service and Privacy Policy. 
          No account will be created.
        </p>
      </div>
    </form>
  );
}
