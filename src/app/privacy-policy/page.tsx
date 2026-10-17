import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Campus Square',
  description: 'Read the Campus Square privacy policy to understand how we handle student, parent, school, and university data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-10 sm:pt-14 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-turquoise text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur">
            <ShieldCheck size={14} />
            <span>Data Privacy & Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-gray-300 text-sm">Campus Square - A Collaborative Initiative by Atom Infinity and OriginBI Mindworks</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-3xl shadow-sm border border-brand-border/80 p-8 md:p-12 text-sm text-slate-600 leading-relaxed space-y-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">1. Introduction</h2>
              <p>
                Welcome to Campus Square. We respect your privacy and are committed to protecting personal data submitted through our event registrations, school hosting enquiries, and university partnership forms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">2. Data We Collect</h2>
              <p className="mb-2">We collect only necessary information to coordinate fair attendance and assessment delivery:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Participant Data:</strong> Student name, grade/standard, academic stream, school name, and city.</li>
                <li><strong>Contact Data:</strong> Official email address and WhatsApp/mobile phone number for entry passes and assessment delivery.</li>
                <li><strong>Parent/Guardian Information:</strong> Parent contact and consent where required for minor participants.</li>
                <li><strong>Institutional Information:</strong> School and university representative designations, official emails, and campus locations.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">3. How Your Data Is Handled with OriginBI</h2>
              <p>
                To provide the complimentary OriginBI behavioral assessment, relevant student contact information is shared securely with OriginBI Mindworks solely to generate the individual assessment invitation and fair-day personalized single-page result PDF report. Data is never sold or used for unsolicited commercial solicitations.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">4. Data Security</h2>
              <p>
                We implement industry-standard encryption, SSL protocols, and restricted role-based database access to ensure personal data is protected against unauthorized access, alteration, or disclosure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-bold text-brand-navy mb-3">5. Official Privacy Contact</h2>
              <p>
                If you have questions regarding your data, updates, or consent revocation, please contact our data coordinator directly:
              </p>
              <div className="mt-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-brand-navy space-y-1.5">
                <p><strong>Office Address:</strong> Tamarai Tech Park (Level 5), S.P.Plot No.16-19 & 20-A, Thiru Vi Ka Industrial Estate, Guindy, Chennai, Tamil Nadu 600032</p>
                <p><strong>Email:</strong> interact@atom-infinity.com</p>
                <p><strong>WhatsApp Support:</strong> +91 80561 34455</p>
                <p><strong>Initiative:</strong> Atom Infinity & OriginBI Mindworks</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
