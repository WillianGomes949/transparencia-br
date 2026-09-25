'use client'

import { Button } from './Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePagination } from '@/hooks/usePagination'

interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const { hasPrev, hasNext, next, prev, range } = usePagination({
    total,
    pageSize,
    currentPage,
    onPageChange,
  })

  if (total === 0) return null

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-ink">
      <div className="mono text-[10px] uppercase tracking-widest text-muted">
        Página {currentPage} • {total} registros
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={!hasPrev}
          className="p-2"
        >
          <ChevronLeft size={16} />
        </Button>
        {range.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`mono text-xs px-3 py-1 border-2 border-ink transition-all ${
              p === currentPage
                ? 'bg-ink text-paper'
                : 'bg-paper hover:bg-ink hover:text-paper'
            }`}
          >
            {p}
          </button>
        ))}
        <Button
          variant="ghost"
          onClick={next}
          disabled={!hasNext}
          className="p-2"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}