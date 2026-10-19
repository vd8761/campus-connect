'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
}

// Client-side image compression to prevent Vercel 4.5MB payload limit
async function compressImageIfNeeded(file: File): Promise<File> {
  // If not an image or already under 1.5MB, keep original
  if (!file.type.startsWith('image/') || file.size < 1.5 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = document.createElement('img');
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1920;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }
            const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpeg', {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/jpeg',
          0.85
        );
      } catch {
        resolve(file);
      }
    };

    img.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({ name, defaultValue = '' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    // Show temporary local preview
    const objectUrl = URL.createObjectURL(rawFile);
    setPreview(objectUrl);
    setUploading(true);

    try {
      // Compress if needed to avoid Vercel 4.5MB payload limit
      const fileToUpload = await compressImageIfNeeded(rawFile);

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPreview(data.url);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Upload failed. Please try again.');
        setPreview(defaultValue);
      }
    } catch (error) {
      console.error('Image Upload Error:', error);
      alert('An error occurred during upload. Please try again.');
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
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden border border-gray-200 bg-slate-50">
          <Image
            src={preview}
            alt="Event Banner Preview"
            fill
            unoptimized
            className="object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-brand-turquoise" />
              <span className="text-xs font-semibold">Uploading & Optimizing...</span>
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={() => {
                setPreview('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-white text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
              title="Remove banner image"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 md:h-64 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-purple hover:bg-brand-purple/5 flex flex-col items-center justify-center cursor-pointer transition-all"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-brand-navy">Click to upload banner image</p>
          <p className="text-xs text-gray-500 mt-1">Recommended: 1920x1080 (JPG, PNG, WEBP)</p>
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {uploading && !preview && (
        <p className="text-sm text-brand-purple font-medium flex items-center gap-1.5">
          <Loader2 size={16} className="animate-spin" />
          <span>Uploading image...</span>
        </p>
      )}
    </div>
  );
}
