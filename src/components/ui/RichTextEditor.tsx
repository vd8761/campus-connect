'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill-new to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-40 w-full animate-pulse bg-gray-100 rounded-lg border border-gray-200"></div>
});

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ name, defaultValue = '', placeholder }: RichTextEditorProps) {
  const [value, setValue] = React.useState(defaultValue);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 focus-within:border-brand-purple focus-within:ring-1 focus-within:ring-brand-purple transition-all">
      <input type="hidden" name={name} value={value} />
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={setValue} 
        modules={modules}
        placeholder={placeholder}
        className="w-full"
      />
      <style jsx global>{`
        .quill {
          display: flex;
          flex-direction: column;
        }
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          font-family: inherit;
        }
        .ql-container.ql-snow {
          border: none;
          min-height: 120px;
          font-family: inherit;
          font-size: 1rem;
        }
        .ql-editor {
          min-height: 120px;
          padding: 1rem;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
