"use client";
import { useState, useEffect, useCallback } from 'react';

const facts: string[] = [
  "Najwyższa emerytura w Polsce (ponad 43 000 zł brutto) jest efektem 62 lat pracy bez ani jednego dnia na zwolnieniu lekarskim.",
  "Średni Polak spędza 36 dni na L4 w ciągu całej kariery. Każdy taki okres obniża wysokość kapitału i przyszłego świadczenia.",
  "Do otrzymania emerytury minimalnej wymagany staż pracy to 20 lat dla kobiet i 25 lat dla mężczyzn.",
  "Wiek emerytalny w Polsce (60 lat dla kobiet, 65 dla mężczyzn) jest jednym z niższych w Unii Europejskiej.",
  "Przejście na emeryturę zaledwie rok później może zwiększyć Twoje miesięczne świadczenie nawet o 10-15%.",
  "Osoby prowadzące działalność gospodarczą często otrzymują niższe emerytury ze względu na opłacanie składek od minimalnej podstawy.",
  "Kapitał początkowy, czyli odtworzona historia składek sprzed 1999 roku, ma kluczowe znaczenie dla wysokości emerytury osób urodzonych przed 1949 r."
];

export function useDailyFact() {
  const [fact, setFact] = useState<string>('');

  const getNewFact = useCallback(() => {
    let newFact;
    do {
      newFact = facts[Math.floor(Math.random() * facts.length)];
    } while (newFact === fact); // Ensure the new fact is different from the current one
    setFact(newFact);
  }, [fact]);

  useEffect(() => {
    getNewFact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return { fact, refreshFact: getNewFact };
}
