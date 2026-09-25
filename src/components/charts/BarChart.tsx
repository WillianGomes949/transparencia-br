'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface BarChartProps {
  data: { label: string; value: number }[]
  title?: string
  height?: number
}

export function BarChart({ data, title, height = 280 }: BarChartProps) {
  if (!data.length) {
    return (
      <div className="brutal-border p-12 text-center mono text-xs uppercase tracking-widest text-muted">
        Sem dados para exibir
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value))
  const barWidth = 100 / data.length

  return (
    <div className="brutal-border p-5 bg-paper">
      {title && (
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="display text-lg">{title}</h3>
          <span className="mono text-[10px] uppercase tracking-widest text-muted">
            {data.length} itens
          </span>
        </div>
      )}

      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1="0"
              x2="100"
              y1={height - p * height}
              y2={height - p * height}
              stroke="#0A0A0A"
              strokeWidth="0.15"
              strokeDasharray="0.5 0.5"
              opacity="0.3"
            />
          ))}

          {/* Bars */}
          {data.map((d, i) => {
            const h = (d.value / maxValue) * height
            const x = i * barWidth
            return (
              <motion.g key={d.label}>
                <motion.rect
                  initial={{ height: 0, y: height }}
                  animate={{ height: h, y: height - h }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  x={`${x + barWidth * 0.15}%`}
                  width={`${barWidth * 0.7}%`}
                  fill="#0A0A0A"
                />
                {/* Accent top */}
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 + 0.5 }}
                  x={`${x + barWidth * 0.15}%`}
                  y={height - h}
                  width={`${barWidth * 0.7}%`}
                  height="2"
                  fill="#FF3B00"
                />
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* Labels */}
      <div className="flex mt-3 gap-1">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex-1 mono text-[9px] uppercase tracking-wider truncate text-center"
            title={`${d.label}: ${formatCurrency(d.value)}`}
          >
            {d.label}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t-2 border-ink flex justify-between mono text-[10px] uppercase tracking-widest text-muted">
        <span>Mín: {formatCurrency(Math.min(...data.map((d) => d.value)))}</span>
        <span>Máx: {formatCurrency(maxValue)}</span>
      </div>
    </div>
  )
}