'use client';

import { useState } from 'react';
import { createCourseAction } from './actions';
import { Button } from '@/components/ui/Button';
import { BookOpen, Tag, GraduationCap, Percent, ChevronDown, Loader2 } from 'lucide-react';

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

const FieldError = ({ msg }: { msg: string }) => (
  <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1.5 font-medium">
    <InfoIcon /> {msg}
  </p>
);

const inputBase = 'w-full h-11 border rounded-xl text-sm focus:ring-2 focus:ring-brand-purple/15 outline-none transition-all';
const inputNormal = `${inputBase} border-brand-border/80 focus:border-brand-purple bg-white text-brand-navy placeholder:text-slate-400`;
const inputError  = `${inputBase} border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-white text-brand-navy placeholder:text-slate-400`;

export function AddCourseForm({ universityId }: { universityId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [marginType, setMarginType] = useState('FIXED');

  const [errors, setErrors] = useState<Record<string, string>>({});

  function setFieldError(field: string, msg: string) {
    setErrors(prev => ({ ...prev, [field]: msg }));
  }
  function clearFieldError(field: string) {
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = (formData.get('name') as string).trim();
    const category = formData.get('category') as string;
    const level = formData.get('level') as string;
    const marginValue = formData.get('marginValue') as string;

    const newErrors: Record<string, string> = {};
    if (!name)           newErrors.name = 'Course name is required.';
    if (!category)       newErrors.category = 'Please select a category.';
    if (!level)          newErrors.level = 'Please select a level.';
    if (!marginValue || isNaN(parseFloat(marginValue))) newErrors.marginValue = 'Enter a valid margin value.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsPending(true);
    const result = await createCourseAction(universityId, formData);
    if (result.error) {
      setErrors({ form: result.error });
    } else {
      (e.target as HTMLFormElement).reset();
      setMarginType('FIXED');
    }
    setIsPending(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-2xs sticky top-4">
      <h2 className="text-base font-heading font-bold text-brand-navy mb-4">Add New Course</h2>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
          {errors.form}
        </div>
      )}

      <form id="add-course-form" onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Course Name */}
        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1.5">
            Course Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="name"
              onChange={() => clearFieldError('name')}
              className={`${errors.name ? inputError : inputNormal} pl-9 pr-3 text-xs`}
              placeholder="E.g., B.Tech Computer Science"
            />
          </div>
          {errors.name && <FieldError msg={errors.name} />}
        </div>

        {/* 2-Column: Category & Level */}
        <div className="grid grid-cols-2 gap-3">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="category"
                onChange={() => clearFieldError('category')}
                className={`${errors.category ? inputError : inputNormal} px-3 pr-8 bg-white text-xs text-slate-700 appearance-none`}
              >
                <option value="">Category</option>
                <option value="Engineering">Engineering</option>
                <option value="Management">Management</option>
                <option value="Design">Design</option>
                <option value="Architecture">Architecture</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Commerce">Commerce</option>
                <option value="Law">Law</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Allied Health">Allied Health</option>
                <option value="Global Studies">Global Studies</option>
                <option value="Research">Research</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
            {errors.category && <FieldError msg={errors.category} />}
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1.5">
              Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="level"
                onChange={() => clearFieldError('level')}
                className={`${errors.level ? inputError : inputNormal} px-3 pr-8 bg-white text-xs text-slate-700 appearance-none`}
              >
                <option value="">Level</option>
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
                <option value="Diploma">Diploma</option>
                <option value="Certification">Certification</option>
                <option value="Doctoral">Doctoral (Ph.D.)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
            {errors.level && <FieldError msg={errors.level} />}
          </div>
        </div>

        {/* 2-Column: Margin Type & Margin Value */}
        <div className="grid grid-cols-2 gap-3">
          {/* Margin Type */}
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1.5">
              Margin Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="marginType"
                value={marginType}
                onChange={(e) => setMarginType(e.target.value)}
                className={`${inputNormal} px-3 pr-8 bg-white text-xs text-slate-700 appearance-none`}
              >
                <option value="FIXED">Fixed (₹)</option>
                <option value="PERCENTAGE">Percent (%)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Margin Value */}
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1.5">
              Margin <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
                {marginType === 'FIXED' ? '₹' : <Percent className="h-3 w-3" />}
              </div>
              <input
                type="number"
                name="marginValue"
                min="0"
                step={marginType === 'FIXED' ? '100' : '0.5'}
                onChange={() => clearFieldError('marginValue')}
                className={`${errors.marginValue ? inputError : inputNormal} pl-6 pr-2 text-xs`}
                placeholder={marginType === 'FIXED' ? '25000' : '15'}
              />
            </div>
            {errors.marginValue && <FieldError msg={errors.marginValue} />}
          </div>
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full justify-center h-11 rounded-xl text-sm font-bold mt-2 shadow-2xs hover:shadow-xs active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Adding Course...</span>
            </span>
          ) : (
            'Add Course'
          )}
        </Button>
      </form>
    </div>
  );
}
