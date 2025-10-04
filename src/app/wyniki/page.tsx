'use client';

import { Suspense, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, LayoutDashboard, Download } from 'lucide-react';
import Link from 'next/link';
import { SimulationResults } from '@/components/pension-vision/simulation-results';
import { useToast } from '@/hooks/use-toast';
import { RegionalQualityIndicator } from '@/components/pension-vision/regional-quality-indicator';
import { Separator } from '@/components/ui/separator';


function WynikiPageContent() {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDownloadReport = async () => {
    toast({
      title: "Generowanie raportu...",
      description: "Twój raport w formacie PDF jest przygotowywany i wkrótce się pobierze.",
    });

    if (!resultsRef.current) {
        console.error("Nie znaleziono elementu do wygenerowania raportu.");
        toast({
            variant: "destructive",
            title: "Błąd",
            description: "Nie można wygenerować raportu. Spróbuj ponownie.",
        });
        return;
    }

    try {
        const canvas = await html2canvas(resultsRef.current, {
            scale: 2, // Zwiększenie skali dla lepszej jakości
            useCORS: true,
            backgroundColor: null, 
        });

        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save("raport-emerytalny.pdf");

    } catch (error) {
        console.error("Błąd podczas generowania PDF:", error);
        toast({
            variant: "destructive",
            title: "Błąd generowania raportu",
            description: "Wystąpił problem podczas tworzenia pliku PDF.",
        });
    }
  };

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
           <div className="flex flex-wrap gap-2">
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
             <Button onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Pobierz raport
            </Button>
           </div>
        </div>
        
        <div ref={resultsRef} className="space-y-8">
            <SimulationResults />
            <Separator className="my-8"/>
            <RegionalQualityIndicator />
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default function WynikiPage() {
    return (
        <Suspense fallback={<div>Ładowanie...</div>}>
            <WynikiPageContent />
        </Suspense>
    )
}
