import sql from '@/lib/neon';
import { AddCourseForm } from './AddCourseForm';
import { ArrowLeft, BookOpen, Percent } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeleteCourseButton } from './DeleteCourseButton';

export const dynamic = 'force-dynamic';

export default async function UniversityCoursesPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  let university: any = null;
  let courses: any[] = [];

  try {
    const unis = await sql`SELECT id, name FROM "University" WHERE id = ${id} LIMIT 1`;
    university = unis[0] ?? null;
    if (!university) return notFound();

    courses = await sql`
      SELECT id, name, category, level, "marginType", "marginValue"
      FROM "Course"
      WHERE "universityId" = ${id}
      ORDER BY name ASC
    `;
  } catch (error) {
    console.warn("Database connection failed on Courses page. Showing empty state.");
    university = { id, name: "University (Offline)" };
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link 
            href="/admin/universities" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline mb-2 transition-all"
          >
            <ArrowLeft size={14} /> Back to Universities
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-navy">
            {university.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage academic programs, degree levels, and commission margins for this institution.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-brand-purple border border-purple-100 text-xs font-bold self-start sm:self-auto">
          <BookOpen size={15} />
          <span>{courses.length} Courses Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <AddCourseForm universityId={id} />
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-brand-border/80 overflow-hidden shadow-2xs">
            <div className="p-4 md:p-5 border-b border-brand-border/60 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                Approved Courses ({courses.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-brand-border/60">
                  <tr>
                    <th className="px-5 py-3.5">Course Name</th>
                    <th className="px-5 py-3.5">Category & Level</th>
                    <th className="px-5 py-3.5">Margin</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40">
                  {courses.length > 0 ? (
                    courses.map((course: any) => (
                      <tr key={course.id} className="hover:bg-purple-50/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-brand-purple flex items-center justify-center shrink-0 border border-purple-100">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-brand-navy text-sm">{course.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-brand-navy text-xs">{course.category}</span>
                            <span className="text-[11px] text-slate-400 font-semibold">{course.level}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1 border ${
                            course.marginType === 'FIXED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-purple-50 text-brand-purple border-purple-200/80'
                          }`}>
                            {course.marginType === 'FIXED' ? (
                              <>₹{Number(course.marginValue).toLocaleString('en-IN')}</>
                            ) : (
                              <><Percent className="w-3 h-3" />{course.marginValue}%</>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <DeleteCourseButton
                            universityId={id}
                            courseId={course.id}
                            courseName={course.name}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                        <BookOpen className="w-10 h-10 mx-auto mb-2.5 text-slate-300" />
                        <p className="text-sm font-bold text-brand-navy">No Courses Configured</p>
                        <p className="text-xs text-slate-400 mt-0.5">Use the form on the left to add programs for this university.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
