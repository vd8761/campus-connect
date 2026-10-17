import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, MessageSquare, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Campus Square',
  description: 'Read the terms and conditions for using the Campus Square platform and participating in our university fairs and assessments.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-10 sm:pt-14 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-turquoise text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur">
            <ShieldCheck size={14} />
            <span>Legal Framework</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Terms of Service</h1>
          <p className="text-gray-300 text-sm">Campus Square - A Collaborative Initiative by Atom Infinity and OriginBI Mindworks</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-3xl shadow-sm border border-brand-border/80 p-8 md:p-12 text-sm text-slate-600 leading-relaxed space-y-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Campus Square website, registering for our school-hosted university fairs, or participating in the complimentary OriginBI behavioral assessment, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">2. Registration and Eligibility</h2>
              <p>
                Registration for students, parents, and school educators attending Campus Square editions is complimentary. You agree to provide accurate, current, and complete registration information. Parent or guardian consent is acknowledged for participating minor students.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">3. Complimentary OriginBI Assessment</h2>
              <p>
                The OriginBI assessment provided through Campus Square is an educational and self-reflection guidance tool. It provides developmental insights regarding behavioral styles and career alignment; it does not determine, guarantee, or restrict any specific university admission, course qualification, or career outcome.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">4. Institutional Code of Conduct</h2>
              <p>
                Campus Square events are held on school campuses. All attendees, university representatives, and partners are expected to adhere to school campus decorum, respecting safety rules, child-protection norms, and orderly participation guidelines.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">5. Intellectual Property</h2>
              <p>
                All trademarks, logos, content, and materials related to Campus Square, Atom Infinity, and OriginBI Mindworks are protected by intellectual property laws. University partner marks belong to their respective institutions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">6. Official Contact</h2>
              <p>
                For questions regarding these terms, contact us at <strong>interact@atom-infinity.com</strong>, via WhatsApp at <strong>+91 80561 34455</strong>, or visit our office at <strong>Tamarai Tech Park (Level 5), S.P.Plot No.16-19 & 20-A, Thiru Vi Ka Industrial Estate, Guindy, Chennai, Tamil Nadu 600032</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
