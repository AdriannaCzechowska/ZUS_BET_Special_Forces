'use client';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { calculatePension } from '@/lib/pension-calculator';
import { SalaryHelper } from './salary-helper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CareerMonthsChart } from './career-months-chart';

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

  const [unpaidLeaveMonths, setUnpaidLeaveMonths] = useState(0);
  const [maternityLeaveMonths, setMaternityLeaveMonths] = useState(0);
  const [parentalLeaveMonths, setParentalLeaveMonths] = useState(0);
  const [sicknessLeaveMonths, setSicknessLeaveMonths] = useState(0);
  const [childcareLeaveMonths, setChildcareLeaveMonths] = useState(0);
  const [unemploymentMonths, setUnemploymentMonths] = useState(0);
  const [workAbroadMonths, setWorkAbroadMonths] = useState(0);

  const careerEvents = [
      { year: 2026, month: 1, duration: 9, type: 'sickness' as const, label: 'Zwolnienie lekarskie' },
      { year: 2027, month: 1, duration: 12, type: 'maternity' as const, label: 'Urlop macierzyński' },
      { year: 2028, month: 1, duration: 24, type: 'childcare' as const, label: 'Urlop wychowawczy' },
      { year: 2035, month: 6, duration: 6, type: 'unemployment' as const, label: 'Okres bezrobocia'},
  ];


  const minRetireYear = useMemo(() => {
    return currentYear + (gender === 'K' ? 60 : 65) - age;
  }, [age, gender]);

  const birthYear = useMemo(() => currentYear - age, [age]);

  const calculatedPension = useMemo(() => {
    const totalLeaveMonths = unpaidLeaveMonths + maternityLeaveMonths + parentalLeaveMonths + sicknessLeaveMonths + childcareLeaveMonths + unemploymentMonths + workAbroadMonths;
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
  }, [age, gender, salary, startWorkYear, retireYear, unpaidLeaveMonths, maternityLeaveMonths, parentalLeaveMonths, sicknessLeaveMonths, childcareLeaveMonths, unemploymentMonths, workAbroadMonths, birthYear]);

  const isGoalAchieved = calculatedPension >= desiredPension;

  return (
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

      <div className="text-center p-8 border-2 rounded-lg" style={{ borderColor: isGoalAchieved ? '#22c55e' : '#ef4444' }}>
        <h3 className="text-lg text-muted-foreground">Twoja szacowana wartość emerytury wynosi:</h3>
        <p className={cn('text-5xl font-bold font-headline my-2', isGoalAchieved ? 'text-green-500' : 'text-red-500')}>
          {calculatedPension.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
        </p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="leaves" className="border rounded-lg bg-card shadow-sm p-4">
          <AccordionTrigger className="font-headline text-lg">Dodatkowe parametry zatrudnienia</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <FormSlider label="Urlop bezpłatny" value={unpaidLeaveMonths} min={0} max={120} step={1} onValueChange={setUnpaidLeaveMonths} unit="miesięcy" />
            <FormSlider label="Urlop macierzyński" value={maternityLeaveMonths} min={0} max={12} step={1} onValueChange={setMaternityLeaveMonths} unit="miesięcy" />
            <FormSlider label="Urlop rodzicielski" value={parentalLeaveMonths} min={0} max={36} step={1} onValueChange={setParentalLeaveMonths} unit="miesięcy" />
            <FormSlider label="Zwolnienie lekarskie (L4)" value={sicknessLeaveMonths} min={0} max={120} step={1} onValueChange={setSicknessLeaveMonths} unit="miesięcy" />
            <FormSlider label="Urlop wychowawczy" value={childcareLeaveMonths} min={0} max={36} step={1} onValueChange={setChildcareLeaveMonths} unit="miesięcy" />
            <FormSlider label="Okres bezrobocia" value={unemploymentMonths} min={0} max={120} step={1} onValueChange={setUnemploymentMonths} unit="miesięcy" />
            <FormSlider label="Praca za granicą (bez składek PL)" value={workAbroadMonths} min={0} max={240} step={1} onValueChange={setWorkAbroadMonths} unit="miesięcy" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

       <CareerMonthsChart 
          startYear={startWorkYear} 
          endYear={retireYear}
          events={careerEvents}
      />

    </div>
  );
}
