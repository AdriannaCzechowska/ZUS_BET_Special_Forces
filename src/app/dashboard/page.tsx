'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DashboardControls, type WorkBreak } from '@/components/pension-vision/dashboard-controls';
import { ZusGrowthChart } from '@/components/pension-vision/zus-growth-chart';
import { DashboardResults } from '@/components/pension-vision/dashboard-results';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { calculatePension, type PensionInput } from '@/lib/pension-calculator';

function DashboardPageContent() {
  const searchParams = useSearchParams();

  // Initial data from the first simulation (from URL)
  const initialParams = useMemo(() => ({
    age: Number(searchParams.get('age') || '30'),
    gender: (searchParams.get('gender') as 'K' | 'M') || 'K',
    grossSalary: Number(searchParams.get('grossSalary') || '6000'),
    retirementYear: Number(searchParams.get('retirementYear') || '2055'),
    startYear: Number(searchParams.get('startYear') || new Date().getFullYear() - 5),
    pregnancyLeaveDuration: Number(searchParams.get('pregnancyLeaveDuration') || '0'),
    maternityLeaveDuration: Number(searchParams.get('maternityLeaveDuration') || '0'),
    childcareLeaveDuration: Number(searchParams.get('childcareLeaveDuration') || '0'),
    includeL4: searchParams.get('includeL4') === 'true',
  }), [searchParams]);

  // Initial calculation based on URL params
  const initialCalculationInput: PensionInput = {
      wiek: initialParams.age,
      plec: initialParams.gender,
      pensjaBrutto: initialParams.grossSalary,
      rokRozpoczeciaPracy: initialParams.startYear,
      rokPrzejsciaNaEmeryture: initialParams.retirementYear,
      dodatkoweLataPracy: 0,
      przerwyWLacznychMiesiacach: 
        initialParams.pregnancyLeaveDuration + 
        initialParams.maternityLeaveDuration + 
        initialParams.childcareLeaveDuration +
        (initialParams.includeL4 ? 12: 0),
  };

  const initialResult = calculatePension(initialCalculationInput);

  const [simulationData, setSimulationData] = useState({
    realPension: initialResult.prognozowanaEmerytura,
    realisticPension: initialResult.kwotaUrealniona,
    replacementRate: initialResult.przewidywanaStopaZastapienia * 100,
  });
  
  const zusGrowthData = [
    { year: 2024, amount: 150000 },
    { year: 2025, amount: 165000 },
    { year: 2030, amount: 250000 },
    { year: 2035, amount: 350000 },
    { year: 2040, amount: 480000 },
    { year: 2045, amount: 650000 },
    { year: 2050, amount: 850000 },
  ];

  const handleRecalculate = (breaks: WorkBreak[], extraYears: number, futureSalaryGrowth: number, zusIndexationRate: number) => {
    const totalBreakMonths = breaks.reduce((acc, b) => acc + b.durationMonths, 0);

    const calculationInput: PensionInput = {
        ...initialCalculationInput,
        dodatkoweLataPracy: extraYears,
        przerwyWLacznychMiesiacach: totalBreakMonths + 
          initialParams.pregnancyLeaveDuration + 
          initialParams.maternityLeaveDuration + 
          initialParams.childcareLeaveDuration +
          (initialParams.includeL4 ? 12 : 0),
        // NOTE: futureSalaryGrowth and zusIndexationRate are not yet used in the calculator
    };
    
    const newResult = calculatePension(calculationInput);
    
    setSimulationData({
        realPension: newResult.prognozowanaEmerytura,
        realisticPension: newResult.kwotaUrealniona,
        replacementRate: newResult.przewidywanaStopaZastapienia * 100,
    });
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Dashboard analityczny' }
      ]} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Dashboard analityczny
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Tutaj możesz szczegółowo dostosować parametry symulacji, aby zobaczyć, jak różne scenariusze wpłyną na Twoją przyszłą emeryturę.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 flex flex-col gap-8">
             <DashboardControls onRecalculate={handleRecalculate} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-8">
            <DashboardResults data={simulationData} />
            <ZusGrowthChart data={zusGrowthData} />
          </div>
        </div>
        
      </main>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Ładowanie...</div>}>
            <DashboardPageContent />
        </Suspense>
    )
}
