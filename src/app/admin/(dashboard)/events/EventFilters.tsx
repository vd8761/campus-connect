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
    <div className="bg-white p-4 rounded-xl border border-brand-border shadow-sm mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px] z-20">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Filter by Type</label>
        <SearchableDropdown 
          options={typeOptions}
          value={currentType}
          onChange={(val) => handleFilterChange('type', val)}
          placeholder="All Types"
        />
      </div>

      <div className="flex-1 min-w-[200px] z-10">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Filter by Status</label>
        <SearchableDropdown 
          options={statusOptions}
          value={currentStatus}
          onChange={(val) => handleFilterChange('status', val)}
          placeholder="All Statuses"
        />
      </div>

      {(currentType || currentStatus) && (
        <div className="pt-5">
          <button 
            onClick={() => router.push('/admin/events')}
            className="text-brand-purple text-sm font-semibold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
