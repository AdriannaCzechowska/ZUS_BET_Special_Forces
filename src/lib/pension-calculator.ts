
export interface PensionInput {
  wiek: number;
  plec: 'K' | 'M';
  pensjaBrutto: number;
  rokRozpoczeciaPracy: number;
  rokPrzejsciaNaEmeryture: number;
  dodatkoweLataPracy: number;
  przerwyWLacznychMiesiacach: number;
  wariant: 1 | 2 | 3;
  employmentType: 'uop' | 'zlecenie' | 'b2b' | 'brak';
}

export interface PensionOutput {
  prognozowanaEmerytura: number;
  kwotaUrealniona: number;
  przewidywanaStopaZastapienia: number;
}

// Średnie dalsze trwanie życia (2025, tablice GUS)
const lifeExpectancy = {
  K: { '60': 266, '61': 258, '62': 250, '63': 242, '64': 234, '65': 226 },
  M: { '65': 209, '66': 202, '67': 195, '68': 188, '69': 181, '70': 174 },
};

// Stałe ogólne
const SKLADKA_EMERYTALNA_RATE = 0.1952;
const BONUS_ZA_DLUZSZA_PRACE = 1.02; // realistyczny efekt wydłużenia pracy
const MINIMALNA_PODSTAWA_B2B = 4694.40;

// Parametry wg wariantów ZUS FUS20
const VARIANT_PARAMS = {
  1: { // pośredni
    ROCZNA_WALORYZACJA_SKLADEK: 1.059,
    FUTURE_INFLATION_RATE: 0.025,
    ROCZNY_WZROST_PENSJI: 1.034,
    SCIAGALNOSC_SKLADEK: 0.99,
  },
  2: { // pesymistyczny
    ROCZNA_WALORYZACJA_SKLADEK: 1.055,
    FUTURE_INFLATION_RATE: 0.025,
    ROCZNY_WZROST_PENSJI: 1.030,
    SCIAGALNOSC_SKLADEK: 0.98,
  },
  3: { // optymistyczny
    ROCZNA_WALORYZACJA_SKLADEK: 1.062,
    FUTURE_INFLATION_RATE: 0.025,
    ROCZNY_WZROST_PENSJI: 1.037,
    SCIAGALNOSC_SKLADEK: 0.995,
  },
};

export function calculatePension(input: PensionInput): PensionOutput {
  const {
    wiek,
    plec,
    pensjaBrutto: initialPensjaBrutto,
    rokRozpoczeciaPracy,
    rokPrzejsciaNaEmeryture,
    dodatkoweLataPracy,
    przerwyWLacznychMiesiacach,
    wariant,
    employmentType,
  } = input;

  let pensjaBrutto = initialPensjaBrutto;
  let skladkaRate = SKLADKA_EMERYTALNA_RATE;

  switch (employmentType) {
    case 'uop':
    case 'zlecenie':
      // Użyj pensji brutto podanej przez użytkownika
      skladkaRate = 0.1952;
      break;
    case 'b2b':
      // Użyj stałej podstawy dla B2B, ale nie niższej niż minimum
      pensjaBrutto = Math.max(5203.80, MINIMALNA_PODSTAWA_B2B);
      skladkaRate = 0.1952;
      break;
    case 'brak':
      // Brak składek
      pensjaBrutto = 0;
      skladkaRate = 0;
      break;
  }


  const params = VARIANT_PARAMS[wariant];
  const currentYear = new Date().getFullYear();

  const lataPracyDoEmerytury = rokPrzejsciaNaEmeryture - currentYear;
  const lataPracyHistoryczne = currentYear - rokRozpoczeciaPracy;
  const laczneLataPracy =
    lataPracyHistoryczne + lataPracyDoEmerytury + dodatkoweLataPracy;

  const efektywneLataPracy = laczneLataPracy - przerwyWLacznychMiesiacach / 12;

  // 1️⃣ Kapitał zgromadzony z waloryzacją i ściągalnością składek
  const rocznaSkladka =
    pensjaBrutto * 12 * skladkaRate * params.SCIAGALNOSC_SKLADEK;
  let totalCapital = 0;

  for (let i = 0; i < efektywneLataPracy; i++) {
    totalCapital = (totalCapital * params.ROCZNA_WALORYZACJA_SKLADEK) + rocznaSkladka;
  }

  // 2️⃣ Bonus za dłuższą pracę
  if (dodatkoweLataPracy > 0) {
    totalCapital *= Math.pow(BONUS_ZA_DLUZSZA_PRACE, dodatkoweLataPracy);
  }

  // 3️⃣ Średnie dalsze trwanie życia (miesiące)
  const retirementAge = (plec === 'K' ? 60 : 65) + dodatkoweLataPracy;
  // @ts-ignore
  const monthsOfLifeExpectancy = lifeExpectancy[plec][retirementAge.toString()] || (plec === 'K' ? 226 : 209);

  const prognozowanaEmerytura = totalCapital / monthsOfLifeExpectancy;

  // 4️⃣ Urealnienie o inflację do roku przejścia na emeryturę
  const lataDoEmerytury = rokPrzejsciaNaEmeryture - currentYear;
  const skumulowanaInflacja = Math.pow(
    1 + params.FUTURE_INFLATION_RATE,
    lataDoEmerytury
  );
  const kwotaUrealniona = prognozowanaEmerytura / skumulowanaInflacja;

  // 5️⃣ Ostatnie wynagrodzenie przed emeryturą
  const ostatniaPensja = initialPensjaBrutto * Math.pow(params.ROCZNY_WZROST_PENSJI, lataDoEmerytury);
  const przewidywanaStopaZastapienia =
    ostatniaPensja > 0 ? kwotaUrealniona / ostatniaPensja : 0;

  return {
    prognozowanaEmerytura: Math.round(prognozowanaEmerytura),
    kwotaUrealniona: Math.round(kwotaUrealniona),
    przewidywanaStopaZastapienia: parseFloat(przewidywanaStopaZastapienia.toFixed(3)),
  };
}
