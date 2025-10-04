'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

type CareerEventType = 'worked' | 'unemployment' | 'sickness' | 'maternity' | 'parental' | 'childcare' | 'unpaid' | 'abroad_contributed' | 'abroad_no_contribution';

interface CareerEvent {
  year: number;
  month: number; // 1-12
  duration: number; // in months
  type: CareerEventType;
  label: string;
}

interface CareerMonthsChartProps {
  startYear: number;
  endYear: number;
  events: CareerEvent[];
}

const colorMap: Record<CareerEventType, string> = {
    worked: 'bg-green-500',
    unemployment: 'bg-gray-400',
    sickness: 'bg-yellow-400',
    maternity: 'bg-pink-500', // #f472b6 (pink-500)
    parental: 'bg-pink-400', // #f9a8d4 (pink-400)
    childcare: 'bg-pink-200', // #fce7f3 (pink-200)
    unpaid: 'bg-gray-600', // #6b7280 (gray-600)
    abroad_contributed: 'bg-blue-600', // #3b82f6 (blue-600)
    abroad_no_contribution: 'bg-blue-400', // #60a5fa (blue-400)
};

const legendItems = [
    { label: 'Miesiące przepracowane', color: 'bg-green-500' },
    { label: 'Okres bezrobocia', color: 'bg-gray-400' },
    { label: 'Zwolnienie lekarskie (L4)', color: 'bg-yellow-400' },
    { label: 'Urlop macierzyński', color: 'bg-pink-500' },
    { label: 'Urlop rodzicielski', color: 'bg-pink-400' },
    { label: 'Urlop wychowawczy', color: 'bg-pink-200' },
    { label: 'Urlop bezpłatny', color: 'bg-gray-600' },
    { label: 'Praca za granicą (ze składką)', color: 'bg-blue-600' },
    { label: 'Praca za granicą (bez składki)', color: 'bg-blue-400' },
];

export function CareerMonthsChart({ startYear, endYear, events }: CareerMonthsChartProps) {
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const getMonthStatus = (year: number, month: number) => {
    for (const event of events) {
      const eventStartMonth = (event.year - startYear) * 12 + event.month;
      const eventEndMonth = eventStartMonth + event.duration;
      const currentMonthIndex = (year - startYear) * 12 + month;

      if (currentMonthIndex >= eventStartMonth && currentMonthIndex < eventEndMonth) {
        return { type: event.type, label: event.label };
      }
    }
    return { type: 'worked' as CareerEventType, label: 'Praca' };
  };

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Miesiące kariery zawodowej
        </CardTitle>
        <CardDescription>
          Wizualizacja Twojej ścieżki zawodowej od początku kariery do planowanej emerytury.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {years.map(year => (
            <div key={year} className="flex items-center gap-2">
              <div className="w-12 text-sm text-muted-foreground text-right">{year}</div>
              <div className="grid grid-cols-12 gap-1 flex-grow">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                  const status = getMonthStatus(year, month);
                  return (
                    <TooltipProvider key={month} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn("h-5 w-full rounded-sm", colorMap[status.type])} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{year} – {new Date(year, month - 1).toLocaleString('pl-PL', { month: 'long' })}</p>
                          <p className="font-semibold">{status.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium mb-2">Legenda:</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {legendItems.map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                        <div className={cn("h-3 w-3 rounded-full", item.color)} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
