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
      <main className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-8">
            <PensionInput />
            <PensionChart />
          </div>
          <div className="space-y-8">
            <DailyFactCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
