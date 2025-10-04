'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, AlertCircle, TrendingUp, TrendingDown, Baby } from 'lucide-react';

const parenthoodImpactData = {
  collection: "parenthoodImpact",
  fields: [
    {
      id: "parenthoodTitle",
      label: "Jak rodzicielstwo wpływa na emeryturę?",
      description: "Moduł pokazuje wpływ przerw w pracy związanych z rodzicielstwem na wysokość przyszłej emerytury. Uwzględnia zwolnienia lekarskie w ciąży, urlopy macierzyńskie, rodzicielskie i wychowawcze."
    },
    {
      id: "pregnancyLeave",
      label: "Zwolnienie lekarskie w ciąży",
      tooltip: "W czasie zwolnienia lekarskiego składki emerytalne są niższe, bo naliczane od podstawy zasiłku, a nie pełnego wynagrodzenia. Skutkuje to niższym kapitałem na koncie emerytalnym."
    },
    {
      id: "maternityParental",
      label: "Urlop macierzyński i rodzicielski",
      tooltip: "Podczas urlopów macierzyńskiego i rodzicielskiego składki emerytalne finansowane są z budżetu państwa i naliczane od zasiłku, co w większości przypadków oznacza niższe wpłaty niż przy pełnym etacie."
    },
    {
      id: "childcareLeave",
      label: "Urlop wychowawczy",
      tooltip": "Na urlopie wychowawczym składki emerytalne również są opłacane z budżetu państwa, ale od minimalnej podstawy, co powoduje obniżenie przyszłej emerytury w porównaniu do pracy zarobkowej."
    },
    {
      id: "totalImpact",
      label: "Łączny wpływ przerw związanych z rodzicielstwem",
      tooltip: "Pokazuje procentową i kwotową różnicę w wysokości prognozowanej emerytury pomiędzy scenariuszem z przerwami rodzicielskimi a scenariuszem ciągłej aktywności zawodowej."
    },
    {
      id: "dataSource",
      label: "Źródło danych",
      tooltip: "Dane o wpływie przerw na emeryturę oparte są na projekcjach ZUS i statystykach zasiłków macierzyńskich, rodzicielskich i wychowawczych."
    }
  ]
};

const ImpactItem = ({ label, tooltip }: { label: string; tooltip: string }) => (
    <li className="flex items-start text-sm">
        <AlertCircle className="h-4 w-4 text-destructive mr-3 mt-0.5 shrink-0" />
        <div>
            <span className="font-medium">{label}</span>
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="ml-1 text-muted-foreground align-middle"><Info className="h-3.5 w-3.5" /></button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground">{tooltip}</p>
        </div>
    </li>
)

export function ParenthoodImpact() {
  const titleData = parenthoodImpactData.fields.find(f => f.id === 'parenthoodTitle');

  return (
    <Card className="shadow-lg semitransparent-panel">
        <CardHeader>
             <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Baby className="h-6 w-6 text-primary" />
                {titleData?.label}
            </CardTitle>
            <CardDescription>{titleData?.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                 {parenthoodImpactData.fields.filter(f => ['pregnancyLeave', 'maternityParental', 'childcareLeave'].includes(f.id)).map(item => (
                    <ImpactItem key={item.id} label={item.label} tooltip={item.tooltip} />
                 ))}
            </ul>
             <div className="mt-6 border-t pt-4">
                <div className="flex items-start text-sm">
                     <TrendingDown className="h-4 w-4 text-accent mr-3 mt-0.5 shrink-0" />
                     <div>
                        <span className="font-medium">{parenthoodImpactData.fields.find(f => f.id === 'totalImpact')?.label}</span>
                        <p className="text-xs text-muted-foreground">{parenthoodImpactData.fields.find(f => f.id === 'totalImpact')?.tooltip}</p>
                     </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
