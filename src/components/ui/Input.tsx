import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        className={`flex h-12 w-full rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-400 placeholder:font-normal ${
          error 
            ? 'border-status-error bg-red-50/30 text-brand-navy focus:ring-1 focus:ring-status-error focus:border-status-error' 
            : 'border-brand-border bg-white text-brand-navy hover:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple focus:border-brand-purple'
        } ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
