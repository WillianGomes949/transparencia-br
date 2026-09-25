'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { testApiConnectionAction } from '@/actions/debug'

interface TestResult {
  endpoint: string
  success: boolean
  message: string
  data?: any
  error?: string
}

export default function DebugPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const runTests = async () => {
    setTesting(true)
    setResults([])

    const result = await testApiConnectionAction()
    setResults(result.tests)
    setTesting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="border-b-2 border-ink pb-4">
        <div className="mono text-xs uppercase tracking-widest text-muted mb-2">
          / debug
        </div>
        <h1 className="display text-4xl md:text-6xl leading-none">
          DEBUG DA API
        </h1>
        <p className="mono text-sm mt-3 text-muted">
          Teste a conexão com a API do Portal da Transparência
        </p>
      </div>

      <Card
        label="Status da Conexão"
        value={testing ? 'Testando...' : results.length ? `${results.filter(r => r.success).length}/${results.length} OK` : 'Não testado'}
        hint="Clique em Testar para verificar a conexão"
      />

      <Button onClick={runTests} disabled={testing}>
        {testing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Testando...
          </>
        ) : (
          <>
            <TestTube size={16} />
            Testar Conexão
          </>
        )}
      </Button>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, i) => (
            <div
              key={i}
              className={`brutal-border p-4 ${
                result.success ? 'bg-paper' : 'bg-accent/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle size={20} className="text-green-600 shrink-0" />
                ) : (
                  <XCircle size={20} className="text-accent shrink-0" />
                )}
                <div className="flex-1">
                  <div className="mono text-xs uppercase tracking-widest text-muted mb-1">
                    {result.endpoint}
                  </div>
                  <div className="font-medium text-sm mb-2">{result.message}</div>
                  {result.error && (
                    <div className="mono text-xs text-accent mt-2 p-2 bg-ink/5 border border-accent">
                      {result.error}
                    </div>
                  )}
                  {result.data && (
                    <details className="mt-2">
                      <summary className="mono text-xs cursor-pointer hover:underline">
                        Ver dados de resposta
                      </summary>
                      <pre className="mono text-[10px] mt-2 p-3 bg-ink text-paper overflow-x-auto max-h-48">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}