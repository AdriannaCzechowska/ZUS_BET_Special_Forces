
'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, Wallet, Home, Zap, Droplets, Trash, Flame, Wifi, Smartphone, Tv, ShoppingBasket, Cigarette, Pill, Stethoscope, Shirt, Plane, Gift, Refrigerator, SprayCan, Clapperboard, BookOpen, Gamepad, Fuel, ShieldCheck, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

// This list should be kept in sync with the one on `na-co-wystarcza` page
const allProducts: Product[] = [
    { id: 'rent', name: 'Czynsz', price: 700, icon: <Home className="h-8 w-8" /> },
    { id: 'electricity', name: 'Prąd', price: 100, icon: <Zap className="h-8 w-8" /> },
    { id: 'water', name: 'Woda', price: 80, icon: <Droplets className="h-8 w-8" /> },
    { id: 'garbage', name: 'Śmieci', price: 100, icon: <Trash className="h-8 w-8" /> },
    { id: 'gas', name: 'Gaz', price: 80, icon: <Flame className="h-8 w-8" /> },
    { id: 'internet', name: 'Internet', price: 50, icon: <Wifi className="h-8 w-8" /> },
    { id: 'mobile', name: 'Abonament komórkowy', price: 30, icon: <Smartphone className="h-8 w-8" /> },
    { id: 'tv', name: 'Telewizja', price: 30, icon: <Tv className="h-8 w-8" /> },
    { id: 'food', name: 'Jedzenie', price: 800, icon: <ShoppingBasket className="h-8 w-8" /> },
    { id: 'stimulants', name: 'Używki', price: 100, icon: <Cigarette className="h-8 w-8" /> },
    { id: 'meds', name: 'Leki', price: 300, icon: <Pill className="h-8 w-8" /> },
    { id: 'doctor', name: 'Prywatny lekarz', price: 200, icon: <Stethoscope className="h-8 w-8" /> },
    { id: 'clothes', name: 'Ubrania', price: 150, icon: <Shirt className="h-8 w-8" /> },
    { id: 'vacation', name: 'Wakacje', price: 1500, icon: <Plane className="h-8 w-8" /> },
    { id: 'grandchild', name: 'Prezent dla wnuka', price: 100, icon: <Gift className="h-8 w-8" /> },
    { id: 'phone', name: 'Telefon', price: 1500, icon: <Smartphone className="h-8 w-8" /> },
    { id: 'fridge', name: 'Lodówka', price: 2000, icon: <Refrigerator className="h-8 w-8" /> },
    { id: 'cosmetics', name: 'Kosmetyki', price: 150, icon: <SprayCan className="h-8 w-8" /> },
    { id: 'theatre_cinema', name: 'Teatr/Kino', price: 50, icon: <Clapperboard className="h-8 w-8" /> },
    { id: 'book', name: 'Książka', price: 60, icon: <BookOpen className="h-8 w-8" /> },
    { id: 'game', name: 'Gra komputerowa', price: 150, icon: <Gamepad className="h-8 w-8" /> },
    { id: 'fuel', name: 'Paliwo', price: 350, icon: <Fuel className="h-8 w-8" /> },
    { id: 'insurance', name: 'Ubezpieczenie', price: 150, icon: <ShieldCheck className="h-8 w-8" /> },
    { id: 'investment', name: 'Inwestycje', price: 200, icon: <TrendingUp className="h-8 w-8" /> },
];

function ShoppingSummaryContent() {
  const searchParams = useSearchParams();
  const totalCost = Number(searchParams.get('totalCost') || 0);
  const balance = Number(searchParams.get('balance') || 0);

  const purchasedItems = useMemo(() => {
    const cartParam = searchParams.get('cart');
    if (!cartParam) return [];
    try {
      const itemIds: string[] = JSON.parse(decodeURIComponent(cartParam));
      
      const itemCounts: Record<string, number> = itemIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(itemCounts).map(([id, count]) => {
          const product = allProducts.find(p => p.id === id);
          if (!product) return null;
          return {
              ...product,
              count
          }
      }).filter(Boolean) as (Product & { count: number })[];

    } catch (e) {
      console.error("Failed to parse cart items:", e);
      return [];
    }
  }, [searchParams]);

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
             <div>
                <h3 className="text-lg font-semibold mb-2 text-left">Twoje zakupy</h3>
                <div className="space-y-2 text-left max-h-60 overflow-y-auto pr-2">
                    {purchasedItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 rounded-md bg-background border">
                             <div>
                                <p className="text-sm font-medium">{item.name} {item.count > 1 ? `(x${item.count})` : ''}</p>
                                <p className="text-xs text-muted-foreground">{(item.price * item.count).toLocaleString('pl-PL')} zł</p>
                             </div>
                        </div>
                    ))}
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
