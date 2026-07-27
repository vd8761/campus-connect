'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
}

export function ImageUpload({ name, defaultValue = '' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show a temporary local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPreview(data.url);
      } else {
        alert('Upload failed. Please try again.');
        setPreview(defaultValue);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during upload.');
      setPreview(defaultValue);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden input to hold the actual URL to submit with the form */}
      <input type="hidden" name={name} value={preview} />
      
      {preview ? (
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden border border-gray-200">
          <Image 
            src={preview} 
            alt="Event Banner Preview" 
            fill 
            className="object-cover" 
          />
          <button 
            type="button"
            onClick={() => {
              setPreview('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-white text-gray-700 hover:text-red-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 md:h-64 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-purple hover:bg-brand-purple/5 flex flex-col items-center justify-center cursor-pointer transition-all"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-brand-navy">Click to upload banner image</p>
          <p className="text-xs text-gray-500 mt-1">Recommended: 1920x1080 (JPG, PNG)</p>
        </div>
      )}
      
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
      />
      
      {uploading && <p className="text-sm text-brand-purple font-medium">Uploading image...</p>}
    </div>
  );
}
