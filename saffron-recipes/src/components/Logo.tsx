import React from 'react';
export function Logo({ className = 'w-8 h-8' }: {className?: string;}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="#7A1F1F"
        strokeWidth="2.5"
        fill="none" />
      
      <path
        d="M50 28 Q42 38 42 48 Q42 56 50 60 Q58 56 58 48 Q58 38 50 28 Z"
        fill="#7A1F1F" />
      
      <path
        d="M50 32 Q46 40 46 48 Q46 53 50 56"
        stroke="#B08D57"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round" />
      
      <line
        x1="50"
        y1="62"
        x2="50"
        y2="72"
        stroke="#7A1F1F"
        strokeWidth="2.5"
        strokeLinecap="round" />
      
      <line
        x1="38"
        y1="76"
        x2="62"
        y2="76"
        stroke="#7A1F1F"
        strokeWidth="2.5"
        strokeLinecap="round" />
      
    </svg>);

}