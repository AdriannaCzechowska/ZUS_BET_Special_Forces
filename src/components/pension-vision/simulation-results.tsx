'use client';

import { useSearchParams } from 'next/navigation';
import { ExpectationGap } from './expectation-gap';
import { PostponementComparison } from './postponement-comparison';
import { Info, TrendingUp, TrendingDown, Percent, Briefcase, BarChart } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Suspense } from 'react';
import { resultTooltips } from '@/lib/result-tooltips';
import { ResultCard } from './result-card';

function ResultsContent() {
  const searchParams = useSearchParams();

  const expectedPension = Number(searchParams.get('expectedPension') || '0');
  const realPension = Number(searchParams.get('realPension') || '0');
  const realisticPension = Number(searchParams.get('realisticPension') || '0');
  const replacementRate = Number(searchParams.get('replacementRate') || '0');
  const pensionWithoutL4 = Number(searchParams.get('pensionWithoutL4') || '0');
  const grossSalary = Number(searchParams.get('grossSalary') || '0');
  const retirementYear = Number(searchParams.get('retirementYear') || new Date().getFullYear());
  
  const yearsToRetirement = retirementYear - new Date().getFullYear();
  // Simplified assumption for nominal salary growth for replacement rate calculation
  const lastNominalSalary = grossSalary * Math.pow(1.034, yearsToRetirement); 
  const nominalReplacementRate = lastNominalSalary > 0 ? (realPension / lastNominalSalary) * 100 : 0;


  // Mock data - replace with actual simulation output
  const avgPensionInRetirementYear = 4100;

  if (!realPension) {
    return (
       <div className="space-y-8">
          <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">
              Brak danych do wyświetlenia
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Wróć do formularza i przeprowadź symulację, aby zobaczyć swoje wyniki.
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
       </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-2">
          Twoja prognoza emerytalna
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Poniżej znajdziesz szczegółowe wyniki symulacji przygotowane na podstawie podanych przez Ciebie danych. Pamiętaj, że są to wartości szacunkowe.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg bg-primary/5 border-primary/20 text-center">
            <h3 className="text-lg font-medium text-primary">Wysokość rzeczywista</h3>
            <p className="text-4xl font-bold font-headline my-2">{realPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            <p className="text-sm text-muted-foreground">
                Nominalna kwota w roku przejścia. Odpowiada to stopie zastąpienia {nominalReplacementRate.toFixed(2)}%.
            </p>
        </div>
         <div className="p-6 border rounded-lg bg-secondary/20 border-secondary/40 text-center">
            <h3 className="text-lg font-medium">Wysokość urealniona</h3>
            <p className="text-4xl font-bold font-headline my-2 text-accent-foreground">{realisticPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
            <p className="text-sm text-muted-foreground">
                Wartość w dzisiejszych cenach. Odpowiada to stopie zastąpienia {replacementRate.toFixed(2)}%.
            </p>
        </div>
      </div>

      {expectedPension > 0 && <ExpectationGap expected={expectedPension} forecasted={realisticPension} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResultCard
          title="Stopa zastąpienia"
          value={replacementRate}
          unit="%"
          icon={<Percent />}
          description={resultTooltips.stopaZastapienia.shortHint}
          tooltipData={resultTooltips.stopaZastapienia}
        />
        <ResultCard
          title="Wpływ zwolnień L4"
          value={pensionWithoutL4}
          unit="PLN"
          icon={<Briefcase />}
          description={resultTooltips.wplywL4.shortHint}
          tooltipData={resultTooltips.wplywL4}
        />
        <ResultCard
          title="Porównanie do średniej"
          value={avgPensionInRetirementYear}
          unit="PLN"
          icon={<BarChart />}
          description={resultTooltips.porownanieDoSredniej.shortHint}
          tooltipData={resultTooltips.porownanieDoSredniej}
        />
      </div>

      <PostponementComparison currentPension={realPension} />
      
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
