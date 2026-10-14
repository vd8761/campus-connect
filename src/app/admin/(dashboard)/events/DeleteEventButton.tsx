'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { deleteEventAction } from './actions';
import { useTransition } from 'react';

export function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${title}" and all its registrations, booths, and schedules?`)) {
      startTransition(async () => {
        await deleteEventAction(id);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
      title={`Delete ${title}`}
    >
      {isPending ? (
        <Loader2 size={15} className="animate-spin text-rose-600" />
      ) : (
        <Trash2 size={15} />
      )}
    </button>
  );
}
