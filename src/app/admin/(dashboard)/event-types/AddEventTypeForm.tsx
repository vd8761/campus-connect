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
    <div className="bg-white rounded-2xl border border-brand-border/80 p-6 shadow-2xs">
      <h2 className="text-lg font-heading font-bold text-brand-navy mb-4">Add New Type</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1.5">
            Event Type Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Masterclass"
            className={`w-full h-11 px-4 text-sm rounded-xl border focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all text-brand-navy placeholder:text-slate-400 ${
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-brand-border/80 focus:border-brand-purple'
            }`}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{error}</span>
            </p>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-11 flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-navy text-white rounded-xl text-sm font-bold shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Adding Type...</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Add Type</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
