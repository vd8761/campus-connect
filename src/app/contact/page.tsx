import React from 'react';
import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Campus Square',
  description: 'Have questions about our university fairs, academic conclaves, partnerships, or registrations? Connect with the Campus Square team.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Campus Square',
    description: 'Have questions about our university fairs, academic conclaves, partnerships, or registrations? Connect with the Campus Square team.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-300">
            Have questions about our events, partnerships, or registrations? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 -mt-10">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Contact Info (Left) */}
            <div className="bg-brand-navy text-white p-10 md:p-14 md:w-2/5 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
              
              <div className="relative z-10 flex-1">
                <h3 className="text-3xl font-heading font-bold mb-8">Contact Information</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-brand-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Email Us</h4>
                      <p className="text-gray-300">info@campussquare.org</p>
                      <p className="text-gray-300">support@campussquare.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-brand-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Call Us</h4>
                      <p className="text-gray-300">+91 98765 43210</p>
                      <p className="text-gray-300">Mon-Fri, 9am to 6pm IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-brand-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Headquarters</h4>
                      <p className="text-gray-300">
                        123 Education Hub,<br />
                        Knowledge Park II,<br />
                        New Delhi, India 110001
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Component (Right) */}
            <ContactForm />
            
          </div>
        </div>
      </section>
    </main>
  );
}
