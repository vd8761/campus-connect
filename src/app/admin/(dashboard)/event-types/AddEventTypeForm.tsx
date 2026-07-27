'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { createEventTypeAction } from './actions';

export function AddEventTypeForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please fill out this field.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      await createEventTypeAction(formData);
      setName(''); // Reset form on success
    } catch (err) {
      setError('An error occurred while creating the event type.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-brand-navy mb-4">Add New Type</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-2">Event Type Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Masterclass"
            className={`w-full px-4 py-3 rounded-lg border focus:ring-1 outline-none transition-all ${
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-brand-purple focus:ring-brand-purple'
            }`}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1.5 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              {error}
            </p>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-navy text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Plus size={18} /> {isSubmitting ? 'Adding...' : 'Add Type'}
        </button>
      </form>
    </div>
  );
}
