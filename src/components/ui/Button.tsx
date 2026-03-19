import React from 'react';
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-dl-primary text-white hover:bg-dl-primary-dark shadow-sm',
      accent: 'bg-dl-accent text-white hover:bg-dl-accent-dark shadow-sm',
      secondary: 'bg-dl-primary-light text-dl-primary-dark hover:bg-dl-primary-mid/20',
      ghost: 'bg-transparent text-dl-primary hover:bg-dl-primary-light',
      outline: 'bg-transparent border-2 border-dl-primary text-dl-primary hover:bg-dl-primary-light',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg font-medium',
      xl: 'px-8 py-4 text-xl font-bold rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
