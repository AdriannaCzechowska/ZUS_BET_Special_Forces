"use client";

import { useDailyFact } from '@/hooks/use-daily-fact';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, Info } from "lucide-react";

function FactContent() {
    const { fact, refreshFact } = useDailyFact();

    return (
        <div className="space-y-4">
             <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-muted-foreground flex-grow">
                    {fact || 'Ładowanie ciekawostki...'}
                </p>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={refreshFact} aria-label="Odśwież ciekawostkę">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Pokaż inną ciekawostkę</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Info className="h-3.5 w-3.5" />
                        <span>Źródło danych</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                        <p>Dane pochodzą z oficjalnych publikacji ZUS oraz GUS.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

export function DailyFactCard() {
    return (
        <Card className="bg-muted shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Ciekawostka dnia</CardTitle>
            </CardHeader>
            <CardContent>
                <FactContent />
            </CardContent>
        </Card>
    );
}

export function DailyFactAccordion() {
    return (
         <Accordion type="single" collapsible className="w-full rounded-lg border bg-card shadow-lg px-6">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="font-headline text-xl hover:no-underline py-4">
                    Ciekawostka dnia
                </AccordionTrigger>
                <AccordionContent>
                    <FactContent />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
