'use client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NewPensionSimulator } from '@/components/pension-vision/new-pension-simulator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow w-full mx-auto p-4 sm:p-6 lg:p-8">
        <NewPensionSimulator />
      </main>
      <Footer />
    </div>
  );
}
