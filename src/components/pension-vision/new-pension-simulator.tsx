

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
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type PeriodType = 'unpaid_leave' | 'maternity_leave' | 'parental_leave' | 'sick_leave' | 'childcare_leave' | 'unemployed' | 'foreign_work_no_contrib';

const periodConfig: { type: PeriodType; label: string; defaultDuration: number, maxDuration: number, description: string }[] = [
    { type: 'maternity_leave', label: 'Urlop macierzyński', defaultDuration: 12, maxDuration: 12, description: "W okresie urlopu macierzyńskiego składki emerytalne są finansowane z budżetu państwa i naliczane od zasiłku macierzyńskiego, który zazwyczaj jest niższy od wynagrodzenia. Powoduje to wolniejszy przyrost kapitału emerytalnego niż podczas pracy na etacie z pełną pensją." },
    { type: 'parental_leave', label: 'Urlop rodzicielski', defaultDuration: 12, maxDuration: 36, description: "W czasie urlopu rodzicielskiego składki są również opłacane z budżetu państwa i obliczane od zasiłku rodzicielskiego. Zazwyczaj jest on niższy od wynagrodzenia, co skutkuje mniejszymi wpłatami na konto emerytalne." },
    { type: 'childcare_leave', label: 'Urlop wychowawczy', defaultDuration: 24, maxDuration: 36, description: "Podczas urlopu wychowawczego składki emerytalne są finansowane z budżetu państwa, lecz naliczane od minimalnej podstawy, znacznie niższej od typowego wynagrodzenia. Skutkuje to wolniejszym wzrostem kapitału emerytalnego." },
    { type: 'sick_leave', label: 'Zwolnienie chorobowe', defaultDuration: 6, maxDuration: 24, description: "W okresie zwolnienia chorobowego składki emerytalne naliczane są od zasiłku chorobowego, który zwykle wynosi 80% wynagrodzenia. Oznacza to niższe wpłaty na konto emerytalne niż przy pełnej pensji." },
    { type: 'unpaid_leave', label: 'Urlop bezpłatny', defaultDuration: 3, maxDuration: 24, description: "Podczas urlopu bezpłatnego składki emerytalne nie są odprowadzane. Okres ten nie powiększa kapitału emerytalnego." },
    { type: 'unemployed', label: 'Bezrobocie', defaultDuration: 6, maxDuration: 24, description: "W czasie bezrobocia, gdy nie przysługuje zasiłek, składki emerytalne nie są odprowadzane i okres ten nie wpływa na wysokość przyszłej emerytury. Jeśli przysługuje zasiłek dla bezrobotnych, składki są odprowadzane, lecz naliczane od jego wysokości, co skutkuje niższymi wpłatami." },
    { type: 'foreign_work_no_contrib', label: 'Praca za granicą (bez składek w Polsce)', defaultDuration: 12, maxDuration: 60, description: "W przypadku pracy za granicą bez odprowadzania składek do polskiego systemu ubezpieczeń społecznych kapitał emerytalny w Polsce nie jest powiększany. Emerytura w Polsce może być wówczas niższa, chyba że okres zagranicznego zatrudnienia zostanie rozliczony na podstawie umów międzynarodowych." },
];

const employmentTypes = {
  'uop': 'Umowa o pracę: Składki emerytalne (19,52%) są obowiązkowe i w całości naliczane od Twojego wynagrodzenia brutto, co zapewnia najwyższy przyrost kapitału emerytalnego.',
  'zlecenie': 'Umowa zlecenie: Składki są obowiązkowe, jeśli nie masz innego tytułu do ubezpieczenia (np. innej umowy o pracę z pensją min. minimalną). Ich brak lub niższa podstawa obniża przyszłą emeryturę.',
  'b2b': 'Działalność gospodarcza / B2B: Najczęściej opłacasz składki od minimalnej podstawy (ok. 60% prognozowanego przeciętnego wynagrodzenia), co skutkuje znacznie niższymi wpłatami na konto emerytalne niż przy umowie o pracę z tym samym dochodem.',
  'brak': 'Brak składek: Wykonywanie pracy bez umowy lub na umowę o dzieło (z wyjątkami) oznacza brak odprowadzanych składek emerytalnych. Ten okres nie powiększa Twojego kapitału na przyszłą emeryturę.',
};
type EmploymentType = keyof typeof employmentTypes;


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
          type="button"
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
  const [wariant, setWariant] = useState<1 | 2 | 3>(1);
  const [employmentType, setEmploymentType] = useState<EmploymentType>('uop');


  const [leavePeriods, setLeavePeriods] = useState<Record<PeriodType, { enabled: boolean; durationMonths: number; startAge: number }>>(
    () => Object.fromEntries(
        periodConfig.map(p => [p.type, { enabled: false, durationMonths: p.defaultDuration, startAge: age + 1 }])
    ) as Record<PeriodType, { enabled: boolean; durationMonths: number; startAge: number }>
  );
  
  const minRetireYear = useMemo(() => {
    return currentYear + (gender === 'K' ? 60 : 65) - age;
  }, [age, gender]);

  const birthYear = useMemo(() => currentYear - age, [age]);

  const careerPeriodsForVisualizer = Object.entries(leavePeriods)
      .filter(([, period]) => period.enabled)
      .map(([type, period]) => {
          const startYearForPeriod = birthYear + period.startAge;
          const startDate = new Date(startYearForPeriod, 0);
          const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + period.durationMonths, 0);
          
          return {
              type: type as PeriodType,
              start: { year: startDate.getFullYear(), month: startDate.getMonth() },
              end: { year: endDate.getFullYear(), month: endDate.getMonth() }
          }
      });


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
      wariant: wariant
    });
    return result.prognozowanaEmerytura;
  }, [age, gender, salary, startWorkYear, retireYear, leavePeriods, birthYear, wariant]);

  const isGoalAchieved = calculatedPension >= desiredPension;

  const updateLeavePeriod = (type: PeriodType, field: 'enabled' | 'durationMonths' | 'startAge', value: boolean | number) => {
     setLeavePeriods(produce(draft => {
        (draft[type] as any)[field] = value;
    }));
  };

  return (
    <div className="space-y-8">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
           
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
            
            <FormSection title="Jakie są Twoje średnie zarobki?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField label="Miesięczne wynagrodzenie brutto (PLN)">
                        <Input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} />
                    </FormField>
                    <SalaryHelper onSalarySelect={setSalary} />
                </div>
            </FormSection>

             <FormSection title="Forma zatrudnienia">
                <RadioGroup value={employmentType} onValueChange={(v) => setEmploymentType(v as EmploymentType)} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="uop" id="uop" className="peer sr-only" />
                    <Label htmlFor="uop" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Umowa o pracę
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="zlecenie" id="zlecenie" className="peer sr-only" />
                    <Label htmlFor="zlecenie" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Umowa zlecenie
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="b2b" id="b2b" className="peer sr-only" />
                    <Label htmlFor="b2b" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Działalność / B2B
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="brak" id="brak" className="peer sr-only" />
                    <Label htmlFor="brak" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Brak składek
                    </Label>
                  </div>
                </RadioGroup>
                <div className="mt-4 text-sm text-muted-foreground bg-gray-50 p-3 rounded-md border">
                  {employmentTypes[employmentType]}
                </div>
             </FormSection>
            
            <FormSection title="Twoja ścieżka kariery">
                <FormSlider label="Kiedy zacząłeś pracę" value={startWorkYear} min={birthYear + 16} max={currentYear} step={1} onValueChange={setStartWorkYear} unit="" />
                <FormSlider label="Kiedy planujesz skończyć pracę" value={retireYear} min={minRetireYear} max={birthYear + 100} step={1} onValueChange={setRetireYear} unit="" />
            </FormSection>
        </div>
        
        <div className="p-6 border rounded-lg bg-card shadow-sm space-y-4">
            <h3 className="font-headline text-xl text-primary">Dodatkowe parametry zatrudnienia</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {periodConfig.map((period) => (
                    <div key={period.type} className="p-3 border rounded-lg bg-background/50 space-y-3">
                         <div className="flex items-center justify-between">
                            <Label htmlFor={`switch-${period.type}`} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                                <span>{period.label}</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button type="button" variant="ghost" size="icon" className="h-4 w-4 ml-1 cursor-help">
                                        <HelpCircle className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{period.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Switch 
                                id={`switch-${period.type}`}
                                checked={leavePeriods[period.type].enabled}
                                onCheckedChange={(checked) => updateLeavePeriod(period.type, 'enabled', checked)}
                            />
                        </div>
                        {leavePeriods[period.type].enabled && (
                            <div className='space-y-4 pt-2'>
                                <div className='space-y-2'>
                                    <div className='flex justify-between items-center'>
                                            <Label className='text-xs'>Wiek rozpoczęcia:</Label>
                                            <span className='text-xs font-bold'>{leavePeriods[period.type].startAge} lat</span>
                                    </div>
                                    <Slider
                                        min={age}
                                        max={retireYear - birthYear}
                                        step={1}
                                        value={[leavePeriods[period.type].startAge]}
                                        onValueChange={(val) => updateLeavePeriod(period.type, 'startAge', val[0])}
                                    />
                                </div>
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
                            </div>
                        )}
                    </div>
                ))}
             </div>
             <div className="mt-4">
                <h3 className="font-headline text-xl text-primary mb-4">Przebieg kariery zawodowej</h3>
                <CareerMonthsVisualizer 
                    periods={careerPeriodsForVisualizer}
                    startYear={startWorkYear} 
                    retirementYear={retireYear}
                />
            </div>
        </div>
      </div>
      
      <div className="p-6 border rounded-lg bg-card shadow-sm mt-8">
        <h3 className="font-headline text-xl text-primary mb-4">Wybierz wariant prognozy</h3>
        <div className="flex gap-2">
            <Button variant={wariant === 1 ? 'default' : 'outline'} onClick={() => setWariant(1)}>Pośredni</Button>
            <Button variant={wariant === 2 ? 'default' : 'outline'} onClick={() => setWariant(2)}>Pesymistyczny</Button>
            <Button variant={wariant === 3 ? 'default' : 'outline'} onClick={() => setWariant(3)}>Optymistyczny</Button>
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
