'use client';

import { useAppStore } from '@/lib/store';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({ current, total, showLabel = true, size = 'md' }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted">
            Progress
          </span>
          <span className="text-sm font-semibold text-foreground">
            {current}/{total} ({percentage}%)
          </span>
        </div>
      )}
      <div className={`w-full bg-card border border-border rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div 
          className={`h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage === 100 && showLabel && (
        <div className="flex items-center justify-center mt-2 space-x-1 text-success animate-pulse">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-medium">All videos completed!</span>
        </div>
      )}
    </div>
  );
}
