'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { deleteUniversityAction } from './actions';
import { useTransition } from 'react';

export function DeleteUniversityButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${name} and all its respective courses?`)) {
      startTransition(async () => {
        await deleteUniversityAction(id);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
      title={`Delete ${name} & its courses`}
    >
      {isPending ? (
        <Loader2 size={15} className="animate-spin text-rose-600" />
      ) : (
        <Trash2 size={15} />
      )}
    </button>
  );
}
