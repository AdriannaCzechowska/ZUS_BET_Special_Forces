"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PensionInput() {
  const [amount, setAmount] = useState("");

  return (
    <Card className="overflow-hidden shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl">
          Jaką emeryturę chcesz otrzymywać?
        </CardTitle>
        <CardDescription>
          Wpisz kwotę netto („na rękę”), którą chciałbyś otrzymywać co miesiąc na emeryturze, aby rozpocząć symulację.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col sm:flex-row gap-4"
          onSubmit={(e) => e.preventDefault()}
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
        </form>
      </CardContent>
    </Card>
  );
}
