'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, SlidersHorizontal } from 'lucide-react';
import { produce } from 'immer';

interface SalaryHistoryEntry {
  id: number;
  year: number;
  amount: number;
}

interface SicknessPeriodEntry {
  id: number;
  startDate: string;
  endDate: string;
}

function SalaryHistory({
  salaryHistory,
  setSalaryHistory,
}: {
  salaryHistory: SalaryHistoryEntry[];
  setSalaryHistory: React.Dispatch<React.SetStateAction<SalaryHistoryEntry[]>>;
}) {
  const addYear = () => {
    setSalaryHistory([
      ...salaryHistory,
      { id: Date.now(), year: new Date().getFullYear() - 1, amount: 0 },
    ]);
  };

  const removeYear = (id: number) => {
    setSalaryHistory(salaryHistory.filter(entry => entry.id !== id));
  };

  const handleChange = (id: number, field: 'year' | 'amount', value: string) => {
    setSalaryHistory(
        produce(draft => {
            const entry = draft.find(e => e.id === id);
            if (entry) {
                entry[field] = Number(value);
            }
        })
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Wprowadź swoje roczne zarobki brutto z poprzednich lat.
      </p>
      {salaryHistory.map(entry => (
        <div key={entry.id} className="flex items-center gap-2">
          <Input
            type="number"
            value={entry.year}
            onChange={(e) => handleChange(entry.id, 'year', e.target.value)}
            className="w-24"
            aria-label={`Rok zarobków ${entry.year}`}
          />
          <Input
            type="number"
            value={entry.amount}
            onChange={(e) => handleChange(entry.id, 'amount', e.target.value)}
            aria-label={`Kwota zarobków za rok ${entry.year}`}
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeYear(entry.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={addYear}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Dodaj rok
      </Button>
    </div>
  );
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
       <Button variant="outline" size="sm" className="w-full" disabled>
        <PlusCircle className="mr-2 h-4 w-4" />
        Dodaj okres ze zmianą zarobków (wkrótce)
      </Button>
    </div>
  );
}

function SicknessPeriods({
    sicknessPeriods,
    setSicknessPeriods,
} : {
    sicknessPeriods: SicknessPeriodEntry[];
    setSicknessPeriods: React.Dispatch<React.SetStateAction<SicknessPeriodEntry[]>>;
}) {

    const addPeriod = () => {
        setSicknessPeriods([...sicknessPeriods, { id: Date.now(), startDate: '', endDate: '' }]);
    };

    const removePeriod = (id: number) => {
        setSicknessPeriods(sicknessPeriods.filter(p => p.id !== id));
    };

    const handleChange = (id: number, field: 'startDate' | 'endDate', value: string) => {
        setSicknessPeriods(
            produce(draft => {
                const period = draft.find(p => p.id === id);
                if (period) {
                    period[field] = value;
                }
            })
        );
    };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Dodaj okresy przebywania na zwolnieniu lekarskim (L4).
      </p>
      {sicknessPeriods.map(period => (
          <div key={period.id} className="flex items-center gap-2">
            <Input type="date" value={period.startDate} onChange={e => handleChange(period.id, 'startDate', e.target.value)} aria-label="Data rozpoczęcia L4" />
            <span className="text-muted-foreground">-</span>
            <Input type="date" value={period.endDate} onChange={e => handleChange(period.id, 'endDate', e.target.value)} aria-label="Data zakończenia L4" />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removePeriod(period.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={addPeriod}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Dodaj okres
      </Button>
    </div>
  );
}

export function DashboardControls() {
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistoryEntry[]>([
    { id: 1, year: 2022, amount: 65000 },
    { id: 2, year: 2023, amount: 72000 },
  ]);
  const [futureSalaryGrowth, setFutureSalaryGrowth] = useState(3.5);
  const [zusIndexationRate, setZusIndexationRate] = useState(4.2);
  const [sicknessPeriods, setSicknessPeriods] = useState<SicknessPeriodEntry[]>([]);

  const handleRecalculate = () => {
    const simulationParams = {
        salaryHistory,
        futureSalaryGrowth,
        zusIndexationRate,
        sicknessPeriods,
    };
    console.log("Przeliczanie symulacji z parametrami:", simulationParams);
    // Tutaj docelowo będzie wywołanie logiki obliczeniowej
  };

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <SlidersHorizontal className="h-6 w-6 text-primary" />
          Dostosuj symulację
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">Przeszłość</TabsTrigger>
            <TabsTrigger value="future">Przyszłość</TabsTrigger>
            <TabsTrigger value="sickness">Choroba</TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="mt-6">
            <SalaryHistory salaryHistory={salaryHistory} setSalaryHistory={setSalaryHistory} />
          </TabsContent>
          <TabsContent value="future" className="mt-6">
            <FutureProjections 
                futureSalaryGrowth={futureSalaryGrowth}
                setFutureSalaryGrowth={setFutureSalaryGrowth}
                zusIndexationRate={zusIndexationRate}
                setZusIndexationRate={setZusIndexationRate}
            />
          </TabsContent>
          <TabsContent value="sickness" className="mt-6">
            <SicknessPeriods sicknessPeriods={sicknessPeriods} setSicknessPeriods={setSicknessPeriods} />
          </TabsContent>
        </Tabs>
        <Button className="w-full mt-6" size="lg" onClick={handleRecalculate}>
          Przelicz symulację
        </Button>
      </CardContent>
    </Card>
  );
}
