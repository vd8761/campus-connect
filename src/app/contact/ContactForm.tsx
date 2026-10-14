"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Send, AlertCircle } from 'lucide-react';

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      reset();
    }, 1500);
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
          <p className="text-green-700">Thank you for reaching out. We will get back to you within 24 hours.</p>
          <Button 
            className="mt-6" 
            variant="outline" 
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
