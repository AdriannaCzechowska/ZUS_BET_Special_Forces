'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


export default function WhatIsItEnoughForPage() {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Na co to wystarcza' }
      ]} />
      <main className="flex-grow w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
             <Button asChild variant="ghost" className="pl-0 text-base">
                <Link href="/symulacja">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Wróć do symulatora
                </Link>
            </Button>
        </div>
        
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Na co wystarczy Twoja emerytura?
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Wkrótce tutaj znajdziesz narzędzia, które pomogą Ci zrozumieć realną siłę nabywczą Twojego przyszłego świadczenia.
          </p>
        </header>

        <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Treść w przygotowaniu...</p>
        </div>

      </main>
      <Footer />
    </div>
  );
}
