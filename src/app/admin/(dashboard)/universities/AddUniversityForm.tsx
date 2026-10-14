'use client';

import { useState } from 'react';
import { createUniversityAction } from './actions';
import { Button } from '@/components/ui/Button';
import { Building2, MapPin, Globe, Loader2 } from 'lucide-react';

export function AddUniversityForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await createUniversityAction(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    
    setIsPending(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 p-6 shadow-2xs sticky top-8">
      <h2 className="text-lg font-heading font-bold text-brand-navy mb-5">Add New University</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form id="add-university-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1.5">
            University Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Building2 className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              name="name" 
              required
              className="w-full h-11 pl-10 pr-4 text-sm border border-brand-border/80 rounded-xl bg-white text-brand-navy placeholder:text-slate-400 focus:ring-2 focus:ring-brand-purple/15 focus:border-brand-purple outline-none transition-all"
              placeholder="E.g., Karpagam Academy of Higher Education"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1.5">City</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              name="city" 
              className="w-full h-11 pl-10 pr-4 text-sm border border-brand-border/80 rounded-xl bg-white text-brand-navy placeholder:text-slate-400 focus:ring-2 focus:ring-brand-purple/15 focus:border-brand-purple outline-none transition-all"
              placeholder="E.g., Chennai"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1.5">Country</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              name="country" 
              defaultValue="India"
              className="w-full h-11 pl-10 pr-4 text-sm border border-brand-border/80 rounded-xl bg-white text-brand-navy placeholder:text-slate-400 focus:ring-2 focus:ring-brand-purple/15 focus:border-brand-purple outline-none transition-all"
              placeholder="E.g., India"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="gradient" 
          className="w-full h-11 rounded-xl font-bold justify-center mt-2 shadow-2xs hover:shadow-xs active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Adding University...</span>
            </span>
          ) : (
            'Add University'
          )}
        </Button>
      </form>
    </div>
  );
}
