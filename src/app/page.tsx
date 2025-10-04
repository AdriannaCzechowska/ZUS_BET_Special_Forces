'use client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PensionInput } from '@/components/pension-vision/pension-input';
import { PensionChart } from '@/components/pension-vision/pension-chart';
import { DailyFactCard, DailyFactAccordion } from '@/components/pension-vision/daily-fact';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">Symulator Emerytalny</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <PensionInput />
            <PensionChart />
          </div>
          <div className="flex flex-col gap-8">
            <div className="hidden lg:block">
              <DailyFactCard />
            </div>
             <div className="lg:hidden">
              <DailyFactAccordion />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
