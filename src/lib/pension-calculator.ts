
export interface PensionInput {
    kwotaZwaloryzowanychSkladek: number;
    zwaloryzowanyKapitalPoczatkowy: number;
    srodkiOFE: number;
    wiek: number;
    plec: 'K' | 'M';
    uwzglednijOFE: boolean;
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
    },
    M: {
        '65': 209,
    }
}

export function calculatePension(input: PensionInput): PensionOutput {
    const { 
        kwotaZwaloryzowanychSkladek, 
        zwaloryzowanyKapitalPoczatkowy, 
        srodkiOFE, 
        wiek, 
        plec,
        uwzglednijOFE 
    } = input;

    let totalCapital = kwotaZwaloryzowanychSkladek + zwaloryzowanyKapitalPoczatkowy;
    if (uwzglednijOFE) {
        totalCapital += srodkiOFE;
    }
    
    const retirementAge = plec === 'K' ? 60 : 65;
    
    // @ts-ignore
    const monthsOfLifeExpectancy = lifeExpectancy[plec][retirementAge.toString()] || (plec === 'K' ? 266 : 209);
    
    const prognozowanaEmerytura = totalCapital / monthsOfLifeExpectancy;

    // Uproszczone założenia, do rozbudowy w przyszłości
    const kwotaUrealniona = prognozowanaEmerytura * 0.8; // Założenie 20% inflacji skumulowanej
    const przewidywanaStopaZastapienia = 0.38; // Stała wartość do czasu implementacji dynamicznego liczenia

    return {
        prognozowanaEmerytura,
        kwotaUrealniona,
        przewidywanaStopaZastapienia
    };
}
