"use client";
import { useState, useEffect, useCallback } from 'react';

const facts: string[] = [
  "Najwyższa emerytura w Polsce wypłacana przez ZUS wynosi ponad 43 000 zł brutto. Otrzymuje ją mieszkaniec województwa śląskiego.",
  "Średni Polak spędza 36 dni na L4 w ciągu całej kariery zawodowej. Każdy taki okres może wpłynąć na obniżenie przyszłego świadczenia.",
  "Aby otrzymać emeryturę minimalną, kobieta musi udowodnić 20 lat stażu pracy, a mężczyzna 25 lat.",
  "Wiek emerytalny w Polsce jest jednym z niższych w Europie i wynosi 60 lat dla kobiet oraz 65 lat dla mężczyzn.",
  "Przejście na emeryturę o rok później może zwiększyć świadczenie nawet o 10-15%.",
];

export function useDailyFact() {
  const [fact, setFact] = useState<string>('');

  const getNewFact = useCallback(() => {
    const newFact = facts[Math.floor(Math.random() * facts.length)];
    setFact(newFact);
  }, []);

  useEffect(() => {
    getNewFact();
  }, [getNewFact]);

  return { fact, refreshFact: getNewFact };
}
