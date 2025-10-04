'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { addDocumentNonBlocking, useFirebase } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { calculatePension, type PensionInput } from '@/lib/pension-calculator';

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  age: z.coerce.number().min(18, 'Wiek musi być większy niż 18 lat.').max(100, 'Wiek nie może przekraczać 100 lat.'),
  gender: z.enum(['K', 'M'], {
    required_error: 'Musisz wybrać płeć.',
  }),
  grossSalary: z.coerce.number().min(0, 'Wynagrodzenie nie może być ujemne.'),
  startYear: z.coerce
    .number()
    .min(1960, 'Rok rozpoczęcia pracy nie może być wcześniejszy niż 1960.')
    .max(currentYear, `Rok rozpoczęcia pracy nie może być w przyszłości.`),
  retirementYear: z.coerce.number().min(currentYear, 'Planowany rok zakończenia pracy nie może być w przeszłości.'),
  zusContributions: z.coerce.number().min(0, 'Środki nie mogą być ujemne.').optional(),
  initialCapital: z.coerce.number().min(0, 'Kapitał nie może być ujemny.').optional(),
  ofeBalance: z.coerce.number().min(0, 'Środki nie mogą być ujemne.').optional(),
  includeL4: z.boolean().default(false).optional(),
  workLonger: z.boolean().default(false).optional(),
  includeOFE: z.boolean().default(true).optional(),
}).refine(data => data.retirementYear > data.startYear, {
    message: "Rok zakończenia pracy musi być późniejszy niż rok rozpoczęcia.",
    path: ["retirementYear"],
}).refine(data => {
    const retirementAge = data.gender === 'K' ? 60 : 65;
    const birthYear = currentYear - data.age;
    const retirementYearByAge = birthYear + retirementAge;
    return data.retirementYear >= retirementYearByAge;
}, data => ({
    message: `Minimalny wiek emerytalny dla Twojej płci to ${data.gender === 'K' ? 60 : 65} lat, co w Twoim przypadku oznacza przejście na emeryturę najwcześniej w ${currentYear - data.age + (data.gender === 'K' ? 60 : 65)}.`,
    path: ["retirementYear"],
}));


export function SimulationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firestore, user } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      gender: 'K',
      grossSalary: 6000,
      startYear: currentYear - 5,
      retirementYear: currentYear + 30,
      includeL4: false,
      workLonger: false,
      includeOFE: true,
      zusContributions: 150000,
      initialCapital: 30000,
      ofeBalance: 20000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie można zapisać symulacji. Użytkownik niezalogowany.",
      });
      return;
    }
    
    const calculationInput: PensionInput = {
      kwotaZwaloryzowanychSkladek: values.zusContributions || 0,
      zwaloryzowanyKapitalPoczatkowy: values.initialCapital || 0,
      srodkiOFE: values.ofeBalance || 0,
      wiek: values.age,
      plec: values.gender,
      uwzglednijOFE: values.includeOFE || false,
    };

    const { prognozowanaEmerytura, kwotaUrealniona, przewidywanaStopaZastapienia } = calculatePension(calculationInput);


    const prognosisData = {
      userId: user.uid,
      timestamp: serverTimestamp(),
      kwotaZwaloryzowanychSkladek: values.zusContributions || 0,
      zwaloryzowanyKapitalPoczatkowy: values.initialCapital || 0,
      srodkiOFE: values.ofeBalance || 0,
      rokPrzechodzeniaNaEmeryture: values.retirementYear,
      wiek: values.age,
      plec: values.gender,
      scenariuszPracaDluzej: values.workLonger || false,
      prognozowanaEmerytura,
      kwotaUrealniona,
      przewidywanaStopaZastapienia,
      podwyzszonyWiek: null, // Placeholder
      uwzglednijOFE: values.includeOFE || false,
    };
    
    try {
      const prognosesCol = collection(firestore, `users/${user.uid}/emeryturaPrognoses`);
      const docRef = await addDocumentNonBlocking(prognosesCol, prognosisData);
      
      toast({
        title: "Symulacja zapisana!",
        description: "Twoje wyniki są gotowe. Przekierowuję...",
      });

      const params = new URLSearchParams();
      params.set('id', docRef.id);
      params.set('realPension', prognozowanaEmerytura.toString());
      params.set('realisticPension', kwotaUrealniona.toString());
      params.set('replacementRate', (przewidywanaStopaZastapienia * 100).toString());
      params.set('pensionWithoutL4', (prognozowanaEmerytura * 1.05).toString()); // Mock value
      const expectedPension = searchParams.get('expectedPension');
      if (expectedPension) {
          params.set('expectedPension', expectedPension);
      }

      router.push(`/wyniki?${params.toString()}`);

    } catch (e) {
      // Error is handled by the non-blocking update function via the global error emitter
    }
  }

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl">Formularz symulacji</CardTitle>
        <CardDescription>
          Wypełnij poniższe pola, abyśmy mogli przygotować dla Ciebie szczegółową symulację emerytalną. Im więcej danych podasz, tym dokładniejszy będzie wynik.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Obecny wiek</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Płeć</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="K" />
                          </FormControl>
                          <FormLabel className="font-normal">Kobieta</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="M" />
                          </FormControl>
                          <FormLabel className="font-normal">Mężczyzna</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grossSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Obecne wynagrodzenie miesięczne brutto</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 6000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zusContributions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zwaloryzowane składki I filaru (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 150000" {...field} />
                    </FormControl>
                    <FormDescription>
                        Dane znajdziesz w Informacji o Stanie Konta Ubezpieczonego w ZUS (IOKU).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initialCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zwaloryzowany kapitał początkowy (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 30000" {...field} />
                    </FormControl>
                      <FormDescription>
                        Dotyczy osób, które pracowały przed 1999 r.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ofeBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Środki z OFE / subkonta (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 20000" {...field} />
                    </FormControl>
                     <FormDescription>
                        Suma środków na subkoncie w ZUS i rachunku w OFE.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rok rozpoczęcia pracy</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 2015" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retirementYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planowany rok przejścia na emeryturę</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 2055" {...field} />
                    </FormControl>
                    <FormDescription>
                        Symulacja zakłada pracę do końca stycznia danego roku.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
               <FormField
                  control={form.control}
                  name="includeOFE"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Uwzględnij środki z OFE / subkonta
                        </FormLabel>
                        <FormDescription>
                           Zaznacz, aby do symulacji wliczyć środki zgromadzone w Otwartym Funduszu Emerytalnym i na subkoncie ZUS.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              <FormField
                  control={form.control}
                  name="includeL4"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Uwzględnij potencjalne zwolnienia L4
                        </FormLabel>
                        <FormDescription>
                          Zaznacz, jeśli symulacja ma uwzględnić statystyczną liczbę dni na zwolnieniu lekarskim w przyszłości.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="workLonger"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Scenariusz "Pracuj dłużej"
                        </FormLabel>
                        <FormDescription>
                          Zaznacz, aby zasymulować pracę o 1 rok dłużej po osiągnięciu ustawowego wieku emerytalnego.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
            </div>
            <Button type="submit" size="lg" className="w-full">Oblicz symulację</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
