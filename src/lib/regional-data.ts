'use client';

// Mock data, in a real app this would come from a database or API
const regionalData = {
    'warszawski': { county: 'm. st. Warszawa', avgPension: 3100 },
    'krakowski': { county: 'm. Kraków', avgPension: 2950 },
    'poznański': { county: 'm. Poznań', avgPension: 2800 },
    'wrocławski': { county: 'm. Wrocław', avgPension: 2850 },
    'gdański': { county: 'm. Gdańsk', avgPension: 2900 },
    'szczeciński': { county: 'm. Szczecin', avgPension: 2700 },
    'bydgoski': { county: 'm. Bydgoszcz', avgPension: 2600 },
    'lubelski': { county: 'm. Lublin', avgPension: 2400 },
    'białostocki': { county: 'm. Białystok', avgPension: 2300 },
    'katowicki': { county: 'm. Katowice', avgPension: 3000 },
    'łódzki': { county: 'm. Łódź', avgPension: 2750 },
    'opolski': { county: 'm. Opole', avgPension: 2650 },
    'rzeszowski': { county: 'm. Rzeszów', avgPension: 2500 },
    'toruński': { county: 'm. Toruń', avgPension: 2600 },
    'zielonogórski': { county: 'm. Zielona Góra', avgPension: 2550 },
};

// Simplified mapping of postcode prefixes to counties
const postcodeToCountyMap: { [key: string]: keyof typeof regionalData } = {
    '00': 'warszawski', '01': 'warszawski', '02': 'warszawski', '03': 'warszawski', '04': 'warszawski',
    '30': 'krakowski', '31': 'krakowski',
    '60': 'poznański', '61': 'poznański',
    '50': 'wrocławski', '51': 'wrocławski', '52': 'wrocławski', '53': 'wrocławski', '54': 'wrocławski',
    '80': 'gdański',
    '70': 'szczeciński', '71': 'szczeciński',
    '85': 'bydgoski',
    '20': 'lubelski',
    '15': 'białostocki',
    '40': 'katowicki',
    '90': 'łódzki', '91': 'łódzki', '92': 'łódzki', '93': 'łódzki', '94': 'łódzki',
    '45': 'opolski',
    '35': 'rzeszowski',
    '87': 'toruński',
    '65': 'zielonogórski',
};

export type RegionalData = {
    county: string;
    avgPension: number;
} | null;

export function getRegionalData(postcode: string): RegionalData {
    const prefix = postcode.substring(0, 2);
    const countyKey = postcodeToCountyMap[prefix];
    if (countyKey) {
        return regionalData[countyKey];
    }
    return null;
}
