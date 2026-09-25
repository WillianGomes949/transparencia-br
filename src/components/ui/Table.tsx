import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  emptyMessage?: string
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Sem dados',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="brutal-border p-12 text-center mono text-sm uppercase tracking-widest text-muted">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="brutal-border overflow-x-auto">
      <table className="w-full">
        <thead className="bg-ink text-paper">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left mono text-[10px] uppercase tracking-widest',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="border-t-2 border-ink hover:bg-ink hover:text-paper transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn('px-4 py-3 text-sm', col.className)}
                >
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}