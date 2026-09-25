'use client'

import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Card } from '@/components/ui/Card'
import { BarChart } from '@/components/charts/BarChart'
import { Button } from '@/components/ui/Button'
import { useDespesas } from '@/hooks/useDespesas'
import { useTotalDespesas } from '@/hooks/useTotalDespesas'
import { useFilterStore } from '@/stores/filterStore'
import { formatCurrency } from '@/lib/utils'
import { exportToCSV } from '@/lib/export'
import { Download, Wallet, TrendingUp, Building2 } from 'lucide-react'
import type { Despesa } from '@/types/api'

const PAGE_SIZE = 20

export default function GastosPage() {
  const { data, isLoading } = useDespesas()
  const { data: total } = useTotalDespesas()
  const { page, setPage } = useFilterStore()
  const [groupBy, setGroupBy] = useState<'orgao' | 'funcao'>('orgao')

  const chartData = useMemo(() => {
    if (!data?.data.length) return []
    const grouped: Record<string, number> = {}
    data.data.forEach((d) => {
      const key =
        groupBy === 'orgao'
          ? d.nomeOrgaoSuperior || '—'
          : d.nomeFuncao || '—'
      grouped[key] = (grouped[key] || 0) + (d.valor || 0)
    })
    return Object.entries(grouped)
      .map(([label, value]) => ({ label: label.slice(0, 12), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [data, groupBy])

  const columns = [
    {
      key: 'orgao',
      header: 'Órgão',
      render: (row: Despesa) => (
        <span className="font-medium">{row.nomeOrgaoSuperior}</span>
      ),
    },
    { key: 'funcao', header: 'Função', render: (row: Despesa) => row.nomeFuncao },
    {
      key: 'beneficiario',
      header: 'Beneficiário',
      render: (row: Despesa) => row.nomeBeneficiario || '—',
    },
    {
      key: 'data',
      header: 'Data',
      render: (row: Despesa) => row.dataPagamento,
    },
    {
      key: 'valor',
      header: 'Valor',
      className: 'text-right mono',
      render: (row: Despesa) => formatCurrency(row.valor),
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
          / despesas
        </div>
        <h1 className="display text-4xl md:text-6xl leading-none">
          DESPESAS PÚBLICAS
        </h1>
        <p className="mono text-sm mt-3 text-muted">
          Documentos de despesa do Governo Federal.
        </p>
      </div>

      <FilterPanel />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          label="Total"
          value={isLoading ? '...' : formatCurrency(total ?? 0)}
        />
        <Card
          label="Registros"
          value={isLoading ? '...' : data?.total ?? 0}
        />
        <Card
          label="Ticket médio"
          value={
            isLoading
              ? '...'
              : formatCurrency((total ?? 0) / Math.max(data?.total ?? 1, 1))
          }
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="mono text-[10px] uppercase tracking-widest text-muted">
          Agrupar por:
        </span>
        <Button
          variant={groupBy === 'orgao' ? 'primary' : 'ghost'}
          onClick={() => setGroupBy('orgao')}
        >
          <Building2 size={14} />
          Órgão
        </Button>
        <Button
          variant={groupBy === 'funcao' ? 'primary' : 'ghost'}
          onClick={() => setGroupBy('funcao')}
        >
          <TrendingUp size={14} />
          Função
        </Button>
      </div>

      <BarChart data={chartData} title="Top 10 por valor" />

      <div className="flex items-center justify-between">
        <h2 className="display text-2xl flex items-center gap-2">
          <Wallet size={24} />
          Registros
        </h2>
        <Button
          variant="ghost"
          onClick={() => data?.data && exportToCSV(data.data, 'despesas')}
          disabled={!data?.data.length}
        >
          <Download size={14} />
          CSV
        </Button>
      </div>

      <Table
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(row) =>
          `${row.numeroDocumento}-${row.dataPagamento}-${row.codigoBeneficiario}`
        }
      />

      <Pagination
        total={data?.total ?? 0}
        pageSize={PAGE_SIZE}
        currentPage={page}
        onPageChange={setPage}
      />
    </motion.div>
  )
}