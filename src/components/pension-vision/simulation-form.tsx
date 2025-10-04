'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
  gender: z.enum(['female', 'male'], {
    required_error: 'Musisz wybrać płeć.',
  }),
  grossSalary: z.coerce.number().min(0, 'Wynagrodzenie nie może być ujemne.'),
  startYear: z.coerce
    .number()
    .min(1960, 'Rok rozpoczęcia pracy nie może być wcześniejszy niż 1960.')
    .max(currentYear, `Rok rozpoczęcia pracy nie może być w przyszłości.`),
  endYear: z.coerce.number().min(currentYear, 'Planowany rok zakończenia pracy nie może być w przeszłości.'),
  zusBalance: z.coerce.number().min(0, 'Środki nie mogą być ujemne.').optional(),
  includeL4: z.boolean().default(false).optional(),
}).refine(data => data.endYear > data.startYear, {
    message: "Rok zakończenia pracy musi być późniejszy niż rok rozpoczęcia.",
    path: ["endYear"],
}).refine(data => {
    const retirementAge = data.gender === 'female' ? 60 : 65;
    const retirementYearByAge = (currentYear - data.age) + retirementAge;
    // This is a simplified validation. A more precise one would use birth date.
    return data.endYear >= retirementYearByAge;
}, data => ({
    message: `Minimalny wiek emerytalny dla Twojej płci to ${data.gender === 'female' ? 60 : 65} lat.`,
    path: ["endYear"],
}));


export function SimulationForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      gender: 'female',
      grossSalary: 5000,
      startYear: currentYear - 3,
      endYear: currentYear + 35,
      includeL4: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Symulacja zakończona!",
      description: "Twoje wyniki są gotowe. Przekierowuję...",
    });
    // Here you would typically pass the data to the results page
    // For now, we just navigate there
    router.push('/wyniki');
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
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Kobieta</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
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
                    <FormLabel>Środki na koncie i subkoncie ZUS (opcjonalnie)</FormLabel>
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
            <Button type="submit" size="lg" className="w-full">Oblicz symulację</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
