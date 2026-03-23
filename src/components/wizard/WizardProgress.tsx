'use client';

import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WIZARD_STEPS } from '@/data/wizard';

interface WizardProgressProps {
  currentStep: number;
  className?: string;
}

export const WizardProgress = memo(function WizardProgress({
  currentStep,
  className,
}: WizardProgressProps) {
  const isInWizard = currentStep > 0;

  if (!isInWizard) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 w-full', className)}>
      {WIZARD_STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const Icon = step.icon;
        const isLast = index === WIZARD_STEPS.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0',
                  isCompleted && 'bg-dl-accent text-white',
                  isCurrent && 'bg-dl-primary text-white ring-4 ring-dl-primary/20',
                  !isCompleted && !isCurrent && 'bg-dl-primary-light/50 text-dl-muted'
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-bold tracking-wide hidden sm:block transition-colors',
                  isCurrent && 'text-dl-primary-dark',
                  isCompleted && 'text-dl-accent',
                  !isCurrent && !isCompleted && 'text-dl-muted/60'
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  'flex-1 h-0.5 rounded-full transition-all duration-500',
                  isCompleted ? 'bg-dl-accent' : 'bg-dl-primary-light/30'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});
