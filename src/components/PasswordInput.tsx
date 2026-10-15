'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { InputError } from './ui/InputError';

export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-field">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Lock size={18} />
        </div>
        <input 
          type={showPassword ? "text" : "password"} 
          name="password"
          required
          className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all outline-none text-brand-navy font-medium"
          placeholder="••••••••"
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-purple transition-colors cursor-pointer"
          title={showPassword ? "Hide password" : "Show password"}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      <InputError message="Please enter your password." />
    </div>
  );
}
