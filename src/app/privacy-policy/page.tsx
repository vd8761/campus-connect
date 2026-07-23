import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Campus Connect privacy policy to understand how we handle your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: October 15, 2024</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4 first:mt-0">1. Introduction</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Welcome to Campus Connect. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">2. The Data We Collect About You</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">3. How We Use Your Personal Data</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., event registration).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2 className="text-2xl font-bold text-brand-navy mt-8 mb-4">5. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@campusconnect.example.com.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
