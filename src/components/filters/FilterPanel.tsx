'use client'

import { useFilterStore } from '@/stores/filterStore'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { RotateCcw } from 'lucide-react'
import { YEARS, MESES } from '@/lib/constants'

export function FilterPanel() {
  const { ano, mes, setAno, setMes, reset } = useFilterStore()

  return (
    <div className="brutal-border p-4 bg-paper">
      <div className="flex items-center justify-between mb-4">
        <h3 className="display text-lg">Filtros</h3>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw size={14} />
          Limpar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Ano"
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          options={YEARS.map((y) => ({ value: String(y), label: String(y) }))}
        />
        <Select
          label="Mês"
          value={mes ?? ''}
          onChange={(e) =>
            setMes(e.target.value ? Number(e.target.value) : undefined)
          }
          options={[
            { value: '', label: 'Todos' },
            ...MESES.map((m, i) => ({ value: String(i + 1), label: m })),
          ]}
        />
        <div className="mono text-xs uppercase tracking-widest text-muted flex items-end pb-2">
          Exibindo dados de {mes ? MESES[mes - 1] : 'todo o ano'} / {ano}
        </div>
      </div>
    </div>
  )
}