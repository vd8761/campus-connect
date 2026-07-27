'use client';

import React, { useState, useRef, useEffect, ElementType } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface SearchableDropdownProps {
  name?: string;
  options: { id: string; name: string }[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  icon?: ElementType;
}

export function SearchableDropdown({ name, options, defaultValue, value, onChange, placeholder = 'Select an option', className = '', required, icon: Icon }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Determine selected value from props or state
  const controlledValue = value !== undefined ? options.find(opt => opt.name === value || opt.id === value) : null;
  const [internalSelected, setInternalSelected] = useState<{ id: string; name: string } | null>(null);
  
  // Update internal selected if defaultValue exists and options change (e.g. async load)
  useEffect(() => {
    if (defaultValue && !internalSelected && options.length > 0) {
      const match = options.find(opt => opt.name === defaultValue || opt.id === defaultValue);
      if (match) setInternalSelected(match);
    }
  }, [defaultValue, options, internalSelected]);
  
  const selected = value !== undefined ? controlledValue : internalSelected;
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Hidden input for form submission - we submit the 'name' as that's what the schema expects currently */}
      <input 
        type="text" 
        name={name} 
        value={selected ? selected.name : ''} 
        readOnly 
        required={required}
        className="opacity-0 absolute inset-0 -z-10 w-full h-full pointer-events-none" 
      />
      
      {/* Main trigger button */}
      <div 
        className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-brand-purple focus-within:border-brand-purple focus-within:ring-1 focus-within:ring-brand-purple transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center overflow-hidden mr-2">
          {Icon && <Icon size={18} className="text-gray-400 mr-2 shrink-0" />}
          <span className={`truncate ${selected ? 'text-brand-navy' : 'text-gray-400'}`}>
            {selected ? selected.name : placeholder}
          </span>
        </div>
        <ChevronDown size={18} className="text-gray-400 shrink-0 mt-0.5" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => {
                    if (onChange) {
                      onChange(option.id);
                    }
                    setInternalSelected(option);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer hover:bg-brand-light text-brand-navy text-sm transition-colors"
                >
                  {option.name}
                  {selected?.id === option.id && <Check size={16} className="text-brand-purple" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-brand-muted text-center">
                No matching event types
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
