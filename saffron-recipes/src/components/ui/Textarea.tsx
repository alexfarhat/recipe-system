import React from 'react';
interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-text-dark mb-1.5">
          {label}
        </label>
      }
      <textarea
        className={`w-full px-3 py-2 bg-surface border border-border-strong rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors ${error ? 'border-tomato' : ''} ${className}`}
        {...props} />
      
      {error && <p className="mt-1 text-sm text-tomato">{error}</p>}
    </div>);

}