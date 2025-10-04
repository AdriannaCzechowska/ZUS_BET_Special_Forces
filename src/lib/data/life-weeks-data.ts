export const lifeWeeksConfig = {
  "weeksPerYear": 52,
  "retirementAge": { "F": 60, "M": 65 },
  "retirementAgeRange": { "min": 55, "max": 70 },
  "avgWagePLN_2025": 8749,
  "valorizationAssumptionPct": 3.0,
  "iiiPillar": {
    "defaultMonthlyPPK_pln": 200,
    "expectedAnnualReturnPct": 3.5
  },
  "colors": {
    "cta": "rgb(255,179,79)",
    "active": "rgb(0,153,63)",
    "reduced": "rgb(240,94,94)",
    "neutral": "rgb(190,195,206)",
    "tier3": "rgb(63,132,210)"
  },
  "ui": {
    "allowManualInput": true,
    "allowSliders": true,
    "wcag": "2.0"
  },
  "formulas": {
    "weeksToRetirement": "weeksPerYear * (retirementAge[sex] - currentAge)",
    "contributionFactorMeaning": "1.0 = pełne składki jak etat; 0.0 = brak składek; wartości pośrednie = składki od niższej podstawy",
    "tier3MonthlyToPension": "kapital_III / miesiace_trwania_zycia (tablice GUS)"
  }
};

export const eventsImpact = [
  {
    "id": "studies",
    "emoji": "🎓",
    "name": "Studia (brak składek)",
    "description": "Okres nauki bez składek emerytalnych.",
    "durationWeeksDefault": 156,
    "contributionFactor": 0.0,
    "editable": true
  },
  {
    "id": "pregnancy_L4",
    "emoji": "👶",
    "name": "Zwolnienie lekarskie w ciąży",
    "description": "Zasiłek chorobowy nie powiększa kapitału emerytalnego.",
    "durationWeeksDefault": 26,
    "contributionFactor": 0.0,
    "editable": true
  },
  {
    "id": "maternity_parental",
    "emoji": "🍼",
    "name": "Urlop macierzyński i rodzicielski",
    "description": "Składki finansowane z budżetu państwa od podstawy zasiłku.",
    "durationWeeksDefault": 52,
    "contributionFactor": 0.8,
    "editable": true
  },
  {
    "id": "childcare_leave",
    "emoji": "🧸",
    "name": "Urlop wychowawczy",
    "description": "Składki od minimalnej podstawy. Model: 60% przeciętnego wynagrodzenia.",
    "durationWeeksDefault": 52,
    "contributionFactorRule": "min( (0.60*avgWagePLN_2025)/userWage, 0.4 )",
    "contributionFactor": 0.35,
    "editable": true
  },
  {
    "id": "unpaid_leave",
    "emoji": "⚪",
    "name": "Urlop bezpłatny",
    "description": "Przerwa bez składek.",
    "durationWeeksDefault": 4,
    "contributionFactor": 0.0,
    "editable": true
  },
  {
    "id": "long_L4",
    "emoji": "🤒",
    "name": "Długotrwałe L4",
    "description": "Dłuższa niezdolność do pracy – brak składek.",
    "durationWeeksDefault": 8,
    "contributionFactor": 0.0,
    "editable": true
  },
  {
    "id": "b2b_full",
    "emoji": "💼",
    "name": "Działalność gospodarcza – pełny ZUS",
    "description": "Składki niezależne od dochodu, przy niższych zarobkach efektywnie ~60% etatu.",
    "durationWeeksDefault": 260,
    "contributionFactor": 0.6,
    "editable": true
  },
  {
    "id": "b2b_preferential",
    "emoji": "💼",
    "name": "Działalność – preferencyjny ZUS",
    "description": "Preferencyjna podstawa przez 24 mies. – dużo niższe składki.",
    "durationWeeksDefault": 104,
    "contributionFactor": 0.3,
    "editable": true
  },
  {
    "id": "contract_of_mandate_no_pension",
    "emoji": "📄",
    "name": "Umowa zlecenie bez składek emerytalnych",
    "description": "Zlecenie bez E+R – brak odkładania w tym okresie.",
    "durationWeeksDefault": 26,
    "contributionFactor": 0.0,
    "editable": true
  },
  {
    "id": "work_abroad_no_PL",
    "emoji": "✈️",
    "name": "Praca za granicą (bez składek w PL)",
    "description": "Pauza w polskich składkach.",
    "durationWeeksDefault": 52,
    "contributionFactor": 0.0,
    "editable": true
  },
  {
    "id": "ppk_start",
    "emoji": "💰",
    "name": "Start III filaru (PPK/IKE/IKZE)",
    "description": "Dodatkowe oszczędzanie. Domyślnie 200 PLN/mies., stopa 3.5%/rok.",
    "durationWeeksDefault": 520,
    "tier3Monthly_pln": 200,
    "tier3ReturnPct": 3.5,
    "editable": true
  }
];

export const lifeWeeksUI = {
  "leftPanel": {
    "title": "Zdarzenia życiowe",
    "showToggles": true,
    "showSliders": true
  },
  "rightPanel": {
    "title": "Twoje życie do emerytury (w tygodniach)",
    "legend": [
      { "label": "Pełne składki", "color": "rgb(0,153,63)" },
      { "label": "Obniżone/świadczenia", "color": "rgb(240,94,94)" },
      { "label": "Brak składek", "color": "rgb(190,195,206)" },
      { "label": "Oszczędzanie III filar", "color": "rgb(63,132,210)" }
    ],
    "tooltipTemplate": "Tydzień {{weekIndex}}: {{eventName}} – współczynnik składkowy {{factor}}"
  },
  "controls": {
    "retirementAgeSlider": { "min": 55, "max": 70, "step": 1 },
    "targetPensionInput": { "min": 1000, "max": 10000, "step": 50 }
  }
};

export const lifeWeeksExamples = {
  "female_1999_demo": {
    "dob": "1999-06-01",
    "sex": "F",
    "retirementAge": 60,
    "currentAgeComputed": 26,
    "weeksLived": 1352,
    "weeksToRetirement": 1768,
    "activeEvents": ["ppk_start", "maternity_parental", "childcare_leave"],
    "notes": "Rekord poglądowy do QA komponentu."
  }
};
