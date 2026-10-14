'use client';

import { useState, useEffect } from 'react';
import { getUniversitiesListAction } from './actions';
import { Building2, Search, Check, GraduationCap, MapPin, CheckSquare, Square } from 'lucide-react';

interface UniversityItem {
  id: string;
  name: string;
  city: string | null;
  country: string;
  logoUrl: string | null;
  courses: number;
}

export function ParticipatingUniversitiesSelector({ initialSelectedIds = [] }: { initialSelectedIds?: string[] }) {
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUniversitiesListAction()
      .then((data: any) => {
        setUniversities(data);
        // If initialSelectedIds is empty and we are creating a new event, default to all universities or empty
        // Keep initialSelectedIds as is
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleUniversity = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(universities.map(u => u.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const filteredUniversities = universities.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    (u.city && u.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-brand-purple rounded-full"></div>
          <div>
            <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
              <span>Participating Universities</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-brand-purple border border-purple-100">
                {selectedIds.length} of {universities.length} Selected
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the verified academic partners attending and setting up booths for this conclave edition.
            </p>
          </div>
        </div>

        {/* Quick bulk action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/5 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckSquare size={13} />
            <span>Select All ({universities.length})</span>
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Square size={13} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter participating universities by name or city..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-brand-border/80 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Hidden inputs to submit selected IDs with FormData */}
      {selectedIds.map(id => (
        <input key={id} type="hidden" name="universityIds" value={id} />
      ))}

      {/* University Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm">
          Loading universities...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
          {filteredUniversities.length > 0 ? (
            filteredUniversities.map((uni) => {
              const isSelected = selectedIds.includes(uni.id);

              return (
                <div
                  key={uni.id}
                  onClick={() => toggleUniversity(uni.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                    isSelected
                      ? 'bg-purple-50/80 border-brand-purple/40 shadow-2xs'
                      : 'bg-white border-brand-border/70 hover:border-brand-purple/30 hover:bg-white'
                  }`}
                >
                  {/* Checkbox indicator */}
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                    isSelected 
                      ? 'bg-brand-purple border-brand-purple text-white shadow-2xs' 
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>

                  {/* Logo thumbnail */}
                  <div className="w-20 h-11 rounded-lg bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                    {uni.logoUrl ? (
                      <img src={uni.logoUrl} alt={uni.name} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-brand-purple/50" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs font-bold leading-tight line-clamp-2 transition-colors ${
                      isSelected ? 'text-brand-purple' : 'text-brand-navy'
                    }`}>
                      {uni.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                      <span className="flex items-center gap-0.5 truncate">
                        <MapPin size={10} className="text-brand-purple shrink-0" />
                        <span>{uni.city || uni.country}</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-brand-purple shrink-0">
                        {uni.courses} {Number(uni.courses) === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-8 text-center text-slate-400 text-xs">
              No universities found matching "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
