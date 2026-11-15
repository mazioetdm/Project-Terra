import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SurfacePanel } from '../components/ui/SurfacePanel';
import { DATA_PROVENANCE_RECORDS } from '../data/dataSources';

interface EvidenceViewProps {
  initialDatasetQuery?: string;
  onNextStep: () => void;
}

export function EvidenceView({
  initialDatasetQuery = '',
  onNextStep,
}: EvidenceViewProps) {
  const [query, setQuery] = useState(initialDatasetQuery);

  useEffect(() => {
    if (initialDatasetQuery !== undefined) {
      setQuery(initialDatasetQuery);
    }
  }, [initialDatasetQuery]);

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DATA_PROVENANCE_RECORDS;
    return DATA_PROVENANCE_RECORDS.filter(
      (rec) =>
        rec.datasetName.toLowerCase().includes(q) ||
        rec.organisation.toLowerCase().includes(q) ||
        rec.variable.toLowerCase().includes(q) ||
        rec.productIdentifier.toLowerCase().includes(q) ||
        rec.applicableBody.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <SurfacePanel tone="elevated" className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--terra-amber)]">
          <span>TERRA Evidence &amp; Datasets</span>
          <span className="text-[var(--terra-border-strong)]">·</span>
          <span>Official Scientific Provenance Registry</span>
        </div>
        <h2 className="text-xl font-medium text-[var(--terra-ink)] leading-snug">
          Verified Earth, Moon, and Mars open scientific datasets powering the TERRA analogue comparison platform.
        </h2>
        <p className="text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
          Every dataset record specifies its source organization, spatial resolution, coordinate reference system, processing level, and known limitations.
        </p>
      </SurfacePanel>

      <div className="space-y-4">
        <SurfacePanel className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--terra-ink-secondary)]">
            Showing {filteredRecords.length} of {DATA_PROVENANCE_RECORDS.length} registered datasets.
          </p>

          <div className="relative sm:w-72 shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--terra-ink-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter datasets..."
              aria-label="Filter datasets"
              className="min-h-[38px] w-full rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] pl-9 pr-8 text-xs text-[var(--terra-ink)] placeholder:text-[var(--terra-ink-muted)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear dataset filter"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--terra-ink-muted)] hover:text-[var(--terra-ink)] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </SurfacePanel>

        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No dataset records match the filter"
            description="Clear the search box to inspect all listed datasets."
            actionLabel="Clear filter"
            onAction={() => setQuery('')}
          />
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((rec) => (
              <SurfacePanel key={rec.id} className="p-5 space-y-4">
                <div className="flex flex-col gap-3 border-b border-[var(--terra-border)] pb-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-[var(--terra-amber)]">
                      {rec.applicableBody} · {rec.temporalClass}
                    </p>
                    <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                      {rec.datasetName}
                    </h2>
                    <p className="text-xs text-[var(--terra-ink-secondary)]">
                      {rec.organisation}
                    </p>
                  </div>

                  <a
                    href={rec.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[var(--terra-radius-sm)] border border-[var(--terra-border-strong)] bg-[var(--terra-surface-elevated)] px-3 text-xs font-medium text-[var(--terra-amber)] hover:bg-[var(--terra-surface-hover)] shrink-0 self-start"
                  >
                    <span>Official source</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                  <div>
                    <dt className="font-mono text-[var(--terra-ink-muted)]">Variable</dt>
                    <dd className="mt-0.5 text-[var(--terra-ink)]">{rec.variable}</dd>
                  </div>

                  <div>
                    <dt className="font-mono text-[var(--terra-ink-muted)]">
                      Resolution
                    </dt>
                    <dd className="mt-0.5 text-[var(--terra-ink)]">
                      {rec.spatialResolution}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-[var(--terra-ink-muted)]">Units</dt>
                    <dd className="mt-0.5 text-[var(--terra-ink)]">{rec.units}</dd>
                  </div>

                  <div>
                    <dt className="font-mono text-[var(--terra-ink-muted)]">
                      Product identifier
                    </dt>
                    <dd className="mt-0.5 font-mono text-[var(--terra-ink)] break-all">
                      {rec.productIdentifier}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-[var(--terra-ink-muted)]">
                      Retrieval / date
                    </dt>
                    <dd className="mt-0.5 text-[var(--terra-ink)]">
                      {rec.observationDate}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-[var(--terra-ink-muted)]">
                      Coordinate system
                    </dt>
                    <dd className="mt-0.5 font-mono text-[var(--terra-ink)]">
                      {rec.coordinateReferenceSystem}
                    </dd>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 border-t border-[var(--terra-border)] pt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div>
                      <dt className="font-mono text-[var(--terra-amber)]">
                        Uncertainty
                      </dt>
                      <dd className="mt-1 text-[var(--terra-ink-secondary)] leading-relaxed">
                        {rec.uncertainty}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-mono text-[var(--terra-amber)]">
                        Limitation
                      </dt>
                      <dd className="mt-1 text-[var(--terra-ink-secondary)] leading-relaxed">
                        {rec.limitation}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-mono text-[var(--terra-ink-muted)]">
                        Unverified items in JSON
                      </dt>
                      <dd className="mt-1 text-[var(--terra-ink-secondary)] leading-relaxed">
                        {rec.unverifiedDetails.length === 0 ? (
                          <span className="text-[var(--terra-ink-muted)]">
                            None flagged
                          </span>
                        ) : (
                          <ul className="space-y-1.5">
                            {rec.unverifiedDetails.map((detail) => (
                              <li key={detail} className="flex items-start gap-2">
                                <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-[4px] border border-[var(--terra-amber)]/50 bg-[var(--terra-amber-soft)] px-1.5 py-0.5 font-mono text-xs text-[var(--terra-amber-hover)]">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>unverified</span>
                                </span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </dd>
                    </div>
                  </div>
                </dl>
              </SurfacePanel>
            ))}
          </div>
        )}
      </div>

      {/* Single Next Step Footer */}
      <div className="flex justify-end border-t border-[var(--terra-border)] pt-5">
        <Button variant="primary" size="md" onClick={onNextStep}>
          <span>Next step: View Methodology</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
