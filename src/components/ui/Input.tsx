import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="mono text-[10px] uppercase tracking-widest text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('brutal-input w-full', className)}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'