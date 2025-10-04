'use client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PensionInput } from '@/components/pension-vision/pension-input';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full">
          <PensionInput />
        </div>
      </main>
      <Footer />
    </div>
  );
}
