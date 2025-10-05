
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function ShoppingSummaryContent() {
  const searchParams = useSearchParams();
  const totalCost = Number(searchParams.get('totalCost') || 0);
  const balance = Number(searchParams.get('balance') || 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Na co to wystarcza', href: '/na-co-wystarcza' },
        { label: 'Podsumowanie zakupów' }
      ]} />
      <main className="flex-grow w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full text-center shadow-xl">
          <CardHeader>
            <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="font-headline text-3xl text-primary mt-4">Zakupy zakończone!</CardTitle>
            <CardDescription>
              Oto podsumowanie Twoich miesięcznych wydatków. Zobacz, ile środków Ci pozostało.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><ShoppingBag className="h-4 w-4"/>Wydano</p>
                    <p className="text-2xl font-bold font-headline">{totalCost.toLocaleString('pl-PL')} zł</p>
                </div>
                 <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><Wallet className="h-4 w-4"/>Pozostało</p>
                    <p className="text-2xl font-bold font-headline">{balance.toLocaleString('pl-PL')} zł</p>
                </div>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                    <Link href="/na-co-wystarcza">Wróć do sklepu</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/symulacja">Nowa symulacja</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function ShoppingSummaryPage() {
    return (
        <Suspense fallback={<div>Ładowanie podsumowania...</div>}>
            <ShoppingSummaryContent />
        </Suspense>
    )
}
