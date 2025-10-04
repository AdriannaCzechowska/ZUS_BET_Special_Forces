'use client';

import { ResultCard } from './result-card';
import { ExpectationGap } from './expectation-gap';
import { PostponementComparison } from './postponement-comparison';
import { AlertCircle, TrendingUp, TrendingDown, Info, BarChart, Percent, Briefcase } from 'lucide-react';

export function SimulationResults() {
  // Mock data - replace with actual simulation output
  const expectedPension = 4500;
  const realPension = 3250.8;
  const realisticPension = 2890.45;
  const avgPensionInRetirementYear = 4100;
  const replacementRate = 38;
  const pensionWithoutL4 = 3410.5;

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
        <ResultCard
          title="Wysokość rzeczywista"
          value={realPension}
          unit="PLN"
          icon={<TrendingUp className="text-green-500" />}
          description="Prognozowana kwota brutto, bez uwzględnienia inflacji i przyszłej waloryzacji składek."
          variant="primary"
        />
        <ResultCard
          title="Wysokość urealniona"
          value={realisticPension}
          unit="PLN"
          icon={<TrendingDown className="text-orange-500" />}
          description="Prognozowana kwota brutto, uwzględniająca prognozowaną inflację. To bardziej realistyczna kwota."
          variant="secondary"
        />
      </div>

      <ExpectationGap expected={expectedPension} forecasted={realisticPension} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResultCard
          title="Stopa zastąpienia"
          value={replacementRate}
          unit="%"
          icon={<Percent />}
          description="Stosunek Twojej pierwszej emerytury do ostatniego wynagrodzenia. Średnia w Polsce to ok. 40%."
        />
        <ResultCard
          title="Wpływ zwolnień L4"
          value={pensionWithoutL4}
          unit="PLN"
          icon={<Briefcase />}
          description={`Twoja emerytura bez uwzględniania statystycznych okresów chorobowych byłaby o ${(pensionWithoutL4 - realPension).toFixed(2)} PLN wyższa.`}
        />
        <ResultCard
          title="Porównanie do średniej"
          value={avgPensionInRetirementYear}
          unit="PLN"
          icon={<BarChart />}
          description={`Twoje świadczenie stanowi ${((realPension / avgPensionInRetirementYear) * 100).toFixed(0)}% prognozowanej średniej emerytury w Twoim roku przejścia na emeryturę.`}
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
