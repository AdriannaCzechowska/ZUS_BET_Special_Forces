'use client';

import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="bg-gray-100 border-b border-t border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="flex items-center text-sm text-gray-600 h-10">
          <Link href="/" className="hover:underline">
            <Home className="h-4 w-4 text-primary mr-2" />
          </Link>
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              {item.href ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="font-bold text-gray-800">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
