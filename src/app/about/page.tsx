import React from 'react';
import Image from 'next/image';
import { Target, Users, Globe2, Award, Zap, BookOpen } from 'lucide-react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Campus Connect and our mission to empower education.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-primary/20 blur-[100px]" />
          <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-accent/20 blur-[100px]" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Empowering the Future of Education</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Campus Connect bridges the gap between ambitious school leaders and forward-thinking universities to create global opportunities for students.
          </p>
        </div>
      </section>

      {/* Our Story / Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-brand-navy mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6 text-lg">
                We believe that every student deserves access to world-class education. Our mission is to facilitate meaningful connections between top-tier educational institutions and high school leaders across India and internationally.
              </p>
              <p className="text-gray-600 text-lg mb-8">
                By organizing premier university fair series, we provide a platform for knowledge exchange, networking, and direct student recruitment that drives the future of global education.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="text-3xl font-bold text-brand-primary mb-2">50+</h4>
                  <p className="text-gray-600 font-medium">Cities Covered</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="text-3xl font-bold text-brand-accent mb-2">200+</h4>
                  <p className="text-gray-600 font-medium">University Partners</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <Image 
                src="/images/about-mission.jpg"
                alt="Students collaborating" 
                fill 
                className="object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-brand-navy mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide our approach to connecting the global education community.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe2, title: "Global Reach", desc: "Connecting local talent with international opportunities." },
              { icon: Users, title: "Community First", desc: "Fostering strong relationships between educators." },
              { icon: Target, title: "Student Success", desc: "Putting student outcomes at the center of everything." },
              { icon: Zap, title: "Innovation", desc: "Embracing modern solutions for education delivery." },
              { icon: Award, title: "Excellence", desc: "Partnering only with the highest quality institutions." },
              { icon: BookOpen, title: "Knowledge Sharing", desc: "Creating platforms for continuous collaborative learning." },
            ].map((val, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6">
                  <val.icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
