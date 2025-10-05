'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThirdPillarComparisonProps {
  ppkRate: number;
}

const InfoTooltip = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/70 ml-1.5 cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const RiskIndicator = ({ level, label }: { level: 'low' | 'medium' | 'high', label: string }) => {
    const riskConfig = {
        low: { label: 'Niskie', color: 'bg-green-500' },
        medium: { label: 'Średnie', color: 'bg-yellow-500' },
        high: { label: 'Wysokie', color: 'bg-red-500' },
    }
    return (
        <div className="flex items-center gap-2">
            <span className={cn("h-3 w-3 rounded-full", riskConfig[level].color)}></span>
            <span>{label}</span>
        </div>
    )
}

export function ThirdPillarComparison({ ppkRate }: ThirdPillarComparisonProps) {
    const getPpkRisk = () => {
        if (ppkRate <= 1) return { level: 'low' as const, label: 'Konserwatywny' };
        if (ppkRate <= 3) return { level: 'medium' as const, label: 'Zrównoważony' };
        return { level: 'high' as const, label: 'Dynamiczny' };
    }
    
    const ppkRisk = getPpkRisk();

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl">Porównanie PPK, IKE i IKZE</DialogTitle>
        <DialogDescription>
          Zobacz kluczowe różnice między najpopularniejszymi formami dobrowolnego oszczędzania na emeryturę w III filarze.
        </DialogDescription>
      </DialogHeader>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold w-[20%]">Cecha</TableHead>
              <TableHead className="font-semibold text-primary w-[26%]">PPK (Pracownicze Plany Kapitałowe)</TableHead>
              <TableHead className="font-semibold w-[26%]">IKE (Indywidualne Konto Emerytalne)</TableHead>
              <TableHead className="font-semibold w-[26%]">IKZE (Indywidualne Konto Zabezpieczenia Emerytalnego)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">Limit wpłat (2024) <InfoTooltip text="Maksymalna kwota, jaką możesz wpłacić w danym roku kalendarzowym." /></div>
              </TableCell>
              <TableCell>4% wynagrodzenia brutto (składka pracownika)</TableCell>
              <TableCell>26 019 zł</TableCell>
              <TableCell>10 407.60 zł (15 611,40 zł dla samozatrudnionych)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">Korzyści podatkowe <InfoTooltip text="Ulgi podatkowe, z których możesz skorzystać podczas oszczędzania i przy wypłacie." /></div>
              </TableCell>
              <TableCell>Brak podatku Belki (19%) od zysków przy wypłacie po 60 r.ż. Dopłaty od państwa i pracodawcy.</TableCell>
              <TableCell>Brak podatku Belki (19%) od zysków przy wypłacie po 60 r.ż. lub nabyciu uprawnień.</TableCell>
              <TableCell>Odliczenie wpłat od podstawy opodatkowania PIT co roku. Przy wypłacie 10% zryczałtowany podatek.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">Poziom ryzyka <InfoTooltip text="Ryzyko inwestycyjne związane z daną formą oszczędzania. Zależy od instrumentów, w które lokowane są środki." /></div>
              </TableCell>
              <TableCell><RiskIndicator level={ppkRisk.level} label={ppkRisk.label} /></TableCell>
              <TableCell><RiskIndicator level="medium" label="Zależne od Ciebie" /></TableCell>
              <TableCell><RiskIndicator level="medium" label="Zależne od Ciebie" /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">Dziedziczenie <InfoTooltip text="Czy zgromadzone środki podlegają dziedziczeniu w razie Twojej śmierci." /></div>
              </TableCell>
              <TableCell>Tak, pełne dziedziczenie. Małżonek otrzymuje połowę, reszta dla uposażonych.</TableCell>
              <TableCell>Tak, pełne dziedziczenie bez podatku od spadków i darowizn.</TableCell>
              <TableCell>Tak, pełne dziedziczenie bez podatku od spadków i darowizn.</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">Mocne strony <TrendingUp className="h-4 w-4 ml-1.5 text-green-600" /></div>
              </TableCell>
              <TableCell>Automatyczny zapis, dopłaty od pracodawcy i państwa, niskie koszty zarządzania.</TableCell>
              <TableCell>Wysoki limit wpłat, duża elastyczność w wyborze instrumentów, zwolnienie z podatku Belki.</TableCell>
              <TableCell>Ulga podatkowa co roku (realna korzyść finansowa), szeroki wybór form inwestowania.</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center">Słabe strony <TrendingDown className="h-4 w-4 ml-1.5 text-red-600" /></div>
              </TableCell>
              <TableCell>Ograniczony wpływ na strategię inwestycyjną, dostępność tylko dla pracowników.</TableCell>
              <TableCell>Brak bieżących korzyści podatkowych, konieczność samodzielnej dyscypliny w oszczędzaniu.</TableCell>
              <TableCell>Podatek 10% przy wypłacie, niższy limit wpłat w porównaniu do IKE.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
