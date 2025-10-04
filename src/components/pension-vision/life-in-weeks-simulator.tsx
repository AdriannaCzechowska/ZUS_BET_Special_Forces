'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { lifeWeeksConfig, eventsImpact, lifeWeeksUI } from '@/lib/data/life-weeks-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';

const TOTAL_WEEKS = 90 * 52;

const WeekBox = ({ weekIndex, event, color, weekData }: { weekIndex: number; event: any; color: string; weekData: any; }) => {
    if (!weekData) return <div className="h-2 w-2 bg-muted/20 rounded-sm" />;
    
    const { isLived, eventName, factor } = weekData;

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            "h-2 w-2 rounded-sm cursor-pointer",
                            isLived ? "opacity-30" : "opacity-100"
                        )}
                        style={{ backgroundColor: color }}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-bold">Tydzień {weekIndex + 1}</p>
                    {eventName ? (
                        <>
                            <p>{eventName}</p>
                            <p className="text-xs text-muted-foreground">Współczynnik: {factor}</p>
                        </>
                    ) : (
                        <p>Aktywność zawodowa</p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};


export function LifeInWeeksSimulator() {
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(lifeWeeksConfig.retirementAge.F);
  const [showLived, setShowLived] = useState(true);

  const [activeEvents, setActiveEvents] = useState<Record<string, { enabled: boolean; duration: number }>>(
    () => {
        const initialEvents: Record<string, { enabled: boolean; duration: number }> = {};
        eventsImpact.forEach(event => {
            initialEvents[event.id] = { enabled: false, duration: event.durationWeeksDefault };
        });
        return initialEvents;
    }
  );

  const weeksData = useMemo(() => {
    const weeks = Array(TOTAL_WEEKS).fill(null).map((_, i) => ({
      isLived: i < currentAge * 52,
      eventName: 'Praca',
      factor: 1.0,
      color: lifeWeeksConfig.colors.active,
    }));

    let weekCursor = currentAge * 52;
    
    Object.entries(activeEvents).forEach(([eventId, eventState]) => {
      if (eventState.enabled) {
        const eventConfig = eventsImpact.find(e => e.id === eventId);
        if (eventConfig) {
          for (let i = 0; i < eventState.duration && weekCursor + i < TOTAL_WEEKS; i++) {
            const weekIndex = weekCursor + i;
            weeks[weekIndex].eventName = eventConfig.name;
            weeks[weekIndex].factor = eventConfig.contributionFactor;
            if (eventConfig.contributionFactor === 0) weeks[weekIndex].color = lifeWeeksConfig.colors.neutral;
            else if (eventConfig.contributionFactor < 1) weeks[weekIndex].color = lifeWeeksConfig.colors.reduced;
            if (eventConfig.tier3Monthly_pln) weeks[weekIndex].color = lifeWeeksConfig.colors.tier3;
          }
          weekCursor += eventState.duration;
        }
      }
    });

    for(let i = retirementAge * 52; i < TOTAL_WEEKS; i++) {
        if(weeks[i]){
            weeks[i].eventName = 'Emerytura';
            weeks[i].color = lifeWeeksConfig.colors.neutral;
        }
    }

    return weeks;
  }, [currentAge, retirementAge, activeEvents]);

  const equivalentFullWeeks = useMemo(() => {
    const activePeriod = weeksData.slice(currentAge * 52, retirementAge * 52);
    return activePeriod.reduce((sum, week) => sum + week.factor, 0);
  }, [weeksData, currentAge, retirementAge]);

  const totalCalendarWeeks = (retirementAge - currentAge) * 52;

  const toggleEvent = (eventId: string) => {
    setActiveEvents(prev => ({
        ...prev,
        [eventId]: { ...prev[eventId], enabled: !prev[eventId].enabled }
    }))
  }

  const handleDurationChange = (eventId: string, duration: number) => {
     setActiveEvents(prev => ({
        ...prev,
        [eventId]: { ...prev[eventId], duration }
    }))
  }

  return (
    <Card className="shadow-lg semitransparent-panel overflow-hidden">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">
                {lifeWeeksUI.rightPanel.title}
            </CardTitle>
            <CardDescription>
                Wizualizuj swoją karierę i zobacz, jak różne wydarzenia życiowe wpływają na Twój kapitał emerytalny.
            </CardDescription>
        </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
                <div>
                     <Label className='font-semibold'>{lifeWeeksUI.leftPanel.title}</Label>
                     <div className='mt-2 space-y-4'>
                        {eventsImpact.map(event => (
                            <div key={event.id} className="p-3 border rounded-lg bg-background/50">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor={`switch-${event.id}`} className="flex items-center gap-2 cursor-pointer">
                                        <span className="text-lg">{event.emoji}</span>
                                        <span className="text-sm font-medium">{event.name}</span>
                                    </Label>
                                    <Switch 
                                        id={`switch-${event.id}`}
                                        checked={activeEvents[event.id].enabled}
                                        onCheckedChange={() => toggleEvent(event.id)}
                                    />
                                </div>
                                {activeEvents[event.id].enabled && (
                                    <div className='mt-3'>
                                        <div className='flex justify-between items-center mb-1'>
                                             <Label className='text-xs'>Czas trwania</Label>
                                             <span className='text-xs font-bold'>{activeEvents[event.id].duration} tyg.</span>
                                        </div>
                                        <Slider
                                            min={4}
                                            max={event.id.includes('stud') ? 260 : 156}
                                            step={4}
                                            value={[activeEvents[event.id].duration]}
                                            onValueChange={(val) => handleDurationChange(event.id, val[0])}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                     </div>
                </div>
            </aside>
            <main className="lg:col-span-3">
                 <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {lifeWeeksUI.rightPanel.legend.map(item => (
                        <div key={item.label} className="flex items-center gap-1.5 text-xs">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                     <Button variant="ghost" size="sm" onClick={() => setShowLived(!showLived)} className="text-xs gap-1.5">
                        {showLived ? <EyeOff /> : <Eye />}
                        {showLived ? 'Ukryj przeżyte' : 'Pokaż przeżyte'}
                     </Button>
                </div>
                <div className="flex flex-wrap gap-px justify-center p-2 bg-muted/20 rounded-lg">
                    {weeksData.map((week, index) => {
                        if (!showLived && week.isLived) {
                            return <div key={index} className="h-2 w-2"/>;
                        }
                        return <WeekBox key={index} weekIndex={index} event={null} color={week.color} weekData={week} />
                    })}
                </div>
                <div className='mt-6 grid grid-cols-2 gap-4 text-center'>
                    <div className='p-4 bg-background/50 rounded-lg border'>
                        <Label className='text-sm text-muted-foreground'>Liczba tygodni kalendarzowych do emerytury</Label>
                        <p className='text-2xl font-bold font-headline'>{totalCalendarWeeks.toLocaleString()}</p>
                    </div>
                     <div className='p-4 bg-background/50 rounded-lg border'>
                        <Label className='text-sm text-muted-foreground'>Tygodnie z pełnymi składkami (ekwiwalent)</Label>
                        <p className='text-2xl font-bold font-headline text-primary'>{equivalentFullWeeks.toFixed(0).toLocaleString()}</p>
                    </div>
                </div>
            </main>
        </div>
      </CardContent>
    </Card>
  );
}
