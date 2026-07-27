import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCountryCallingCode } from 'react-phone-number-input';

export function CountrySelect({ value, onChange, labels, options, iconComponent: Icon }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options ? options.filter((o: any) => o.value).filter((o: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const countryName = (o.label || '').toLowerCase();
    const code = (getCountryCallingCode(o.value) || '').toString();
    return countryName.includes(searchLower) || code.includes(searchLower) || `+${code}`.includes(searchLower);
  }) : [];

  return (
    <div className="relative flex items-center h-full border-r border-brand-border bg-gray-50/80 rounded-l-md hover:bg-gray-100 transition-colors z-10" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 cursor-pointer h-full"
      >
        <div className="flex items-center justify-center shrink-0 w-6 h-4 overflow-hidden rounded-[2px] shadow-sm">
          {Icon && value ? (
            <Icon country={value} label={labels ? labels[value] : value} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 shadow-inner" />
          )}
        </div>
        <span className="text-sm font-medium text-brand-navy whitespace-nowrap">
          {value ? `+${getCountryCallingCode(value)}` : ''}
        </span>
        <ChevronDown size={14} className={`text-brand-muted transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-brand-border rounded-md shadow-xl py-1 flex flex-col max-h-[300px] animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
          
          <div className="p-2 border-b border-gray-100 bg-gray-50/50">
            <input 
              type="text" 
              placeholder="Search country or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white border border-brand-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple shadow-sm transition-all"
              autoFocus
            />
          </div>

          <div className="overflow-y-auto flex-1">
            <div
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
                setSearchTerm('');
              }}
              className="px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 text-brand-navy"
            >
              {labels ? labels['ZZ'] : 'International'}
            </div>
            
            {filteredOptions.length > 0 ? (
              filteredOptions.map(({ value: countryValue, label }: any) => (
                <div
                  key={countryValue}
                  onClick={() => {
                    onChange(countryValue);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 flex items-center gap-3
                    ${value === countryValue 
                      ? 'bg-brand-purple/5 text-brand-purple font-semibold' 
                      : 'text-brand-navy hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-center shrink-0 w-6 h-4 overflow-hidden rounded-[2px] shadow-sm">
                    {Icon && <Icon country={countryValue} label={label} className="w-full h-full object-cover" />}
                  </div>
                  <span className="truncate flex-1">{label}</span>
                  <span className="text-gray-400 font-mono text-xs">+{(getCountryCallingCode as any)(countryValue)}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-sm text-center text-gray-500 font-medium">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
