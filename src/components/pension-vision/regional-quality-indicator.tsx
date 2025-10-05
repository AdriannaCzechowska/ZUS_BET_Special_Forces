'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Info } from 'lucide-react';
import { getRegionalData } from '@/lib/regional-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

interface RegionalQualityIndicatorProps {
    realisticPension: number;
    onPostcodeChange: (postcode: string) => void;
}

export function RegionalQualityIndicator({ realisticPension, onPostcodeChange }: RegionalQualityIndicatorProps) {
  const [postcode, setPostcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ ratio: number; status: string; county: string; basket_cost: number; avg_pension_county: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onPostcodeChange(postcode);
    if (!/^\d{2}-\d{3}$/.test(postcode)) {
        if (postcode.length > 0) {
             setError("Wprowadź poprawny kod pocztowy (format: XX-XXX).");
        } else {
            setError(null);
        }
        setResult(null);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    const timer = setTimeout(() => {
        const data = getRegionalData(postcode);
        if (!data) {
            setError("Nie znaleziono danych dla podanego kodu pocztowego.");
            setIsLoading(false);
            return;
        }

        const basket_cost_county = data.avgPension * 1.05;
        const ratio = realisticPension / basket_cost_county;
        let status = 'red';
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

    return () => clearTimeout(timer);

  }, [postcode, realisticPension, onPostcodeChange]);
  
  if (!realisticPension) {
    return null;
  }

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Kod Pocztowy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-2">
            <Input 
                placeholder="Wpisz swój kod pocztowy (np. 00-001)"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="max-w-xs"
            />
        </div>
        
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        
        {isLoading && (
            <div className="space-y-4 pt-4">
                <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
        )}

      </CardContent>
    </Card>
  );
}
