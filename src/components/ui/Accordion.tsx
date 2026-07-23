"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}

export function AccordionItem({ title, content, isOpen = false, onClick }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-brand-navy hover:text-brand-primary transition-colors cursor-pointer focus:outline-none"
        onClick={onClick}
      >
        <span>{title}</span>
        <ChevronDown 
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-gray-600">
          {content}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { title: string; content: React.ReactNode }[];
  className?: string;
}

export function Accordion({ items, className = '' }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => toggleItem(index)}
        />
      ))}
    </div>
  );
}
