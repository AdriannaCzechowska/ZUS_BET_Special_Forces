"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import Link from "next/link";
import { Label } from "../ui/label";

export function PensionInput() {
  const [amount, setAmount] = useState("");
  const router = useRouter();

  const handleGoToSimulation = () => {
    const params = new URLSearchParams();
    if (amount) {
      params.set('expectedPension', amount);
    }
    router.push(`/symulacja?${params.toString()}`);
  };

  return (
    <Card className="overflow-hidden shadow-none border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="font-bold text-2xl md:text-3xl">
            Jaką emeryturę chcesz otrzymywać?
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" aria-label="Więcej informacji o obliczaniu emerytury przez ZUS">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-bold text-2xl">Jak ZUS oblicza emeryturę?</DialogTitle>
                <DialogDescription className="text-base pt-4 text-left">
                  Twoja emerytura = (zwaloryzowany kapitał początkowy + zwaloryzowane składki I filaru + środki z subkonta/OFE) ÷ przewidywane dalsze trwanie życia (w miesiącach wg GUS).
                </DialogDescription>
              </DialogHeader>
              <Button variant="link" asChild className="p-0 justify-start -mt-2">
                  <Link href="#">Dowiedz się więcej o waloryzacji składek</Link>
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Wpisz kwotę netto („na rękę”), którą chciałbyś otrzymywać co miesiąc na emeryturze, aby rozpocząć symulację.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-grow">
            <Label htmlFor="pension-amount-input" className="sr-only">Docelowa kwota emerytury</Label>
            <Input
              id="pension-amount-input"
              type="number"
              min="0"
              placeholder="np. 4500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-16 text-lg h-14 rounded-md"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground font-semibold" aria-hidden="true">
              PLN
            </span>
          </div>
          <Button
            size="lg"
            className="rounded-md text-lg py-7 sm:py-4 bg-accent text-black font-bold hover:bg-accent/90"
            aria-label="Przejdź do szczegółowej symulacji emerytalnej"
            onClick={handleGoToSimulation}
          >
            Przejdź do symulacji
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
