import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-text-dark mb-1.5">
          {label}
        </label>
      }
      <input
        className={`w-full px-3 py-2 bg-surface border border-border-strong rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${error ? 'border-tomato' : ''} ${className}`}
        {...props} />
      
      {error && <p className="mt-1 text-sm text-tomato">{error}</p>}
    </div>);

}