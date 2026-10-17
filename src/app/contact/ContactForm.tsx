"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Send, AlertCircle } from 'lucide-react';

import { submitContactUsMessage } from '@/app/actions/enquiries';

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await submitContactUsMessage(values);
      if (res.success) {
        setSubmitted(true);
        reset();
      } else {
        setServerError(res.error || "Failed to submit message. Please try again.");
      }
    } catch (err: any) {
      setServerError("An unexpected error occurred. Please contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 md:p-14 md:w-3/5">
      <h3 className="text-2xl font-bold text-brand-navy mb-6">Send us a Message</h3>
      
      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <Send size={32} />
          </div>
          <h4 className="text-2xl font-bold mb-2">Message Sent!</h4>
          <p className="text-green-700 text-sm mb-3">Thank you for reaching out. Our team will get back to you promptly.</p>
          <div className="text-xs text-slate-600 bg-white/80 p-3 rounded-lg border border-green-200 mb-4 max-w-sm">
            For urgent coordination, WhatsApp us at <strong>8056134455</strong> or email <strong>interact@atom-infinity.com</strong>.
          </div>
          <Button 
            className="mt-2" 
            variant="outline" 
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name <span className="text-status-error">*</span></label>
              <Input {...register("firstName")} error={!!errors.firstName} placeholder="John" />
              {errors.firstName && (
                <p className="text-status-error text-xs mt-1.5 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={12} /> {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name <span className="text-status-error">*</span></label>
              <Input {...register("lastName")} error={!!errors.lastName} placeholder="Doe" />
              {errors.lastName && (
                <p className="text-status-error text-xs mt-1.5 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={12} /> {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address <span className="text-status-error">*</span></label>
            <Input type="email" {...register("email")} error={!!errors.email} placeholder="john@example.com" />
            {errors.email && (
              <p className="text-status-error text-xs mt-1.5 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={12} /> {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Subject <span className="text-status-error">*</span></label>
            <Input {...register("subject")} error={!!errors.subject} placeholder="How can we help you?" />
            {errors.subject && (
              <p className="text-status-error text-xs mt-1.5 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={12} /> {errors.subject.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Message <span className="text-status-error">*</span></label>
            <Textarea {...register("message")} error={!!errors.message} placeholder="Type your message here..." className="min-h-[150px]" />
            {errors.message && (
              <p className="text-status-error text-xs mt-1.5 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={12} /> {errors.message.message}
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      )}
    </div>
  );
}
