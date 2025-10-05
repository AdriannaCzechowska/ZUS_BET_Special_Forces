'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NewPensionSimulator } from '@/components/pension-vision/new-pension-simulator';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useToast } from '@/hooks/use-toast';


export default function SimulationPage() {
  const { toast } = useToast();
  const simulatorRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    toast({
      title: "Generowanie raportu PDF...",
      description: "Twój raport jest przygotowywany i wkrótce się pobierze.",
    });

    if (!simulatorRef.current) {
        console.error("Nie znaleziono elementu do wygenerowania raportu.");
        toast({
            variant: "destructive",
            title: "Błąd",
            description: "Nie można wygenerować raportu PDF. Spróbuj ponownie.",
        });
        return;
    }

    try {
        const canvas = await html2canvas(simulatorRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: window.getComputedStyle(document.body).backgroundColor || '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save("raport-symulacji.pdf");

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
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Formularz symulacji' }
      ]} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div ref={simulatorRef} className="bg-background">
            <NewPensionSimulator />
        </div>
        <div className="mt-12 text-center">
            <Button size="lg" onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Pobierz jako PDF
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
