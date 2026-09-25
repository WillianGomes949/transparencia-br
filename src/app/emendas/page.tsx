'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Card } from '@/components/ui/Card'
import { BarChart } from '@/components/charts/BarChart'
import { Button } from '@/components/ui/Button'
import { useEmendas } from '@/hooks/useEmendas'
import { useFilterStore } from '@/stores/filterStore'
import { formatCurrency } from '@/lib/utils'
import { exportToCSV } from '@/lib/export'
import { Download, ScrollText } from 'lucide-react'
import type { Emenda } from '@/types/api'

export default function EmendasPage() {
  const { data, isLoading } = useEmendas()
  const { page, setPage } = useFilterStore()

  const chartData = useMemo(() => {
    if (!data?.data.length) return []
    const grouped: Record<string, number> = {}
    data.data.forEach((e) => {
      const key = e.autor || '—'
      grouped[key] = (grouped[key] || 0) + (e.valorPago || 0)
    })
    return Object.entries(grouped)
      .map(([label, value]) => ({ label: label.slice(0, 12), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [data])

  const totalPago = useMemo(
    () => data?.data.reduce((s, e) => s + (e.valorPago || 0), 0) ?? 0,
    [data]
  )
  const totalEmpenhado = useMemo(
    () => data?.data.reduce((s, e) => s + (e.valorEmpenhado || 0), 0) ?? 0,
    [data]
  )

  const columns = [
    { key: 'numero', header: 'Nº', render: (r: Emenda) => r.numeroEmenda },
    { key: 'autor', header: 'Autor', render: (r: Emenda) => r.autor },
    { key: 'uf', header: 'UF', render: (r: Emenda) => r.ufAutor },
    { key: 'localidade', header: 'Localidade', render: (r: Emenda) => r.localidade },
    {
      key: 'empenhado',
      header: 'Empenhado',
      className: 'text-right mono',
      render: (r: Emenda) => formatCurrency(r.valorEmpenhado),
    },
    {
      key: 'pago',
      header: 'Pago',
      className: 'text-right mono',
      render: (r: Emenda) => formatCurrency(r.valorPago),
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
          / emendas parlamentares
        </div>
        <h1 className="display text-4xl md:text-6xl leading-none">EMENDAS</h1>
        <p className="mono text-sm mt-3 text-muted">
          Recursos destinados por deputados e senadores.
        </p>
      </div>

      <FilterPanel />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          label="Total empenhado"
          value={isLoading ? '...' : formatCurrency(totalEmpenhado)}
        />
        <Card
          label="Total pago"
          value={isLoading ? '...' : formatCurrency(totalPago)}
        />
        <Card
          label="Registros"
          value={isLoading ? '...' : data?.total ?? 0}
        />
      </div>

      <BarChart data={chartData} title="Top 10 autores por valor pago" />

      <div className="flex items-center justify-between">
        <h2 className="display text-2xl flex items-center gap-2">
          <ScrollText size={24} />
          Registros
        </h2>
        <Button
          variant="ghost"
          onClick={() => data?.data && exportToCSV(data.data, 'emendas')}
          disabled={!data?.data.length}
        >
          <Download size={14} />
          CSV
        </Button>
      </div>

      <Table
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(r) => r.numeroEmenda}
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