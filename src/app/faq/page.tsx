import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Find answers to frequently asked questions about attending or partnering with Campus Connect.',
};

const faqs = [
  {
    title: "How do I register for an upcoming event?",
    content: "Registration can be completed directly through our website. Navigate to the 'Events' page, select the specific city edition you wish to attend, and click the 'Register' button. Follow the prompts to complete your attendee profile."
  },
  {
    title: "Is there a fee to attend the fair?",
    content: "For students, parents, and school leaders, attending the Campus Connect fairs is completely free. University partners and exhibitors must pay a registration fee to book their booths."
  },
  {
    title: "Who should attend these events?",
    content: "Our events are designed for high school students (Grades 9-12), their parents, school counselors, principals, and educators looking to connect with top universities and discover global education opportunities."
  },
  {
    title: "How can my university become a partner?",
    content: "We are always looking to expand our network of prestigious institutions. Please visit the 'Partners' page and click 'Become a Partner' to fill out an inquiry form, or contact our partnerships team directly."
  },
  {
    title: "What COVID-19 safety measures are in place?",
    content: "We strictly adhere to all local government guidelines regarding public gatherings. Specific safety protocols, if required, will be communicated to registered attendees closer to the event date."
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300">
            Find answers to common questions about attending, partnering, and navigating Campus Connect events.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      {/* Still need help CTA */}
      <section className="px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-brand-light rounded-2xl p-10 border border-gray-200">
            <h2 className="text-2xl font-heading font-bold text-brand-navy mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              If you couldn't find the answer you were looking for, our support team is ready to help.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
