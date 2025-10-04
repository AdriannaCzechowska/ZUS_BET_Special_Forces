'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

type PeriodType = 'employment' | 'unemployed' | 'sick_leave' | 'maternity_leave' | 'parental_leave' | 'childcare_leave' | 'unpaid_leave' | 'foreign_work_with_contrib' | 'foreign_work_no_contrib';

interface Period {
  type: PeriodType;
  start: { year: number; month: number }; // month 0-11
  end: { year: number; month: number };
}

interface CareerMonthsVisualizerProps {
  periods: Period[];
  startYear: number;
  retirementYear: number;
}

const colorMap: Record<PeriodType, string> = {
    employment: 'bg-green-500',
    unemployed: 'bg-gray-400',
    sick_leave: 'bg-yellow-400',
    maternity_leave: 'bg-pink-400',
    parental_leave: 'bg-pink-300',
    childcare_leave: 'bg-pink-100',
    unpaid_leave: 'bg-gray-500',
    foreign_work_with_contrib: 'bg-blue-500',
    foreign_work_no_contrib: 'bg-blue-300',
};

const legendItems: { label: string; color: string, type: PeriodType }[] = [
    { label: 'Zatrudnienie', color: 'bg-green-500', type: 'employment' },
    { label: 'Bezrobocie', color: 'bg-gray-400', type: 'unemployed' },
    { label: 'Zwolnienie lekarskie', color: 'bg-yellow-400', type: 'sick_leave' },
    { label: 'Urlop macierzyński', color: 'bg-pink-400', type: 'maternity_leave' },
    { label: 'Urlop rodzicielski', color: 'bg-pink-300', type: 'parental_leave' },
    { label: 'Urlop wychowawczy', color: 'bg-pink-100', type: 'childcare_leave' },
    { label: 'Urlop bezpłatny', color: 'bg-gray-500', type: 'unpaid_leave' },
    { label: 'Praca za granicą (ze składką)', color: 'bg-blue-500', type: 'foreign_work_with_contrib' },
    { label: 'Praca za granicą (bez składki)', color: 'bg-blue-300', type: 'foreign_work_no_contrib' },
];

const typePriority: Record<PeriodType, number> = {
    employment: 1,
    maternity_leave: 2,
    parental_leave: 3,
    childcare_leave: 4,
    sick_leave: 5,
    unpaid_leave: 6,
    foreign_work_with_contrib: 7,
    foreign_work_no_contrib: 8,
    unemployed: 9,
};


export function CareerMonthsVisualizer({ periods, startYear, retirementYear }: CareerMonthsVisualizerProps) {
  const years = Array.from({ length: retirementYear - startYear + 1 }, (_, i) => startYear + i);
  const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

  const getMonthStatus = (year: number, month: number): { type: PeriodType; label: string } => {
    let activePeriod: Period | null = null;

    for (const period of periods) {
        const startDate = new Date(period.start.year, period.start.month);
        const endDate = new Date(period.end.year, period.end.month);
        const currentDate = new Date(year, month);

        if (currentDate >= startDate && currentDate <= endDate) {
            if (!activePeriod || typePriority[period.type] < typePriority[activePeriod.type]) {
                activePeriod = period;
            }
        }
    }

    if (activePeriod) {
        const legendItem = legendItems.find(item => item.type === activePeriod!.type);
        return { type: activePeriod.type, label: legendItem?.label || 'Nieznany okres' };
    }

    return { type: 'employment', label: 'Zatrudnienie' }; // Default if no period matches
  };

  return (
    <Card className="shadow-lg semitransparent-panel max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Przebieg kariery zawodowej
        </CardTitle>
        <CardDescription>
          Wizualizacja Twojej ścieżki zawodowej miesiąc po miesiącu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-px">
          {years.map(year => (
            <div key={year} className="flex items-center">
              <div className="grid grid-cols-12 gap-px w-full">
                {Array.from({ length: 12 }).map((_, monthIndex) => {
                  const status = getMonthStatus(year, monthIndex);
                  return (
                    <TooltipProvider key={monthIndex} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn("h-3 w-3 rounded-sm", colorMap[status.type] || 'bg-gray-200')} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{year} – {monthNames[monthIndex]}</p>
                          <p>{status.label}</p>
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
            <h4 className="text-sm font-medium mb-2">Legenda:</h4>
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

// Example usage:
export function CareerVisualizerExample() {
    const examplePeriods: Period[] = [
        { type: "employment", start: { year: 2015, month: 6 }, end: { year: 2018, month: 4 } },
        { type: "unemployed", start: { year: 2018, month: 5 }, end: { year: 2018, month: 10 } },
        { type: "foreign_work_with_contrib", start: { year: 2019, month: 0 }, end: { year: 2020, month: 11 } },
        { type: "maternity_leave", start: { year: 2022, month: 2 }, end: { year: 2023, month: 1 } },
        { type: "parental_leave", start: { year: 2023, month: 2 }, end: { year: 2023, month: 7 } },
        { type: "sick_leave", start: { year: 2025, month: 8 }, end: { year: 2025, month: 9 } }
    ];

    return (
        <div className="p-8">
            <CareerMonthsVisualizer periods={examplePeriods} startYear={2015} retirementYear={2050} />
        </div>
    );
}
