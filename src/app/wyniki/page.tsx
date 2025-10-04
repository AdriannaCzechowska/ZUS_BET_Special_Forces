'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { SimulationResults } from '@/components/pension-vision/simulation-results';

export default function ResultsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Button asChild variant="ghost" className="pl-0 text-base">
            <Link href="/symulacja">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do formularza
            </Link>
          </Button>
           <div className="flex gap-2">
             <Button asChild variant="outline">
              <Link href="/symulacja">
                <RefreshCw className="mr-2 h-4 w-4" />
                Nowa symulacja
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Przejdź do Dashboardu
              </Link>
            </Button>
           </div>
        </div>
        
        <SimulationResults />

      </main>
      <Footer />
    </div>
  );
}
