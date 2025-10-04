'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Info } from 'lucide-react';
import type { ResultTooltip } from '@/lib/result-tooltips';

interface ResultCardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'default';
  tooltipData?: ResultTooltip;
}

export function ResultCard({
  title,
  value,
  unit,
  description,
  icon,
  variant = 'default',
  tooltipData,
}: ResultCardProps) {
  return (
    <Card className={cn(
        "shadow-lg semitransparent-panel h-full flex flex-col",
        {
            "bg-primary/5 border-primary/20": variant === 'primary',
            "bg-secondary/20 border-secondary/40": variant === 'secondary',
        }
    )}>
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-x-2">
        <div className="flex items-center gap-1.5">
         <CardTitle className="text-base font-medium font-body">{title}</CardTitle>
         {tooltipData && (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 -mt-1 text-muted-foreground shrink-0">
                        <Info className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">{tooltipData.tooltipTitle}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-foreground">
                        {tooltipData.tooltipBody.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                        {tooltipData.formula && (
                           <div 
                                className="p-3 bg-muted rounded-md text-xs font-code"
                                dangerouslySetInnerHTML={{ __html: tooltipData.formula }}
                           />
                        )}
                         <div className="text-xs text-muted-foreground space-y-1">
                            <p><span className="font-semibold">Jednostki:</span> {tooltipData.units}</p>
                            <p><span className="font-semibold">Źródło:</span> {tooltipData.source}</p>
                        </div>
                        {tooltipData.notes && tooltipData.notes.length > 0 && (
                            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                                {tooltipData.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
         )}
        </div>
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
