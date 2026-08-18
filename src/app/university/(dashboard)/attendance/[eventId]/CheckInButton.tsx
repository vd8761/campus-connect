'use client';

import { useState } from 'react';
import { toggleBoothVisitAction } from './actions';
import { Check, X } from 'lucide-react';

export function CheckInButton({ 
  eventId, 
  participantId, 
  initialIsPresent 
}: { 
  eventId: string, 
  participantId: string,
  initialIsPresent: boolean
}) {
  const [isPresent, setIsPresent] = useState(initialIsPresent);
  const [isPending, setIsPending] = useState(false);

  async function handleToggle() {
    setIsPending(true);
    // Optimistic update
    setIsPresent(!isPresent);
    
    const result = await toggleBoothVisitAction(eventId, participantId);
    
    if (result.error) {
      // Revert on error
      setIsPresent(isPresent);
      alert(result.error);
    }
    
    setIsPending(false);
  }

  if (isPresent) {
    return (
      <button 
        onClick={handleToggle}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
      >
        <Check size={16} /> Present
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 border border-gray-200"
    >
      <X size={16} /> Absent
    </button>
  );
}
