'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DashboardControls } from '@/components/pension-vision/dashboard-controls';
import { ZusGrowthChart } from '@/components/pension-vision/zus-growth-chart';
import { DashboardResults } from '@/components/pension-vision/dashboard-results';
import { Separator } from '@/components/ui/separator';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export default function DashboardPage() {
  // Mock data for the components
  const simulationData = {
    realPension: 3250.8,
    realisticPension: 2890.45,
    replacementRate: 38,
  };
  const zusGrowthData = [
    { year: 2024, amount: 150000 },
    { year: 2025, amount: 165000 },
    { year: 2030, amount: 250000 },
    { year: 2035, amount: 350000 },
    { year: 2040, amount: 480000 },
    { year: 2045, amount: 650000 },
    { year: 2050, amount: 850000 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Dashboard analityczny' }
      ]} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/wyniki">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót do wyników
            </Link>
          </Button>
        </div>
        
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
             <DashboardControls />
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
