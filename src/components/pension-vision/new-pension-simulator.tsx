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
import { CareerMonthsVisualizer } from './career-months-visualizer';
import { Baby, Briefcase, FileText, Globe, HeartHandshake, Home, School, Plane, Wallet, BookOpen } from 'lucide-react';

type PeriodType = 'unpaid_leave' | 'maternity_leave' | 'parental_leave' | 'sick_leave' | 'childcare_leave' | 'unemployed' | 'foreign_work_no_contrib';

interface LeavePeriod {
  id: string;
  type: PeriodType;
  enabled: boolean;
  startYear: number;
  startMonth: number; 
  durationMonths: number;
}

const periodConfig: { type: PeriodType; label: string; icon: React.ReactNode, defaultDuration: number, maxDuration: number }[] = [
    { type: 'maternity_leave', label: 'Urlop macierzyński', icon: <Baby />, defaultDuration: 12, maxDuration: 12 },
    { type: 'parental_leave', label: 'Urlop rodzicielski', icon: <Baby />, defaultDuration: 12, maxDuration: 36 },
    { type: 'childcare_leave', label: 'Urlop wychowawczy', icon: <HeartHandshake />, defaultDuration: 24, maxDuration: 36 },
    { type: 'sick_leave', label: 'Zwolnienie L4', icon: <FileText />, defaultDuration: 6, maxDuration: 24 },
    { type: 'unpaid_leave', label: 'Urlop bezpłatny', icon: <Wallet />, defaultDuration: 3, maxDuration: 24 },
    { type: 'unemployed', label: 'Bezrobocie', icon: <Home />, defaultDuration: 6, maxDuration: 24 },
    { type: 'foreign_work_no_contrib', label: 'Praca za granicą (bez składek PL)', icon: <Plane />, defaultDuration: 12, maxDuration: 60 },
];

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

  const [leavePeriods, setLeavePeriods] = useState<Record<PeriodType, { enabled: boolean; durationMonths: number }>>(
    () => Object.fromEntries(
        periodConfig.map(p => [p.type, { enabled: false, durationMonths: p.defaultDuration }])
    ) as Record<PeriodType, { enabled: boolean; durationMonths: number }>
  );

  const minRetireYear = useMemo(() => {
    return currentYear + (gender === 'K' ? 60 : 65) - age;
  }, [age, gender]);

  const birthYear = useMemo(() => currentYear - age, [age]);
  
  const careerPeriodsForVisualizer = useMemo(() => {
     let currentSimYear = startWorkYear;
     let currentSimMonth = 0;

    return Object.entries(leavePeriods)
      .filter(([, period]) => period.enabled)
      .map(([type, period]) => {
          const startDate = new Date(currentSimYear, currentSimMonth);
          const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + period.durationMonths, 0);

          const periodData = {
              type: type as PeriodType,
              start: { year: startDate.getFullYear(), month: startDate.getMonth() },
              end: { year: endDate.getFullYear(), month: endDate.getMonth() }
          }
          
          // Move cursor for next period
          const nextStartDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1);
          currentSimYear = nextStartDate.getFullYear();
          currentSimMonth = nextStartDate.getMonth();

          return periodData;
      });
  }, [leavePeriods, startWorkYear]);


  const calculatedPension = useMemo(() => {
    const totalLeaveMonths = Object.values(leavePeriods)
        .filter(p => p.enabled)
        .reduce((sum, period) => sum + period.durationMonths, 0);

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

  const updateLeavePeriod = (type: PeriodType, field: 'enabled' | 'durationMonths', value: boolean | number) => {
     setLeavePeriods(produce(draft => {
        (draft[type] as any)[field] = value;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
             <div className="p-6 border rounded-lg bg-card shadow-sm space-y-4">
                <h3 className="font-headline text-xl text-primary">Dodatkowe parametry zatrudnienia</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {periodConfig.map((period) => (
                        <div key={period.type} className="p-3 border rounded-lg bg-background/50 space-y-3">
                             <div className="flex items-center justify-between">
                                <Label htmlFor={`switch-${period.type}`} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                                    {period.icon}
                                    <span>{period.label}</span>
                                </Label>
                                <Switch 
                                    id={`switch-${period.type}`}
                                    checked={leavePeriods[period.type].enabled}
                                    onCheckedChange={(checked) => updateLeavePeriod(period.type, 'enabled', checked)}
                                />
                            </div>
                            {leavePeriods[period.type].enabled && (
                                <div className='space-y-2'>
                                    <div className='flex justify-between items-center'>
                                            <Label className='text-xs'>Długość:</Label>
                                            <span className='text-xs font-bold'>{leavePeriods[period.type].durationMonths} mies.</span>
                                    </div>
                                    <Slider
                                        min={1}
                                        max={period.maxDuration}
                                        step={1}
                                        value={[leavePeriods[period.type].durationMonths]}
                                        onValueChange={(val) => updateLeavePeriod(period.type, 'durationMonths', val[0])}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                 </div>
            </div>

             <CareerMonthsVisualizer 
                periods={careerPeriodsForVisualizer}
                startYear={startWorkYear} 
                retirementYear={retireYear}
            />
        </div>
      </div>
      
      <div className="text-center p-8 border-2 rounded-lg mt-8" style={{ borderColor: isGoalAchieved ? '#22c55e' : '#ef4444' }}>
        <h3 className="text-lg text-muted-foreground">Twoja szacowana wartość emerytury wynosi:</h3>
        <p className={cn('text-5xl font-bold font-headline my-2', isGoalAchieved ? 'text-green-500' : 'text-red-500')}>
          {calculatedPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
        </p>
      </div>
    </div>
  );
}
