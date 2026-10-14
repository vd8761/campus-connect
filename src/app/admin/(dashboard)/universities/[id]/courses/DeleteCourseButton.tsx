'use client';

import { useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteCourseAction } from './actions';

export function DeleteCourseButton({
  universityId,
  courseId,
  courseName,
}: {
  universityId: string;
  courseId: string;
  courseName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete course "${courseName}"?`)) {
      startTransition(async () => {
        await deleteCourseAction(universityId, courseId);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 active:scale-90"
      title={`Delete ${courseName}`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
