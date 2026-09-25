'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Card } from '@/components/ui/Card'
import { BarChart } from '@/components/charts/BarChart'
import { Button } from '@/components/ui/Button'
import { useContratos } from '@/hooks/useContratos'
import { useFilterStore } from '@/stores/filterStore'
import { formatCurrency } from '@/lib/utils'
import { exportToCSV } from '@/lib/export'
import { Download, FileSignature } from 'lucide-react'
import type { Contrato } from '@/types/api'

export default function ContratosPage() {
  const { data, isLoading } = useContratos()
  const { page, setPage } = useFilterStore()

  const chartData = useMemo(() => {
    if (!data?.data.length) return []
    const grouped: Record<string, number> = {}
    data.data.forEach((c) => {
      const key = c.orgao || '—'
      grouped[key] = (grouped[key] || 0) + (c.valor || 0)
    })
    return Object.entries(grouped)
      .map(([label, value]) => ({ label: label.slice(0, 12), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [data])

  const total = useMemo(
    () => data?.data.reduce((s, c) => s + (c.valor || 0), 0) ?? 0,
    [data]
  )

  const columns = [
    { key: 'numero', header: 'Nº', render: (r: Contrato) => r.numero },
    { key: 'orgao', header: 'Órgão', render: (r: Contrato) => r.orgao },
    {
      key: 'contratado',
      header: 'Contratado',
      render: (r: Contrato) => r.contratado,
    },
    {
      key: 'objeto',
      header: 'Objeto',
      render: (r: Contrato) => (
        <span className="line-clamp-2">{r.objeto}</span>
      ),
    },
    {
      key: 'valor',
      header: 'Valor',
      className: 'text-right mono',
      render: (r: Contrato) => formatCurrency(r.valor),
    },
    {
      key: 'situacao',
      header: 'Situação',
      render: (r: Contrato) => (
        <span
          className={`mono text-[10px] uppercase tracking-widest px-2 py-1 border-2 border-ink ${
            r.situacao === 'Vigente' ? 'bg-paper' : 'bg-ink text-paper'
          }`}
        >
          {r.situacao}
        </span>
      ),
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
          / contratos
        </div>
        <h1 className="display text-4xl md:text-6xl leading-none">
          CONTRATOS
        </h1>
        <p className="mono text-sm mt-3 text-muted">
          Contratos e convênios do Poder Executivo Federal.
        </p>
      </div>

      <FilterPanel />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          label="Valor total"
          value={isLoading ? '...' : formatCurrency(total)}
        />
        <Card
          label="Contratos"
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

      <BarChart data={chartData} title="Top 10 órgãos por valor" />

      <div className="flex items-center justify-between">
        <h2 className="display text-2xl flex items-center gap-2">
          <FileSignature size={24} />
          Registros
        </h2>
        <Button
          variant="ghost"
          onClick={() => data?.data && exportToCSV(data.data, 'contratos')}
          disabled={!data?.data.length}
        >
          <Download size={14} />
          CSV
        </Button>
      </div>

      <Table
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(r) => r.numero}
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