import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { PasswordInput } from '@/components/PasswordInput';
import { ValidatedForm } from '@/components/ui/ValidatedForm';
import { InputError } from '@/components/ui/InputError';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default async function AdminLogin(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams?.error;

  async function login(formData: FormData) {
    'use server'
    const username = formData.get('username');
    const password = formData.get('password');
    
    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;
    
    if (username === correctUsername && password === correctPassword) {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      redirect('/admin');
    } else {
      redirect('/admin/login?error=1');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-gray-100 p-8 sm:p-10">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-brand-navy">Welcome Back</h1>
          <p className="text-brand-muted text-sm mt-2">Enter your admin credentials to securely access your dashboard.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 border border-red-100 font-medium flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>Invalid credentials. Please verify your email and password and try again.</span>
          </div>
        )}
        
        <ValidatedForm action={login} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-brand-navy mb-2">Email or Username</label>
            <div className="form-field">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="username"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-brand-navy font-medium"
                  placeholder="admin@campusconnect.com"
                />
              </div>
              <InputError message="Please enter your email or username." />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-brand-navy">Password</label>
            </div>
            <PasswordInput />
          </div>
          
          <div className="pt-2">
            <Button type="submit" variant="gradient" className="w-full py-6 text-base rounded-xl flex items-center justify-center gap-2 group shadow-md hover:shadow-lg transition-all">
              Secure Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </ValidatedForm>
      </div>
      
      {/* Footer Text */}
      <div className="mt-10 text-center flex flex-col items-center text-sm font-medium text-brand-muted/70">
        <div className="flex items-center gap-2">
          <Lock size={14} />
          <span>Protected by Campus Connect Security</span>
        </div>
      </div>
    </div>
  );
}
