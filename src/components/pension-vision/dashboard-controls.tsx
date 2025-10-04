'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, SlidersHorizontal } from 'lucide-react';

function SalaryHistory() {
  // Mock data for salary history
  const salaryHistory = [
    { year: 2022, amount: 65000 },
    { year: 2023, amount: 72000 },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Wprowadź swoje roczne zarobki brutto z poprzednich lat.</p>
      {salaryHistory.map(entry => (
        <div key={entry.year} className="flex items-center gap-2">
          <Input type="number" defaultValue={entry.year} className="w-24" aria-label={`Rok zarobków ${entry.year}`} />
          <Input type="number" defaultValue={entry.amount} aria-label={`Kwota zarobków za rok ${entry.year}`}/>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Dodaj rok
      </Button>
    </div>
  )
}

function FutureProjections() {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Dostosuj prognozy przyszłych zarobków i wskaźników.</p>
            <div className='space-y-2'>
                <Label htmlFor="future-salary">Prognozowany wzrost pensji (% rocznie)</Label>
                <Input id="future-salary" type="number" defaultValue={3.5} />
            </div>
             <div className='space-y-2'>
                <Label htmlFor="indexation-rate">Wskaźnik waloryzacji składek ZUS (%)</Label>
                <Input id="indexation-rate" type="number" defaultValue={4.2} />
            </div>
            <Button variant="outline" size="sm" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Dodaj okres ze zmianą zarobków
            </Button>
        </div>
    )
}

function SicknessPeriods() {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Dodaj okresy przebywania na zwolnieniu lekarskim (L4).</p>
            <div className="flex items-center gap-2">
                <Input type="date" aria-label="Data rozpoczęcia L4" />
                <span className="text-muted-foreground">-</span>
                <Input type="date" aria-label="Data zakończenia L4" />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
             <Button variant="outline" size="sm" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Dodaj okres
            </Button>
        </div>
    )
}


export function DashboardControls() {
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
            <SalaryHistory />
          </TabsContent>
          <TabsContent value="future" className="mt-6">
            <FutureProjections />
          </TabsContent>
          <TabsContent value="sickness" className="mt-6">
            <SicknessPeriods />
          </TabsContent>
        </Tabs>
        <Button className="w-full mt-6" size="lg">
            Przelicz symulację
        </Button>
      </CardContent>
    </Card>
  );
}
