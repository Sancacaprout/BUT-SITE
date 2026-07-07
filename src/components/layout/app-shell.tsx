"use client";

import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Home,
  Library,
  Rocket,
  Search,
  Settings,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProgressProvider } from "@/lib/progress/progress-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/week/week-1", label: "Semaine", icon: BookOpen },
  { href: "/corrections", label: "Corrections", icon: FileText },
  { href: "/project/week-1", label: "Projet", icon: Wrench },
  { href: "/checkpoint/week-1", label: "Checkpoint", icon: ClipboardCheck },
  { href: "/library", label: "Fiches", icon: Library },
  { href: "/review", label: "Révision", icon: CheckCircle2 },
  { href: "/resources", label: "Ressources", icon: Rocket },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Accueil">
          <span className="grid size-10 place-items-center rounded-md bg-accent text-white">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-sm font-semibold text-foreground">
              BUT Info Starter
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Semaine 1 sans spoiler
            </span>
          </span>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" aria-label="Navigation principale">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                  active
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/search"
          className="grid size-10 shrink-0 place-items-center rounded-md border border-line text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          aria-label="Rechercher"
          title="Rechercher"
        >
          <Search size={18} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <ProgressProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>{children}</main>
        <footer className="border-t border-line bg-surface">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <p>Programme extrait du PDF fourni, structuré pour apprendre par étapes.</p>
            <p>{supabaseConfigured ? "Supabase configuré" : "Mode localStorage actif"}</p>
          </div>
        </footer>
      </div>
    </ProgressProvider>
  );
}
