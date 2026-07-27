import React from 'react';

interface InputErrorProps {
  message?: string;
}

export function InputError({ message = 'Please fill out this field.' }: InputErrorProps) {
  return (
    <p className="error-message hidden text-red-500 text-sm mt-1.5 items-center gap-1.5 font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      {message}
    </p>
  );
}
