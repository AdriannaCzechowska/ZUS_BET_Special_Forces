'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Clock } from 'lucide-react';

interface PostponementComparisonProps {
  currentPension: number;
}

export function PostponementComparison({ currentPension }: PostponementComparisonProps) {
  // Mock data for increases - in a real app, this would be calculated
  const scenarios = [
    { years: 1, increasePercent: 8, newPension: currentPension * 1.08 },
    { years: 2, increasePercent: 17, newPension: currentPension * 1.17 },
    { years: 5, increasePercent: 45, newPension: currentPension * 1.45 },
  ];

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <div>
                 <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    Poczekaj, zyskaj więcej
                </CardTitle>
                <CardDescription className="mt-2">
                    Zobacz, jak odłożenie decyzji o przejściu na emeryturę może wpłynąć na wysokość Twojego świadczenia.
                </CardDescription>
            </div>
             <TrendingUp className="h-8 w-8 text-muted-foreground/50 hidden sm:block" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="font-semibold">Późniejsza emerytura o</TableHead>
                    <TableHead className="text-right font-semibold">Nowe świadczenie (brutto)</TableHead>
                    <TableHead className="text-right font-semibold">Wzrost</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scenarios.map((scenario) => (
                    <TableRow key={scenario.years}>
                        <TableCell className="font-medium">{scenario.years} {scenario.years === 1 ? 'rok' : (scenario.years < 5 ? 'lata' : 'lat')}</TableCell>
                        <TableCell className="text-right font-bold text-lg text-primary">
                            {scenario.newPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-semibold">
                            +{(scenario.newPension - currentPension).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
