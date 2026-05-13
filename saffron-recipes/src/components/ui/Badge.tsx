import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?:
  'default' |
  'herb' |
  'saffron' |
  'paprika' |
  'purple' |
  'forest' |
  'accent' |
  'primary';
  className?: string;
}
export function Badge({
  children,
  variant = 'default',
  className = ''
}: BadgeProps) {
  const variants = {
    default: 'bg-border/60 text-text-dark border border-border-strong',
    herb: 'bg-forest/10 text-forest border border-forest/20',
    forest: 'bg-forest/10 text-forest border border-forest/20',
    saffron: 'bg-accent/15 text-accent border border-accent/30',
    accent: 'bg-accent/15 text-accent border border-accent/30',
    paprika: 'bg-primary/10 text-primary border border-primary/20',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    purple: 'bg-[#3A2E4A]/10 text-[#3A2E4A] border border-[#3A2E4A]/20'
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide uppercase ${variants[variant]} ${className}`}>
      
      {children}
    </span>);

}