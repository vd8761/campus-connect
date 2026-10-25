import sql from '@/lib/neon';
import { AddUniversityForm } from './AddUniversityForm';
import { DeleteUniversityButton } from './DeleteUniversityButton';
import { Building2, MapPin, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UniversitiesPage() {
  let universities: any[] = [];
  try {
    universities = await sql`
      SELECT 
        u.id, u.name, u.city, u.country, u."logoUrl", u.description, u."createdAt",
        COUNT(DISTINCT c.id) AS courses,
        COUNT(DISTINCT ue.id) AS events
      FROM "University" u
      LEFT JOIN "Course" c ON c."universityId" = u.id
      LEFT JOIN "UniversityEvent" ue ON ue."universityId" = u.id
      GROUP BY u.id, u.name, u.city, u.country, u."logoUrl", u.description, u."createdAt"
      ORDER BY u.name ASC
    `;
  } catch (error) {
    console.warn("Database connection failed on Universities page. Showing empty state.");
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-brand-navy">
            Universities & Academic Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage enrolled institutions, their approved degree courses, and margin configurations.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-brand-purple border border-purple-100 text-xs font-bold self-start sm:self-auto shrink-0">
          <GraduationCap size={16} />
          <span>{universities.length} Universities Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Add University Form */}
        <div className="lg:col-span-4">
          <AddUniversityForm />
        </div>

        {/* Right: University Partners Table */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-brand-border/80 overflow-hidden shadow-2xs">
            <div className="p-4 md:p-5 border-b border-brand-border/60 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                Partner Institutions ({universities.length})
              </h2>
            </div>

            <div className="divide-y divide-brand-border/40">
              {universities.length > 0 ? (
                universities.map((uni: any) => (
                  <div 
                    key={uni.id} 
                    className="p-3.5 sm:p-4 md:p-5 hover:bg-purple-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 group"
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      {/* Logo thumbnail or fallback building icon */}
                      <div className="w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 rounded-xl bg-white border border-brand-border/80 flex items-center justify-center p-2 shrink-0 shadow-2xs overflow-hidden">
                        {uni.logoUrl ? (
                          <img 
                            src={uni.logoUrl} 
                            alt={uni.name} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-brand-purple/60" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-heading font-bold text-brand-navy text-sm md:text-base group-hover:text-brand-purple transition-colors truncate">
                          {uni.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                            {uni.city ? `${uni.city}, ${uni.country}` : uni.country}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-brand-purple border border-purple-100">
                            <GraduationCap className="w-3 h-3" />
                            {uni.courses} {Number(uni.courses) === 1 ? 'Course' : 'Courses'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <Link
                        href={`/admin/universities/${uni.id}/courses`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-purple text-white shadow-2xs hover:bg-brand-purple/90 transition-all"
                      >
                        <GraduationCap size={13} />
                        <span>Manage Courses ({uni.courses})</span>
                      </Link>
                      <DeleteUniversityButton id={uni.id} name={uni.name} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-base font-bold text-brand-navy">No Universities Found</p>
                  <p className="text-xs text-slate-500 mt-1">Use the form to add a university to the system.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
