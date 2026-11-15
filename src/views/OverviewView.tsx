import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Compass,
  ExternalLink,
  Flame,
  GitCompare,
  Globe2,
  ImageOff,
  Layers,
  Loader2,
  Moon,
  Satellite,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { InfoTooltip } from '../components/ui/InfoTooltip';
import { SurfacePanel } from '../components/ui/SurfacePanel';
import { ImageTypeBadge, ValueTag } from '../components/ui/ValueTag';
import {
  computeCoverageSummary,
  formatMetricValue,
  formatNullableString,
  getMetricValueTag,
  METRIC_KEYS,
  METRIC_META,
} from '../data/analogData';
import { DATA_PROVENANCE_RECORDS } from '../data/dataSources';
import { EARTH_ANALOGUE_SITES } from '../data/earthAnalogueSites';
import { PLANETARY_TARGETS } from '../data/planetaryTargets';
import { fetchMoonLocationImagery } from '../providers/moonSurfaceImageryProvider';
import type {
  AnalogDataset,
  AppRoute,
  PlanetaryBodyId,
  SurfaceObservationImage,
} from '../types/terra';

interface OverviewViewProps {
  dataset: AnalogDataset;
  onNavigate: (route: AppRoute) => void;
  onOpenExploreBody: (body: PlanetaryBodyId) => void;
  onOpenCompareBreakdown: () => void;
}

export function OverviewView({
  dataset,
  onNavigate,
  onOpenExploreBody,
  onOpenCompareBreakdown: _onOpenCompareBreakdown,
}: OverviewViewProps) {
  const [lunarImageStatus, setLunarImageStatus] = useState<
    'loading' | 'ready' | 'unavailable'
  >('loading');
  const [lunarImage, setLunarImage] = useState<SurfaceObservationImage | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLunarImageStatus('loading');

    fetchMoonLocationImagery(dataset.reference.id, null, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        if (res.status === 'ready' && res.images.length > 0) {
          setLunarImage(res.images[0]);
          setLunarImageStatus('ready');
        } else {
          setLunarImage(null);
          setLunarImageStatus('unavailable');
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLunarImage(null);
          setLunarImageStatus('unavailable');
        }
      });

    return () => controller.abort();
  }, [dataset.reference.id]);

  const coverage = useMemo(
    () => computeCoverageSummary(dataset, DATA_PROVENANCE_RECORDS.length),
    [dataset]
  );

  const readinessFraction =
    coverage.totalMetricSlots > 0
      ? coverage.measuredMetricCount / coverage.totalMetricSlots
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Banner: Official NASA Space Apps Challenge Alignment */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <SurfacePanel
          tone="elevated"
          className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-5"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-[var(--terra-amber)] font-semibold">TERRA</span>
              <span className="text-[var(--terra-border-strong)]">·</span>
              <span className="text-[var(--terra-ink-secondary)]">
                NASA Space Apps Challenge
              </span>
              <span className="text-[var(--terra-border-strong)]">·</span>
              <span className="text-[var(--terra-sage)]">
                Earth Analog Discovery Platform
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-medium text-[var(--terra-ink)] leading-snug">
              Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars
            </h1>

            <p className="text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
              TERRA integrates open Earth, Moon, and Mars scientific datasets to characterize and
              compare terrestrial environments that help prepare for future lunar bases (Artemis III
              South Pole) and Mars robotic/crewed exploration.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-[var(--terra-border)] pt-4">
            <button
              type="button"
              onClick={() => onOpenExploreBody('earth')}
              className="flex items-center justify-center gap-1.5 rounded-[var(--terra-radius-sm)] border border-[#5ec8e5]/40 bg-[#5ec8e5]/10 px-3 py-2 text-xs font-semibold text-[#5ec8e5] hover:bg-[#5ec8e5]/20 cursor-pointer terra-transition"
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>Explore Earth</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenExploreBody('moon')}
              className="flex items-center justify-center gap-1.5 rounded-[var(--terra-radius-sm)] border border-[var(--terra-amber)]/40 bg-[var(--terra-amber)]/10 px-3 py-2 text-xs font-semibold text-[var(--terra-amber)] hover:bg-[var(--terra-amber)]/20 cursor-pointer terra-transition"
            >
              <Moon className="h-3.5 w-3.5" />
              <span>Explore Moon</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenExploreBody('mars')}
              className="flex items-center justify-center gap-1.5 rounded-[var(--terra-radius-sm)] border border-[#e05638]/40 bg-[#e05638]/10 px-3 py-2 text-xs font-semibold text-[#e05638] hover:bg-[#e05638]/20 cursor-pointer terra-transition"
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Explore Mars</span>
            </button>
          </div>
        </SurfacePanel>

        <SurfacePanel className="lg:col-span-5 p-4 flex flex-col justify-between gap-3">
          {lunarImageStatus === 'loading' && (
            <div className="flex min-h-[210px] flex-col items-center justify-center gap-2 rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[#0b0d11] p-4 text-center">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--terra-amber)]" />
              <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                Loading NASA LROC south pole tile...
              </p>
            </div>
          )}

          {lunarImageStatus === 'ready' && lunarImage && (
            <figure className="m-0 space-y-2.5">
              <div className="relative overflow-hidden rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[#080a0d] aspect-[16/10]">
                <img
                  src={lunarImage.thumbnailUrl}
                  alt={`${lunarImage.title} — ${lunarImage.cameraOrInstrument}`}
                  referrerPolicy="no-referrer"
                  onError={() => setLunarImageStatus('unavailable')}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2.5 top-2.5">
                  <ImageTypeBadge type="orbital" />
                </div>
              </div>
              <figcaption className="space-y-1 text-xs">
                <p className="font-medium text-[var(--terra-ink)]">{lunarImage.title}</p>
                <p className="font-mono text-[var(--terra-ink-muted)]">
                  {lunarImage.spacecraft} · {lunarImage.cameraOrInstrument} ·{' '}
                  {lunarImage.acquisitionDate}
                </p>
                <a
                  href={lunarImage.originalSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-amber)] hover:underline"
                >
                  <span>Open NASA LROC archive</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </figcaption>
            </figure>
          )}

          {lunarImageStatus === 'unavailable' && (
            <div className="flex min-h-[210px] flex-col items-center justify-center gap-3 rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[#0b0d11] p-5 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--terra-border-strong)] bg-[var(--terra-surface)]">
                {lunarImage ? (
                  <ImageOff className="h-4 w-4 text-[var(--terra-ink-muted)]" />
                ) : (
                  <Satellite className="h-4 w-4 text-[var(--terra-amber)]" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[var(--terra-ink)]">
                  Planetary Observation Archive Active
                </p>
                <p className="text-xs text-[var(--terra-ink-muted)]">
                  Access verified NASA Moon Trek and Mars Trek global mosaics directly:
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 font-mono text-xs">
                <a
                  href="https://trek.nasa.gov/moon/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--terra-amber)] hover:underline"
                >
                  <span>Moon Trek</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://trek.nasa.gov/mars/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#e05638] hover:underline"
                >
                  <span>Mars Trek</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </SurfacePanel>
      </section>

      {/* Dual Planetary Exploration Pathways */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--terra-border)] pb-3">
          <div>
            <span className="font-mono text-xs text-[var(--terra-amber)] font-medium">
              Exploration Architecture
            </span>
            <h2 className="text-xl font-medium text-[var(--terra-ink)]">
              Two Dedicated Planetary Analogue Pathways
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--terra-ink-muted)]">
            Moon &amp; Mars workflows
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Pathway 1: Moon Base Analogue Pathway */}
          <SurfacePanel className="p-5 sm:p-6 flex flex-col justify-between space-y-4 border border-[var(--terra-amber)]/40 bg-[var(--terra-surface)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--terra-amber)] font-semibold">
                  <Moon className="h-4 w-4" />
                  <span>PATHWAY 1: MOON PERMANENT BASE</span>
                </div>
                <span className="rounded bg-[var(--terra-amber)]/10 px-2 py-0.5 font-mono text-[11px] text-[var(--terra-amber)]">
                  Artemis Exploration Zone
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[var(--terra-ink)]">
                Lunar South Pole Base Analogue Workflow
              </h3>

              <p className="text-xs text-[var(--terra-ink-secondary)] leading-relaxed">
                Connects candidate lunar base habitats on peak illumination ridges (Connecting
                Ridge, Malapert Mountain) to shock-metamorphosed anorthosite crusts and alpine permafrost
                ridges on Earth.
              </p>

              <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 space-y-1.5 text-xs font-mono">
                <p className="text-[var(--terra-ink-muted)]">Primary Terrestrial Analogues:</p>
                <div className="flex flex-wrap gap-2 text-[var(--terra-ink)]">
                  <span className="rounded border border-[var(--terra-border)] bg-[var(--terra-surface)] px-2 py-0.5">
                    Mistastin / Kamestastin (Anorthosite)
                  </span>
                  <span className="rounded border border-[var(--terra-border)] bg-[var(--terra-surface)] px-2 py-0.5">
                    Haughton Structure (Polar Breccia)
                  </span>
                  <span className="rounded border border-[var(--terra-border)] bg-[var(--terra-surface)] px-2 py-0.5">
                    Taglang La Pass (Slope &amp; Scree)
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => onOpenExploreBody('moon')}
            >
              <span>Explore Moon Base Pathway</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SurfacePanel>

          {/* Pathway 2: Mars Exploration Analogue Pathway */}
          <SurfacePanel className="p-5 sm:p-6 flex flex-col justify-between space-y-4 border border-[#e05638]/40 bg-[var(--terra-surface)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-[#e05638] font-semibold">
                  <Flame className="h-4 w-4" />
                  <span>PATHWAY 2: MARS EXPLORATION</span>
                </div>
                <span className="rounded bg-[#e05638]/10 px-2 py-0.5 font-mono text-[11px] text-[#e05638]">
                  Mars 2020 / MSL / ISRU
                </span>
              </div>

              <h3 className="text-lg font-semibold text-[var(--terra-ink)]">
                Mars Landing &amp; Surface Exploration Workflow
              </h3>

              <p className="text-xs text-[var(--terra-ink-secondary)] leading-relaxed">
                Connects rover traverse corridors, ancient lacustrine deltas, and subsurface ice
                sheets (Jezero Crater, Gale Crater, Utopia Planitia) to hyper-arid clays, perchlorate
                soils, and High-Arctic permafrost patterned ground.
              </p>

              <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 space-y-1.5 text-xs font-mono">
                <p className="text-[var(--terra-ink-muted)]">Primary Terrestrial Analogues:</p>
                <div className="flex flex-wrap gap-2 text-[var(--terra-ink)]">
                  <span className="rounded border border-[var(--terra-border)] bg-[var(--terra-surface)] px-2 py-0.5">
                    Atacama Core (Perchlorates &amp; Clays)
                  </span>
                  <span className="rounded border border-[var(--terra-border)] bg-[var(--terra-surface)] px-2 py-0.5">
                    Svalbard (Permafrost &amp; Ice Polygons)
                  </span>
                  <span className="rounded border border-[var(--terra-border)] bg-[var(--terra-surface)] px-2 py-0.5">
                    Haughton Structure (Valley Channels)
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              className="w-full border-[#e05638]/60 text-[#e05638] hover:bg-[#e05638]/15"
              onClick={() => onOpenExploreBody('mars')}
            >
              <span>Explore Mars Pathway</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </SurfacePanel>
        </div>
      </section>

      {/* Guided 4-Step Research Sequence */}
      <SurfacePanel className="p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-medium text-[var(--terra-ink)]">How to Use TERRA</h2>
          <span className="font-mono text-xs text-[var(--terra-ink-muted)]">
            4-step scientific workflow
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => onNavigate('explore')}
            className="flex flex-col justify-between rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 text-left hover:border-[var(--terra-amber)]/60 cursor-pointer terra-transition"
          >
            <div>
              <p className="font-mono text-xs text-[var(--terra-amber)] font-semibold">Step 1</p>
              <p className="mt-1 text-sm font-semibold text-[var(--terra-ink)]">
                Planetary Explorer
              </p>
              <p className="mt-1 text-xs text-[var(--terra-ink-muted)]">
                Rotate, zoom, and inspect interactive 3D globes of Earth, Moon, and Mars.
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-amber)]">
              <span>Open Planetary Explorer</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('study-areas')}
            className="flex flex-col justify-between rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 text-left hover:border-[var(--terra-cyan)]/60 cursor-pointer terra-transition"
          >
            <div>
              <p className="font-mono text-xs text-[#5ec8e5] font-semibold">Step 2</p>
              <p className="mt-1 text-sm font-semibold text-[var(--terra-ink)]">
                Earth Analogue Discovery
              </p>
              <p className="mt-1 text-xs text-[var(--terra-ink-muted)]">
                Inspect 7 study locations with ground-level field photography and institutional records.
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-[#5ec8e5]">
              <span>Discover Analogues</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('compare')}
            className="flex flex-col justify-between rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 text-left hover:border-[var(--terra-sage)]/60 cursor-pointer terra-transition"
          >
            <div>
              <p className="font-mono text-xs text-[var(--terra-sage)] font-semibold">Step 3</p>
              <p className="mt-1 text-sm font-semibold text-[var(--terra-ink)]">
                12-Dimension Compare
              </p>
              <p className="mt-1 text-xs text-[var(--terra-ink-muted)]">
                Compare Earth analogues with Moon and Mars targets with honest uncertainty metrics.
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-sage)]">
              <span>Compare Environments</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('evidence')}
            className="flex flex-col justify-between rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-4 text-left hover:border-[var(--terra-border-strong)] cursor-pointer terra-transition"
          >
            <div>
              <p className="font-mono text-xs text-[var(--terra-ink-secondary)] font-semibold">Step 4</p>
              <p className="mt-1 text-sm font-semibold text-[var(--terra-ink)]">
                Evidence &amp; Methodology
              </p>
              <p className="mt-1 text-xs text-[var(--terra-ink-muted)]">
                Verify open institutional data provenance from NASA, USGS, ESA, and CSA.
              </p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-ink)]">
              <span>Inspect Evidence</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </button>
        </div>
      </SurfacePanel>

      {/* Dataset Coverage & Institutional Readiness */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <SurfacePanel className="lg:col-span-8 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-medium text-[var(--terra-ink)]">
              Scientific Dataset Coverage
            </h2>
            <ValueTag kind="derived" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3.5 space-y-1">
              <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                Earth Analogue Sites
              </p>
              <p className="font-mono text-xl font-medium text-[#5ec8e5] tabular-nums">
                {EARTH_ANALOGUE_SITES.length}
              </p>
              <p className="text-xs text-[var(--terra-ink-secondary)]">
                3 Established · 2 Proposed Candidates · 2 Materials Only
              </p>
            </div>

            <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3.5 space-y-1">
              <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                Planetary Targets
              </p>
              <p className="font-mono text-xl font-medium text-[var(--terra-amber)] tabular-nums">
                {PLANETARY_TARGETS.length}
              </p>
              <p className="text-xs text-[var(--terra-ink-secondary)]">
                2 Moon Base Candidates · 5 Mars Exploration Targets
              </p>
            </div>

            <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3.5 space-y-1">
              <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                Comparison Dimensions
              </p>
              <p className="font-mono text-xl font-medium text-[var(--terra-sage)] tabular-nums">
                12
              </p>
              <p className="text-xs text-[var(--terra-ink-secondary)]">
                Terrain, Composition, Environment &amp; Operations
              </p>
            </div>
          </div>
        </SurfacePanel>

        <SurfacePanel className="lg:col-span-4 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                Data Integrity
              </h2>
              <ValueTag kind="measured" />
            </div>
            <p className="text-xs text-[var(--terra-ink-secondary)]">
              Verified ground-level photography and open scientific datasets from institutional archives.
            </p>
          </div>

          <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--terra-ink-muted)]">Ground-Level Photos:</span>
              <span className="text-[var(--terra-sage)] font-semibold">100% Authentic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--terra-ink-muted)]">Planetary Elevation:</span>
              <span className="text-[var(--terra-amber)]">LOLA &amp; MOLA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--terra-ink-muted)]">Uncertainty Metrics:</span>
              <span className="text-[#5ec8e5]">Explicitly Declared</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onNavigate('methodology')}
          >
            <span>Review Scientific Methodology</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </SurfacePanel>
      </section>

      {/* Footer Next Step */}
      <div className="flex justify-end border-t border-[var(--terra-border)] pt-5">
        <Button variant="primary" size="md" onClick={() => onNavigate('explore')}>
          <span>Next step: Launch Planetary Explorer (Earth, Moon &amp; Mars)</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
