'use client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PensionInput } from '@/components/pension-vision/pension-input';
import { PensionChart } from '@/components/pension-vision/pension-chart';
import { DailyFactCard } from '@/components/pension-vision/daily-fact';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
         <div className="space-y-8">
          <PensionInput />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PensionChart />
            <DailyFactCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
