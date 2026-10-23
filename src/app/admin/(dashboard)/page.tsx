import prisma from '@/lib/prisma';
import { 
  Users, 
  Calendar, 
  Building2, 
  Sparkles, 
  BrainCircuit,
  ArrowUpRight, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  let eventsCount = 0;
  let registrationsCount = 0;
  let universitiesCount = 0;
  let coursesCount = 0;
  let discProfilesCount = 0;
  let recentRegistrations: any[] = [];
  let upcomingEvents: any[] = [];

  try {
    eventsCount = await prisma.event.count();
    registrationsCount = await prisma.eventRegistration.count();
    universitiesCount = await prisma.university.count();
    coursesCount = await prisma.course.count();
    discProfilesCount = await prisma.assessmentResult.count();
    
    recentRegistrations = await prisma.eventRegistration.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { 
        participant: true,
        event: true 
      }
    });

    upcomingEvents = await prisma.event.findMany({
      take: 3,
      orderBy: { startDate: 'asc' },
      select: {
        id: true,
        title: true,
        city: true,
        startDate: true,
        status: true,
        slug: true,
        _count: {
          select: { registrations: true }
        }
      }
    });
  } catch (error) {
    console.warn("Database connection failed on Admin Dashboard. Showing fallback state.");
  }

  const statCards = [
    {
      title: 'Total Fair Editions',
      value: eventsCount,
      subtitle: eventsCount > 0 ? 'Active Editions' : 'No Active Editions',
      badge: eventsCount > 0 ? 'Active Series' : 'Draft / Empty',
      badgeColor: eventsCount > 0 ? 'bg-brand-purple/10 text-brand-purple' : 'bg-slate-100 text-slate-600',
      icon: Calendar,
      iconBg: 'bg-brand-purple/10 text-brand-purple',
      href: '/admin/events',
    },
    {
      title: 'Registered Delegates',
      value: registrationsCount,
      subtitle: registrationsCount > 0 ? 'Across scheduled editions' : 'Awaiting edition launch',
      badge: registrationsCount > 0 ? '+ Live Attendees' : '0 Registrations',
      badgeColor: registrationsCount > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600',
      icon: Users,
      iconBg: 'bg-emerald-100 text-emerald-600',
      href: '/admin/participants',
    },
    {
      title: 'University Partners',
      value: universitiesCount,
      subtitle: `${coursesCount} Active Programs`,
      badge: 'Verified Roster',
      badgeColor: 'bg-violet-50 text-violet-700',
      icon: Building2,
      iconBg: 'bg-violet-100 text-violet-600',
      href: '/admin/universities',
    },
    {
      title: 'DISC Profiling',
      value: discProfilesCount,
      subtitle: discProfilesCount > 0 ? 'Origin BI Assessments' : 'Awaiting Assessments',
      badge: discProfilesCount > 0 ? '+ Assessed' : 'Origin BI Active',
      badgeColor: 'bg-indigo-50 text-indigo-700',
      icon: BrainCircuit,
      iconBg: 'bg-indigo-100 text-indigo-600',
      href: '/admin/reports/recommendations',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 md:p-8 rounded-2xl border border-brand-border/80 shadow-2xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time edition metrics, delegate registrations, and verified university partners.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin/events/new">
            <Button variant="gradient" className="rounded-xl font-bold gap-2 h-11 px-5 shadow-sm hover:shadow-md transition-all">
              <Plus size={16} />
              <span>Create Edition</span>
            </Button>
          </Link>
          <Link href="/admin/participants">
            <Button variant="outline" className="rounded-xl font-semibold border-brand-border/80 text-brand-navy hover:bg-brand-light h-11 px-4">
              All Participants
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={idx} 
              href={stat.href}
              className="bg-white p-5 md:p-6 rounded-2xl border border-brand-border/80 shadow-2xs hover:shadow-md hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center transition-transform group-hover:scale-105 duration-200`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-black/5 ${stat.badgeColor}`}>
                    {stat.badge}
                  </span>
                </div>
                <div className="text-3xl font-heading font-black text-brand-navy tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-brand-navy/90">
                  {stat.title}
                </div>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-brand-border/40 flex items-center justify-between text-xs text-slate-500">
                <span>{stat.subtitle}</span>
                <ArrowUpRight size={14} className="text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two-Column Grid: Recent Registrations & Active Editions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Registrations Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-brand-border/80 shadow-2xs overflow-hidden flex flex-col">
          <div>
            <div className="p-5 md:p-6 border-b border-brand-border/60 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-bold text-brand-navy">
                  Recent Delegate Registrations
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Latest attendees registered across educational editions
                </p>
              </div>
              <Link 
                href="/admin/participants" 
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline"
              >
                <span>View All ({registrationsCount})</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-brand-light/50 text-[11px] font-bold text-brand-muted uppercase tracking-wider border-b border-brand-border/60">
                  <tr>
                    <th className="pl-6 pr-3 py-3.5">Delegate</th>
                    <th className="px-3 py-3.5">Fair Edition</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="pl-3 pr-6 py-3.5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40">
                  {recentRegistrations.length > 0 ? (
                    recentRegistrations.map((reg) => {
                      const initials = reg.participant?.fullName
                        ? reg.participant.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                        : 'D';

                      return (
                        <tr key={reg.id} className="hover:bg-purple-50/20 transition-colors">
                          <td className="pl-6 pr-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-xs flex items-center justify-center shrink-0 border border-brand-purple/20 shadow-2xs">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-brand-navy text-sm whitespace-nowrap">
                                  {reg.participant?.fullName || 'Anonymous Delegate'}
                                </div>
                                <div className="text-xs text-brand-muted whitespace-nowrap" title={reg.participant?.email || reg.participant?.mobile}>
                                  {reg.participant?.email || reg.participant?.mobile}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="font-semibold text-brand-navy text-sm">
                              {reg.event?.title || 'Edition'}
                            </div>
                            <div className="text-xs text-brand-muted flex items-center gap-1.5 mt-0.5">
                              <MapPin size={11} className="text-brand-purple shrink-0" />
                              <span>{reg.event?.city || 'Tamil Nadu'}</span>
                            </div>
                          </td>

                          <td className="px-3 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
                              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                              Confirmed
                            </span>
                          </td>

                          <td className="pl-3 pr-6 py-4 text-right whitespace-nowrap">
                            <span className="text-xs font-medium text-slate-600">
                              {new Date(reg.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-brand-muted">
                        <Users size={32} className="mx-auto text-brand-muted/40 mb-2" />
                        <p className="font-semibold text-brand-navy">No registrations yet</p>
                        <p className="text-xs text-brand-muted mt-1">
                          Registrations submitted on the public website will appear here in real time.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 bg-brand-light/30 border-t border-brand-border/60 text-center">
            <Link 
              href="/admin/participants" 
              className="text-xs font-bold text-brand-purple hover:text-brand-navy transition-colors inline-flex items-center gap-1.5"
            >
              <span>Manage all attendee profiles and export participant rosters</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Column: Upcoming Editions Glance (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-brand-border/80 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-heading font-bold text-brand-navy">
                  Active Editions
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  Scheduled upcoming editions
                </p>
              </div>
              <Link 
                href="/admin/events"
                className="text-xs font-bold text-brand-purple hover:underline"
              >
                All Events
              </Link>
            </div>

            <div className="space-y-3.5">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => {
                  const eventDate = new Date(event.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <div 
                      key={event.id}
                      className="p-4 rounded-xl border border-brand-border/70 bg-brand-light/20 hover:bg-white hover:border-brand-purple/40 hover:shadow-xs transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-purple/10 text-brand-purple">
                          <MapPin size={10} />
                          {event.city}
                        </span>
                        <span className="text-[11px] font-semibold text-brand-muted">
                          {eventDate}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-brand-navy group-hover:text-brand-purple transition-colors leading-snug mb-2">
                        {event.title}
                      </h3>

                      <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 text-xs text-brand-muted">
                        <span>{event._count?.registrations || 0} registered</span>
                        <Link 
                          href={`/admin/events/${event.id}`}
                          className="font-bold text-brand-purple hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Edit</span>
                          <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 px-4 text-center rounded-xl border border-dashed border-brand-border/80 bg-brand-light/30">
                  <Calendar size={28} className="mx-auto text-brand-muted/40 mb-2" />
                  <p className="text-xs font-bold text-brand-navy">No Scheduled Editions</p>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Click below to create your first educational edition.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-brand-border/60">
            <Link href="/admin/events/new" className="block">
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-dashed border-brand-purple/40 text-brand-purple hover:bg-brand-light text-xs font-bold h-10 gap-1.5"
              >
                <Plus size={14} />
                <span>Add Another Event Edition</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

