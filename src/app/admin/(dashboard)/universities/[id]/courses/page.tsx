import sql from '@/lib/neon';
import { AddCourseForm } from './AddCourseForm';
import { ArrowLeft, BookOpen, Percent, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deleteCourseAction } from './actions';

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
    <div className="p-8 max-w-7xl mx-auto">
      <Link href="/admin/universities" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-navy mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Universities
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-navy">{university.name} — Courses</h1>
        <p className="text-brand-muted mt-1">Manage courses and margin configurations for this university.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddCourseForm universityId={id} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-brand-muted text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Course Name</th>
                  <th className="px-6 py-4 font-medium">Category / Level</th>
                  <th className="px-6 py-4 font-medium">Margin</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.length > 0 ? (
                  courses.map((course: any) => (
                    <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-navy/5 flex items-center justify-center text-brand-navy shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-brand-navy text-sm">{course.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5 text-sm">
                          <span className="font-medium text-brand-navy">{course.category}</span>
                          <span className="text-xs text-brand-muted">{course.level}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1 ${
                          course.marginType === 'FIXED'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}>
                          {course.marginType === 'FIXED' ? (
                            <>₹{Number(course.marginValue).toLocaleString('en-IN')}</>
                          ) : (
                            <><Percent className="w-3 h-3" />{course.marginValue}%</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action={async () => {
                          'use server';
                          await deleteCourseAction(id, course.id);
                        }}>
                          <button
                            type="submit"
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-brand-muted">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium text-brand-navy mb-1">No Courses Found</p>
                      <p className="text-sm">Use the form to add a course for this university.</p>
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
