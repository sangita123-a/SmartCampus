import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LoadingProps {
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({
  label = 'Loading...',
  className,
  fullScreen = false,
}: LoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-slate-600',
        fullScreen && 'min-h-[50vh]',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-teal-700" aria-hidden />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
