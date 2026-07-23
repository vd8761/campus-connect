import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using the Campus Connect platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-300">Last updated: October 15, 2024</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4 first:mt-0">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              By accessing and using the Campus Connect website and services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">2. Registration and Accounts</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              To attend our events, you may be required to register for an account. You must provide accurate and complete information and keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials.
            </p>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">3. Event Attendance</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>We reserve the right to refuse entry to any of our events at our discretion.</li>
              <li>Attendees must conduct themselves in a professional and respectful manner at all times.</li>
              <li>Any form of harassment or disruptive behavior may result in immediate removal from the event without refund (if applicable).</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              All content included on this site, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the site, is the property of Campus Connect or its suppliers and protected by copyright and other laws.
            </p>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              In no event shall Campus Connect, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">6. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
