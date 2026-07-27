'use client';

import React, { useState, FormEvent, HTMLProps } from 'react';

interface ValidatedFormProps extends Omit<HTMLProps<HTMLFormElement>, 'action'> {
  action?: string | ((formData: FormData) => void | Promise<void>);
}

export function ValidatedForm({ children, action, className = '', onSubmit, ...props }: ValidatedFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    
    // If the form is natively invalid, prevent submission
    if (!e.currentTarget.checkValidity()) {
      e.preventDefault();
      
      // Give a tiny delay for React to render the .is-submitted classes
      setTimeout(() => {
        const firstInvalid = e.target.closest('form')?.querySelector(':invalid') as HTMLElement;
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      
      return;
    }
    
    // Otherwise allow the Server Action to run or call the custom onSubmit
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form 
      action={action as any} 
      className={`group ${isSubmitted ? 'is-submitted' : ''} ${className}`} 
      onSubmit={handleSubmit} 
      noValidate 
      {...props}
    >
      {children}
    </form>
  );
}
