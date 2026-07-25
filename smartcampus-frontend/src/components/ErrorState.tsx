import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center',
        className
      )}
      role="alert"
    >
      <AlertTriangle className="h-10 w-10 text-red-600" aria-hidden />
      <div>
        <h3 className="text-lg font-semibold text-red-900">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
        >
          Try again
        </button>
      )}
    </div>
  );
}
