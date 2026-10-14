'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export function EventFilters({ eventTypes }: { eventTypes: { id: string, name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentType = searchParams.get('type') || '';
  const currentStatus = searchParams.get('status') || '';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/events?${params.toString()}`);
  };

  const typeOptions = [
    { id: '', name: 'All Types' },
    ...eventTypes.map(t => ({ id: t.name, name: t.name }))
  ];

  const statusOptions = [
    { id: '', name: 'All Statuses' },
    { id: 'DRAFT', name: 'Draft' },
    { id: 'OPEN', name: 'Registration Open' },
    { id: 'OPENING_SOON', name: 'Opening Soon' },
    { id: 'CLOSED', name: 'Registration Closed' },
    { id: 'COMPLETED', name: 'Completed' },
  ];

  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-brand-border/80 shadow-2xs mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[220px] z-20">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Filter by Type
        </label>
        <SearchableDropdown 
          options={typeOptions}
          value={currentType}
          onChange={(val) => handleFilterChange('type', val)}
          placeholder="All Types"
        />
      </div>

      <div className="flex-1 min-w-[220px] z-10">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Filter by Status
        </label>
        <SearchableDropdown 
          options={statusOptions}
          value={currentStatus}
          onChange={(val) => handleFilterChange('status', val)}
          placeholder="All Statuses"
        />
      </div>

      {(currentType || currentStatus) && (
        <div className="shrink-0 pb-1">
          <button 
            onClick={() => router.push('/admin/events')}
            className="px-3 py-2 rounded-xl text-xs font-bold text-brand-purple hover:bg-brand-light border border-brand-purple/20 transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
