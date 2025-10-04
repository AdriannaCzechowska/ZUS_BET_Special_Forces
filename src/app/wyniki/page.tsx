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

function WynikiPageContent() {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

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
      const realPension = searchParams.get('realPension') || '0';
      const realisticPension = searchParams.get('realisticPension') || '0';
      const replacementRate = searchParams.get('replacementRate') || '0';
      const pensionWithoutL4 = searchParams.get('pensionWithoutL4') || '0';
      const grossSalary = searchParams.get('grossSalary') || '0';
      const age = searchParams.get('age') || '0';
      const gender = searchParams.get('gender') || 'N/A';
      const retirementYear = searchParams.get('retirementYear') || 'N/A';

      const headers = [
        "Parametr",
        "Wartość"
      ];
      const data = [
        ["Identyfikator Symulacji", searchParams.get('id') || 'Brak'],
        ["Data wygenerowania", new Date().toLocaleString('pl-PL')],
        ["--- Dane Wejściowe ---", ""],
        ["Wiek", age],
        ["Płeć", gender === 'K' ? 'Kobieta' : 'Mężczyzna'],
        ["Rok przejścia na emeryturę", retirementYear],
        ["Ostatnie wynagrodzenie brutto", grossSalary],
        ["--- Główne Wyniki ---", ""],
        ["Wysokość rzeczywista (brutto)", realPension],
        ["Wysokość urealniona (brutto)", realisticPension],
        ["Stopa zastąpienia (%)", replacementRate],
        ["--- Scenariusze Dodatkowe ---", ""],
        ["Emerytura bez wpływu L4 (szacunkowo)", pensionWithoutL4],
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
                            <DropdownMenuItem onClick={handleDownloadCsv}>
                                Pobierz jako CSV (Excel)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </SideNav>
            </div>

            <div ref={resultsRef} className="space-y-8 lg:col-span-3">
                <SimulationResults />
                <Separator className="my-8"/>
                <ThirdPillarSimulator />
                <Separator className="my-8"/>
                <RegionalQualityIndicator />
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
