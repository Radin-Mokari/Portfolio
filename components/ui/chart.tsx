"use client"

import type * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Define types for common chart props
type ChartProps = {
  data: Record<string, any>[]
  config: ChartConfig
  className?: string
}

type LineChartProps = ChartProps & {
  lines: {
    dataKey: string
    stroke: string
    type?: "linear" | "monotone" | "step"
    strokeWidth?: number
  }[]
}

type BarChartProps = ChartProps & {
  bars: {
    dataKey: string
    fill: string
  }[]
}

type PieChartProps = ChartProps & {
  dataKey: string
  nameKey: string
  innerRadius?: number
  outerRadius?: number
  fill?: string
  segments: {
    dataKey: string
    fill: string
  }[]
}

type AreaChartProps = ChartProps & {
  areas: {
    dataKey: string
    fill: string
    stroke: string
    type?: "linear" | "monotone" | "step"
  }[]
}

// Generic Chart Component
const Chart = ({ children, className, ...props }: React.ComponentProps<typeof ChartContainer>) => (
  <ChartContainer className={className} {...props}>
    {children}
  </ChartContainer>
)

// Line Chart Component
const ChartLine = ({ data, config, lines, className }: LineChartProps) => (
  <ChartContainer config={config} className={className}>
    <LineChart accessibilityLayer data={data}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <YAxis tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      <Legend />
      {lines.map((lineProps, index) => (
        <Line key={index} dot={false} {...lineProps} />
      ))}
    </LineChart>
  </ChartContainer>
)

// Bar Chart Component
const ChartBar = ({ data, config, bars, className }: BarChartProps) => (
  <ChartContainer config={config} className={className}>
    <BarChart accessibilityLayer data={data}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <YAxis tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      <Legend />
      {bars.map((barProps, index) => (
        <Bar key={index} {...barProps} />
      ))}
    </BarChart>
  </ChartContainer>
)

// Pie Chart Component
const ChartPie = ({
  data,
  config,
  dataKey,
  nameKey,
  innerRadius = 80,
  outerRadius = 120,
  fill = "#8884d8",
  segments,
  className,
}: PieChartProps) => (
  <ChartContainer config={config} className={className}>
    <PieChart accessibilityLayer>
      <Tooltip content={<ChartTooltipContent />} />
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        fill={fill}
        {...segments}
      />
      <Legend />
    </PieChart>
  </ChartContainer>
)

// Area Chart Component
const ChartArea = ({ data, config, areas, className }: AreaChartProps) => (
  <ChartContainer config={config} className={className}>
    <AreaChart accessibilityLayer data={data}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        tickLine={false}
        tickMargin={10}
        axisLine={false}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <YAxis tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
      <Legend />
      {areas.map((areaProps, index) => (
        <Area key={index} {...areaProps} />
      ))}
    </AreaChart>
  </ChartContainer>
)

export { Chart, ChartLine, ChartBar, ChartPie, ChartArea }
