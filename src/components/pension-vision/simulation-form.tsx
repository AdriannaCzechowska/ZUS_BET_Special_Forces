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

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  age: z.coerce.number().min(18, 'Wiek musi być większy niż 18 lat.').max(65, 'Wiek nie może przekraczać 65 lat.'),
  gender: z.enum(['K', 'M'], {
    required_error: 'Musisz wybrać płeć.',
  }),
  grossSalary: z.coerce.number().min(0, 'Wynagrodzenie nie może być ujemne.'),
  startYear: z.coerce
    .number()
    .min(1960, 'Rok rozpoczęcia pracy nie może być wcześniejszy niż 1960.')
    .max(currentYear, `Rok rozpoczęcia pracy nie może być w przyszłości.`),
  endYear: z.coerce.number().min(currentYear, 'Planowany rok zakończenia pracy nie może być w przeszłości.'),
  zusBalance: z.coerce.number().min(0, 'Środki nie mogą być ujemne.').optional(),
  initialCapital: z.coerce.number().min(0, 'Kapitał nie może być ujemny.').optional(),
  ofeBalance: z.coerce.number().min(0, 'Środki nie mogą być ujemne.').optional(),
  includeL4: z.boolean().default(false).optional(),
  workLonger: z.boolean().default(false).optional(),
  includeOFE: z.boolean().default(true).optional(),
}).refine(data => data.endYear > data.startYear, {
    message: "Rok zakończenia pracy musi być późniejszy niż rok rozpoczęcia.",
    path: ["endYear"],
}).refine(data => {
    const retirementAge = data.gender === 'K' ? 60 : 65;
    const retirementYearByAge = (currentYear - data.age) + retirementAge;
    // This is a simplified validation. A more precise one would use birth date.
    return data.endYear >= retirementYearByAge;
}, data => ({
    message: `Minimalny wiek emerytalny dla Twojej płci to ${data.gender === 'K' ? 60 : 65} lat.`,
    path: ["endYear"],
}));


export function SimulationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firestore, user } = useFirebase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      gender: 'K',
      grossSalary: 5000,
      startYear: currentYear - 3,
      endYear: currentYear + 35,
      includeL4: false,
      workLonger: false,
      includeOFE: true,
      zusBalance: 150000,
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
    
    // Mock output data, in a real app this would be calculated
    const prognozowanaEmerytura = values.grossSalary * 0.4;
    const kwotaUrealniona = prognozowanaEmerytura * 0.8;
    const przewidywanaStopaZastapienia = 0.38;

    const prognosisData = {
      userId: user.uid,
      timestamp: serverTimestamp(),
      kwotaZwaloryzowanychSkladek: values.zusBalance || 0,
      zwaloryzowanyKapitalPoczatkowy: values.initialCapital || 0,
      srodkiOFE: values.ofeBalance || 0,
      rokPrzechDzieNaEmeryture: values.endYear,
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
          Wypełnij poniższe pola, abyśmy mogli przygotować dla Ciebie szczegółową symulację emerytalną.
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
                        className="flex items-center space-x-4"
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
                    <FormLabel>Wynagrodzenie miesięczne brutto</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zusBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zwaloryzowane składki I filaru (opcjonalnie)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 150000" {...field} />
                    </FormControl>
                    <FormDescription>
                        Jeśli nie znasz tej kwoty, pozostaw pole puste.
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
                      <Input type="number" placeholder="np. 2010" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planowany rok zakończenia pracy</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="np. 2050" {...field} />
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
                          Zaznacz, jeśli symulacja ma uwzględnić statystyczną liczbę dni na zwolnieniu lekarskim.
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
                          Zaznacz, aby zasymulować pracę po osiągnięciu wieku emerytalnego.
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
