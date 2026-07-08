"use client";

import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Home,
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
  { href: "/dashboard", label: "Tableau", icon: BarChart3 },
  { href: "/week", label: "Semaines", icon: BookOpen },
  { href: "/corrections", label: "Corrections", icon: FileText },
  { href: "/project", label: "Projets", icon: Wrench },
  { href: "/checkpoint", label: "Bilans", icon: ClipboardCheck },
];

function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-surface/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 lg:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-xl pr-2 transition hover:bg-surface-muted/70"
          aria-label="Accueil"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-accent text-accent-contrast shadow-sm transition group-hover:bg-accent-hover">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <span className="hidden min-w-0 lg:block">
            <span className="block truncate text-sm font-semibold leading-5 text-foreground">
              BUT Info
            </span>
          </span>
        </Link>

        <nav
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-line bg-surface-muted/70 p-1 shadow-inner [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Navigation principale"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
                  active
                    ? "bg-accent text-accent-contrast shadow-sm"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/search"
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted-foreground shadow-sm transition hover:bg-surface-muted hover:text-foreground"
          aria-label="Rechercher"
          title="Rechercher"
        >
          <Search size={18} aria-hidden="true" />
        </Link>
        <Link
          href="/review"
          className="hidden size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted-foreground shadow-sm transition hover:bg-surface-muted hover:text-foreground xl:grid"
          aria-label="Révision"
          title="Révision"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
        </Link>
        <Link
          href="/resources"
          className="hidden size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted-foreground shadow-sm transition hover:bg-surface-muted hover:text-foreground xl:grid"
          aria-label="Ressources"
          title="Ressources"
        >
          <Rocket size={18} aria-hidden="true" />
        </Link>
        <Link
          href="/settings"
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted-foreground shadow-sm transition hover:bg-surface-muted hover:text-foreground"
          aria-label="Paramètres"
          title="Paramètres"
        >
          <Settings size={18} aria-hidden="true" />
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
            <p>Apprendre pas à pas, avec cours, exercices et corrections.</p>
            <p>{supabaseConfigured ? "Supabase configuré" : "Sauvegarde locale active"}</p>
          </div>
        </footer>
      </div>
    </ProgressProvider>
  );
}
