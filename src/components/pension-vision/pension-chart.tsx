"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"

const chartData = [
  { category: "Poniżej minimalnej", value: 1780.96, key: "minimalna" },
  { category: "Średnia obecna", value: 3845.54, key: "srednia" },
  { category: "Najwyższa w PL", value: 43412, key: "najwyzsza" },
]

const tooltips: Record<string, string> = {
  minimalna: "Świadczeniobiorcy z niską aktywnością zawodową (poniżej 20 lat dla kobiet, 25 lat dla mężczyzn), którzy nie nabyli prawa do gwarantowanej emerytury minimalnej.",
  srednia: "Aktualny średni poziom świadczeń emerytalnych w Polsce wypłacanych przez ZUS. Poziom ten jest mocno zróżnicowany regionalnie i w zależności od płci.",
  najwyzsza: "Najwyższa zarejestrowana emerytura w Polsce, wypłacana osobie, która pracowała przez ponad 62 lata bez przerw na zwolnienia lekarskie.",
}

const chartConfig = {
  value: {
    label: "Wartość (PLN)",
  },
  minimalna: {
    label: "Poniżej minimalnej",
    color: "hsl(var(--chart-1))",
  },
  srednia: {
    label: "Średnia obecna",
    color: "hsl(var(--chart-2))",
  },
  najwyzsza: {
    label: "Najwyższa w PL",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur-sm max-w-xs">
        <div className="mb-2">
            <p className="font-bold text-foreground">
              {data.value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
            </p>
            <p className="text-sm text-muted-foreground">
              {data.category}
            </p>
        </div>
        <p className="text-xs text-foreground/80">{tooltips[data.key]}</p>
      </div>
    );
  }
  return null;
};


export function PensionChart() {
  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Porównaj swoje oczekiwania</CardTitle>
        <CardDescription>Zobacz, jak Twoja wymarzona emerytura wypada na tle obecnych realiów w Polsce.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart 
            data={chartData} 
            accessibilityLayer 
            margin={{ top: 30, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs"
            />
            <YAxis hide={true} domain={[0, (dataMax: number) => dataMax * 1.1]}/>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Bar dataKey="value" radius={8}>
                <LabelList dataKey="value" position="top" offset={12} className="fill-foreground font-semibold" formatter={(value: number) => `${Math.round(value).toLocaleString('pl-PL')} zł`} />
                {chartData.map((entry) => (
                    <Cell key={entry.category} fill={chartConfig[entry.key as keyof typeof chartConfig].color} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
          Obecna średnia stopa zastąpienia to ok. <span className="font-semibold text-foreground">40%</span> ostatniego wynagrodzenia.
        </p>
      </CardFooter>
    </Card>
  )
}
