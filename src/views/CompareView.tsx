import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Crosshair,
  ExternalLink,
  Flame,
  GitCompare,
  HelpCircle,
  Info,
  Layers,
  Moon,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { InfoTooltip } from '../components/ui/InfoTooltip';
import { SurfacePanel } from '../components/ui/SurfacePanel';
import { NotScoredBadge, ValueTag } from '../components/ui/ValueTag';
import {
  compareSingleMetric,
  formatMetricValue,
  formatNullableString,
  getMetricValueTag,
  METRIC_KEYS,
  METRIC_META,
} from '../data/analogData';
import {
  COMPARISON_DIMENSIONS,
  getPairwiseComparison,
  type DimensionComparisonEntry,
} from '../data/analogueComparisons';
import {
  EARTH_ANALOGUE_SITES,
  getEarthAnalogueById,
  type EarthAnalogueSiteRecord,
} from '../data/earthAnalogueSites';
import {
  PLANETARY_TARGETS,
  getPlanetaryTargetById,
  type PlanetaryTargetRecord,
} from '../data/planetaryTargets';
import type { AnalogDataset, EarthSite } from '../types/terra';

interface CompareViewProps {
  dataset: AnalogDataset;
  selectedEarthSiteId: string;
  selectedPlanetaryTargetId?: string;
  onSelectEarthSite: (id: string) => void;
  onSelectPlanetaryTarget?: (targetId: string) => void;
  onOpenMaterialsPanel: (siteId: string) => void;
  onNextStep: () => void;
}

function formatLatLon(lat: number, lon: number): string {
  return `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(3)}° ${lon >= 0 ? 'E' : 'W'}`;
}

export function CompareView({
  dataset,
  selectedEarthSiteId,
  selectedPlanetaryTargetId,
  onSelectEarthSite,
  onSelectPlanetaryTarget,
  onOpenMaterialsPanel,
  onNextStep,
}: CompareViewProps) {
  const [activePlanetaryTargetId, setActivePlanetaryTargetId] = useState<string>(
    selectedPlanetaryTargetId ?? 'moon-connecting-ridge'
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'all' | 'terrain' | 'composition' | 'environment' | 'operations'
  >('all');
  const [expandedDimensionId, setExpandedDimensionId] = useState<string | null>(null);

  const earthSiteRecord: EarthAnalogueSiteRecord = useMemo(() => {
    return (
      getEarthAnalogueById(selectedEarthSiteId) ??
      EARTH_ANALOGUE_SITES[0]
    );
  }, [selectedEarthSiteId]);

  const analogSiteData: EarthSite | undefined = useMemo(() => {
    return dataset.sites.find((s) => s.id === selectedEarthSiteId);
  }, [dataset.sites, selectedEarthSiteId]);

  const planetaryTarget: PlanetaryTargetRecord = useMemo(() => {
    return (
      getPlanetaryTargetById(activePlanetaryTargetId) ??
      PLANETARY_TARGETS[0]
    );
  }, [activePlanetaryTargetId]);

  const pairwiseComparison = useMemo(() => {
    return getPairwiseComparison(earthSiteRecord.siteId, planetaryTarget.targetId);
  }, [earthSiteRecord.siteId, planetaryTarget.targetId]);

  const filteredDimensions: DimensionComparisonEntry[] = useMemo(() => {
    if (activeCategoryFilter === 'all') {
      return pairwiseComparison.dimensions;
    }
    const metaMap = new Map(COMPARISON_DIMENSIONS.map((d) => [d.id, d.category]));
    return pairwiseComparison.dimensions.filter(
      (dim) => metaMap.get(dim.dimensionId) === activeCategoryFilter
    );
  }, [pairwiseComparison, activeCategoryFilter]);

  const handleTargetChange = (targetId: string) => {
    setActivePlanetaryTargetId(targetId);
    onSelectPlanetaryTarget?.(targetId);
  };

  const isMaterialOnly = earthSiteRecord.classification === 'materials_reference';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <SurfacePanel tone="elevated" className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--terra-amber)]">
            <GitCompare className="h-4 w-4" />
            <span>PLANETARY COMPARISON WORKSPACE</span>
            <span className="text-[var(--terra-border-strong)]">·</span>
            <span>12 Scientific Comparison Dimensions</span>
          </div>
          <span
            className={`rounded-[4px] border px-2.5 py-0.5 font-mono text-xs font-semibold ${
              pairwiseComparison.evidenceTier === 'Strong supporting evidence'
                ? 'border-[var(--terra-sage)]/60 bg-[var(--terra-sage-soft)] text-[#86efac]'
                : pairwiseComparison.evidenceTier === 'Materials reference only'
                  ? 'border-[var(--terra-border)] bg-[var(--terra-bg)] text-[var(--terra-sage)]'
                  : 'border-[var(--terra-amber)]/60 bg-[var(--terra-amber-soft)] text-[var(--terra-amber)]'
            }`}
          >
            {pairwiseComparison.evidenceTier}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-medium text-[var(--terra-ink)] leading-snug">
          Compare Earth Analogues with Moon Base Locations and Mars Targets
        </h1>

        <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed max-w-4xl">
          {pairwiseComparison.summaryAnalogy}
        </p>
      </SurfacePanel>

      {/* Two-Point Selector: Earth Analogue vs Planetary Target */}
      <SurfacePanel tone="elevated" className="p-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-11 lg:items-center">
          {/* Left Point: Earth Analogue Site */}
          <div className="lg:col-span-5 rounded-[var(--terra-radius-md)] border border-[#5ec8e5]/45 bg-[var(--terra-bg)] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="compare-earth-select"
                className="font-mono text-xs font-medium text-[#5ec8e5]"
              >
                Earth analogue site (cyan)
              </label>
              <span
                aria-hidden="true"
                className="inline-block h-2 w-6 rounded-[2px] bg-[#5ec8e5]"
              />
            </div>

            <select
              id="compare-earth-select"
              value={earthSiteRecord.siteId}
              onChange={(e) => onSelectEarthSite(e.target.value)}
              aria-label="Select Earth analogue site"
              className="min-h-[40px] w-full rounded-[var(--terra-radius-sm)] border border-[var(--terra-border-strong)] bg-[var(--terra-surface)] px-3 text-sm font-medium text-[var(--terra-ink)] cursor-pointer"
            >
              <optgroup label="Established Reference Analogues">
                {EARTH_ANALOGUE_SITES.filter(
                  (s) => s.classification === 'established_analogue'
                ).map((site) => (
                  <option key={site.siteId} value={site.siteId}>
                    {site.name} ({site.country})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Proposed Candidate Analogues">
                {EARTH_ANALOGUE_SITES.filter(
                  (s) => s.classification === 'candidate_analogue'
                ).map((site) => (
                  <option key={site.siteId} value={site.siteId}>
                    {site.name} ({site.country})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Materials-Only References">
                {EARTH_ANALOGUE_SITES.filter(
                  (s) => s.classification === 'materials_reference'
                ).map((site) => (
                  <option key={site.siteId} value={site.siteId}>
                    {site.name} ({site.country})
                  </option>
                ))}
              </optgroup>
            </select>

            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--terra-ink-muted)]">
              <span className="tabular-nums">
                {formatLatLon(earthSiteRecord.coordinates.lat, earthSiteRecord.coordinates.lon)}
              </span>
              <a
                href={earthSiteRecord.coordinateSource}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--terra-amber)] hover:underline"
              >
                <span>Coordinate source</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="text-xs text-[var(--terra-ink-secondary)]">
              Environment: <span className="text-[var(--terra-ink)]">{earthSiteRecord.environmentType}</span>
            </p>
          </div>

          {/* Connecting Line with VS */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center gap-1 py-1">
            <div className="hidden lg:flex w-full items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-[#5ec8e5]" />
              <div className="h-px flex-1 bg-[var(--terra-border-strong)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--terra-amber)]" />
            </div>
            <div className="lg:hidden flex h-6 w-px bg-[var(--terra-border-strong)]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--terra-ink-muted)]">
              vs
            </span>
          </div>

          {/* Right Point: Planetary Target Selector */}
          <div className="lg:col-span-5 rounded-[var(--terra-radius-md)] border border-[var(--terra-amber)]/45 bg-[var(--terra-bg)] p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-[var(--terra-amber)]">
                {planetaryTarget.planet === 'moon' ? (
                  <Moon className="h-3.5 w-3.5" />
                ) : (
                  <Flame className="h-3.5 w-3.5" />
                )}
                <span>Planetary target ({planetaryTarget.planet.toUpperCase()})</span>
              </div>
              <span
                aria-hidden="true"
                className="inline-block h-2 w-6 rounded-[2px] bg-[var(--terra-amber)]"
              />
            </div>

            <select
              id="compare-planet-select"
              value={planetaryTarget.targetId}
              onChange={(e) => handleTargetChange(e.target.value)}
              aria-label="Select planetary target"
              className="min-h-[40px] w-full rounded-[var(--terra-radius-sm)] border border-[var(--terra-border-strong)] bg-[var(--terra-surface)] px-3 text-sm font-medium text-[var(--terra-ink)] cursor-pointer"
            >
              <optgroup label="Moon Targets (Permanent Base Candidates)">
                {PLANETARY_TARGETS.filter((t) => t.planet === 'moon').map((target) => (
                  <option key={target.targetId} value={target.targetId}>
                    {target.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Mars Targets (Rover Exploration & Craters)">
                {PLANETARY_TARGETS.filter((t) => t.planet === 'mars').map((target) => (
                  <option key={target.targetId} value={target.targetId}>
                    {target.name}
                  </option>
                ))}
              </optgroup>
            </select>

            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--terra-ink-muted)]">
              <span className="tabular-nums">
                {formatLatLon(planetaryTarget.coordinates.lat, planetaryTarget.coordinates.lon)}
              </span>
              <a
                href={planetaryTarget.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--terra-amber)] hover:underline"
              >
                <span>Mission archive</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="text-xs text-[var(--terra-ink-secondary)]">
              Context: <span className="text-[var(--terra-ink)]">{planetaryTarget.missionContext}</span>
            </p>
          </div>
        </div>

        {/* Materials-only Warning if applicable */}
        {isMaterialOnly && (
          <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-sage)]/50 bg-[var(--terra-sage-soft)] p-3 flex items-start gap-2.5 text-xs">
            <Info className="h-4 w-4 shrink-0 text-[var(--terra-sage)] mt-0.5" />
            <div>
              <p className="font-semibold text-[var(--terra-ink)]">
                Materials-Only Reference ({earthSiteRecord.name})
              </p>
              <p className="text-[var(--terra-ink-secondary)] mt-0.5 leading-relaxed">
                This site is a geochemical, mineralogical, and petrographic benchmark (anorthosite cumulate
                or fresh volcanic basalt). It is strictly excluded from terrain score ranking to prevent alpine relief
                from skewing terrain evaluations.
              </p>
            </div>
          </div>
        )}
      </SurfacePanel>

      {/* 12 Scientific Comparison Dimensions */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--terra-border)] pb-3">
          <div>
            <h2 className="text-xl font-medium text-[var(--terra-ink)]">
              12 Scientific Comparison Dimensions
            </h2>
            <p className="text-xs text-[var(--terra-ink-muted)]">
              Systematic evaluation across terrain, composition, environmental dynamics, and surface operations.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {(
              [
                { id: 'all', label: 'All Dimensions (12)' },
                { id: 'composition', label: 'Composition' },
                { id: 'terrain', label: 'Terrain' },
                { id: 'environment', label: 'Environment' },
                { id: 'operations', label: 'Operations' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`rounded-[4px] px-2.5 py-1 text-xs cursor-pointer terra-transition ${
                  activeCategoryFilter === cat.id
                    ? 'bg-[var(--terra-amber)] text-[#0a0c0f] font-semibold'
                    : 'border border-[var(--terra-border)] bg-[var(--terra-bg)] text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions Cards */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDimensions.map((entry) => {
            const meta = COMPARISON_DIMENSIONS.find((d) => d.id === entry.dimensionId);
            const isExpanded = expandedDimensionId === entry.dimensionId;

            return (
              <SurfacePanel key={entry.dimensionId} className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-[var(--terra-border)] pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--terra-ink)]">
                        {meta ? meta.name : entry.dimensionId}
                      </h3>
                      <span className="rounded-[4px] border border-[var(--terra-border-strong)] bg-[var(--terra-bg)] px-2 py-0.5 font-mono text-[11px] text-[var(--terra-ink-muted)]">
                        {meta ? meta.category : 'metric'}
                      </span>
                      <span className="font-mono text-xs text-[var(--terra-ink-muted)]">
                        unit: {entry.units}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--terra-ink-secondary)]">
                      {meta?.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <ValueTag kind={entry.statusTag} />
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedDimensionId(isExpanded ? null : entry.dimensionId)
                      }
                      aria-label="Toggle dimension details"
                      className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[var(--terra-border)] text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)] cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Earth vs Planetary Observations */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
                  <div className="rounded-[var(--terra-radius-sm)] border border-[#5ec8e5]/35 bg-[var(--terra-bg)] p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#5ec8e5]">
                        Earth Analogue: {earthSiteRecord.name}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--terra-ink-muted)]">
                        {entry.resolutionEarth}
                      </span>
                    </div>
                    <p className="text-[var(--terra-ink)] leading-relaxed">
                      {entry.earthObservation}
                    </p>
                    <div className="font-mono text-[11px] text-[var(--terra-ink-muted)] border-t border-[var(--terra-border)] pt-2">
                      Dataset: {entry.sourceDatasetEarth}
                    </div>
                  </div>

                  <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-amber)]/35 bg-[var(--terra-bg)] p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[var(--terra-amber)]">
                        Planetary Target: {planetaryTarget.name}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--terra-ink-muted)]">
                        {entry.resolutionPlanet}
                      </span>
                    </div>
                    <p className="text-[var(--terra-ink)] leading-relaxed">
                      {entry.planetaryObservation}
                    </p>
                    <div className="font-mono text-[11px] text-[var(--terra-ink-muted)] border-t border-[var(--terra-border)] pt-2">
                      Dataset: {entry.sourceDatasetPlanet}
                    </div>
                  </div>
                </div>

                {/* Expanded Methodology & Uncertainty Details */}
                {isExpanded && (
                  <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-surface-elevated)] p-4 space-y-2 text-xs">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <span className="font-mono text-[var(--terra-amber)]">Comparison method:</span>
                        <p className="text-[var(--terra-ink)] mt-0.5">{entry.comparisonMethod}</p>
                      </div>
                      <div>
                        <span className="font-mono text-[var(--terra-ink-muted)]">Observation timeframe:</span>
                        <p className="text-[var(--terra-ink)] mt-0.5">{entry.observationPeriod}</p>
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[var(--terra-sage)]">Uncertainty analysis:</span>
                      <p className="text-[var(--terra-ink-secondary)] mt-0.5">{entry.uncertainty}</p>
                    </div>
                    {entry.missingInformation && (
                      <div className="rounded border border-[var(--terra-danger)]/40 bg-[#231215] p-2 text-[var(--terra-danger)]">
                        <span className="font-mono font-semibold">Missing data notice: </span>
                        <span>{entry.missingInformation}</span>
                      </div>
                    )}
                  </div>
                )}
              </SurfacePanel>
            );
          })}
        </div>
      </section>

      {/* 7-Question Analogy Explanation Card */}
      <SurfacePanel tone="elevated" className="p-5 sm:p-6 space-y-5">
        <div className="border-b border-[var(--terra-border)] pb-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--terra-amber)]">
            <Sparkles className="h-4 w-4" />
            <span>SCIENTIFIC EVALUATION</span>
          </div>
          <h2 className="text-xl font-medium text-[var(--terra-ink)] mt-1">
            Why {earthSiteRecord.name} Analogs {planetaryTarget.name}
          </h2>
          <p className="text-xs text-[var(--terra-ink-muted)] mt-0.5">
            Structured 7-point evaluation answering core mission questions for science and operations teams.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
          <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 space-y-1.5">
            <h3 className="font-mono text-xs font-semibold text-[#5ec8e5]">
              1. What is similar?
            </h3>
            <p className="text-[var(--terra-ink)] leading-relaxed">
              {earthSiteRecord.analogyExplanation.whatIsSimilar}
            </p>
          </div>

          <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 space-y-1.5">
            <h3 className="font-mono text-xs font-semibold text-[var(--terra-amber)]">
              2. What is different?
            </h3>
            <p className="text-[var(--terra-ink)] leading-relaxed">
              {earthSiteRecord.analogyExplanation.whatIsDifferent}
            </p>
          </div>

          <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 space-y-1.5">
            <h3 className="font-mono text-xs font-semibold text-[var(--terra-sage)]">
              3. Why does this similarity matter?
            </h3>
            <p className="text-[var(--terra-ink)] leading-relaxed">
              {earthSiteRecord.analogyExplanation.whySimilarityMatters}
            </p>
          </div>

          <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 space-y-1.5">
            <h3 className="font-mono text-xs font-semibold text-[#ffd8a8]">
              4. Testable scientific experiments
            </h3>
            <p className="text-[var(--terra-ink)] leading-relaxed">
              {earthSiteRecord.analogyExplanation.experimentsPossible}
            </p>
          </div>

          <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 space-y-1.5">
            <h3 className="font-mono text-xs font-semibold text-[#86efac]">
              5. Technology &amp; hardware to test
            </h3>
            <p className="text-[var(--terra-ink)] leading-relaxed">
              {earthSiteRecord.analogyExplanation.technologyToTest}
            </p>
          </div>

          <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 space-y-1.5">
            <h3 className="font-mono text-xs font-semibold text-[#fca5a5]">
              6. Exploration risk reduction
            </h3>
            <p className="text-[var(--terra-ink)] leading-relaxed">
              {earthSiteRecord.analogyExplanation.explorationRiskReduction}
            </p>
          </div>
        </div>

        {/* 7. Physical Limits */}
        <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-danger)]/40 bg-[var(--terra-bg)] p-4 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[var(--terra-danger)]" />
            <h3 className="font-mono text-xs font-semibold text-[var(--terra-danger)]">
              7. What CANNOT be reproduced on Earth (physical limits)
            </h3>
          </div>
          <p className="text-[var(--terra-ink)] leading-relaxed">
            {earthSiteRecord.analogyExplanation.whatCannotBeReproduced}
          </p>
        </div>
      </SurfacePanel>

      {/* Single Next Step Footer */}
      <div className="flex justify-end border-t border-[var(--terra-border)] pt-5">
        <Button variant="primary" size="md" onClick={onNextStep}>
          <span>Next step: Inspect Data Provenance on Evidence Page</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
