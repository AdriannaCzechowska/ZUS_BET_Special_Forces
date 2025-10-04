'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

interface ResultCardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'default';
}

export function ResultCard({
  title,
  value,
  unit,
  description,
  icon,
  variant = 'default',
}: ResultCardProps) {
  return (
    <Card className={cn(
        "shadow-lg semitransparent-panel h-full flex flex-col",
        {
            "bg-primary/5 border-primary/20": variant === 'primary',
            "bg-secondary/20 border-secondary/40": variant === 'secondary',
        }
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium font-body">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="text-3xl font-bold font-headline">
          {value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-lg ml-1 font-body text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex-grow">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
