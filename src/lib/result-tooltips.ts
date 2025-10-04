
export interface ResultTooltip {
  id: string;
  cardTitle: string;
  shortHint: string;
  tooltipTitle: string;
  tooltipBody: string[];
  formula: string;
  units: string;
  source: string;
  placeholders: Record<string, string>;
  notes: string[];
}

export const resultTooltips: Record<string, ResultTooltip> = {
  "wysokoscRzeczywista": {
    "id": "wysokoscRzeczywista",
    "cardTitle": "Wysokość rzeczywista",
    "shortHint": "Nominalna kwota pierwszej emerytury w roku przejścia.",
    "tooltipTitle": "Co to jest „wysokość rzeczywista”",
    "tooltipBody": [
      "To prognozowana miesięczna kwota brutto w roku przyznania emerytury. Nie korygujemy jej o przyszłą inflację – pokazuje wartość w cenach roku przejścia.",
      "Wyliczenie bazuje na systemie zdefiniowanej składki: zgromadzony kapitał (konto ZUS + subkonto/OFE + kapitał początkowy), po wszystkich waloryzacjach, dzielony przez prognozowane dalsze trwanie życia (miesiące) dla płci i wieku w tablicach GUS."
    ],
    "formula": "Emerytura<sub>nominalna</sub> = (Kapitał<sub>składki</sub> + Kapitał<sub>subkonto/OFE</sub> + Kapitał<sub>początkowy</sub>) &divide; Średnie dalsze trwanie życia<sub>w miesiącach</sub>",
    "units": "PLN/mies. brutto, ceny roku przejścia",
    "source": "FUS prognoza 2023–2080, tablice trwania życia GUS",
    "placeholders": {
      "display": "{{pension_nominal}} PLN"
    },
    "notes": [
      "Waloryzacje składek do roku przejścia uwzględnione.",
      "Kwota orientacyjna – rzeczywista decyzja następuje w momencie przyznania świadczenia."
    ]
  },
  "wysokoscUrealniona": {
    "id": "wysokoscUrealniona",
    "cardTitle": "Wysokość urealniona",
    "shortHint": "Ta sama emerytura przeliczona do dzisiejszej siły nabywczej.",
    "tooltipTitle": "Co to jest „wysokość urealniona”",
    "tooltipBody": [
      "To prognozowana emerytura nominalna zdyskontowana do cen roku bazowego (rok bieżący). Dzięki temu widzisz wartość w „dzisiejszych pieniądzach”.",
      "Do dyskontowania stosujemy ścieżkę CPI z wariantu bazowego FUS."
    ],
    "formula": "Emerytura<sub>realna (dziś)</sub> = Emerytura<sub>nominalna</sub> &divide; Skumulowany wskaźnik inflacji",
    "units": "PLN/mies. brutto, ceny roku bazowego",
    "source": "FUS prognoza CPI, wariant bazowy",
    "placeholders": {
      "display": "{{pension_real_today}} PLN"
    },
    "notes": [
      "Wynik zależy od założeń inflacyjnych – zmiana ścieżki CPI zmieni kwotę."
    ]
  },
  "stopaZastapienia": {
    "id": "stopaZastapienia",
    "cardTitle": "Stopa zastąpienia",
    "shortHint": "Udział pierwszej emerytury w ostatniej pensji.",
    "tooltipTitle": "Jak liczymy stopę zastąpienia",
    "tooltipBody": [
      "Porównujemy pierwszą emeryturę nominalną do ostatniego miesięcznego wynagrodzenia nominalnego tuż przed przejściem.",
      "Pokazuje, jaki procent Twojej ostatniej pensji pokryje pierwsza emerytura. W Polsce średnio ok. 40% dla nowych emerytur, ale trend jest malejący."
    ],
    "formula": "Stopa zastąpienia = (Emerytura<sub>nominalna</sub> &divide; Ostatnie wynagrodzenie<sub>nominalne</sub>) × 100%",
    "units": "%",
    "source": "FUS, GUS – wynagrodzenia; założenia projektu",
    "placeholders": {
      "display": "{{replacement_rate}} %"
    },
    "notes": [
      "Wariant alternatywny (realny) możliwy: E_real_t0 ÷ Wynagrodzenie_real_t0."
    ]
  },
  "wplywL4": {
    "id": "wplywL4",
    "cardTitle": "Wpływ zwolnień L4",
    "shortHint": "Różnica w emeryturze wynikająca z ujęcia statystycznych absencji.",
    "tooltipTitle": "Jak liczony jest wpływ L4",
    "tooltipBody": [
      "Zasiłek chorobowy nie jest oskładkowany składką emerytalną. W miesiącach absencji nie rośnie kapitał emerytalny.",
      "Symulujemy dwa przebiegi: (A) bez absencji, (B) z przeciętną liczbą dni L4 według płci i wieku. W wariancie (B) zmniejszamy roczne składki proporcjonalnie do udziału dni L4 w roku i ponownie liczymy emeryturę.",
      "Prezentowana kwota to różnica: ile niższa jest Twoja emerytura przy ujęciu statystycznych L4."
    ],
    "formula": "Różnica<sub>L4</sub> = Emerytura<sub>(bez L4)</sub> - Emerytura<sub>(z L4)</sub>",
    "units": "PLN/mies. brutto",
    "source": "Plik ‘pkt 4 i 5_absencja chorobowa.xlsx’, założenia projektu",
    "placeholders": {
      "display": "{{l4_impact_amount}} PLN",
      "deltaText": "Bez L4 byłoby +{{l4_delta}} PLN/mies."
    },
    "notes": [
      "Ujęcie uproszczone: redukcja składek proporcją dni L4/365.",
      "Rzeczywiste przepisy różnicują okresy wynagrodzenia chorobowego i zasiłku – w MVP stosujemy model uproszczony."
    ]
  },
  "porownanieDoSredniej": {
    "id": "porownanieDoSredniej",
    "cardTitle": "Porównanie do średniej",
    "shortHint": "Zestawienie z prognozowaną średnią emeryturą w roku przejścia.",
    "tooltipTitle": "Jak liczymy porównanie do średniej",
    "tooltipBody": [
      "Dzielimy Twoją prognozowaną emeryturę nominalną przez prognozowaną średnią emeryturę krajową w roku przejścia.",
      "Gdy podasz kod pocztowy, możemy dodatkowo pokazać relację do średniej dla Twojego powiatu."
    ],
    "formula": "Stosunek do średniej = Emerytura<sub>nominalna</sub> &divide; Średnia emerytura<sub>w kraju</sub>",
    "units": "PLN oraz %",
    "source": "FUS (średnie świadczenia), plik ‘pkt 6_emerytury_powiaty’ dla wariantu lokalnego",
    "placeholders": {
      "avgNational": "{{avg_pension_year_T}} PLN",
      "sharePct": "{{share_vs_avg}} %"
    },
    "notes": [
      "Wartości średnie pochodzą z projekcji i podlegają rewizjom."
    ]
  }
}
