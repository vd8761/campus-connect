import React from 'react';
import Image from 'next/image';

interface LogoProps {
  light?: boolean;
  className?: string;
}

export function Logo({ light = false, className }: LogoProps) {
  return (
    <div className="flex items-center">
      <Image
        src={light ? "/campus-square-logo-white.png" : "/campus-square-logo-transparent.png"}
        alt="Campus Square™"
        width={953}
        height={311}
        className={className || "w-auto h-9 md:h-10 lg:h-11 object-contain transition-all"}
        priority
        unoptimized
      />
    </div>
  );
}
