import { useMemo, useState } from 'react';
import { ArrowRight, Info, Lock, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { InfoTooltip } from '../components/ui/InfoTooltip';
import { SurfacePanel } from '../components/ui/SurfacePanel';
import { NotScoredBadge, StabilityBadge, ValueTag } from '../components/ui/ValueTag';
import {
  formatMetricValue,
  getRankingDemoBlockers,
  METRIC_KEYS,
  METRIC_META,
  rankTerrainCandidates,
  STABILITY_WEIGHT_SETS,
} from '../data/analogData';
import type { AnalogDataset, MetricKey } from '../types/terra';

interface RankingViewProps {
  dataset: AnalogDataset;
  onSelectSite: (siteId: string) => void;
  onNextStep: () => void;
}

export function RankingView({
  dataset,
  onSelectSite,
  onNextStep,
}: RankingViewProps) {
  const defaultWeights = dataset.scoring.weights;

  const [weights, setWeights] = useState<Record<MetricKey, number>>(() => ({
    ...defaultWeights,
  }));

  const { activeBlockers, allScoredDemoItems } = useMemo(
    () => getRankingDemoBlockers(dataset, weights),
    [dataset, weights]
  );

  const isLocked = activeBlockers.length > 0;

  const rankedSites = useMemo(
    () => rankTerrainCandidates(dataset.sites, dataset.reference, weights),
    [dataset.sites, dataset.reference, weights]
  );

  const stabilityRows = useMemo(() => {
    const slopeOrRoughnessDemo = allScoredDemoItems.some(
      (b) => b.metricKey === 'slope_deg' || b.metricKey === 'roughness_m'
    );
    if (slopeOrRoughnessDemo) return [];
    const terrainSites = dataset.sites.filter((s) => s.terrain_suitable);
    const rankingsBySet = {} as Record<
      (typeof STABILITY_WEIGHT_SETS)[number]['id'],
      Map<string, number | null>
    >;
    for (const preset of STABILITY_WEIGHT_SETS) {
      const ranked = rankTerrainCandidates(
        terrainSites,
        dataset.reference,
        preset.weights
      );
      const map = new Map<string, number | null>();
      for (const row of ranked) map.set(row.site.id, row.rank);
      rankingsBySet[preset.id] = map;
    }
    return terrainSites.map((site) => {
      const eq = rankingsBySet.equal.get(site.id) ?? null;
      const sh = rankingsBySet.slope_heavy.get(site.id) ?? null;
      const rh = rankingsBySet.roughness_heavy.get(site.id) ?? null;
      const isStable = eq !== null && eq === sh && sh === rh;
      return {
        siteId: site.id,
        siteName: site.name,
        ranks: { equal: eq, slope_heavy: sh, roughness_heavy: rh },
        isStable,
      };
    });
  }, [dataset, allScoredDemoItems]);

  const allWeightsZero =
    weights.slope_deg === 0 &&
    weights.roughness_m === 0 &&
    weights.temp_diurnal_range_K === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Interpretive Guardrail */}
      <SurfacePanel className="p-4 flex items-start gap-3 text-xs text-[var(--terra-ink-secondary)]">
        <Info className="h-4 w-4 shrink-0 text-[var(--terra-amber)] mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold text-[var(--terra-ink)]">
            Relative index, not a probability or percentage match.
          </p>
          <p>
            Ranking covers terrain candidates only. Each scored metric computes{' '}
            <span className="font-mono text-[var(--terra-ink)]">
              overlap(Earth p5–p95, Moon p5–p95) / length(union)
            </span>{' '}
            from 0 to 1. Using <InfoTooltip termKey="p5_p95" label="p5/p50/p95 intervals" />{' '}
            is a simplified stand-in for full distribution overlap. Missing or unscored
            metrics are dropped and remaining weights are renormalized.
          </p>
        </div>
      </SurfacePanel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Weight Sliders */}
        <aside className="lg:col-span-4 space-y-4">
          <SurfacePanel className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--terra-border)] pb-3">
              <div>
                <p className="font-mono text-xs text-[var(--terra-amber)]">
                  Live metric weights
                </p>
                <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                  Weight sliders
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setWeights({ ...defaultWeights })}
                className="inline-flex min-h-[34px] items-center gap-1 rounded-[6px] px-2 text-xs text-[var(--terra-ink-muted)] hover:bg-[var(--terra-surface-elevated)] hover:text-[var(--terra-ink)] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              {METRIC_KEYS.map((key) => {
                const meta = METRIC_META[key];
                const raw = weights[key];
                const isTempContextOnly =
                  key === 'temp_diurnal_range_K' && raw === 0;

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor={`rank-weight-${key}`}
                        className="text-xs font-medium text-[var(--terra-ink)]"
                      >
                        {meta.label}
                      </label>
                      <span className="font-mono text-xs text-[var(--terra-amber)] tabular-nums">
                        {raw.toFixed(2)}
                      </span>
                    </div>

                    {isTempContextOnly && (
                      <span className="inline-block rounded-[4px] border border-[var(--terra-border-strong)] bg-[var(--terra-bg)] px-2 py-0.5 font-mono text-xs text-[var(--terra-ink-muted)]">
                        context only
                      </span>
                    )}

                    <input
                      id={`rank-weight-${key}`}
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={raw}
                      onChange={(e) =>
                        setWeights((prev) => ({
                          ...prev,
                          [key]: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-[var(--terra-amber)] cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {allWeightsZero && (
              <p className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border-strong)] bg-[var(--terra-bg)] p-3 text-xs text-[var(--terra-ink-muted)]">
                All weights are 0.00. Raise at least one weight above zero to compute the
                composite index.
              </p>
            )}

            <p className="border-t border-[var(--terra-border)] pt-3 text-xs text-[var(--terra-ink-secondary)] leading-relaxed">
              {dataset.scoring.weights_note}
            </p>
          </SurfacePanel>
        </aside>

        {/* Main Ranking Stage (Locked OR Unlocked) */}
        <section className="lg:col-span-8 space-y-5">
          {isLocked ? (
            <SurfacePanel tone="elevated" className="p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3 border-b border-[var(--terra-border)] pb-4">
                <Lock className="h-5 w-5 shrink-0 text-[var(--terra-amber)] mt-0.5" />
                <div className="space-y-1">
                  <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                    Ranking unlocks when real values replace the demo values
                  </h2>
                  <p className="text-sm text-[var(--terra-ink-secondary)]">
                    Active metrics used in the composite ranking still hold{' '}
                    <span className="font-mono text-xs">placeholder: true</span> demo
                    numbers in <span className="font-mono text-xs">analog_data.json</span>.
                    Scores and ordinal ranks are withheld until real extracted values replace
                    them.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-mono text-xs text-[var(--terra-amber)]">
                  Values still marked as demo ({activeBlockers.length} active blockers):
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activeBlockers.map((item) => (
                    <div
                      key={`${item.body}-${item.subject}-${item.metricKey}`}
                      className="flex items-center justify-between gap-2 rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--terra-ink)] truncate">
                          {item.subject}
                        </p>
                        <p className="font-mono text-[var(--terra-ink-muted)]">
                          {item.body} · {item.metricLabel}
                        </p>
                      </div>
                      <ValueTag kind="demo" />
                    </div>
                  ))}
                </div>
              </div>
            </SurfacePanel>
          ) : (
            <>
              {/* Unlocked Ranked Terrain Candidates */}
              <SurfacePanel tone="elevated" className="p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--terra-border)] pb-3">
                  <div>
                    <p className="font-mono text-xs text-[var(--terra-amber)]">
                      Terrain candidates ({rankedSites.length})
                    </p>
                    <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                      Relative overlap index vs. {dataset.reference.name}
                    </h2>
                  </div>
                  <ValueTag kind="derived" />
                </div>

                <div className="space-y-4">
                  {rankedSites.map((row) => {
                    const barWidth =
                      row.compositeIndex !== null
                        ? Math.max(2, Math.min(100, row.compositeIndex * 100))
                        : 0;

                    return (
                      <article
                        key={row.site.id}
                        className="rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 space-y-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-[4px] border border-[var(--terra-amber)]/50 bg-[var(--terra-amber-soft)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--terra-amber)] tabular-nums">
                                {row.rank !== null ? `#${row.rank}` : 'Unranked'}
                              </span>
                              <span className="rounded-[4px] border border-[var(--terra-border-strong)] bg-[var(--terra-surface)] px-2 py-0.5 font-mono text-xs text-[var(--terra-ink-secondary)]">
                                {row.scoredCount} of {row.totalMetrics} metrics scored
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-[var(--terra-ink)]">
                              {row.site.name}
                            </h3>
                          </div>

                          <div className="sm:text-right shrink-0 space-y-1">
                            <div className="flex sm:justify-end items-center gap-2">
                              <span className="font-mono text-xs text-[var(--terra-ink-muted)]">
                                Index (0–1)
                              </span>
                              <ValueTag kind="derived" />
                            </div>
                            <p className="font-mono text-xl font-medium text-[#5ec8e5] tabular-nums">
                              {formatMetricValue(row.compositeIndex, 3)}
                            </p>
                          </div>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-[3px] border border-[var(--terra-border)] bg-[var(--terra-surface)]">
                          <div
                            className="h-full bg-[#5ec8e5] terra-transition"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
                          {METRIC_KEYS.map((key) => {
                            const cmp = row.metrics[key];
                            const meta = METRIC_META[key];
                            const nw = row.normalizedWeights[key];
                            const isTempContext =
                              key === 'temp_diurnal_range_K' &&
                              weights.temp_diurnal_range_K === 0;

                            return (
                              <div
                                key={key}
                                className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-surface)] p-3 space-y-1"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-medium text-[var(--terra-ink)]">
                                    {meta.shortLabel}
                                  </span>
                                  {isTempContext ? (
                                    <span className="font-mono text-xs text-[var(--terra-ink-muted)]">
                                      context only
                                    </span>
                                  ) : (
                                    <span className="font-mono text-xs text-[var(--terra-ink-muted)] tabular-nums">
                                      w={nw.toFixed(2)}
                                    </span>
                                  )}
                                </div>

                                {!cmp.isScored ? (
                                  <div className="flex items-center gap-1.5 pt-0.5">
                                    {cmp.missingReason === 'not scored' && (
                                      <NotScoredBadge />
                                    )}
                                    <ValueTag kind="no_data" />
                                  </div>
                                ) : (
                                  <>
                                    <p className="font-mono text-xs text-[#5ec8e5] tabular-nums">
                                      overlap: {formatMetricValue(cmp.overlapRatio, 3)}
                                    </p>
                                    <p className="font-mono text-xs text-[var(--terra-ink-secondary)] tabular-nums">
                                      |Δp50|: {formatMetricValue(cmp.medianDistance, 2)}{' '}
                                      {cmp.earth.unit}
                                    </p>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectSite(row.site.id)}
                          >
                            <span>Inspect in Compare</span>
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </SurfacePanel>

              {/* Rank Stability Across Three Weight Sets */}
              {dataset.scoring.show_rank_stability && stabilityRows.length > 0 && (
                <SurfacePanel className="p-5 space-y-4">
                  <div className="border-b border-[var(--terra-border)] pb-3">
                    <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                      Rank stability across three weight sets
                    </h2>
                    <p className="mt-1 text-xs text-[var(--terra-ink-secondary)]">
                      Checks whether ordinal rank holds across Equal (0.50/0.50/0),
                      Slope-heavy (0.80/0.20/0), and Roughness-heavy (0.20/0.80/0).
                    </p>
                  </div>

                  <div className="space-y-2.5 md:hidden">
                    {stabilityRows.map((row) => (
                      <div
                        key={row.siteId}
                        className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-[var(--terra-ink)]">
                            {row.siteName}
                          </span>
                          <StabilityBadge stable={row.isStable} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono text-[var(--terra-ink-secondary)] tabular-nums">
                          <div>
                            Equal: {row.ranks.equal ? `#${row.ranks.equal}` : 'no data'}
                          </div>
                          <div>
                            Slope:{' '}
                            {row.ranks.slope_heavy ? `#${row.ranks.slope_heavy}` : 'no data'}
                          </div>
                          <div>
                            Rough:{' '}
                            {row.ranks.roughness_heavy
                              ? `#${row.ranks.roughness_heavy}`
                              : 'no data'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-[var(--terra-border)] font-mono text-[var(--terra-ink-muted)]">
                          <th className="py-2.5 pr-4 font-medium">Study area</th>
                          {STABILITY_WEIGHT_SETS.map((preset) => (
                            <th key={preset.id} className="px-3 py-2.5 font-medium">
                              {preset.label}
                            </th>
                          ))}
                          <th className="pl-3 py-2.5 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--terra-border)]">
                        {stabilityRows.map((row) => (
                          <tr key={row.siteId}>
                            <td className="py-3 pr-4 font-medium text-[var(--terra-ink)]">
                              {row.siteName}
                            </td>
                            <td className="px-3 py-3 font-mono tabular-nums text-[var(--terra-ink-secondary)]">
                              {row.ranks.equal !== null ? `#${row.ranks.equal}` : 'no data'}
                            </td>
                            <td className="px-3 py-3 font-mono tabular-nums text-[var(--terra-ink-secondary)]">
                              {row.ranks.slope_heavy !== null
                                ? `#${row.ranks.slope_heavy}`
                                : 'no data'}
                            </td>
                            <td className="px-3 py-3 font-mono tabular-nums text-[var(--terra-ink-secondary)]">
                              {row.ranks.roughness_heavy !== null
                                ? `#${row.ranks.roughness_heavy}`
                                : 'no data'}
                            </td>
                            <td className="pl-3 py-3 text-right">
                              <StabilityBadge stable={row.isStable} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SurfacePanel>
              )}
            </>
          )}
        </section>
      </div>

      {/* Single Next Step Footer */}
      <div className="flex justify-end border-t border-[var(--terra-border)] pt-5">
        <Button variant="primary" size="md" onClick={onNextStep}>
          <span>Next step: Review Evidence &amp; Methodology</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
