'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { RegistrationForm } from './RegistrationForm';
import { Turnstile } from '@marsidev/react-turnstile';
import { ArrowRight, Lock, UserCircle, Mail } from 'lucide-react';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';

// Basic flag icon component for CountrySelect
const FlagIcon = ({ country, label, className }: any) => {
  return (
    <img 
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
      alt={label}
      className={className}
    />
  );
};

export function SmartRegistration({ 
  eventId, 
  eventSlug, 
  eventTitle 
}: { 
  eventId: string; 
  eventSlug: string; 
  eventTitle?: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [prefillData, setPrefillData] = useState<any>(null);
  const [error, setError] = useState('');
  const [country, setCountry] = useState<any>('IN');

  const isEmail = identifier.length > 0 && /[a-zA-Z@]/.test(identifier);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter your email or mobile number.');
      return;
    }
    if (!turnstileToken) {
      setError('Please complete the security check.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      let finalIdentifier = identifier;
      const field = isEmail ? 'email' : 'mobile';

      if (!isEmail && country) {
        // Strip any existing '+' if the user typed it
        let digits = identifier.replace(/\D/g, '');
        // Standardize with country code
        if (digits.length === 10) {
           finalIdentifier = `+${getCountryCallingCode(country)}${digits}`;
        }
      }
      
      const res = await fetch(`/api/participant?${field}=${encodeURIComponent(finalIdentifier)}&token=${turnstileToken}&eventId=${eventId}`);
      const data = await res.json();
      
      if (data.success && data.isRegistered) {
        setError('You are already registered for this event. No need to register again!');
        return;
      }

      if (data.success && data.participant) {
        setPrefillData(data.participant);
      } else {
        // Not found, just pass the identifier to the form
        setPrefillData({
          [field]: finalIdentifier
        });
      }
      
      setStep(2);
      setTimeout(() => {
        const cardElement = document.getElementById('registration-card');
        if (cardElement) {
          const headerOffset = 85;
          const elementPosition = cardElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      }, 50);
    } catch (e) {
      console.error('Failed to verify', e);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (step === 2) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <RegistrationForm eventId={eventId} eventSlug={eventSlug} eventTitle={eventTitle} initialData={prefillData} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-purple mx-auto mb-4">
          <UserCircle size={32} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-brand-navy mb-2">Welcome! Let's get started.</h2>
        <p className="text-brand-muted text-sm">
          Enter your email or mobile number to see if you are already registered with Campus Square™.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-2">Email or Mobile Number</label>
          <div className="relative flex h-12 rounded-md border border-brand-border bg-white shadow-sm transition-all duration-200 focus-within:ring-1 focus-within:ring-brand-purple focus-within:border-brand-purple hover:border-brand-purple/50">
            <div className="flex-shrink-0 transition-all duration-300">
              {identifier.length > 0 && (
                isEmail ? (
                  <div className="flex items-center justify-center w-14 bg-gray-50/80 border-r border-brand-border h-full text-brand-muted rounded-l-md animate-in slide-in-from-left-2 fade-in">
                    <Mail size={20} className="text-brand-purple" />
                  </div>
                ) : (
                  <div className="h-full animate-in slide-in-from-left-2 fade-in">
                    <CountrySelect 
                      value={country} 
                      onChange={setCountry} 
                      labels={en} 
                      options={getCountries().map(c => ({ value: c, label: en[c] }))}
                      iconComponent={FlagIcon}
                    />
                  </div>
                )
              )}
            </div>
            <input 
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="flex-1 h-full px-4 text-brand-navy bg-transparent outline-none placeholder:text-gray-400"
              placeholder="e.g. john@example.com or 9876543210"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="flex justify-center my-6">
          <Turnstile 
            siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAFWnYtjSIMm6bFZC'}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setError('Security check failed. Please refresh and try again.')}
            onExpire={() => setTurnstileToken(null)}
            options={{
              theme: 'light',
              size: 'normal',
            }}
          />
        </div>

        <Button 
          type="submit" 
          variant="gradient" 
          className="w-full h-12 text-base font-semibold shadow-md flex items-center justify-center gap-2"
          disabled={isVerifying || !turnstileToken || !identifier}
        >
          {isVerifying ? (
            'Verifying securely...'
          ) : (
            <>Continue <ArrowRight size={18} /></>
          )}
        </Button>
        
        <p className="text-center text-xs text-brand-muted flex items-center justify-center gap-1.5 mt-4">
          <Lock size={12} /> Protected by Cloudflare Security
        </p>
      </form>
    </div>
  );
}
