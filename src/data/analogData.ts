import rawAnalogData from './analog_data.json';
import type {
  AnalogDataset,
  EarthSite,
  LunarReference,
  MetricKey,
  MetricStats,
  ValueStatusTagKind,
} from '../types/terra';
import type { GlossaryTermKey } from '../components/ui/InfoTooltip';

export const ANALOG_DATA: AnalogDataset = rawAnalogData as AnalogDataset;

export const METRIC_KEYS: MetricKey[] = [
  'slope_deg',
  'roughness_m',
  'temp_diurnal_range_K',
];

export const METRIC_META: Record<
  MetricKey,
  {
    label: string;
    shortLabel: string;
    plainMeaning: string;
    description: string;
    tooltipKey?: GlossaryTermKey;
  }
> = {
  slope_deg: {
    label: 'Terrain slope',
    shortLabel: 'Slope',
    plainMeaning: 'Slope: how steep the ground is',
    description: 'Surface slope distribution (p5, p50, p95) computed on 30 m resampled DEMs.',
    tooltipKey: 'slope',
  },
  roughness_m: {
    label: 'Surface roughness',
    shortLabel: 'Roughness',
    plainMeaning: 'Roughness: how uneven the ground is at small scales',
    description: 'RMS height residual measured over matched moving windows on both bodies.',
    tooltipKey: 'roughness',
  },
  temp_diurnal_range_K: {
    label: 'Diurnal temperature range',
    shortLabel: 'Temperature',
    plainMeaning: 'Temperature range: how much surface temperature swings from day to night',
    description:
      'Day-to-night surface temperature swing (K). Default weight 0 (context only) due to scale and cold-trap differences.',
  },
};

export function isValidNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function formatMetricValue(
  value: number | null | undefined,
  decimals?: number
): string {
  if (!isValidNumber(value)) return 'no data';
  if (typeof decimals === 'number') {
    return value.toFixed(decimals);
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');
}

export function formatNullableString(value: string | null | undefined): string {
  if (value === null || value === undefined || value.trim() === '') return 'no data';
  return value;
}

export function hasCompletePercentiles(metric: MetricStats): boolean {
  return (
    isValidNumber(metric.p5) &&
    isValidNumber(metric.p50) &&
    isValidNumber(metric.p95)
  );
}

export function getMetricValueTag(metric: MetricStats): ValueStatusTagKind {
  if (!metric.scored || !hasCompletePercentiles(metric)) {
    return 'no_data';
  }
  if (metric.placeholder) {
    return 'demo';
  }
  return 'measured';
}

/**
 * Returns true if any displayed metric across the lunar reference or sites
 * has placeholder === true.
 */
export function hasAnyPlaceholderMetric(data: AnalogDataset = ANALOG_DATA): boolean {
  for (const key of METRIC_KEYS) {
    if (data.reference.metrics[key]?.placeholder) {
      return true;
    }
  }
  for (const site of data.sites) {
    for (const key of METRIC_KEYS) {
      const m = site.metrics[key];
      if (!m) continue;
      const isDisplayed = site.terrain_suitable || m.scored;
      if (isDisplayed && m.placeholder) {
        return true;
      }
    }
  }
  return false;
}

export function getTerrainCandidateSites(data: AnalogDataset = ANALOG_DATA): EarthSite[] {
  return data.sites.filter((s) => s.terrain_suitable);
}

export function getMaterialsOnlySites(data: AnalogDataset = ANALOG_DATA): EarthSite[] {
  return data.sites.filter((s) => !s.terrain_suitable);
}

export interface CoverageSummary {
  totalSites: number;
  terrainCandidateCount: number;
  materialsOnlyCount: number;
  datasetsCount: number;
  totalMetricSlots: number;
  measuredMetricCount: number;
  demoMetricCount: number;
  noDataMetricCount: number;
}

export function computeCoverageSummary(
  data: AnalogDataset,
  datasetsCount: number
): CoverageSummary {
  const terrainCandidates = getTerrainCandidateSites(data);
  const materialsOnly = getMaterialsOnlySites(data);

  let measuredMetricCount = 0;
  let demoMetricCount = 0;
  let noDataMetricCount = 0;
  let totalMetricSlots = 0;

  const inspectMetric = (m: MetricStats) => {
    totalMetricSlots += 1;
    const tag = getMetricValueTag(m);
    if (tag === 'measured') measuredMetricCount += 1;
    else if (tag === 'demo') demoMetricCount += 1;
    else noDataMetricCount += 1;
  };

  for (const key of METRIC_KEYS) {
    inspectMetric(data.reference.metrics[key]);
  }
  for (const site of data.sites) {
    for (const key of METRIC_KEYS) {
      inspectMetric(site.metrics[key]);
    }
  }

  return {
    totalSites: data.sites.length,
    terrainCandidateCount: terrainCandidates.length,
    materialsOnlyCount: materialsOnly.length,
    datasetsCount,
    totalMetricSlots,
    measuredMetricCount,
    demoMetricCount,
    noDataMetricCount,
  };
}

export interface RankingDemoBlocker {
  subject: string;
  body: 'Moon' | 'Earth';
  metricKey: MetricKey;
  metricLabel: string;
  weight: number;
}

export function getRankingDemoBlockers(
  data: AnalogDataset,
  weights: Record<MetricKey, number>
): {
  activeBlockers: RankingDemoBlocker[];
  allScoredDemoItems: RankingDemoBlocker[];
} {
  const allScoredDemoItems: RankingDemoBlocker[] = [];
  const terrainCandidates = getTerrainCandidateSites(data);

  for (const key of METRIC_KEYS) {
    const refMetric = data.reference.metrics[key];
    if (refMetric.scored && refMetric.placeholder) {
      allScoredDemoItems.push({
        subject: data.reference.name,
        body: 'Moon',
        metricKey: key,
        metricLabel: METRIC_META[key].shortLabel,
        weight: weights[key] ?? 0,
      });
    }
  }

  for (const site of terrainCandidates) {
    for (const key of METRIC_KEYS) {
      const m = site.metrics[key];
      if (m.scored && m.placeholder) {
        allScoredDemoItems.push({
          subject: site.name,
          body: 'Earth',
          metricKey: key,
          metricLabel: METRIC_META[key].shortLabel,
          weight: weights[key] ?? 0,
        });
      }
    }
  }

  const activeBlockers = allScoredDemoItems.filter(
    (item) => (weights[item.metricKey] ?? 0) > 0
  );

  return { activeBlockers, allScoredDemoItems };
}

export interface MetricComparisonResult {
  key: MetricKey;
  earth: MetricStats;
  moon: MetricStats;
  isScored: boolean;
  missingReason: 'not scored' | 'no data' | null;
  overlapRatio: number | null;
  medianDistance: number | null;
}

export function compareSingleMetric(
  key: MetricKey,
  earth: MetricStats,
  moon: MetricStats
): MetricComparisonResult {
  if (!earth.scored || !moon.scored) {
    return {
      key,
      earth,
      moon,
      isScored: false,
      missingReason: 'not scored',
      overlapRatio: null,
      medianDistance: null,
    };
  }

  if (!hasCompletePercentiles(earth) || !hasCompletePercentiles(moon)) {
    return {
      key,
      earth,
      moon,
      isScored: false,
      missingReason: 'no data',
      overlapRatio: null,
      medianDistance: null,
    };
  }

  const eMin = Math.min(earth.p5!, earth.p95!);
  const eMax = Math.max(earth.p5!, earth.p95!);
  const mMin = Math.min(moon.p5!, moon.p95!);
  const mMax = Math.max(moon.p5!, moon.p95!);

  const overlapLength = Math.max(0, Math.min(eMax, mMax) - Math.max(eMin, mMin));
  const unionLength = Math.max(eMax, mMax) - Math.min(eMin, mMin);

  const overlapRatio =
    unionLength > 0 ? Math.min(1, Math.max(0, overlapLength / unionLength)) : eMin === mMin ? 1 : 0;

  const medianDistance = Math.abs(earth.p50! - moon.p50!);

  return {
    key,
    earth,
    moon,
    isScored: true,
    missingReason: null,
    overlapRatio,
    medianDistance,
  };
}

export interface RankedCandidateResult {
  site: EarthSite;
  rank: number | null;
  compositeIndex: number | null;
  scoredCount: number;
  totalMetrics: number;
  activeWeightSum: number;
  normalizedWeights: Record<MetricKey, number>;
  metrics: Record<MetricKey, MetricComparisonResult>;
}

export function rankTerrainCandidates(
  sites: EarthSite[],
  reference: LunarReference,
  weights: Record<MetricKey, number>
): RankedCandidateResult[] {
  const candidates = sites.filter((s) => s.terrain_suitable);

  const prelim = candidates.map((site) => {
    const metrics = {} as Record<MetricKey, MetricComparisonResult>;
    let scoredCount = 0;
    let activeWeightSum = 0;

    for (const key of METRIC_KEYS) {
      const cmp = compareSingleMetric(key, site.metrics[key], reference.metrics[key]);
      metrics[key] = cmp;
      if (cmp.isScored && cmp.overlapRatio !== null) {
        scoredCount += 1;
        activeWeightSum += Math.max(0, weights[key] ?? 0);
      }
    }

    const normalizedWeights: Record<MetricKey, number> = {
      slope_deg: 0,
      roughness_m: 0,
      temp_diurnal_range_K: 0,
    };

    let compositeIndex: number | null = null;
    if (scoredCount > 0 && activeWeightSum > 0) {
      let weightedSum = 0;
      for (const key of METRIC_KEYS) {
        const cmp = metrics[key];
        if (cmp.isScored && cmp.overlapRatio !== null) {
          const nw = Math.max(0, weights[key] ?? 0) / activeWeightSum;
          normalizedWeights[key] = nw;
          weightedSum += nw * cmp.overlapRatio;
        }
      }
      compositeIndex = weightedSum;
    }

    return {
      site,
      rank: null as number | null,
      compositeIndex,
      scoredCount,
      totalMetrics: METRIC_KEYS.length,
      activeWeightSum,
      normalizedWeights,
      metrics,
    };
  });

  prelim.sort((a, b) => {
    if (a.compositeIndex === null && b.compositeIndex === null) {
      return a.site.name.localeCompare(b.site.name);
    }
    if (a.compositeIndex === null) return 1;
    if (b.compositeIndex === null) return -1;
    if (Math.abs(b.compositeIndex - a.compositeIndex) > 1e-9) {
      return b.compositeIndex - a.compositeIndex;
    }
    return a.site.name.localeCompare(b.site.name);
  });

  let nextRank = 1;
  for (const row of prelim) {
    if (row.compositeIndex !== null) {
      row.rank = nextRank;
      nextRank += 1;
    }
  }

  return prelim;
}

export interface WeightSetPreset {
  id: 'equal' | 'slope_heavy' | 'roughness_heavy';
  label: string;
  weights: Record<MetricKey, number>;
}

export const STABILITY_WEIGHT_SETS: WeightSetPreset[] = [
  {
    id: 'equal',
    label: 'Equal (0.50 / 0.50 / 0)',
    weights: { slope_deg: 0.5, roughness_m: 0.5, temp_diurnal_range_K: 0 },
  },
  {
    id: 'slope_heavy',
    label: 'Slope-heavy (0.80 / 0.20 / 0)',
    weights: { slope_deg: 0.8, roughness_m: 0.2, temp_diurnal_range_K: 0 },
  },
  {
    id: 'roughness_heavy',
    label: 'Roughness-heavy (0.20 / 0.80 / 0)',
    weights: { slope_deg: 0.2, roughness_m: 0.8, temp_diurnal_range_K: 0 },
  },
];

export interface RankStabilityEntry {
  siteId: string;
  siteName: string;
  ranks: Record<WeightSetPreset['id'], number | null>;
  isStable: boolean;
}

export function computeRankStability(
  sites: EarthSite[],
  reference: LunarReference
): RankStabilityEntry[] {
  const terrainSites = sites.filter((s) => s.terrain_suitable);
  const rankingsBySet = {} as Record<WeightSetPreset['id'], Map<string, number | null>>;

  for (const preset of STABILITY_WEIGHT_SETS) {
    const ranked = rankTerrainCandidates(terrainSites, reference, preset.weights);
    const map = new Map<string, number | null>();
    for (const row of ranked) {
      map.set(row.site.id, row.rank);
    }
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
      ranks: {
        equal: eq,
        slope_heavy: sh,
        roughness_heavy: rh,
      },
      isStable,
    };
  });
}
