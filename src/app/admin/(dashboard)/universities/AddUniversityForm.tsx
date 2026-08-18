'use client';

import { useState } from 'react';
import { createUniversityAction } from './actions';
import { Button } from '@/components/ui/Button';
import { Building2, MapPin, Globe } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-8">
      <h2 className="text-xl font-heading font-bold text-brand-navy mb-6">Add New University</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form id="add-university-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-1.5">University Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              name="name" 
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
              placeholder="E.g., Anna University"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-1.5">City</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              name="city" 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
              placeholder="E.g., Chennai"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-1.5">Country</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              name="country" 
              defaultValue="India"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-colors"
              placeholder="E.g., India"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="default" 
          className="w-full justify-center mt-2"
          disabled={isPending}
        >
          {isPending ? 'Adding...' : 'Add University'}
        </Button>
      </form>
    </div>
  );
}
