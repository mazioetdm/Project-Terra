import { useEffect, useMemo, useRef, useState } from 'react';
import { Database, MapPin, Menu, Moon, Search, X } from 'lucide-react';
import { ANALOG_DATA } from '../../data/analogData';
import { DATA_PROVENANCE_RECORDS } from '../../data/dataSources';
import type {
  AppRoute,
  DatasetProvenanceRecord,
  EarthSite,
} from '../../types/terra';

interface TopBarProps {
  currentRoute: AppRoute;
  onOpenMobileSidebar: () => void;
  onSelectSite: (site: EarthSite) => void;
  onSelectLunarReference: () => void;
  onSelectDataset: (record: DatasetProvenanceRecord) => void;
}

const ROUTE_HEADER: Record<AppRoute, { title: string; subtitle: string }> = {
  overview: {
    title: 'Overview',
    subtitle:
      'What you are looking at: the research question, Connecting Ridge reference values, and dataset readiness.',
  },
  explore: {
    title: 'Explore',
    subtitle:
      'What you are looking at: Moon and Earth globes paired with study area profiles and coordinate controls.',
  },
  compare: {
    title: 'Compare',
    subtitle:
      'What you are looking at: side-by-side Earth and Connecting Ridge terrain ranges on shared axes plus limitations.',
  },
  ranking: {
    title: 'Ranking',
    subtitle:
      'What you are looking at: gated interval-overlap ranking and sensitivity checks across terrain candidates.',
  },
  evidence: {
    title: 'Evidence',
    subtitle:
      'What you are looking at: official dataset records and methodology documentation.',
  },
};

export function TopBar({
  currentRoute,
  onOpenMobileSidebar,
  onSelectSite,
  onSelectLunarReference,
  onSelectDataset,
}: TopBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const meta = ROUTE_HEADER[currentRoute] ?? ROUTE_HEADER.overview;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const refMatches =
      !q ||
      ANALOG_DATA.reference.name.toLowerCase().includes(q) ||
      'connecting ridge moon south pole'.includes(q);

    const sites = q
      ? ANALOG_DATA.sites.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q) ||
            s.role.toLowerCase().includes(q)
        )
      : ANALOG_DATA.sites;

    const datasets = q
      ? DATA_PROVENANCE_RECORDS.filter(
          (d) =>
            d.datasetName.toLowerCase().includes(q) ||
            d.organisation.toLowerCase().includes(q) ||
            d.variable.toLowerCase().includes(q)
        )
      : DATA_PROVENANCE_RECORDS;

    return { refMatches, sites, datasets };
  }, [query]);

  const totalMatches =
    (matches.refMatches ? 1 : 0) + matches.sites.length + matches.datasets.length;

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--terra-border)] bg-[var(--terra-bg)]/95 px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open navigation sidebar"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-surface)] text-[var(--terra-ink)] lg:hidden cursor-pointer"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <h1 className="font-display text-xl font-medium text-[var(--terra-ink)] leading-tight">
              {meta.title}
            </h1>
            <p className="mt-0.5 text-xs text-[var(--terra-ink-secondary)] leading-snug">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Working Search over Site Names & Dataset Names */}
        <div ref={searchBoxRef} className="relative w-full md:w-80 shrink-0">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--terra-ink-muted)]"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
            }}
            placeholder="Search site names or datasets..."
            aria-label="Search site names and dataset names"
            className="min-h-[38px] w-full rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-surface)] pl-9 pr-8 text-xs text-[var(--terra-ink)] placeholder:text-[var(--terra-ink-muted)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--terra-ink-muted)] hover:text-[var(--terra-ink)] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {open && (
            <div className="absolute left-0 right-0 top-[42px] z-30 max-h-80 overflow-y-auto rounded-[var(--terra-radius-md)] border border-[var(--terra-border-strong)] bg-[#141820] shadow-[var(--terra-shadow-panel)]">
              <div className="flex items-center justify-between border-b border-[var(--terra-border)] px-3 py-2">
                <span className="font-mono text-xs text-[var(--terra-ink-muted)]">
                  Sites &amp; datasets ({totalMatches})
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs text-[var(--terra-ink-muted)] hover:text-[var(--terra-ink)] cursor-pointer"
                >
                  Close
                </button>
              </div>

              {totalMatches === 0 ? (
                <p className="p-3 text-xs text-[var(--terra-ink-muted)]">
                  No site or dataset matches &ldquo;{query}&rdquo;.
                </p>
              ) : (
                <div className="divide-y divide-[var(--terra-border)]">
                  {matches.refMatches && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                        onSelectLunarReference();
                      }}
                      className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--terra-surface-hover)] cursor-pointer"
                    >
                      <Moon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--terra-amber)]" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[var(--terra-ink)] truncate">
                          {ANALOG_DATA.reference.name}
                        </p>
                        <p className="font-mono text-xs text-[var(--terra-amber)]">
                          Moon reference · AOI centre pending
                        </p>
                      </div>
                    </button>
                  )}

                  {matches.sites.map((site) => (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                        onSelectSite(site);
                      }}
                      className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--terra-surface-hover)] cursor-pointer"
                    >
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5ec8e5]" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[var(--terra-ink)] truncate">
                          {site.name}
                        </p>
                        <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                          Earth site · {site.terrain_suitable ? 'Terrain candidate' : 'Materials only'}
                        </p>
                      </div>
                    </button>
                  ))}

                  {matches.datasets.map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                        onSelectDataset(rec);
                      }}
                      className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--terra-surface-hover)] cursor-pointer"
                    >
                      <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--terra-ink-secondary)]" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[var(--terra-ink)] truncate">
                          {rec.datasetName}
                        </p>
                        <p className="font-mono text-xs text-[var(--terra-ink-muted)] truncate">
                          Dataset · {rec.applicableBody}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
