'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Briefcase, FileText, HardHat, LandPlot, Plane, School, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';


const scenarios = [
  { id: 'etat', label: 'Umowa o pracę', icon: <Briefcase /> },
  { id: 'zlecenie', label: 'Umowa zlecenie', icon: <FileText /> },
  { id: 'b2b', label: 'Działalność (B2B)', icon: <HardHat /> },
  { id: 'dzielo', label: 'Umowa o dzieło', icon: <LandPlot /> },
  { id: 'maly-zus', label: 'Mały ZUS', icon: <School /> },
  { id: 'brak-pracy', label: 'Brak pracy', icon: <Home /> },
  { id: 'zagranica', label: 'Praca za granicą', icon: <Plane /> },
];

const ScenarioForm = ({
  scenario,
  onSubmit,
}: {
  scenario: string;
  onSubmit: (data: any) => void;
}) => {
  const [age, setAge] = useState(30);
  const [retirementYear, setRetirementYear] = useState(2055);
  const [salary, setSalary] = useState(6000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      age,
      retirementYear,
      grossSalary: salary,
      gender: 'K',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`age-${scenario}`}>Wiek</Label>
          <Input
            id={`age-${scenario}`}
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="np. 30"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`retirement-${scenario}`}>Rok przejścia na emeryturę</Label>
          <Input
            id={`retirement-${scenario}`}
            type="number"
            value={retirementYear}
            onChange={(e) => setRetirementYear(Number(e.target.value))}
            placeholder="np. 2055"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`salary-${scenario}`}>Miesięczne wynagrodzenie brutto</Label>
          <Input
            id={`salary-${scenario}`}
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            placeholder="np. 6000"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Przejdź do pełnej symulacji
      </Button>
    </form>
  );
};

export function PensionScenarioSimulator() {
    const router = useRouter();

    const handleFormSubmit = (data: any) => {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            params.set(key, String(value));
        });
        router.push(`/symulacja?${params.toString()}`);
    };

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Symulator Ścieżek Kariery
        </CardTitle>
        <CardDescription>
          Wybierz jedną ze ścieżek kariery, aby zobaczyć, jak może wpłynąć na Twoją emeryturę.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="etat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto">
            {scenarios.map((scenario) => (
              <TabsTrigger key={scenario.id} value={scenario.id} className="flex-col h-16">
                 {scenario.icon}
                 <span className='mt-1 text-xs'>{scenario.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

           {scenarios.map((scenario) => (
              <TabsContent key={scenario.id} value={scenario.id} className="mt-6">
                <ScenarioForm
                    scenario={scenario.id}
                    onSubmit={handleFormSubmit}
                />
              </TabsContent>
            ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
