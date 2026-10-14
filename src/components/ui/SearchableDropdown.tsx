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
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  required?: boolean;
  icon?: ElementType;
}

export function SearchableDropdown({ 
  name, 
  options, 
  defaultValue, 
  value, 
  onChange, 
  placeholder = 'Select an option', 
  searchPlaceholder = 'Search...',
  noOptionsMessage = 'No matching options found',
  className = '', 
  buttonClassName = '',
  menuClassName = '',
  align = 'left',
  required, 
  icon: Icon 
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Determine selected value from props or state
  const controlledValue = value !== undefined ? (options.find(opt => opt.name === value || opt.id === value) || null) : null;
  const [internalSelected, setInternalSelected] = useState<{ id: string; name: string } | null>(null);
  
  // Update internal selected if defaultValue exists and options change
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
      {/* Hidden input for form submission */}
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
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`flex items-center justify-between w-full h-11 px-4 rounded-xl border border-brand-border/80 bg-white cursor-pointer hover:border-brand-purple/60 focus:outline-none focus:ring-2 focus:ring-brand-purple/15 focus:border-brand-purple transition-all select-none shadow-sm ${buttonClassName}`}
      >
        <div className="flex items-center overflow-hidden mr-2 min-w-0">
          {Icon && <Icon size={18} className="text-brand-purple shrink-0 mr-2.5" />}
          <span className={`truncate text-sm font-medium ${selected ? 'text-brand-navy' : 'text-brand-muted'}`}>
            {selected ? selected.name : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-brand-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-purple' : ''}`} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute z-50 min-w-full sm:min-w-[280px] max-w-sm mt-2 bg-white border border-brand-border rounded-2xl shadow-xl shadow-brand-navy/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
          align === 'right' ? 'right-0' : 'left-0'
        } ${menuClassName}`}>
          <div className="p-2 border-b border-brand-border/60 bg-brand-light/40">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input 
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-7 py-2 bg-white border border-brand-border rounded-xl text-xs text-brand-navy placeholder:text-brand-muted focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-navy text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center bg-brand-border/40 hover:bg-brand-border"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selected?.id === option.id || selected?.name === option.name;
                return (
                  <button 
                    key={option.id}
                    type="button"
                    onClick={() => {
                      if (onChange) {
                        onChange(option.id);
                      }
                      setInternalSelected(option);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                      isSelected 
                        ? 'bg-brand-purple/10 text-brand-purple font-semibold' 
                        : 'text-brand-navy hover:bg-brand-light'
                    }`}
                  >
                    <span className="leading-snug">{option.name}</span>
                    {isSelected && <Check size={16} className="text-brand-purple shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-xs text-brand-muted text-center font-medium">
                {noOptionsMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
