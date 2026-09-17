import React from 'react';

interface FooterProps {
  className?: string;
  maxWidth?: string;
}

export function Footer({ className = '', maxWidth = 'max-w-6xl' }: FooterProps) {
  return (
    <footer className={`mt-6 mb-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className={`mx-auto ${maxWidth}`}>
        <div className="rounded-xl border border-[#E5E7EB] bg-white py-5 sm:py-6 px-4 text-center shadow-2xs">
          <p className="text-xs text-slate-500 font-normal">
            © 2024 tentwenty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
