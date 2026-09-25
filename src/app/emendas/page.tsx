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
import { formatCurrency, parseCurrency } from '@/lib/utils'
import { exportToCSV } from '@/lib/export'
import { Download, ScrollText } from 'lucide-react'
import Link from 'next/link'
import type { Emenda } from '@/types/api'

export default function EmendasPage() {
  const { data, isLoading } = useEmendas()
  const { page, setPage } = useFilterStore()

  const chartData = useMemo(() => {
    if (!data?.data.length) return []
    const grouped: Record<string, number> = {}
    data.data.forEach((e) => {
      const key = e.nomeAutor || e.autor || '—'
      grouped[key] = (grouped[key] || 0) + parseCurrency(e.valorPago)
    })
    return Object.entries(grouped)
      .map(([label, value]) => ({ label: label.slice(0, 14), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [data])

  const totalPago = useMemo(
    () =>
      data?.data.reduce((s, e) => s + parseCurrency(e.valorPago), 0) ?? 0,
    [data]
  )
  const totalEmpenhado = useMemo(
    () =>
      data?.data.reduce((s, e) => s + parseCurrency(e.valorEmpenhado), 0) ?? 0,
    [data]
  )
  const totalLiquidado = useMemo(
    () =>
      data?.data.reduce((s, e) => s + parseCurrency(e.valorLiquidado), 0) ?? 0,
    [data]
  )

  const columns = [
    {
      key: 'numero',
      header: 'Nº',
      render: (r: Emenda) => (
        <Link
          href={`/emendas/${r.numeroEmenda}`}
          className="mono text-xs hover:underline"
        >
          {r.numeroEmenda}
        </Link>
      ),
    },
    {
      key: 'autor',
      header: 'Autor',
      render: (r: Emenda) => (
        <div>
          <div className="font-medium">{r.nomeAutor || r.autor}</div>
          <div className="mono text-[10px] text-muted">{r.autor}</div>
        </div>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (r: Emenda) => (
        <span className="mono text-[10px] uppercase tracking-widest">
          {r.tipoEmenda}
        </span>
      ),
    },
    {
      key: 'localidade',
      header: 'Localidade',
      render: (r: Emenda) => r.localidadeDoGasto || '—',
    },
    {
      key: 'funcao',
      header: 'Função',
      render: (r: Emenda) => r.funcao || '—',
    },
    {
      key: 'empenhado',
      header: 'Empenhado',
      className: 'text-right mono',
      render: (r: Emenda) => formatCurrency(parseCurrency(r.valorEmpenhado)),
    },
    {
      key: 'pago',
      header: 'Pago',
      className: 'text-right mono',
      render: (r: Emenda) => (
        <span className="font-bold">{formatCurrency(parseCurrency(r.valorPago))}</span>
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
          / emendas parlamentares
        </div>
        <h1 className="display text-4xl md:text-6xl leading-none">EMENDAS</h1>
        <p className="mono text-sm mt-3 text-muted">
          Recursos destinados por deputados e senadores.
        </p>
      </div>

      <FilterPanel />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          label="Total empenhado"
          value={isLoading ? '...' : formatCurrency(totalEmpenhado)}
        />
        <Card
          label="Total liquidado"
          value={isLoading ? '...' : formatCurrency(totalLiquidado)}
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
          onClick={() =>
            data?.data &&
            exportToCSV(
              data.data.map((e) => ({
                numero: e.numeroEmenda,
                autor: e.nomeAutor,
                codigoAutor: e.autor,
                tipo: e.tipoEmenda,
                ano: e.ano,
                localidade: e.localidadeDoGasto,
                funcao: e.funcao,
                empenhado: parseCurrency(e.valorEmpenhado),
                liquidado: parseCurrency(e.valorLiquidado),
                pago: parseCurrency(e.valorPago),
                restoInscrito: parseCurrency(e.valorRestoInscrito),
                restoCancelado: parseCurrency(e.valorRestoCancelado),
                restoPago: parseCurrency(e.valorRestoPago),
              })),
              'emendas'
            )
          }
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