'use client';

import { useSearchParams } from 'next/navigation';
import { ExpectationGap } from './expectation-gap';
import { PostponementComparison } from './postponement-comparison';
import { Info, TrendingUp, TrendingDown, Percent, Briefcase, BarChart } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Suspense } from 'react';
import { resultTooltips } from '@/lib/result-tooltips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function ResultsContent() {
  const searchParams = useSearchParams();

  // Check if there are any search params to decide whether to show real or default data
  const hasParams = Array.from(searchParams.keys()).length > 0;

  const expectedPension = Number(searchParams.get('expectedPension') || '0');
  const realPension = Number(searchParams.get('realPension') || '0');
  const realisticPension = Number(searchParams.get('realisticPension') || '0');
  const replacementRate = Number(searchParams.get('replacementRate') || '0');
  const pensionWithoutL4 = Number(searchParams.get('pensionWithoutL4') || '0');
  const grossSalary = Number(search_params.get('grossSalary') || '0');
  const retirementYear = Number(search_params.get('retirementYear') || new Date().getFullYear());
  
  const yearsToRetirement = retirementYear - new Date().getFullYear();
  const lastNominalSalary = grossSalary * Math.pow(1.034, yearsToRetirement); 
  const nominalReplacementRate = lastNominalSalary > 0 ? (realPension / lastNominalSalary) * 100 : 0;

  const avgPensionInRetirementYear = 4100;

  // Default example data
  const defaultData = {
    realPension: 5800,
    realisticPension: 3500,
    replacementRate: 42,
    nominalReplacementRate: 38,
    expectedPension: 4000,
  };

  const displayData = hasParams ? {
    realPension,
    realisticPension,
    replacementRate,
    nominalReplacementRate,
    expectedPension,
    pensionWithoutL4,
    avgPensionInRetirementYear
  } : defaultData;
  
  const showExpectationGap = hasParams && expectedPension > 0;


  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">
          {hasParams ? "Twoja prognoza emerytalna" : "Przykładowa prognoza emerytalna"}
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {hasParams 
            ? "Poniżej znajdziesz szczegółowe wyniki symulacji przygotowane na podstawie podanych przez Ciebie danych. Pamiętaj, że są to wartości szacunkowe."
            : "Oto przykładowe wyniki symulacji. Wypełnij formularz, aby zobaczyć swoją spersonalizowaną prognozę."
          }
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg bg-primary/5 border-primary/20 text-center">
            <h3 className="text-lg font-medium text-primary">Wysokość rzeczywista</h3>
            <p className="text-4xl font-bold font-headline my-2">{displayData.realPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            <p className="text-sm text-muted-foreground">
                Nominalna kwota w roku przejścia. Odpowiada to stopie zastąpienia {displayData.nominalReplacementRate.toFixed(2)}%.
            </p>
        </div>
         <div className="p-6 border rounded-lg bg-secondary/20 border-secondary/40 text-center">
            <h3 className="text-lg font-medium">Wysokość urealniona</h3>
            <p className="text-4xl font-bold font-headline my-2 text-accent-foreground">{displayData.realisticPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            <p className="text-sm text-muted-foreground">
                Wartość w dzisiejszych cenach. Odpowiada to stopie zastąpienia {displayData.replacementRate.toFixed(2)}%.
            </p>
        </div>
      </div>

      {showExpectationGap && <ExpectationGap expected={displayData.expectedPension} forecasted={displayData.realisticPension} />}

      {hasParams && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card>
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-x-2">
                    <CardTitle className="text-base font-medium font-body">Stopa zastąpienia</CardTitle>
                    <Percent />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold font-headline">{displayData.replacementRate.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground mt-2">{resultTooltips.stopaZastapienia.shortHint}</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-x-2">
                    <CardTitle className="text-base font-medium font-body">Wpływ zwolnień L4</CardTitle>
                    <Briefcase />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold font-headline">{displayData.pensionWithoutL4?.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                    <p className="text-xs text-muted-foreground mt-2">{resultTooltips.wplywL4.shortHint}</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-x-2">
                    <CardTitle className="text-base font-medium font-body">Porównanie do średniej</CardTitle>
                    <BarChart />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold font-headline">{displayData.avgPensionInRetirementYear?.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                    <p className="text-xs text-muted-foreground mt-2">{resultTooltips.porownanieDoSredniej.shortHint}</p>
                </CardContent>
             </Card>
          </div>
          <PostponementComparison currentPension={displayData.realPension} />
        </>
      )}
      
      <div className="flex items-center gap-3 text-sm text-muted-foreground bg-accent/20 p-4 rounded-lg border border-accent/30">
        <Info className="h-5 w-5 shrink-0 text-accent" />
        <p>
          Wszystkie przedstawione kwoty są wartościami brutto. Symulacje opierają się na aktualnych prognozach ZUS i GUS dotyczących dalszego trwania życia, inflacji oraz wzrostu wynagrodzeń.
        </p>
      </div>
    </div>
  );
}

export function SimulationResults() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <ResultsContent />
    </Suspense>
  )
}
