import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200 shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-400 placeholder:font-normal ${
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
Textarea.displayName = 'Textarea';
