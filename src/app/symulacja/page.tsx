'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SimulationForm } from '@/components/pension-vision/simulation-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export default function SimulationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Formularz symulacji' }
      ]} />
      <main className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <SimulationForm />
      </main>
      <Footer />
    </div>
  );
}
