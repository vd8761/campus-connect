'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from './Button';

interface SubmitButtonProps extends ButtonProps {
  loadingText?: string;
  icon?: React.ElementType;
}

export function SubmitButton({
  children,
  loadingText,
  icon: Icon,
  className = '',
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={`relative active:scale-[0.98] transition-all duration-150 select-none ${
        pending ? 'cursor-not-allowed opacity-80' : ''
      } ${className}`}
      {...props}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          <Loader2 size={16} className="animate-spin shrink-0" />
          <span>{loadingText || 'Please wait...'}</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          {Icon && <Icon size={16} className="shrink-0" />}
          {children}
        </span>
      )}
    </Button>
  );
}
