'use client'

import Link from 'next/link'
import { Menu, User2, RefreshCw } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { motion } from 'framer-motion'

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  return (
    <header className="border-b-2 border-ink bg-paper sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden brutal-button p-2"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-baseline gap-2 group">
            <motion.span
              className="display text-2xl md:text-3xl"
              whileHover={{ letterSpacing: '-0.02em' }}
            >
              TRANSPARÊNCIA
            </motion.span>
            <span className="mono text-xs text-muted hidden md:inline">
              /v1.0
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 mono text-xs border-2 border-ink px-3 py-1">
            <RefreshCw size={12} />
            <span>25/09/2026</span>
          </div>
          <a
            href="https://portaldatransparencia.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-button p-2"
            aria-label="GitHub"
          >
            <User2 size={18} />
          </a>
        </div>
      </div>
    </header>
  )
}