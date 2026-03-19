import React from 'react';
import { Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo = ({ className, iconOnly = false }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dl-accent text-white">
        <Link2 className="w-5 h-5 rotate-45" />
      </div>
      {!iconOnly && (
        <div className="text-xl font-bold tracking-tight">
          <span className="text-dl-primary-dark">Docente</span>
          <span className="text-dl-accent">Link</span>
        </div>
      )}
    </div>
  );
};
