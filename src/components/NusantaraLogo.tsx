/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NusantaraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const NusantaraLogo: React.FC<NusantaraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  orientation = 'horizontal'
}) => {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const titleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-3xl'
  };

  const subSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  return (
    <div className={`flex items-center gap-3 ${orientation === 'vertical' ? 'flex-col text-center' : ''} ${className}`}>
      
      {/* Emblem Frame with user uploaded rosette */}
      <div className={`relative ${iconSizeClasses[size]} shrink-0 rounded-2xl bg-white border border-pink-200/80 shadow-xs flex items-center justify-center p-1 overflow-hidden group`}>
        <img
          src="/assets/aistudio/nusantara_emblem_clean.png"
          alt="Nusantara Beauty Solution Logo"
          className="w-full h-full object-contain rounded-xl transition-transform duration-200 group-hover:scale-105"
          onError={(e) => {
            // Fallback to original image if needed
            (e.target as HTMLImageElement).src = '/assets/aistudio/WhatsApp_Image_2026-10-24_at_00.02.48_9c5b00ba.png';
          }}
        />
      </div>

      {/* Brand Wordmark & Subtitle */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold tracking-wider text-slate-900 uppercase font-sans ${titleSizeClasses[size]}`}>
              NUSANTARA
            </span>
          </div>
          <span className={`font-semibold tracking-widest text-pink-700 uppercase -mt-0.5 ${subSizeClasses[size]}`}>
            Beauty Solution
          </span>
        </div>
      )}

    </div>
  );
};
