import sql from '@/lib/neon';
import { AddUniversityForm } from './AddUniversityForm';
import { Building2, MapPin, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UniversitiesPage() {
  let universities: any[] = [];
  try {
    universities = await sql`
      SELECT 
        u.id, u.name, u.city, u.country, u."createdAt",
        COUNT(DISTINCT c.id) AS courses,
        COUNT(DISTINCT ue.id) AS events
      FROM "University" u
      LEFT JOIN "Course" c ON c."universityId" = u.id
      LEFT JOIN "UniversityEvent" ue ON ue."universityId" = u.id
      GROUP BY u.id, u.name, u.city, u.country, u."createdAt"
      ORDER BY u.name ASC
    `;
  } catch (error) {
    console.warn("Database connection failed on Universities page. Showing empty state.");
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand-navy">Universities</h1>
          <p className="text-brand-muted mt-1">Manage enrolled universities, their courses, and booth access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddUniversityForm />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-brand-muted text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">University</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Stats</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {universities.length > 0 ? (
                  universities.map((uni: any) => (
                    <tr key={uni.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="font-semibold text-brand-navy">{uni.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-brand-muted">
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="w-4 h-4" />
                          {uni.city ? `${uni.city}, ${uni.country}` : uni.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-brand-muted">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3"/> {uni.courses} Courses
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/universities/${uni.id}/courses`}
                          className="p-2 text-brand-teal hover:bg-brand-teal/10 rounded-lg transition-colors inline-flex"
                          title="Manage Courses"
                        >
                          <GraduationCap className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-brand-muted">
                      <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium text-brand-navy mb-1">No Universities Found</p>
                      <p className="text-sm">Use the form to add a university to the system.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
