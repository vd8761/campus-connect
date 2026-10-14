'use client';

import { useTransition } from 'react';
import { Ban, Check, Trash2, Loader2 } from 'lucide-react';
import { toggleEventTypeAction, deleteEventTypeAction } from './actions';

interface EventTypeActionsProps {
  id: string;
  name: string;
  isActive: boolean;
}

export function EventTypeActions({ id, name, isActive }: EventTypeActionsProps) {
  const [isToggling, startToggle] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const handleToggle = () => {
    startToggle(async () => {
      await toggleEventTypeAction(id, isActive);
    });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      startDelete(async () => {
        await deleteEventTypeAction(id);
      });
    }
  };

  return (
    <div className="flex justify-end gap-1.5">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isToggling || isDeleting}
        className={`p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50 active:scale-95 ${
          isActive
            ? 'text-amber-600 hover:bg-amber-50'
            : 'text-emerald-600 hover:bg-emerald-50'
        }`}
        title={isActive ? 'Deactivate' : 'Activate'}
      >
        {isToggling ? (
          <Loader2 size={16} className="animate-spin text-amber-600" />
        ) : isActive ? (
          <Ban size={16} />
        ) : (
          <Check size={16} />
        )}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isToggling || isDeleting}
        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50 active:scale-95"
        title={`Delete ${name}`}
      >
        {isDeleting ? (
          <Loader2 size={16} className="animate-spin text-rose-600" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>
    </div>
  );
}
