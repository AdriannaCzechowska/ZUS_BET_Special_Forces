"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { Separator } from "../ui/separator"

const chartData = [
  { category: "Poniżej minimalnej", value: 1780.96, key: "minimalna" },
  { category: "Średnia obecna", value: 3845.54, key: "srednia" },
  { category: "Najwyższa w PL", value: 43412, key: "najwyzsza" },
]

const tooltips: Record<string, string> = {
  minimalna: "<20/25 lat pracy – brak prawa do gwarantowanej minimalnej emerytury.",
  srednia: "Obliczana na bazie: 19,52 % składki emerytalnej z wynagrodzenia brutto, waloryzacja roczna i kwartalna wg wskaźników MRPiPS.",
  najwyzsza: "Przykład: 43 000 zł brutto, woj. śląskie, ponad 55 lat pracy, brak przerw chorobowych.",
}

const chartConfig = {
  value: {
    label: "Wartość (PLN)",
  },
  minimalna: {
    label: "Poniżej minimalnej",
    color: "hsl(var(--chart-4))", // red
  },
  srednia: {
    label: "Średnia obecna",
    color: "hsl(var(--chart-2))", // blue
  },
  najwyzsza: {
    label: "Najwyższa w PL",
    color: "hsl(var(--chart-1))", // green
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
      <CardFooter className="flex-col items-start gap-4">
        <p className="text-xs text-muted-foreground text-center w-full">
          Obecna średnia stopa zastąpienia to ok. <span className="font-semibold text-foreground">40%</span> ostatniego wynagrodzenia.
        </p>
        <Separator />
        <p className="text-xs text-muted-foreground text-center w-full">
          Wskaźniki waloryzacji składek ogłasza MRPiPS w Monitorze Polskim – aktualizacja co 1 czerwca.
        </p>
      </CardFooter>
    </Card>
  )
}
