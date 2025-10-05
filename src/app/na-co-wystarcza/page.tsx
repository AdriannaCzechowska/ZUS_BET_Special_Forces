'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useImmer } from 'use-immer';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Wallet, ShoppingCart, Trash2, Home, ShoppingBasket, Pill, Stethoscope, Shirt, Plane, Gift, Laptop, BookOpen, Zap, Droplets, Trash, Flame, Wifi, Smartphone, Tv, Cigarette, WashingMachine, Refrigerator, SprayCan, Clapperboard, Gamepad, Fuel, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

const products: Product[] = [
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

const singlePurchaseItems = new Set([
  'rent', 'electricity', 'water', 'garbage', 'gas', 'internet', 'mobile',
  'tv', 'food', 'vacation', 'phone', 'fridge', 'insurance', 'fuel'
]);

const mandatoryItems = new Set([
  'rent', 'electricity', 'water', 'garbage', 'gas', 'food'
]);


function ShoppingSimulator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const initialBalance = Number(searchParams.get('realisticPension') || '3500');

  const [balance, setBalance] = useImmer(initialBalance);
  const [cart, setCart] = useImmer<Product[]>([]);
  const balanceRef = useRef<HTMLParagraphElement>(null);

  const totalCost = cart.reduce((sum, item) => sum + item.price, 0);

  const triggerBalanceAnimation = () => {
    const el = balanceRef.current;
    if (el) {
      el.classList.remove('animate-balance-update');
      // void el.offsetWidth; // Trigger reflow
      setTimeout(() => {
          el.classList.add('animate-balance-update');
      }, 10)
    }
  }

  const addToCart = (product: Product) => {
    if (singlePurchaseItems.has(product.id) && cart.some(item => item.id === product.id)) {
      toast({
        variant: "destructive",
        title: "Produkt już w koszyku",
        description: `Możesz dodać "${product.name}" tylko raz.`,
      });
      return;
    }

    if (balance < product.price) {
      toast({
        variant: "destructive",
        title: "Brak środków",
        description: `Nie możesz dodać "${product.name}" do koszyka.`,
      });
      return;
    }
    setBalance(draft => draft - product.price);
    triggerBalanceAnimation();

    setCart(draft => {
      draft.push(product);
    });
    toast({
      title: "Dodano do koszyka",
      description: `${product.name} za ${product.price.toLocaleString('pl-PL')} zł.`,
    });
  };

  const removeFromCart = (productToRemove: Product, indexToRemove: number) => {
    setBalance(draft => draft + productToRemove.price);
    triggerBalanceAnimation();
    setCart(draft => {
      draft.splice(indexToRemove, 1);
    });
     toast({
      title: "Usunięto z koszyka",
      description: `${productToRemove.name} wrócił na półkę.`,
    });
  };
  
  const finishShopping = () => {
    const missingItems = Array.from(mandatoryItems).filter(
      (mandatoryId) => !cart.some((cartItem) => cartItem.id === mandatoryId)
    );

    if (missingItems.length > 0) {
      const missingItemNames = missingItems.map(id => products.find(p => p.id === id)?.name).join(', ');
      toast({
        variant: "destructive",
        title: 'Zapomniałeś o obowiązkowych opłatach!',
        description: `Nie zapłaciłeś za: ${missingItemNames}. Uzupełnij koszyk, aby kontynuować.`,
        duration: 5000,
      });
      return;
    }
    
    const cartItemsParam = encodeURIComponent(JSON.stringify(cart.map(item => item.id)));
    router.push(`/podsumowanie-zakupow?totalCost=${totalCost}&balance=${balance}&cart=${cartItemsParam}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[
        { label: 'Symulator emerytalny', href: '/' },
        { label: 'Na co to wystarcza' }
      ]} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0 text-base">
            <Link href="/symulacja">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do symulatora
            </Link>
          </Button>
        </div>

        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Na co wystarczy Twoja emerytura?
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
            Przekonaj się, jak wygląda siła nabywcza Twojej prognozowanej emerytury. Spróbuj zrobić miesięczne zakupy, dodając produkty do koszyka.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Półka sklepowa</CardTitle>
                <CardDescription>Kliknij produkt, aby dodać go do koszyka.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => {
                  const isSinglePurchase = singlePurchaseItems.has(product.id);
                  const isInCart = cart.some(item => item.id === product.id);
                  const isDisabled = isSinglePurchase && isInCart;

                  return (
                    <button 
                      key={product.id} 
                      onClick={() => addToCart(product)} 
                      disabled={isDisabled}
                      className="text-center p-4 border rounded-lg hover:bg-accent/80 hover:border-primary active:scale-95 transition-all flex flex-col items-center justify-between h-40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:bg-muted/50 disabled:cursor-not-allowed disabled:hover:bg-muted/50 disabled:scale-100"
                    >
                      <div className="text-primary">{product.icon}</div>
                      <div className="mt-2">
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.price.toLocaleString('pl-PL')} zł</p>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 lg:sticky lg:top-24">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet /> Portfel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Twoja urealniona emerytura</p>
                <p className="text-4xl font-bold font-headline text-primary">{initialBalance.toLocaleString('pl-PL')} zł</p>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground">Pozostało</p>
                <p ref={balanceRef} className="text-3xl font-bold">{balance.toLocaleString('pl-PL')} zł</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart /> Twój koszyk
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Koszyk jest pusty.</p>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex justify-between items-center bg-background/50 p-2 rounded-md animate-cart-item-in">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.price.toLocaleString('pl-PL')} zł</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item, index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Suma:</span>
                  <span>{totalCost.toLocaleString('pl-PL')} zł</span>
                </div>
                 <Button className="w-full mt-4" onClick={finishShopping} disabled={cart.length === 0}>
                    Zakończ zakupy
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}


export default function WhatIsItEnoughForPage() {
    return (
        <Suspense fallback={<div>Ładowanie...</div>}>
            <ShoppingSimulator />
        </Suspense>
    )
}
