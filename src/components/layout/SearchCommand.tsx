"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Wallet, ScrollText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { buscaGlobalAction, type BuscaResult } from "@/actions/busca";
import { formatCurrency, parseCurrency } from "@/lib/utils";
import { Button } from "../ui/Button";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuscaResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebounce(query, 400);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResult(null);
    }
  }, [open]);

  useEffect(() => {
    if (!debounced || debounced.length < 3) {
      setResult(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    buscaGlobalAction(debounced).then((r) => {
      if (!cancelled) {
        setResult(r);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="brutal-button flex items-center gap-2 mono text-xs"
      >
        <Search size={14} />
        <span className="hidden md:inline">Buscar</span>
        <kbd className="hidden md:inline mono text-[10px] px-1.5 py-0.5 border border-ink">
          ⌘K
        </kbd>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-ink/60 z-50 flex items-start justify-center pt-20 px-4"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "tween", duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl brutal-card p-0 overflow-hidden"
              style={{ boxShadow: "8px 8px 0 0 var(--ink)" }}
            >
              <div className="flex items-center gap-3 p-4 border-b-2 border-ink">
                <Search size={18} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por beneficiário, autor, órgão..."
                  className="flex-1 bg-transparent outline-none mono text-sm placeholder:text-muted"
                />
                <Button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-ink hover:text-paper transition-colors"
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4">
                {loading && (
                  <div className="flex items-center gap-2 mono text-xs text-muted py-4">
                    <Loader2 size={14} className="animate-spin" />
                    Buscando...
                  </div>
                )}

                {!loading && query.length >= 3 && !result?.total && (
                  <div className="mono text-xs text-muted text-center py-8 uppercase tracking-widest">
                    Nenhum resultado para {query}
                  </div>
                )}

                {!loading && result && result.despesas.length > 0 && (
                  <section className="mb-6">
                    <h3 className="mono text-[10px] uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                      <Wallet size={12} />
                      Despesas ({result.despesas.length})
                    </h3>
                    <ul className="space-y-1">
                      {result.despesas.map((d, i) => (
                        <li key={`${d.numeroDocumento}-${i}`}>
                          <Link
                            href={`/gastos`}
                            onClick={() => setOpen(false)}
                            className="block p-3 border-2 border-transparent hover:border-ink hover:pl-5 transition-all"
                          >
                            <div className="flex justify-between items-baseline gap-2">
                              <span className="font-medium text-sm truncate">
                                {d.nomeBeneficiario || d.nomeOrgaoSuperior}
                              </span>
                              <span className="mono text-xs shrink-0">
                                {formatCurrency(d.valor)}
                              </span>
                            </div>
                            <div className="mono text-[10px] text-muted mt-1 truncate">
                              {d.nomeFuncao} • {d.dataPagamento}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {!loading && result && result.emendas.length > 0 && (
                  <section>
                    <h3 className="mono text-[10px] uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                      <ScrollText size={12} />
                      Emendas ({result.emendas.length})
                    </h3>
                    <ul className="space-y-1">
                      {result.emendas.map((e) => (
                        <li key={e.numeroEmenda}>
                          <Link
                            href={`/emendas/${e.numeroEmenda}`}
                            onClick={() => setOpen(false)}
                            className="block p-3 border-2 border-transparent hover:border-ink hover:pl-5 transition-all"
                          >
                            <div className="flex justify-between items-baseline gap-2">
                              <span className="font-medium text-sm truncate">
                                {e.nomeAutor || e.autor}
                              </span>
                              <span className="mono text-xs shrink-0">
                                {formatCurrency(parseCurrency(e.valorPago))}
                              </span>
                            </div>
                            <div className="mono text-[10px] text-muted mt-1 truncate">
                              {e.localidadeDoGasto} • {e.tipoEmenda} • {e.ano}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {!loading && !query && (
                  <div className="mono text-[10px] uppercase tracking-widest text-muted text-center py-8">
                    Digite pelo menos 3 caracteres para buscar
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
