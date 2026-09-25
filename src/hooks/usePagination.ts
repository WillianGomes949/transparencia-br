'use client'

interface UsePaginationProps {
  total: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function usePagination({
  total,
  pageSize,
  currentPage,
  onPageChange,
}: UsePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const goTo = (page: number) => {
    const p = Math.min(Math.max(1, page), totalPages)
    onPageChange(p)
  }

  return {
    totalPages,
    hasPrev,
    hasNext,
    goTo,
    next: () => hasNext && goTo(currentPage + 1),
    prev: () => hasPrev && goTo(currentPage - 1),
    range: Array.from({ length: totalPages }, (_, i) => i + 1).slice(
      Math.max(0, currentPage - 3),
      Math.min(totalPages, currentPage + 2)
    ),
  }
}