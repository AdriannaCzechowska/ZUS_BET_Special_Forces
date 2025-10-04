'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Info, ArrowRight } from 'lucide-react';
import { getRegionalData, RegionalData } from '@/lib/regional-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

function Gauge({ value }: { value: number }) {
    const percentage = Math.min(Math.max(value * 100, 0), 150);
    const rotation = (percentage / 100) * 180 - 90;

    let colorClass = 'bg-destructive';
    if (percentage >= 100) {
        colorClass = 'bg-primary';
    } else if (percentage >= 80) {
        colorClass = 'bg-yellow-500';
    }

    return (
        <div className="relative w-48 h-24 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full border-b-8 border-l-8 border-r-8 border-muted rounded-t-full"></div>
            <div className={cn(
                "absolute top-0 left-0 w-full h-full border-b-8 border-l-8 border-r-8 rounded-t-full transition-all duration-500",
                colorClass
            )} style={{ clipPath: `inset(0 ${100 - (percentage / 1.5)}% 0 0)` }}></div>
            <div
                className="absolute bottom-0 left-1/2 w-1 h-1/2 bg-foreground origin-bottom transition-transform duration-500"
                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            ></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-2xl font-bold font-headline">
                {Math.round(percentage)}%
            </div>
        </div>
    );
}


export function RegionalQualityIndicator() {
  const searchParams = useSearchParams();
  const [postcode, setPostcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ ratio: number; status: string; county: string; basket_cost: number; avg_pension_county: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const realisticPension = Number(searchParams.get('realisticPension') || '0');

  const handleCheck = () => {
    if (!/^\d{2}-\d{3}$/.test(postcode)) {
        setError("Wprowadź poprawny kod pocztowy (format: XX-XXX).");
        setResult(null);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    setTimeout(() => {
        const data = getRegionalData(postcode);
        if (!data) {
            setError("Nie znaleziono danych dla podanego kodu pocztowego.");
            setIsLoading(false);
            return;
        }

        const basket_cost_county = data.avgPension * 1.05;
        const ratio = realisticPension / basket_cost_county;
        let status = 'green';
        if (ratio >= 1.0) {
            status = 'green';
        } else if (ratio >= 0.8) {
            status = 'yellow';
        }
        
        setResult({
            county: data.county,
            basket_cost: basket_cost_county,
            avg_pension_county: data.avgPension,
            ratio: ratio,
            status: status
        });
        setIsLoading(false);
    }, 500); // Simulate API call
  };
  
  if (!realisticPension) {
    return null;
  }

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Wskaźnik jakości życia w regionie
        </CardTitle>
        <CardDescription>
            Sprawdź, jak Twoja prognozowana emerytura urealniona wypada na tle szacowanych kosztów życia w Twoim powiecie.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-2">
            <Input 
                placeholder="Wpisz swój kod pocztowy (np. 00-001)"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="max-w-xs"
            />
            <Button onClick={handleCheck} disabled={isLoading}>
                {isLoading ? "Sprawdzanie..." : "Sprawdź"}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
        
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        
        {isLoading && (
            <div className="space-y-4 pt-4">
                <Skeleton className="h-24 w-48 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
        )}

        {result && (
            <div className="text-center pt-4 space-y-4">
                <Gauge value={result.ratio} />
                <div className="max-w-md mx-auto space-y-4 pt-4">
                    <div className='bg-background/50 p-4 rounded-lg border'>
                         <p className="text-muted-foreground">Twoja prognozowana emerytura realna</p>
                        <p className="text-2xl font-bold font-headline">{realisticPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                    </div>
                     <div className='bg-background/50 p-4 rounded-lg border'>
                         <div className="text-muted-foreground flex items-center justify-center gap-1">
                            <span>Lokalny koszyk seniora w powiecie {result.county}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 inline-flex items-center justify-center">
                                            <Info className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="max-w-xs">Koszyk jest szacowany na podstawie średniej emerytury w danym powiecie (dane GUS) i może nie odzwierciedlać w pełni realnych kosztów.</div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                         </div>
                        <p className="text-2xl font-bold font-headline">{result.basket_cost.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</p>
                    </div>

                    <Separator />

                    <p className={cn(
                        "font-semibold text-lg",
                        result.status === 'green' && 'text-primary',
                        result.status === 'yellow' && 'text-yellow-500',
                        result.status === 'red' && 'text-destructive',
                    )}>
                        {result.status === 'green' && `Pokrywasz ${(result.ratio * 100).toFixed(0)}% kosztów życia – nadwyżka +${(realisticPension - result.basket_cost).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}/m-c`}
                        {result.status === 'yellow' && `Pokrywasz ${(result.ratio * 100).toFixed(0)}% kosztów życia – brakuje ${(result.basket_cost - realisticPension).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}/m-c`}
                        {result.status === 'red' && `Pokrywasz ${(result.ratio * 100).toFixed(0)}% kosztów życia – ryzyko niedoboru -${(result.basket_cost - realisticPension).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}/m-c`}
                    </p>
                </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
