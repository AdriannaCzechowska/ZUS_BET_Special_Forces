'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResultCard } from './result-card';
import { TrendingUp, TrendingDown, Percent, Sparkles } from 'lucide-react';

interface DashboardResultsProps {
  data: {
    realPension: number;
    realisticPension: number;
    replacementRate: number;
  };
}

export function DashboardResults({ data }: DashboardResultsProps) {
  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          Wyniki dynamiczne
        </CardTitle>
        <CardDescription>
          Wyniki Twojej symulacji zaktualizują się automatycznie po zmianie parametrów i przeliczeniu.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResultCard
          title="Wysokość rzeczywista"
          value={data.realPension}
          unit="PLN"
          icon={<TrendingUp className="text-green-500" />}
          description="Prognoza brutto bez uwzględnienia inflacji i waloryzacji."
          variant="primary"
        />
        <ResultCard
          title="Wysokość urealniona"
          value={data.realisticPension}
          unit="PLN"
          icon={<TrendingDown className="text-orange-500" />}
          description="Prognoza brutto uwzględniająca przewidywaną inflację."
          variant="secondary"
        />
        <ResultCard
          title="Stopa zastąpienia"
          value={data.replacementRate}
          unit="%"
          icon={<Percent />}
          description="Stosunek Twojej pierwszej emerytury do ostatniego wynagrodzenia."
        />
      </CardContent>
    </Card>
  );
}
