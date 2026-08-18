'use client';

import { useState } from 'react';
import { createCourseAction } from './actions';
import { Button } from '@/components/ui/Button';
import { BookOpen, Tag, GraduationCap, Percent, ChevronDown } from 'lucide-react';

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

const inputBase = 'w-full py-2.5 border rounded-xl focus:ring-1 outline-none transition-all';
const inputNormal = `${inputBase} border-gray-200 focus:border-brand-teal focus:ring-brand-teal`;
const inputError  = `${inputBase} border-red-500 focus:border-red-500 focus:ring-red-500`;

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
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-8">
      <h2 className="text-xl font-heading font-bold text-brand-navy mb-6">Add New Course</h2>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {errors.form}
        </div>
      )}

      <form id="add-course-form" onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Course Name */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-2">
            Course Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              onChange={() => clearFieldError('name')}
              className={`${errors.name ? inputError : inputNormal} pl-10 pr-4`}
              placeholder="E.g., B.Tech Computer Science"
            />
          </div>
          {errors.name && <FieldError msg={errors.name} />}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="category"
              onChange={() => clearFieldError('category')}
              className={`${errors.category ? inputError : inputNormal} pl-10 pr-9 bg-white text-gray-700 appearance-none`}
            >
              <option value="">Select Category</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
              <option value="Medicine">Medicine</option>
              <option value="Law">Law</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          {errors.category && <FieldError msg={errors.category} />}
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-2">
            Level <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-4 w-4 text-gray-400" />
            </div>
            <select
              name="level"
              onChange={() => clearFieldError('level')}
              className={`${errors.level ? inputError : inputNormal} pl-10 pr-9 bg-white text-gray-700 appearance-none`}
            >
              <option value="">Select Level</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
              <option value="Diploma">Diploma</option>
              <option value="Certificate">Certificate</option>
              <option value="PhD">PhD</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          {errors.level && <FieldError msg={errors.level} />}
        </div>

        {/* Margin Type */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-2">
            Margin Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="marginType"
              value={marginType}
              onChange={(e) => setMarginType(e.target.value)}
              className={`${inputNormal} pl-4 pr-9 bg-white text-gray-700 appearance-none`}
            >
              <option value="FIXED">Fixed Rate (₹)</option>
              <option value="PERCENTAGE">Percentage (%)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Margin Value */}
        <div>
          <label className="block text-sm font-bold text-brand-navy mb-2">
            Margin Value <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm font-medium">
              {marginType === 'FIXED' ? '₹' : <Percent className="h-4 w-4" />}
            </div>
            <input
              type="number"
              name="marginValue"
              min="0"
              step={marginType === 'FIXED' ? '100' : '0.5'}
              onChange={() => clearFieldError('marginValue')}
              className={`${errors.marginValue ? inputError : inputNormal} pl-8 pr-4`}
              placeholder={marginType === 'FIXED' ? '5000' : '15'}
            />
          </div>
          {errors.marginValue && <FieldError msg={errors.marginValue} />}
        </div>

        <Button
          type="submit"
          variant="default"
          className="w-full justify-center mt-2"
          disabled={isPending}
        >
          {isPending ? 'Adding...' : 'Add Course'}
        </Button>
      </form>
    </div>
  );
}
