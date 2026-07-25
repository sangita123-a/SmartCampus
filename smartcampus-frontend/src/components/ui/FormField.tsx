import type { ReactNode } from 'react';



interface FormFieldProps {

  label: string;

  error?: string;

  hint?: string;

  children: ReactNode;

  htmlFor?: string;

}



export function FormField({ label, error, hint, children, htmlFor }: FormFieldProps) {

  return (

    <div>

      <label

        htmlFor={htmlFor}

        className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"

      >

        {label}

      </label>

      {children}

      {hint && !error ? (

        <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>

      ) : null}

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}

    </div>

  );

}



export const formInputClass =

  'w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900';

