'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  ScrollText,
  MapPin,
  User,
  Calendar,
  AlertCircle,
  Tag,
} from 'lucide-react'
import { useEmendaDetail } from '@/hooks/useEmendaDetail'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, parseCurrency } from '@/lib/utils'

export default function EmendaDetailPage({
  params,
}: {
  params: Promise<{ numero: string }>
}) {
  const { numero } = use(params)
  const { data: emenda, isLoading, error } = useEmendaDetail(numero)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-ink/20" />
        <div className="h-16 w-full border-2 border-ink" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 border-2 border-ink" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !emenda) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="brutal-border p-8 flex items-center gap-3">
          <AlertCircle size={24} />
          <div>
            <div className="display text-lg">Emenda não encontrada</div>
            <div className="mono text-xs text-muted mt-1">
              Verifique o número e tente novamente.
            </div>
          </div>
        </div>
        <Link href="/emendas" className="mt-6 inline-block">
          <Button variant="ghost">
            <ArrowLeft size={14} />
            Voltar
          </Button>
        </Link>
      </div>
    )
  }

  const empenhado = parseCurrency(emenda.valorEmpenhado)
  const liquidado = parseCurrency(emenda.valorLiquidado)
  const pago = parseCurrency(emenda.valorPago)
  const restoInscrito = parseCurrency(emenda.valorRestoInscrito)
  const restoCancelado = parseCurrency(emenda.valorRestoCancelado)
  const restoPago = parseCurrency(emenda.valorRestoPago)

  const execucao = empenhado > 0 ? (pago / empenhado) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <Link href="/emendas">
        <Button variant="ghost">
          <ArrowLeft size={14} />
          Voltar para emendas
        </Button>
      </Link>

      <div className="border-b-2 border-ink pb-4">
        <div className="mono text-xs uppercase tracking-widest text-muted mb-2">
          / emenda parlamentar
        </div>
        <h1 className="display text-3xl md:text-5xl leading-none break-all">
          {emenda.numeroEmenda}
        </h1>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className="mono text-xs uppercase tracking-widest px-3 py-1 border-2 border-ink bg-ink text-paper">
            {emenda.tipoEmenda}
          </span>
          <span className="mono text-xs text-muted">
            Ano {emenda.ano} • Código: {emenda.codigoEmenda}
          </span>
        </div>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          label="Empenhado"
          value={formatCurrency(empenhado)}
          hint="Valor comprometido"
        />
        <Card
          label="Liquidado"
          value={formatCurrency(liquidado)}
          hint="Serviço confirmado"
        />
        <Card
          label="Pago"
          value={formatCurrency(pago)}
          hint={`${execucao.toFixed(1)}% executado`}
        />
      </div>

      {/* Barra de execução */}
      <div className="brutal-border p-5">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="display text-lg">Execução Orçamentária</h3>
          <span className="mono text-sm">{execucao.toFixed(1)}%</span>
        </div>
        <div className="h-6 border-2 border-ink bg-paper relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(execucao, 100)}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-ink relative"
          >
            <div className="absolute top-0 right-0 bottom-0 w-1 bg-[var(--accent)]" />
          </motion.div>
        </div>
        <div className="flex justify-between mt-2 mono text-[10px] uppercase tracking-widest text-muted">
          <span>Empenhado</span>
          <span>Pago</span>
        </div>
      </div>

      {/* Restos a pagar */}
      <div className="brutal-border p-5">
        <h3 className="display text-lg mb-4">Restos a Pagar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-ink pl-3">
            <div className="mono text-[10px] uppercase tracking-widest text-muted">
              Inscrito
            </div>
            <div className="display text-xl mt-1">
              {formatCurrency(restoInscrito)}
            </div>
          </div>
          <div className="border-l-4 border-ink pl-3">
            <div className="mono text-[10px] uppercase tracking-widest text-muted">
              Cancelado
            </div>
            <div className="display text-xl mt-1 text-accent">
              {formatCurrency(restoCancelado)}
            </div>
          </div>
          <div className="border-l-4 border-ink pl-3">
            <div className="mono text-[10px] uppercase tracking-widest text-muted">
              Pago
            </div>
            <div className="display text-xl mt-1">
              {formatCurrency(restoPago)}
            </div>
          </div>
        </div>
      </div>

      {/* Detalhes */}
      <div className="brutal-border p-5 space-y-4">
        <h3 className="display text-lg flex items-center gap-2">
          <ScrollText size={20} />
          Detalhes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailRow
            icon={<User size={14} />}
            label="Autor"
            value={emenda.nomeAutor || '—'}
            hint={emenda.autor ? `Código: ${emenda.autor}` : undefined}
          />
          <DetailRow
            icon={<Tag size={14} />}
            label="Tipo"
            value={emenda.tipoEmenda}
          />
          <DetailRow
            icon={<MapPin size={14} />}
            label="Localidade do gasto"
            value={emenda.localidadeDoGasto || '—'}
          />
          <DetailRow
            icon={<Calendar size={14} />}
            label="Ano"
            value={String(emenda.ano)}
          />
          <DetailRow
            icon={<ScrollText size={14} />}
            label="Função"
            value={emenda.funcao || '—'}
          />
          <DetailRow
            icon={<ScrollText size={14} />}
            label="Subfunção"
            value={emenda.subfuncao || '—'}
          />
        </div>
      </div>

      <div className="mono text-[10px] text-muted pt-4 border-t-2 border-ink">
        FONTE: PORTAL DA TRANSPARÊNCIA — API DE DADOS ABERTOS. ATUALIZADO EM
        TEMPO REAL.
      </div>
    </motion.div>
  )
}

function DetailRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-ink last:border-0">
      <div className="mt-0.5 text-muted">{icon}</div>
      <div className="flex-1">
        <div className="mono text-[10px] uppercase tracking-widest text-muted">
          {label}
        </div>
        <div className="text-sm mt-0.5 break-words">{value || '—'}</div>
        {hint && (
          <div className="mono text-[10px] text-muted mt-0.5">{hint}</div>
        )}
      </div>
    </div>
  )
}