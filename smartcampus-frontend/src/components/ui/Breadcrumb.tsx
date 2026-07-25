'use client';



import Link from 'next/link';

import { ChevronRight } from 'lucide-react';



export interface BreadcrumbItem {

  label: string;

  href?: string;

}



interface BreadcrumbProps {

  items: BreadcrumbItem[];

}



export function Breadcrumb({ items }: BreadcrumbProps) {

  return (

    <nav aria-label="Breadcrumb" className="mb-4">

      <ol className="flex flex-wrap items-center gap-1 text-sm text-[var(--muted)]">

        {items.map((item, index) => {

          const isLast = index === items.length - 1;

          return (

            <li key={`${item.label}-${index}`} className="flex items-center gap-1">

              {index > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0" /> : null}

              {item.href && !isLast ? (

                <Link

                  href={item.href}

                  className="font-medium text-teal-700 transition hover:underline dark:text-teal-300"

                >

                  {item.label}

                </Link>

              ) : (

                <span

                  className={

                    isLast

                      ? 'font-semibold text-[var(--foreground)]'

                      : 'font-medium'

                  }

                  aria-current={isLast ? 'page' : undefined}

                >

                  {item.label}

                </span>

              )}

            </li>

          );

        })}

      </ol>

    </nav>

  );

}

