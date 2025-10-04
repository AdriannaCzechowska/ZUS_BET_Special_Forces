'use client';

import { AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface ExpectationGapProps {
  expected: number;
  forecasted: number;
}

export function ExpectationGap({ expected, forecasted }: ExpectationGapProps) {
  const difference = forecasted - expected;
  const isPositive = difference >= 0;
  const yearsToWorkMore = 3; // Mock data, should be calculated

  return (
    <div className="border-l-4 rounded-r-lg p-4 bg-card semitransparent-panel flex flex-col md:flex-row items-start gap-4"
        style={{ borderLeftColor: isPositive ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>
        
      <div className="flex-shrink-0">
        {isPositive ? (
          <ArrowUp className="h-8 w-8 text-primary" />
        ) : (
          <AlertCircle className="h-8 w-8 text-destructive" />
        )}
      </div>

      <div className="flex-grow">
        <h3 className="font-headline text-xl font-semibold mb-1">
          {isPositive ? 'Cel osiągnięty!' : 'Luka do uzupełnienia'}
        </h3>
        <p className="text-muted-foreground">
          Twoje oczekiwania wynosiły{' '}
          <span className="font-bold text-foreground">
            {expected.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
          </span>. 
          Nasza prognoza wskazuje na{' '}
          <span className="font-bold text-foreground">
            {forecasted.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
          </span>.
        </p>
        
        <p className="mt-2 text-sm">
          {isPositive ? (
            <span className="text-primary-dark font-medium">
              Twoja prognozowana emerytura jest o <span className="font-bold">{difference.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}</span> wyższa niż oczekiwałeś. Gratulacje!
            </span>
          ) : (
            <span className="text-destructive font-medium">
              Aby osiągnąć swój cel, musiałbyś pracować o około <span className="font-bold">{yearsToWorkMore} lata</span> dłużej.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
