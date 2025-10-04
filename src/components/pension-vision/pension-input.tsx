"use client";

import { useState } from "react";
import Link from "next/link";
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

export function PensionInput() {
  const [amount, setAmount] = useState("");

  return (
    <Card className="overflow-hidden shadow-lg semitransparent-panel">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="font-headline text-2xl md:text-3xl">
            Jaką emeryturę chcesz otrzymywać?
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Jak ZUS oblicza emeryturę?</DialogTitle>
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
            <Input
              type="number"
              min="0"
              placeholder="np. 4500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-16 text-lg h-14 rounded-xl"
              aria-label="Docelowa kwota emerytury"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground font-semibold">
              PLN
            </span>
          </div>
          <Button
            size="lg"
            className="rounded-2xl text-lg py-7 sm:py-4 bg-accent text-accent-foreground hover:bg-accent/90"
            aria-label="Przejdź do szczegółowej symulacji emerytalnej"
            asChild
          >
            <Link href="/symulacja">Przejdź do symulacji</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
