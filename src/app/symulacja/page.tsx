'use client';

import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { stringify } from 'csv-stringify/browser/esm/sync';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NewPensionSimulator, type SimulatorState } from '@/components/pension-vision/new-pension-simulator';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, Lightbulb } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { calculatePension } from '@/lib/pension-calculator';

export default function SimulationPage() {
  const { toast } = useToast();
  const simulatorRef = useRef<HTMLDivElement>(null);
  const [simulatorState, setSimulatorState] = useState<SimulatorState | null>(null);
  const { isAdmin } = useAuthContext();
  const searchParams = useSearchParams();

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

  const handleDownloadCsv = () => {
    if (!simulatorState) {
        toast({
            variant: "destructive",
            title: "Brak danych",
            description: "Wypełnij formularz, aby wygenerować raport CSV.",
        });
        return;
    }

    toast({
      title: "Generowanie pliku CSV...",
      description: "Twój plik jest przygotowywany do pobrania.",
    });
    
    try {
        const now = new Date();
        const totalLeaveMonths = simulatorState.leavePeriods.reduce((sum, period) => sum + period.durationMonths, 0);
        const birthYear = now.getFullYear() - simulatorState.age;
        const retirementAge = simulatorState.retireYear - birthYear;
        const extraWorkYears = Math.max(0, retirementAge - (simulatorState.gender === 'K' ? 60 : 65));
        
        const pensionResult = calculatePension({
            wiek: simulatorState.age,
            plec: simulatorState.gender,
            pensjaBrutto: simulatorState.salary,
            rokRozpoczeciaPracy: simulatorState.startWorkYear,
            rokPrzejsciaNaEmeryture: simulatorState.retireYear,
            dodatkoweLataPracy: extraWorkYears,
            przerwyWLacznychMiesiacach: totalLeaveMonths,
            wariant: simulatorState.wariant,
            employmentType: simulatorState.employmentType,
        });

        const headers = [
            "Parametr",
            "Wartość"
        ];
        const data = [
            ["Data użycia", now.toLocaleDateString('pl-PL')],
            ["Godzina użycia", now.toLocaleTimeString('pl-PL')],
            ["Emerytura oczekiwana", searchParams.get('expectedPension') || 'Brak'],
            ["Wiek", simulatorState.age],
            ["Płeć", simulatorState.gender === 'K' ? 'Kobieta' : 'Mężczyzna'],
            ["Wysokość wynagrodzenia", simulatorState.salary],
            ["Czy uwzględniał okresy choroby", simulatorState.leavePeriods.some(p => p.type === 'sick_leave') ? 'Tak' : 'Nie'],
            ["Emerytura rzeczywista", pensionResult.prognozowanaEmerytura],
            ["Emerytura urealniona", pensionResult.kwotaUrealniona],
            ["Kod pocztowy", simulatorState.postcode || "Brak Danych"],
        ];

      const csvContent = stringify([headers, ...data], { delimiter: ';' });
      const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "raport-symulacji.csv");
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

  const realisticPension = simulatorState ? calculatePension({
        wiek: simulatorState.age,
        plec: simulatorState.gender,
        pensjaBrutto: simulatorState.salary,
        rokRozpoczeciaPracy: simulatorState.startWorkYear,
        rokPrzejsciaNaEmeryture: simulatorState.retireYear,
        dodatkoweLataPracy: 0, // Simplified for this link
        przerwyWLacznychMiesiacach: simulatorState.leavePeriods.reduce((sum, p) => sum + p.durationMonths, 0),
        wariant: simulatorState.wariant,
        employmentType: simulatorState.employmentType,
    }).kwotaUrealniona : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Formularz symulacji' }
      ]} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div ref={simulatorRef} className="bg-background">
            <NewPensionSimulator onStateChange={setSimulatorState} />
        </div>
        <div className="mt-12 text-center flex justify-center items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        Pobierz raport
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                    <DropdownMenuItem onClick={handleDownloadPdf}>
                        Pobierz jako PDF
                    </DropdownMenuItem>
                    {isAdmin && (
                        <DropdownMenuItem onClick={handleDownloadCsv}>
                            Pobierz jako CSV (Excel)
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild size="lg" variant="outline">
                 <Link href={`/na-co-wystarcza?realisticPension=${realisticPension}`}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Na co to wystarcza
                </Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
