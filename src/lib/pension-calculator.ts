
export interface PensionInput {
    wiek: number;
    plec: 'K' | 'M';
    pensjaBrutto: number;
    rokRozpoczeciaPracy: number;
    rokPrzejsciaNaEmeryture: number;
    dodatkoweLataPracy: number; // 0 or more
    przerwyWLacznychMiesiacach: number; // total months of breaks
}

export interface PensionOutput {
    prognozowanaEmerytura: number;
    kwotaUrealniona: number;
    przewidywanaStopaZastapienia: number;
}

// Dane z tablic GUS dotyczących średniego dalszego trwania życia (2025)
const lifeExpectancy = {
    K: {
        '60': 266,
        '61': 258,
        '62': 250,
        '63': 242,
        '64': 234,
        '65': 226,
    },
    M: {
        '65': 209,
        '66': 202,
        '67': 195,
        '68': 188,
        '69': 181,
        '70': 174,
    }
}

const SKLADKA_EMERYTALNA_RATE = 0.1952;
const ROCZNA_WALORYZACJA_SKLADEK = 1.05; // Założenie 5% rocznie
const FUTURE_INFLATION_RATE = 0.025; // Założenie 2.5% rocznie
const BONUS_ZA_DLUZSZA_PRACE = 1.08; // 8% bonusu za każdy dodatkowy rok

export function calculatePension(input: PensionInput): PensionOutput {
    const { 
        wiek, 
        plec,
        pensjaBrutto,
        rokRozpoczeciaPracy,
        rokPrzejsciaNaEmeryture,
        dodatkoweLataPracy,
        przerwyWLacznychMiesiacach
    } = input;

    const lataPracyDoEmerytury = rokPrzejsciaNaEmeryture - new Date().getFullYear();
    const lataPracyHistoryczne = new Date().getFullYear() - rokRozpoczeciaPracy;
    const laczneLataPracy = lataPracyHistoryczne + lataPracyDoEmerytury + dodatkoweLataPracy;
    
    const laczneMiesiacePracy = laczneLataPracy * 12;
    const efektywneMiesiacePracy = laczneMiesiacePracy - przerwyWLacznychMiesiacach;

    // Uproszczone obliczenie kapitału
    let totalCapital = 0;
    const rocznaSkladka = pensjaBrutto * 12 * SKLADKA_EMERYTALNA_RATE;
    
    for (let i = 0; i < (efektywneMiesiacePracy / 12); i++) {
        totalCapital = (totalCapital + rocznaSkladka) * ROCZNA_WALORYZACJA_SKLADEK;
    }
    
    // Dodanie bonusu za dłuższą pracę
    if (dodatkoweLataPracy > 0) {
      totalCapital *= Math.pow(BONUS_ZA_DLUZSZA_PRACE, dodatkoweLataPracy);
    }

    const retirementAge = (plec === 'K' ? 60 : 65) + dodatkoweLataPracy;
    
    // @ts-ignore
    const monthsOfLifeExpectancy = lifeExpectancy[plec][retirementAge.toString()] || (plec === 'K' ? 266 : 209);
    
    const prognozowanaEmerytura = totalCapital / monthsOfLifeExpectancy;
    
    const lataDoEmerytury = rokPrzejsciaNaEmeryture - new Date().getFullYear();
    const skumulowanaInflacja = Math.pow(1 + FUTURE_INFLATION_RATE, lataDoEmerytury);

    const kwotaUrealniona = prognozowanaEmerytura / skumulowanaInflacja; 
    
    const ostatniaPensja = pensjaBrutto * Math.pow(1.03, lataDoEmerytury); // Założenie 3% wzrostu pensji rocznie
    const przewidywanaStopaZastapienia = ostatniaPensja > 0 ? prognozowanaEmerytura / ostatniaPensja : 0;

    return {
        prognozowanaEmerytura: isNaN(prognozowanaEmerytura) ? 0 : prognozowanaEmerytura,
        kwotaUrealniona: isNaN(kwotaUrealniona) ? 0 : kwotaUrealniona,
        przewidywanaStopaZastapienia: isNaN(przewidywanaStopaZastapienia) ? 0 : przewidywanaStopaZastapienia
    };
}
