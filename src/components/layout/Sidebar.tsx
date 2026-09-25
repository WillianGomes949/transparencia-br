"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  ScrollText,
  Plane,
  FileSignature,
  Home,
  X,
  TestTube,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

const NAV = [
  { href: "/", label: "Início", icon: Home },
  { href: "/gastos", label: "Gastos", icon: Wallet },
  { href: "/emendas", label: "Emendas", icon: ScrollText },
  { href: "/viagens", label: "Viagens", icon: Plane },
  { href: "/contratos", label: "Contratos", icon: FileSignature },
  { href: "/debug", label: "Debug", icon: TestTube },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Desktop */}
      <aside className="relative hidden md:block w-64 border-r-2 border-ink bg-paper min-h-[calc(100vh-80px)]">
        <nav className="p-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 border-2 border-transparent mono text-sm uppercase tracking-wider transition-all",
                  active
                    ? "bg-ink text-paper border-ink"
                    : "hover:border-ink hover:pl-5",
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 mono text-[10px] text-muted border-t-2 border-ink pt-3">
          <p>FONTE: PORTAL DA</p>
          <p>TRANSPARÊNCIA</p>
          <p className="mt-2">API v1 — DADOS ABERTOS</p>
        </div>
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-ink/40 z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-paper border-r-2 border-ink z-50"
            >
              <div className="flex justify-end p-4 border-b-2 border-ink">
                <Button
                  onClick={() => setSidebarOpen(false)}
                  className="brutal-button p-2"
                >
                  <X size={18} />
                </Button>
              </div>
              <nav className="p-4 space-y-1">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 border-2 border-transparent mono text-sm uppercase tracking-wider",
                        active
                          ? "bg-ink text-paper border-ink"
                          : "hover:border-ink",
                      )}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
