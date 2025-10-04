'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';

const lifeExpectancy = {
    K: 266, // 60 lat
    M: 209, // 65 lat
};

// MVP constants
const ANNUAL_RETURN_RATE = 0.035;
const PPK_WELCOME_BONUS = 250;
const PPK_ANNUAL_BONUS = 240;
const PPK_EMPLOYER_CONTRIBUTION = 0.015; // 1.5%

export function ThirdPillarSimulator() {
  const searchParams = useSearchParams();
  const [ppkEmployeeRate, setPpkEmployeeRate] = useState([2]); // Default 2%

  const baseRealPension = Number(searchParams.get('realPension') || '0');
  const grossSalary = Number(searchParams.get('grossSalary') || '0');
  const age = Number(searchParams.get('age') || '0');
  const gender = searchParams.get('gender') as 'K' | 'M' || 'K';
  const retirementYear = Number(searchParams.get('retirementYear') || '0');
  
  const lastSalary = grossSalary; // For MVP, assume last salary is current salary

  const simulationResults = useMemo(() => {
    if (!grossSalary || !age || !retirementYear) return null;

    const yearsToRetirement = retirementYear - new Date().getFullYear();
    if (yearsToRetirement <= 0) return {
        totalCapital: 0,
        extraMonthlyPension: 0,
        totalReplacementRate: (baseRealPension / lastSalary) * 100
    };

    const employeeContribution = grossSalary * 12 * (ppkEmployeeRate[0] / 100);
    const employerContribution = grossSalary * 12 * PPK_EMPLOYER_CONTRIBUTION;
    
    let accumulatedCapital = PPK_WELCOME_BONUS;

    for (let i = 0; i < yearsToRetirement; i++) {
        accumulatedCapital += employeeContribution + employerContribution + PPK_ANNUAL_BONUS;
        accumulatedCapital *= (1 + ANNUAL_RETURN_RATE);
    }
    
    const monthsOfLifeExpectancy = lifeExpectancy[gender];
    const extraMonthlyPension = accumulatedCapital / monthsOfLifeExpectancy;
    const totalPension = baseRealPension + extraMonthlyPension;
    const totalReplacementRate = lastSalary > 0 ? (totalPension / lastSalary) * 100 : 0;

    return {
      totalCapital: accumulatedCapital,
      extraMonthlyPension,
      totalReplacementRate
    };

  }, [ppkEmployeeRate, grossSalary, age, retirementYear, gender, baseRealPension, lastSalary]);

  if (!baseRealPension || !grossSalary) {
    return null; // Don't render if essential data is missing
  }
  
  const goalPercentage = simulationResults ? (simulationResults.totalReplacementRate / 70) * 100 : 0;

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Chcesz wyższej emerytury?
        </CardTitle>
        <CardDescription>
          Sprawdź, jak dodatkowe oszczędności w III filarze mogą podnieść Twoje przyszłe świadczenie i pomóc osiągnąć cel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="ppk-slider" className="font-semibold">Twoja składka PPK: {ppkEmployeeRate[0]}%</Label>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Info className="h-3.5 w-3.5" />
                        <span>Jak to działa?</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="end">
                        <p className="max-w-xs">Twoja składka (0-4%) + 1.5% od pracodawcy + dopłaty od państwa. Całość jest inwestowana.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            id="ppk-slider"
            min={0}
            max={4}
            step={0.5}
            value={ppkEmployeeRate}
            onValueChange={setPpkEmployeeRate}
          />
        </div>

        {simulationResults && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Dodatkowy kapitał</p>
                    <p className="text-xl font-bold font-headline text-primary">{simulationResults.totalCapital.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Dodatkowo do emerytury</p>
                    <p className="text-xl font-bold font-headline text-primary">+{simulationResults.extraMonthlyPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Łączna stopa zastąpienia</p>
                    <p className="text-xl font-bold font-headline text-primary">{simulationResults.totalReplacementRate.toFixed(2)}%</p>
                </div>
            </div>
        )}
        
        <div>
            <Label className="text-sm text-muted-foreground">Postęp do celu (70% ostatniej pensji)</Label>
            <Progress value={goalPercentage} className="mt-1 h-3" />
        </div>
      </CardContent>
    </Card>
  );
}
