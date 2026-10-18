'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { PasswordInput } from '@/components/PasswordInput';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

function UniversityLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(searchParams.get('error') ? 'Invalid credentials or access denied.' : null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else if (res?.ok) {
        router.push('/university/attendance');
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-heading font-bold text-brand-navy">University Portal</h1>
        <p className="text-brand-muted text-sm mt-2">Login with your University Representative credentials.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 border border-red-100 font-medium flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-2">Email Address</label>
          <div className="form-field">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input 
                type="email" 
                name="email"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-brand-navy font-medium"
                placeholder="rep@university.edu"
              />
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-brand-navy">Password</label>
          </div>
          <PasswordInput />
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            variant="gradient" 
            className="w-full py-6 text-base rounded-xl flex items-center justify-center gap-2 group shadow-md hover:shadow-lg transition-all"
            isLoading={isLoading}
            loadingText="Authenticating..."
          >
            Secure Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </>
  );
}

export default function UniversityLogin() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-gray-100 p-8 sm:p-10">
        <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
          <UniversityLoginForm />
        </Suspense>
      </div>
      
      <div className="mt-10 text-center flex flex-col items-center text-sm font-medium text-brand-muted/70">
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-brand-purple" />
          <span>Protected by Campus Square™ Security</span>
        </div>
      </div>
    </div>
  );
}
