'use client';
import { useState, useMemo } from 'react';
import { produce } from 'immer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { calculatePension } from '@/lib/pension-calculator';
import { SalaryHelper } from './salary-helper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CareerMonthsVisualizer } from './career-months-visualizer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2 } from 'lucide-react';

type PeriodType = 'unpaid_leave' | 'maternity_leave' | 'parental_leave' | 'sick_leave' | 'childcare_leave' | 'unemployed' | 'foreign_work_no_contrib';

interface LeavePeriod {
  id: string;
  type: PeriodType;
  startYear: number;
  startMonth: number; // 0-11
  durationMonths: number;
}

const periodLabels: Record<PeriodType, string> = {
    unpaid_leave: "Urlop bezpłatny",
    maternity_leave: "Urlop macierzyński",
    parental_leave: "Urlop rodzicielski",
    sick_leave: "Zwolnienie lekarskie (L4)",
    childcare_leave: "Urlop wychowawczy",
    unemployed: "Okres bezrobocia",
    foreign_work_no_contrib: "Praca za granicą (bez składek PL)",
};


const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4 p-6 border rounded-lg bg-card shadow-sm">
    <h3 className="font-headline text-xl text-primary">{title}</h3>
    {children}
  </div>
);

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {children}
  </div>
);

const FormSlider = ({ label, value, min, max, step, onValueChange, unit }: { label: string, value: number, min: number, max: number, step: number, onValueChange: (value: number) => void, unit: string }) => (
  <FormField label={`${label}: ${value} ${unit}`}>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onValueChange(v[0])}
    />
  </FormField>
);

const FormRadioGroup = ({ label, value, options, onValueChange }: { label: string, value: string, options: { value: string, label: string }[], onValueChange: (value: string) => void }) => (
  <FormField label={label}>
    <div className="flex gap-2">
      {options.map(option => (
        <Button
          key={option.value}
          variant={value === option.value ? 'default' : 'outline'}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  </FormField>
);

const currentYear = new Date().getFullYear();

export function NewPensionSimulator() {
  const [desiredPension, setDesiredPension] = useState(4000);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'K' | 'M'>('K');
  const [isTaxExempt, setIsTaxExempt] = useState(true);
  const [startWorkYear, setStartWorkYear] = useState(currentYear - 10);
  const [retireYear, setRetireYear] = useState(currentYear + 30);
  const [salary, setSalary] = useState(6000);

  const [leavePeriods, setLeavePeriods] = useState<LeavePeriod[]>([]);

  const minRetireYear = useMemo(() => {
    return currentYear + (gender === 'K' ? 60 : 65) - age;
  }, [age, gender]);

  const birthYear = useMemo(() => currentYear - age, [age]);
  
  const careerPeriodsForVisualizer = leavePeriods.map(p => {
    const startDate = new Date(p.startYear, p.startMonth);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + p.durationMonths, 0); // 0 makes it the last day of previous month
    return {
        type: p.type as any, // Cast to fit visualizer types
        start: { year: p.startYear, month: p.startMonth },
        end: { year: endDate.getFullYear(), month: endDate.getMonth() }
    }
  });


  const calculatedPension = useMemo(() => {
    const totalLeaveMonths = leavePeriods.reduce((sum, period) => sum + period.durationMonths, 0);
    const retirementAge = retireYear - birthYear;
    const extraWorkYears = Math.max(0, retirementAge - (gender === 'K' ? 60 : 65));

    const result = calculatePension({
      wiek: age,
      plec: gender,
      pensjaBrutto: salary,
      rokRozpoczeciaPracy: startWorkYear,
      rokPrzejsciaNaEmeryture: retireYear,
      dodatkoweLataPracy: extraWorkYears,
      przerwyWLacznychMiesiacach: totalLeaveMonths,
    });
    return result.prognozowanaEmerytura;
  }, [age, gender, salary, startWorkYear, retireYear, leavePeriods, birthYear]);

  const isGoalAchieved = calculatedPension >= desiredPension;

  const addLeavePeriod = (type: PeriodType) => {
    setLeavePeriods(produce(draft => {
        draft.push({
            id: Date.now().toString(),
            type: type,
            startYear: currentYear + 1,
            startMonth: 0,
            durationMonths: 12,
        });
    }));
  };

  const removeLeavePeriod = (id: string) => {
    setLeavePeriods(currentPeriods => currentPeriods.filter(p => p.id !== id));
  };
  
  const updateLeavePeriod = <K extends keyof LeavePeriod>(id: string, field: K, value: LeavePeriod[K]) => {
     setLeavePeriods(produce(draft => {
        const period = draft.find(p => p.id === id);
        if (period) {
            period[field] = value;
        }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <FormSection title="Jaką emeryturę chciałbyś mieć w przyszłości?">
                <FormField label="Oczekiwana kwota emerytury (PLN netto)">
                <Input type="number" value={desiredPension} onChange={e => setDesiredPension(Number(e.target.value))} className="max-w-xs text-lg" />
                </FormField>
            </FormSection>

            <FormSection title="Podstawowe informacje">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField label="Ile masz lat?">
                    <Input type="number" value={age} onChange={e => setAge(Number(e.target.value))} />
                </FormField>
                <FormRadioGroup
                    label="Jaką masz płeć?"
                    value={gender}
                    options={[{ value: 'K', label: 'Kobieta' }, { value: 'M', label: 'Mężczyzna' }]}
                    onValueChange={(v) => setGender(v as 'K' | 'M')}
                />
                <div className="flex items-center space-x-2">
                    <Switch id="tax-exempt" checked={isTaxExempt} onCheckedChange={setIsTaxExempt} />
                    <Label htmlFor="tax-exempt">Czy jesteś zwolniony z płacenia składek do 26 roku życia?</Label>
                </div>
                </div>
            </FormSection>

            <FormSection title="Twoja ścieżka kariery">
                <FormSlider label="Kiedy zacząłeś pracę" value={startWorkYear} min={birthYear + 16} max={currentYear} step={1} onValueChange={setStartWorkYear} unit="" />
                <FormSlider label="Kiedy planujesz skończyć pracę" value={retireYear} min={minRetireYear} max={birthYear + 100} step={1} onValueChange={setRetireYear} unit="" />
            </FormSection>

            <FormSection title="Jakie są Twoje średnie zarobki?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField label="Miesięczne wynagrodzenie brutto (PLN)">
                        <Input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} />
                    </FormField>
                    <SalaryHelper onSalarySelect={setSalary} />
                </div>
            </FormSection>
        </div>
        
        <div className="space-y-8">
            <Accordion type="multiple" className="w-full space-y-4">
                <AccordionItem value="leaves" className="border rounded-lg bg-card shadow-sm p-4">
                <AccordionTrigger className="font-headline text-lg">Dodatkowe parametry zatrudnienia</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                    {leavePeriods.map(period => (
                        <div key={period.id} className='p-3 border rounded-lg bg-background/50 space-y-2'>
                            <div className='flex justify-between items-center'>
                                <Label className='font-semibold'>{periodLabels[period.type]}</Label>
                                <Button variant="ghost" size="icon" className='text-destructive h-7 w-7' onClick={() => removeLeavePeriod(period.id)}>
                                    <Trash2 className='h-4 w-4' />
                                </Button>
                            </div>
                            <div className='grid grid-cols-3 gap-2'>
                                <FormField label="Rok startu">
                                    <Input type="number" value={period.startYear} onChange={e => updateLeavePeriod(period.id, 'startYear', Number(e.target.value))} />
                                </FormField>
                                <FormField label="Miesiąc startu">
                                    <Input type="number" min="1" max="12" value={period.startMonth + 1} onChange={e => updateLeavePeriod(period.id, 'startMonth', Number(e.target.value) - 1)} />
                                </FormField>
                                <FormField label="Ile miesięcy">
                                    <Input type="number" value={period.durationMonths} onChange={e => updateLeavePeriod(period.id, 'durationMonths', Number(e.target.value))} />
                                </FormField>
                            </div>
                        </div>
                    ))}

                    <Select onValueChange={(value: PeriodType) => addLeavePeriod(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Dodaj nowy okres przerwy..." />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(periodLabels).map(([type, label]) => (
                                <SelectItem key={type} value={type}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </AccordionContent>
                </AccordionItem>
            </Accordion>
             <CareerMonthsVisualizer 
                periods={careerPeriodsForVisualizer}
                startYear={startWorkYear} 
                retirementYear={retireYear}
            />
        </div>
      </div>
      
      <div className="text-center p-8 border-2 rounded-lg" style={{ borderColor: isGoalAchieved ? '#22c55e' : '#ef4444' }}>
        <h3 className="text-lg text-muted-foreground">Twoja szacowana wartość emerytury wynosi:</h3>
        <p className={cn('text-5xl font-bold font-headline my-2', isGoalAchieved ? 'text-green-500' : 'text-red-500')}>
          {calculatedPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
        </p>
      </div>
    </div>
  );
}
