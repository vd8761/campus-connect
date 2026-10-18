"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageSquare, Mail, Sparkles, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { WhatsAppIcon } from './ui/WhatsAppIcon';

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export const CAMPUS_SQUARE_FAQS: FAQCategory[] = [
  {
    title: "1. About Campus Square™",
    items: [
      {
        id: 1,
        question: "What is Campus Square™?",
        answer: "Campus Square™ is a school-university fair joint collaboration by Atom Infinity and OriginBI. It connects schools, universities, students, parents and education partners to explore higher education opportunities and build meaningful connections.",
      },
      {
        id: 2,
        question: "Who can participate in Campus Square™?",
        answer: "Campus Square™ welcomes students, parents, school leaders, university representatives, educators, career counsellors and education partners.",
      },
      {
        id: 3,
        question: "Where are Campus Square™ events conducted?",
        answer: "Campus Square™ editions are hosted at different schools and locations. Visit the Upcoming Editions section to explore events and their details.",
      },
    ],
  },
  {
    title: "2. Students and Parents",
    items: [
      {
        id: 4,
        question: "Why should students attend Campus Square™?",
        answer: "Students can discover universities, explore academic programmes, interact with university representatives and learn about higher education and career pathways.",
      },
      {
        id: 5,
        question: "Can parents attend Campus Square™?",
        answer: "Yes. Parents and guardians are welcome to explore educational opportunities and support their children's academic and career decisions.",
      },
      {
        id: 6,
        question: "Is Campus Square™ registration free?",
        answer: "Yes! Registration for Campus Square™ is completely free.",
      },
      {
        id: 7,
        question: "How can I register for Campus Square™?",
        answer: "Visit the website, select your preferred edition and complete the online registration form.",
      },
      {
        id: 8,
        question: "What is the OriginBI assessment?",
        answer: "The OriginBI assessment offers insights to help students explore their interests, strengths and potential academic or career pathways. It can support informed decision-making alongside academic guidance and personal reflection.",
      },
      {
        id: 9,
        question: "Is the OriginBI assessment free?",
        answer: "Yes! The OriginBI assessment offered through Campus Square™ is completely free for participants.",
      },
      {
        id: 10,
        question: "How can I access the free OriginBI assessment?",
        answer: "Register for Campus Square™ and follow the instructions provided on the website or by the event team to access your complimentary assessment.",
      },
      {
        id: 11,
        question: "Do I need to pay separately for the assessment?",
        answer: "No. The OriginBI assessment offered through Campus Square™ is free, with no separate assessment fee.",
      },
      {
        id: 12,
        question: "Will the assessment determine my future career?",
        answer: "No. The assessment provides guidance and insights; it does not determine or guarantee a particular career outcome. Students should also consider their interests, abilities, academic performance and professional guidance.",
      },
      {
        id: 13,
        question: "What information is required for registration?",
        answer: "You may be asked to provide your name, contact details, school, grade or academic level and preferred event. Parent or guardian consent may be required for younger participants.",
      },
    ],
  },
  {
    title: "3. University Partnerships",
    items: [
      {
        id: 14,
        question: "Which universities are associated with Campus Square™?",
        answer: "Campus Square™ works with university partners to connect students with higher education opportunities. Visit the University Partners section to explore the institutions associated with the initiative.",
      },
      {
        id: 15,
        question: "Will every university attend every edition?",
        answer: "Not necessarily. University participation may vary by location. Please check the relevant event page for the confirmed participating institutions.",
      },
      {
        id: 16,
        question: "How can a university become a Campus Square™ partner?",
        answer: "Universities can submit an enquiry through the University Partnerships section of the website to explore collaboration opportunities.",
      },
      {
        id: 17,
        question: "What are the benefits of becoming a university partner?",
        answer: "University partners can showcase their programmes, engage with students and parents, increase awareness of their institutions and connect with school communities across different editions.",
      },
      {
        id: 18,
        question: "How can a university participate in a particular edition?",
        answer: "Contact the Campus Square™ team through the university enquiry form and mention your preferred event or location. Participation details will be discussed with the team.",
      },
    ],
  },
  {
    title: "4. Schools and Education Partners",
    items: [
      {
        id: 19,
        question: "Can a school host a Campus Square™ edition?",
        answer: "Yes. Schools interested in hosting an edition can contact the Campus Square™ team to discuss the opportunity and event requirements.",
      },
      {
        id: 20,
        question: "What are the benefits of hosting Campus Square™?",
        answer: "Hosting a Campus Square™ edition helps schools connect students and parents with universities, encourage higher education exploration and strengthen engagement with educational institutions.",
      },
      {
        id: 21,
        question: "Can educators and career counsellors collaborate with Campus Square™?",
        answer: "Yes. Educators, career counsellors and academic professionals are welcome to enquire about relevant collaboration opportunities.",
      },
      {
        id: 22,
        question: "Can education companies and service providers participate?",
        answer: "Relevant education organisations and service providers can contact the Campus Square™ team to explore potential collaboration opportunities.",
      },
    ],
  },
  {
    title: "5. Registration and Support",
    items: [
      {
        id: 23,
        question: "How can I find upcoming Campus Square™ events?",
        answer: "Visit the Upcoming Editions section of the website for available event details, registration links and participating universities.",
      },
      {
        id: 24,
        question: "What happens after I register?",
        answer: "Follow the confirmation instructions displayed after registration. Updates and relevant event information will be shared through the contact details you provide.",
      },
      {
        id: 25,
        question: "Can I change or cancel my registration?",
        answer: "Please contact the Campus Square™ team through the website if you need to update or cancel your registration.",
      },
      {
        id: 26,
        question: "How can I contact Campus Square™?",
        answer: "Visit the Contact Us section of the website to submit your enquiry regarding registration, university partnerships, school hosting or collaboration.",
      },
      {
        id: 27,
        question: "How is my personal information handled?",
        answer: "Personal information submitted through registration and enquiry forms will be handled in accordance with the website's Privacy Policy and applicable data protection requirements. Parent or guardian consent may be required for younger participants.",
      },
    ],
  },
];

export function CampusSquareFaqSection({ isStandalone = false }: { isStandalone?: boolean }) {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 1: true });
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');

  const toggleItem = (id: number) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categoriesToRender = selectedCategory === 'ALL'
    ? CAMPUS_SQUARE_FAQS
    : [CAMPUS_SQUARE_FAQS[selectedCategory]];

  return (
    <section className={`py-20 ${isStandalone ? 'bg-transparent' : 'bg-slate-50 border-t border-brand-border/60'}`} id="faqs">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-purple/20">
            <HelpCircle size={14} className="text-brand-purple" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-navy tracking-tight mb-4">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            Campus Square™ - A University Fair Series, a joint collaboration by Atom Infinity and Origin Bi, bringing schools and universities together to connect students with higher education opportunities.
          </p>
          <p className="text-sm font-semibold text-brand-purple mt-1">
            Connect Campuses. Schools. Universities. Students. Opportunities.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${selectedCategory === 'ALL'
              ? 'bg-brand-navy text-white shadow-md'
              : 'bg-white text-brand-navy border border-brand-border hover:border-brand-purple/40'
              }`}
          >
            All Questions (27)
          </button>
          {CAMPUS_SQUARE_FAQS.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(idx)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${selectedCategory === idx
                ? 'bg-brand-navy text-white shadow-md'
                : 'bg-white text-brand-navy border border-brand-border hover:border-brand-purple/40'
                }`}
            >
              {cat.title.replace(/^\d+\.\s*/, '')}
            </button>
          ))}
        </div>

        {/* Accordion Categories */}
        <div className="space-y-8">
          {categoriesToRender.map((cat, cIdx) => (
            <div key={cIdx} className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border/80 shadow-xs">
              <h3 className="text-xl font-heading font-bold text-brand-navy mb-6 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>{cat.title}</span>
                <span className="text-xs font-normal text-brand-muted">{cat.items.length} Questions</span>
              </h3>

              <div className="space-y-3">
                {cat.items.map((item) => {
                  const isOpen = !!openItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen
                        ? 'border-brand-purple/40 bg-purple-50/20'
                        : 'border-brand-border/60 bg-white hover:border-brand-border'
                        }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="font-heading font-bold text-sm sm:text-base text-brand-navy flex items-start gap-2.5">
                          <span className="text-brand-purple text-xs font-mono font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-100 shrink-0 mt-0.5">
                            Q{item.id}
                          </span>
                          <span>{item.question}</span>
                        </span>
                        <ChevronDown
                          size={18}
                          className={`text-brand-muted shrink-0 transition-transform duration-300 mt-1 ${isOpen ? 'rotate-180 text-brand-purple' : ''
                            }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-purple-100/60 ml-9 sm:ml-10">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Support & Contact Card */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-brand-border/80 shadow-sm text-center">
          <h3 className="text-xl font-heading font-bold text-brand-navy mb-2">
            Still Have Questions?
          </h3>
          <p className="text-brand-muted text-sm max-w-lg mx-auto mb-6">
            Whether you represent a school, university, student community or education organisation, Campus Square™ welcomes opportunities to collaborate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <a
              href="https://wa.me/918056134455"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 shrink-0" />
              <span>WhatsApp: +91 80561 34455</span>
            </a>
            <a
              href="mailto:interact@atom-infinity.com"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white shadow-md transition-all cursor-pointer"
            >
              <Mail size={16} />
              <span>interact@atom-infinity.com</span>
            </a>
            <Link href="/contact">
              <Button variant="outline" className="px-5 py-3 rounded-xl inline-flex items-center gap-2">
                <Send size={15} />
                <span>Contact Us Form</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
