'use client'

import { AlertCircle, Key, WifiOff, RefreshCw } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from './Button'

interface ApiErrorAlertProps {
  error: string
  errorCode?: string
  onRetry?: () => void
}

export function ApiErrorAlert({ error, errorCode, onRetry }: ApiErrorAlertProps) {
  const getIcon = () => {
    if (errorCode === 'INVALID_TOKEN') return <Key size={20} />
    if (errorCode === 'NETWORK_ERROR') return <WifiOff size={20} />
    return <AlertCircle size={20} />
  }

  const getTitle = () => {
    if (errorCode === 'INVALID_TOKEN') return 'Token de API Inválido'
    if (errorCode === 'NETWORK_ERROR') return 'Erro de Conexão'
    return 'Erro ao Carregar Dados'
  }

  const getSolution = () => {
    if (errorCode === 'INVALID_TOKEN') {
      return (
        <div className="mono text-xs space-y-2">
          <p>1. Acesse: https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email</p>
          <p>2. Cadastre-se com conta Gov.br (Prata ou Ouro)</p>
          <p>3. Copie o token recebido por email</p>
          <p>4. Crie/atualize o arquivo <code className="bg-ink text-paper px-2 py-0.5">.env.local</code>:</p>
          <pre className="bg-ink text-paper p-3 overflow-x-auto">
{`PORTAL_API_TOKEN=seu_token_aqui`}
          </pre>
          <p>5. Reinicie o servidor: <code className="bg-ink text-paper px-2 py-0.5">npm run dev</code></p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="brutal-border p-5 bg-paper"
    >
      <div className="flex items-start gap-3">
        <div className="text-accent">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="display text-lg mb-2">{getTitle()}</h3>
          <p className="mono text-sm text-muted mb-3">{error}</p>
          
          {getSolution() && (
            <div className="mt-4 pt-4 border-t-2 border-ink">
              <h4 className="mono text-xs uppercase tracking-widest mb-3">Como resolver:</h4>
              {getSolution()}
            </div>
          )}

          {onRetry && (
            <Button
              onClick={onRetry}
              className="brutal-button mt-4 flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Tentar Novamente
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}