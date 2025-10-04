'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase } from 'lucide-react';
import { salaryData, regions, positions } from '@/lib/data/salary-data';

const formSchema = z.object({
  region: z.string().min(1, { message: 'Proszę wybrać województwo.' }),
  position: z.string().min(1, { message: 'Proszę wybrać stanowisko.' }),
});

type FormData = z.infer<typeof formSchema>;

interface SalaryResult {
  region: string;
  position: string;
  salary: number;
}

export function SalaryChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: '',
      position: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`/api/average-salary?position=${data.position}&region=${data.region}`);
      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych. Spróbuj ponownie.');
      }
      const salaryResult = await response.json();
      setResult(salaryResult);
    } catch (e: any) {
      setError(e.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Sprawdź średnie wynagrodzenie
        </CardTitle>
        <CardDescription>
          Wybierz województwo i stanowisko, aby zobaczyć orientacyjne średnie zarobki brutto w danym regionie.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Województwo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz województwo..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stanowisko</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz stanowisko..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions.map(pos => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sprawdź
            </Button>
          </form>
        </Form>

        {error && (
          <div className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        {result && (
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Średnie wynagrodzenie brutto dla stanowiska</p>
                    <p className="font-bold text-lg">{result.position}</p>
                    <p className="text-sm text-muted-foreground">w województwie {result.region}</p>
                    <p className="text-4xl font-bold font-headline text-primary mt-2">
                        {result.salary.toLocaleString('pl-PL')} PLN
                    </p>
                </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
