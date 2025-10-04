'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, SlidersHorizontal } from 'lucide-react';
import { produce } from 'immer';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface WorkBreak {
  id: string;
  type: 'l4' | 'macierzynski' | 'wychowawczy' | 'bezrobocie';
  durationMonths: number;
}

interface DashboardControlsProps {
    onRecalculate: (breaks: WorkBreak[], extraYears: number, futureSalaryGrowth: number, zusIndexationRate: number) => void;
}


function FutureProjections({
    futureSalaryGrowth,
    setFutureSalaryGrowth,
    zusIndexationRate,
    setZusIndexationRate,
}: {
    futureSalaryGrowth: number;
    setFutureSalaryGrowth: (value: number) => void;
    zusIndexationRate: number;
    setZusIndexationRate: (value: number) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Dostosuj prognozy przyszłych zarobków i wskaźników.
      </p>
      <div className="space-y-2">
        <Label htmlFor="future-salary">Prognozowany wzrost pensji (% rocznie)</Label>
        <Input id="future-salary" type="number" value={futureSalaryGrowth} onChange={e => setFutureSalaryGrowth(Number(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="indexation-rate">Wskaźnik waloryzacji składek ZUS (%)</Label>
        <Input id="indexation-rate" type="number" value={zusIndexationRate} onChange={e => setZusIndexationRate(Number(e.target.value))} />
      </div>
    </div>
  );
}

function WorkBreaks({
    breaks,
    setBreaks,
} : {
    breaks: WorkBreak[];
    setBreaks: React.Dispatch<React.SetStateAction<WorkBreak[]>>;
}) {

    const addBreak = (type: WorkBreak['type']) => {
        setBreaks(produce(draft => {
            draft.push({ id: Date.now().toString(), type, durationMonths: 12 });
        }));
    };

    const removeBreak = (id: string) => {
        setBreaks(breaks.filter(p => p.id !== id));
    };

    const updateDuration = (id: string, duration: number) => {
        setBreaks(produce(draft => {
            const item = draft.find(b => b.id === id);
            if (item) {
                item.durationMonths = duration;
            }
        }))
    }
    
    const breakLabels: Record<WorkBreak['type'], string> = {
        l4: "Zwolnienie L4",
        macierzynski: "Urlop macierzyński/rodzicielski",
        wychowawczy: "Urlop wychowawczy",
        bezrobocie: "Okres bezrobocia"
    };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Dodaj okresy przerw w karierze zawodowej, które mają wpływ na wysokość składek.
      </p>

       <div className="space-y-2">
          <Label>Szybkie scenariusze L4</Label>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => addBreak('l4')}>Średni czas na L4</Button>
            <Button size="sm" variant="outline" onClick={() => updateDuration(breaks.find(b => b.type === 'l4')?.id || '', 6)}>Pół roku</Button>
            <Button size="sm" variant="outline" onClick={() => updateDuration(breaks.find(b => b.type === 'l4')?.id || '', 12)}>Cały rok</Button>
          </div>
        </div>

      {breaks.map(b => (
          <div key={b.id} className="flex items-center gap-2">
            <Input value={breakLabels[b.type]} readOnly className="border-0 bg-transparent shadow-none px-0" />
            <Input type="number" value={b.durationMonths} onChange={e => updateDuration(b.id, Number(e.target.value))} className="w-24" aria-label="Czas trwania przerwy w miesiącach" />
            <span className='text-xs text-muted-foreground'>m-cy</span>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeBreak(b.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
      ))}
      <Select onValueChange={(value: WorkBreak['type']) => addBreak(value)}>
        <SelectTrigger>
            <SelectValue placeholder="Dodaj nową przerwę..." />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="l4">Zwolnienie L4</SelectItem>
            <SelectItem value="macierzynski">Urlop macierzyński</SelectItem>
            <SelectItem value="wychowawczy">Urlop wychowawczy</SelectItem>
            <SelectItem value="bezrobocie">Bezrobocie</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function ExtraWork({ extraYears, setExtraYears}: {extraYears: number; setExtraYears: (val: number) => void;}) {
    return (
        <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
                 <Label htmlFor="extra-years-slider">Dodatkowe lata pracy</Label>
                 <span className="font-bold text-lg text-primary">{extraYears} {extraYears === 1 ? 'rok' : (extraYears > 1 && extraYears < 5 ? 'lata' : 'lat')}</span>
            </div>
             <Slider
                id="extra-years-slider"
                min={0}
                max={10}
                step={1}
                value={[extraYears]}
                onValueChange={(val) => setExtraYears(val[0])}
            />
            <p className='text-xs text-muted-foreground'>Określ, ile lat planujesz pracować dłużej po osiągnięciu ustawowego wieku emerytalnego.</p>
        </div>
    )
}

export function DashboardControls({ onRecalculate }: DashboardControlsProps) {
  const [futureSalaryGrowth, setFutureSalaryGrowth] = useState(3.5);
  const [zusIndexationRate, setZusIndexationRate] = useState(4.2);
  const [breaks, setBreaks] = useState<WorkBreak[]>([]);
  const [extraYears, setExtraYears] = useState(0);

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <SlidersHorizontal className="h-6 w-6 text-primary" />
          Dostosuj symulację
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="breaks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breaks">Przerwy</TabsTrigger>
            <TabsTrigger value="future">Przyszłość</TabsTrigger>
            <TabsTrigger value="extraWork">Dłuższa praca</TabsTrigger>
          </TabsList>
          <TabsContent value="breaks" className="mt-6">
            <WorkBreaks breaks={breaks} setBreaks={setBreaks} />
          </TabsContent>
          <TabsContent value="future" className="mt-6">
            <FutureProjections 
                futureSalaryGrowth={futureSalaryGrowth}
                setFutureSalaryGrowth={setFutureSalaryGrowth}
                zusIndexationRate={zusIndexationRate}
                setZusIndexationRate={setZusIndexationRate}
            />
          </TabsContent>
          <TabsContent value="extraWork" className="mt-6">
            <ExtraWork extraYears={extraYears} setExtraYears={setExtraYears} />
          </TabsContent>
        </Tabs>
        <Button className="w-full mt-6" size="lg" onClick={() => onRecalculate(breaks, extraYears, futureSalaryGrowth, zusIndexationRate)}>
          Przelicz symulację
        </Button>
      </CardContent>
    </Card>
  );
}
