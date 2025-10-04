'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Banknote } from "lucide-react";

interface ZusGrowthChartProps {
  data: { year: number; amount: number }[];
}

const chartConfig = {
  amount: {
    label: "Zgromadzony kapitał",
    color: "hsl(var(--primary))",
  },
};

export function ZusGrowthChart({ data }: ZusGrowthChartProps) {
  return (
    <Card className="shadow-lg semitransparent-panel">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Banknote className="h-6 w-6 text-primary"/>
            Wzrost kapitału ZUS
        </CardTitle>
        <CardDescription>
          Prognozowany wzrost wartości Twojego konta i subkonta w ZUS z biegiem lat.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <AreaChart
            data={data}
            accessibilityLayer
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(Number(value) / 1000).toLocaleString()}k zł`}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent
                indicator="dot"
                formatter={(value) => Number(value).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}
                />}
            />
            <Legend content={<ChartLegendContent />} />
            <Area
              dataKey="amount"
              type="natural"
              fill={chartConfig.amount.color}
              fillOpacity={0.3}
              stroke={chartConfig.amount.color}
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
