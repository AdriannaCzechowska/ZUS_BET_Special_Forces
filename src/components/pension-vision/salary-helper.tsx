'use client';

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import { regions, positions } from '@/lib/data/salary-data';
import { NATIONAL_AVERAGE_SALARY, MINIMUM_WAGE } from '@/lib/constants';

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

interface SalaryHelperProps {
  // eslint-disable-next-line no-unused-vars
  onSalarySelect: (salary: number) => void;
}

export function SalaryHelper({ onSalarySelect }: SalaryHelperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: '',
      position: '',
    },
  });

  const handleQuickSet = (salary: number) => {
    onSalarySelect(salary);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/average-salary?position=${data.position}&region=${data.region}`);
      if (!response.ok) {
        throw new Error('Nie udało się pobrać danych. Spróbuj ponownie.');
      }
      const salaryResult: SalaryResult = await response.json();
      onSalarySelect(salaryResult.salary);
    } catch (e: any) {
      setError(e.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-muted/40 border-dashed">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <h4 className="font-semibold text-sm">Szybkie uzupełnienie</h4>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleQuickSet(MINIMUM_WAGE)}>
                Płaca minimalna
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleQuickSet(NATIONAL_AVERAGE_SALARY)}>
                Średnia krajowa
            </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Województwo..." />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Stanowisko..." />
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
            <Button type="submit" disabled={isLoading} size="sm" className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Wstaw średnią dla stanowiska
            </Button>
          </form>
        </Form>
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}
