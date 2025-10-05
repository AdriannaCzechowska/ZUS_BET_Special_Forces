

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

const lifeExpectancy = {
  K: { '60': 266, '61': 258, '62': 250, '63': 242, '64': 234, '65': 226 },
  M: { '65': 209, '66': 202, '67': 195, '68': 188, '69': 181, '70': 174 },
};

const SKLADKA_EMERYTALNA_RATE = 0.1952;
const BONUS_ZA_DLUZSZA_PRACE = 1.02; 
const MINIMALNA_PODSTAWA_B2B = 4694.40;
const MINIMALNA_EMERYTURA = 1878.91;

const VARIANT_PARAMS = {
  1: { 
    ROCZNA_WALORYZACJA_SKLADEK: 1.059,
    FUTURE_INFLATION_RATE: 0.025,
    ROCZNY_WZROST_PENSJI: 1.034,
    SCIAGALNOSC_SKLADEK: 0.99,
  },
  2: { 
    ROCZNA_WALORYZACJA_SKLADEK: 1.055,
    FUTURE_INFLATION_RATE: 0.025,
    ROCZNY_WZROST_PENSJI: 1.030,
    SCIAGALNOSC_SKLADEK: 0.98,
  },
  3: { 
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
      skladkaRate = 0.1952;
      break;
    case 'b2b':
      pensjaBrutto = Math.max(5203.80, MINIMALNA_PODSTAWA_B2B);
      skladkaRate = 0.1952;
      break;
    case 'brak':
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

  const rocznaSkladka =
    pensjaBrutto * 12 * skladkaRate * params.SCIAGALNOSC_SKLADEK;
  let totalCapital = 0;

  for (let i = 0; i < efektywneLataPracy; i++) {
    totalCapital = (totalCapital * params.ROCZNA_WALORYZACJA_SKLADEK) + rocznaSkladka;
  }

  if (dodatkoweLataPracy > 0) {
    totalCapital *= Math.pow(BONUS_ZA_DLUZSZA_PRACE, dodatkoweLataPracy);
  }

  const retirementAge = (plec === 'K' ? 60 : 65) + dodatkoweLataPracy;
  // @ts-ignore
  const monthsOfLifeExpectancy = lifeExpectancy[plec][retirementAge.toString()] || (plec === 'K' ? 226 : 209);

  let prognozowanaEmerytura = totalCapital / monthsOfLifeExpectancy;

  const lataDoEmerytury = rokPrzejsciaNaEmeryture - currentYear;
  const skumulowanaInflacja = Math.pow(
    1 + params.FUTURE_INFLATION_RATE,
    lataDoEmerytury
  );
  let kwotaUrealniona = prognozowanaEmerytura / skumulowanaInflacja;

  const ostatniaPensja = initialPensjaBrutto * Math.pow(params.ROCZNY_WZROST_PENSJI, lataDoEmerytury);
  const przewidywanaStopaZastapienia =
    ostatniaPensja > 0 ? kwotaUrealniona / ostatniaPensja : 0;
  
  if (plec === 'K') {
    if (efektywneLataPracy >= 20 && wiek >= 60 && prognozowanaEmerytura < MINIMALNA_EMERYTURA) {
        prognozowanaEmerytura = MINIMALNA_EMERYTURA;
    }
  } else {
    if (efektywneLataPracy >= 25 && wiek >= 65 && prognozowanaEmerytura < MINIMALNA_EMERYTURA) {
        prognozowanaEmerytura = MINIMALNA_EMERYTURA;
    }
  }
  
  kwotaUrealniona = prognozowanaEmerytura / skumulowanaInflacja;

  return {
    prognozowanaEmerytura: Math.round(prognozowanaEmerytura),
    kwotaUrealniona: Math.round(kwotaUrealniona),
    przewidywanaStopaZastapienia: parseFloat(przewidywanaStopaZastapienia.toFixed(3)),
  };
}
