import {
  BarChart3,
  BookOpen,
  Compass,
  GitCompare,
  Globe2,
  X,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { AppRoute } from '../../types/terra';

interface SidebarProps {
  currentRoute: AppRoute;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onNavigate: (route: AppRoute) => void;
}

const NAV_ITEMS: {
  route: AppRoute;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { route: 'overview', label: 'Overview', icon: Compass },
  { route: 'explore', label: 'Explore', icon: Globe2 },
  { route: 'compare', label: 'Compare', icon: GitCompare },
  { route: 'ranking', label: 'Ranking', icon: BarChart3 },
  { route: 'evidence', label: 'Evidence', icon: BookOpen },
];

export function Sidebar({
  currentRoute,
  mobileOpen,
  onCloseMobile,
  onNavigate,
}: SidebarProps) {
  const handleSelect = (route: AppRoute) => {
    onNavigate(route);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[#080a0d] border-r border-[var(--terra-border)]">
      <div>
        <div className="flex h-14 items-center justify-between border-b border-[var(--terra-border)] px-5">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              handleSelect('overview');
            }}
            className="font-display text-xl font-semibold tracking-tight text-[var(--terra-ink)] whitespace-nowrap"
          >
            TERRA
          </a>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation sidebar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--terra-radius-sm)] text-[var(--terra-ink-muted)] hover:bg-[var(--terra-surface)] hover:text-[var(--terra-ink)] lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Primary navigation" className="px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleSelect(item.route)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[42px] w-full items-center gap-3 rounded-[var(--terra-radius-sm)] px-3 text-left text-sm font-medium whitespace-nowrap cursor-pointer terra-transition ${
                  active
                    ? 'bg-[var(--terra-amber-soft)] text-[var(--terra-ink)] border border-[var(--terra-amber)]/45'
                    : 'text-[var(--terra-ink-secondary)] hover:bg-[var(--terra-surface)] hover:text-[var(--terra-ink)] border border-transparent'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? 'text-[var(--terra-amber)]' : 'text-[var(--terra-ink-muted)]'
                  }`}
                  strokeWidth={1.75}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[var(--terra-border)] px-5 py-4">
        <p className="font-mono text-xs text-[var(--terra-amber)]">
          Lunar south pole scope
        </p>
        <p className="mt-1 text-xs text-[var(--terra-ink-muted)] leading-relaxed">
          Earth analogues for the lunar south pole.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-[232px]">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={onCloseMobile}
            aria-hidden="true"
            className="fixed inset-0 bg-black/65"
          />
          <aside className="relative z-10 w-[264px] max-w-[85vw] h-full">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
