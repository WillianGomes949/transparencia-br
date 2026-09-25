import { cn } from '@/lib/utils'

interface CardProps {
  label: string
  value: string | number
  hint?: string
  className?: string
}

export function Card({ label, value, hint, className }: CardProps) {
  return (
    <div className={cn('brutal-card p-5', className)}>
      <div className="mono text-[10px] uppercase tracking-widest text-muted mb-2">
        {label}
      </div>
      <div className="display text-3xl md:text-4xl break-words">{value}</div>
      {hint && (
        <div className="mono text-xs text-muted mt-3 border-t border-ink pt-2">
          {hint}
        </div>
      )}
    </div>
  )
}