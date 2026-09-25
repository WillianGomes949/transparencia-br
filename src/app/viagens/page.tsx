'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Card } from '@/components/ui/Card'
import { BarChart } from '@/components/charts/BarChart'
import { Button } from '@/components/ui/Button'
import { useViagens } from '@/hooks/useViagens'
import { useFilterStore } from '@/stores/filterStore'
import { formatCurrency } from '@/lib/utils'
import { exportToCSV } from '@/lib/export'
import { Download, Plane } from 'lucide-react'
import type { Viagem } from '@/types/api'

export default function ViagensPage() {
  const { data, isLoading } = useViagens()
  const { page, setPage } = useFilterStore()

  const chartData = useMemo(() => {
    if (!data?.data.length) return []
    const grouped: Record<string, number> = {}
    data.data.forEach((v) => {
      const key = v.destino || '—'
      grouped[key] =
        (grouped[key] || 0) + (v.valorDiarias || 0) + (v.valorPassagens || 0)
    })
    return Object.entries(grouped)
      .map(([label, value]) => ({ label: label.slice(0, 12), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [data])

  const total = useMemo(
    () =>
      data?.data.reduce(
        (s, v) => s + (v.valorDiarias || 0) + (v.valorPassagens || 0),
        0
      ) ?? 0,
    [data]
  )

  const columns = [
    { key: 'nome', header: 'Nome', render: (r: Viagem) => r.nome },
    { key: 'cargo', header: 'Cargo', render: (r: Viagem) => r.cargo },
    { key: 'destino', header: 'Destino', render: (r: Viagem) => r.destino },
    { key: 'motivo', header: 'Motivo', render: (r: Viagem) => r.motivo },
    {
      key: 'periodo',
      header: 'Período',
      render: (r: Viagem) => `${r.dataInicio} → ${r.dataFim}`,
    },
    {
      key: 'valor',
      header: 'Total',
      className: 'text-right mono',
      render: (r: Viagem) =>
        formatCurrency((r.valorDiarias || 0) + (r.valorPassagens || 0)),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="border-b-2 border-ink pb-4">
        <div className="mono text-xs uppercase tracking-widest text-muted mb-2">
          / viagens a serviço
        </div>
        <h1 className="display text-4xl md:text-6xl leading-none">VIAGENS</h1>
        <p className="mono text-sm mt-3 text-muted">
          Diárias e passagens de servidores em serviço.
        </p>
      </div>

      <FilterPanel />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          label="Total gasto"
          value={isLoading ? '...' : formatCurrency(total)}
        />
        <Card
          label="Viagens"
          value={isLoading ? '...' : data?.total ?? 0}
        />
        <Card
          label="Ticket médio"
          value={
            isLoading
              ? '...'
              : formatCurrency(total / Math.max(data?.total ?? 1, 1))
          }
        />
      </div>

      <BarChart data={chartData} title="Top 10 destinos" />

      <div className="flex items-center justify-between">
        <h2 className="display text-2xl flex items-center gap-2">
          <Plane size={24} />
          Registros
        </h2>
        <Button
          variant="ghost"
          onClick={() => data?.data && exportToCSV(data.data, 'viagens')}
          disabled={!data?.data.length}
        >
          <Download size={14} />
          CSV
        </Button>
      </div>

      <Table
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(r) =>
          `${r.cpf}-${r.dataInicio}-${r.destino}-${r.motivo}`
        }
      />

      <Pagination
        total={data?.total ?? 0}
        pageSize={20}
        currentPage={page}
        onPageChange={setPage}
      />
    </motion.div>
  )
}