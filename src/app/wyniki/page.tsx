'use client';

import { Suspense, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { stringify }from 'csv-stringify/browser/esm/sync';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, RefreshCw, LayoutDashboard, Download, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { SimulationResults } from '@/components/pension-vision/simulation-results';
import { useToast } from '@/hooks/use-toast';
import { RegionalQualityIndicator } from '@/components/pension-vision/regional-quality-indicator';
import { Separator } from '@/components/ui/separator';
import { ThirdPillarSimulator } from '@/components/pension-vision/third-pillar-simulator';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { SideNav } from '@/components/layout/side-nav';
import { useSearchParams } from 'next/navigation';
import { ParenthoodImpact } from '@/components/pension-vision/ParenthoodImpact';
import { useAuthContext } from '@/context/AuthContext';

function WynikiPageContent() {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const postcodeRef = useRef<string>('');
  const searchParams = useSearchParams();
  const { isAdmin } = useAuthContext();

  const handleDownloadReport = async () => {
    toast({
      title: "Generowanie raportu PDF...",
      description: "Twój raport jest przygotowywany i wkrótce się pobierze.",
    });

    if (!resultsRef.current) {
        console.error("Nie znaleziono elementu do wygenerowania raportu.");
        toast({
            variant: "destructive",
            title: "Błąd",
            description: "Nie można wygenerować raportu PDF. Spróbuj ponownie.",
        });
        return;
    }

    try {
        const canvas = await html2canvas(resultsRef.current, {
            scale: 2,
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

  const handleDownloadCsv = () => {
    toast({
      title: "Generowanie pliku CSV...",
      description: "Twój plik jest przygotowywany do pobrania.",
    });
    
    try {
        const now = new Date();
        const headers = [
            "Parametr",
            "Wartość"
        ];
        const data = [
            ["Data użycia", now.toLocaleDateString('pl-PL')],
            ["Godzina użycia", now.toLocaleTimeString('pl-PL')],
            ["Emerytura oczekiwana", searchParams.get('expectedPension') || 'Brak'],
            ["Wiek", searchParams.get('age') || 'Brak'],
            ["Płeć", searchParams.get('gender') === 'K' ? 'Kobieta' : 'Mężczyzna'],
            ["Wysokość wynagrodzenia", searchParams.get('grossSalary') || 'Brak'],
            ["Czy uwzględniał okresy choroby", searchParams.get('includeL4') === 'true' ? 'Tak' : 'Nie'],
            ["Wysokość zgromadzonych środków na koncie i Subkoncie", 'N/A (nowy model)'],
            ["Emerytura rzeczywista", searchParams.get('realPension') || 'Brak'],
            ["Emerytura urealniona", searchParams.get('realisticPension') || 'Brak'],
            ["Kod pocztowy", postcodeRef.current || 'Brak Danych'],
        ];

      const csvContent = stringify([headers, ...data], { delimiter: ';' });
      const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "raport-emerytalny.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch(error) {
        console.error("Błąd podczas generowania CSV:", error);
        toast({
            variant: "destructive",
            title: "Błąd generowania pliku",
            description: "Wystąpił problem podczas tworzenia pliku CSV.",
        });
    }
  }


  const navItems = [
    {
        icon: <RefreshCw className="mr-2 h-4 w-4" />,
        label: 'Nowa symulacja',
        href: '/symulacja',
        active: true
    },
    {
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
        label: 'Przejdź do Dashboardu',
        href: '/dashboard',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Wyniki symulacji' }
      ]} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
             <Button asChild variant="ghost" className="pl-0 text-base">
                <Link href="/symulacja">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Wróć do formularza
                </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            <div className="lg:col-span-1">
                 <SideNav title="Akcje" items={navItems}>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start text-base px-4 py-3 rounded-none text-primary/80 hover:bg-primary/10">
                                <Download className="mr-2 h-4 w-4" />
                                Pobierz raport
                                <ChevronDown className="ml-auto h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={handleDownloadReport}>
                                Pobierz jako PDF
                            </DropdownMenuItem>
                            {isAdmin && (
                                <DropdownMenuItem onClick={handleDownloadCsv}>
                                    Pobierz jako CSV (Excel)
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </SideNav>
            </div>

            <div ref={resultsRef} className="space-y-8 lg:col-span-3">
                <SimulationResults />
                <Separator className="my-8"/>
                <ThirdPillarSimulator />
                <Separator className="my-8"/>
                <RegionalQualityIndicator onPostcodeChange={(pc) => postcodeRef.current = pc} />
                <Separator className="my-8"/>
                <ParenthoodImpact />
            </div>
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
