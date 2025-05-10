// components/ui/chart.tsx
import type React from "react"

interface ChartProps {
  data: any[]
  categories: string[]
  index: string
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const BarChart: React.FC<ChartProps> = ({ data, categories, index, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      {/* Mock Bar Chart */}
      <div>BarChart Placeholder</div>
      <div>
        {data.map((item, i) => (
          <div key={i}>
            {item[index]}: {categories.map((cat) => `${cat}: ${item[cat]} `)}
          </div>
        ))}
      </div>
    </div>
  )
}

export const LineChart: React.FC<ChartProps> = ({ data, categories, index, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      {/* Mock Line Chart */}
      <div>LineChart Placeholder</div>
      <div>
        {data.map((item, i) => (
          <div key={i}>
            {item[index]}: {categories.map((cat) => `${cat}: ${item[cat]} `)}
          </div>
        ))}
      </div>
    </div>
  )
}
