'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Baby, Stethoscope, Briefcase, Info, CheckCircle2 } from "lucide-react";

const impactData = {
  title: "Jak rodzicielstwo wpływa na emeryturę?",
  description: "Moduł pokazuje wpływ przerw w pracy związanych z rodzicielstwem na wysokość przyszłej emerytury. Uwzględnia zwolnienia lekarskie w ciąży, urlopy macierzyńskie, rodzicielskie i wychowawcze.",
  items: [
    {
      id: "pregnancyLeave",
      label: "Zwolnienie lekarskie w ciąży",
      tooltip: "W czasie zwolnienia lekarskiego składki emerytalne są niższe, bo naliczane od podstawy zasiłku, a nie pełnego wynagrodzenia. Skutkuje to niższym kapitałem na koncie emerytalnym.",
      icon: <Stethoscope className="h-5 w-5 text-destructive" />
    },
    {
      id: "maternityParental",
      label: "Urlop macierzyński i rodzicielski",
      tooltip: "Podczas urlopów macierzyńskiego i rodzicielskiego składki emerytalne finansowane są z budżetu państwa i naliczane od zasiłku, co w większości przypadków oznacza niższe wpłaty niż przy pełnym etacie.",
      icon: <Baby className="h-5 w-5 text-primary" />
    },
    {
      id: "childcareLeave",
      label: "Urlop wychowawczy",
      tooltip: "Na urlopie wychowawczym składki emerytalne również są opłacane z budżetu państwa, ale od minimalnej podstawy, co powoduje obniżenie przyszłej emerytury w porównaniu do pracy zarobkowej.",
      icon: <Briefcase className="h-5 w-5 text-accent" />
    }
  ],
  totalImpact: {
    label: "Łączny wpływ przerw związanych z rodzicielstwem",
    tooltip: "Pokazuje procentową i kwotową różnicę w wysokości prognozowanej emerytury pomiędzy scenariuszem z przerwami rodzicielskimi a scenariuszem ciągłej aktywności zawodowej."
  },
  dataSource: {
    label: "Źródło danych",
    tooltip: "Dane o wpływie przerw na emeryturę oparte są na projekcjach ZUS i statystykach zasiłków macierzyńskich, rodzicielskich i wychowawczych."
  }
};

const ImpactItem = ({ item }: { item: typeof impactData.items[0] }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 bg-muted rounded-full p-2">
            {item.icon}
        </div>
        <div className="flex-grow">
            <p className="font-medium text-foreground">{item.label}</p>
        </div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground">
                        <Info className="h-4 w-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">{item.tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
);

export function ParenthoodImpact() {
  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Baby className="h-6 w-6 text-primary" />
          {impactData.title}
        </CardTitle>
        <CardDescription>
          {impactData.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
            {impactData.items.map(item => <ImpactItem key={item.id} item={item} />)}
        </div>
        <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{impactData.totalImpact.label}</span>
                </div>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="hover:text-foreground">
                                <Info className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">{impactData.totalImpact.tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <p className="text-right text-lg font-bold text-destructive">-543,21 PLN (-15.8%)</p>
        </div>
         <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3 w-3" />
            <span>{impactData.dataSource.label}: {impactData.dataSource.tooltip}</span>
        </div>
      </CardContent>
    </Card>
  );
}
