import React from 'react';
import Image from 'next/image';

interface LogoProps {
  light?: boolean;
}

export function Logo({ light = false }: LogoProps) {
  return (
    <div className="flex items-center">
      <Image 
        src={light ? "/campus-connect-logo-white.png" : "/campus-connect-logo.png"} 
        alt="Campus Connect" 
        width={1200}
        height={320}
        className="w-auto h-12 md:h-14 object-contain"
        priority
        unoptimized
        quality={100}
      />
    </div>
  );
}
