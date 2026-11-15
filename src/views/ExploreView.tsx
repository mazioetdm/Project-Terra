import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  ExternalLink,
  GitCompare,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Moon,
  Plus,
  RotateCcw,
} from 'lucide-react';
import {
  PlanetaryGlobeCanvas,
  type PlanetaryGlobeHandle,
} from '../components/globe/PlanetaryGlobeCanvas';
import { SurfaceImageModal } from '../components/globe/SurfaceImageModal';
import { Button } from '../components/ui/Button';
import { InfoTooltip } from '../components/ui/InfoTooltip';
import { SurfacePanel } from '../components/ui/SurfacePanel';
import { TerrainImage } from '../components/ui/TerrainImage';
import {
  AgreementBadge,
  ImageTypeBadge,
  NotScoredBadge,
  ValueTag,
} from '../components/ui/ValueTag';
import {
  ANALOG_DATA,
  formatMetricValue,
  formatNullableString,
  getMaterialsOnlySites,
  getMetricValueTag,
  getTerrainCandidateSites,
  METRIC_KEYS,
  METRIC_META,
} from '../data/analogData';
import {
  getVerifiedMediaForSite,
  toSurfaceObservationImage,
} from '../data/media';
import { getDefaultEarthModisDate } from '../providers/earthGibsProvider';
import {
  getPlanetaryMarkers,
  loadPlanetaryLayer,
  PLANET_DEFINITIONS,
  PLANET_LAYERS,
} from '../providers/planetRegistry';
import { fetchLocationSurfaceImagery } from '../providers/surfaceImageryRegistry';
import type {
  EarthSite,
  LocationImageryResult,
  PlanetaryBodyId,
  PlanetaryFeatureMarker,
  SurfaceObservationImage,
  TileLoadResult,
} from '../types/terra';
import {
  getPlanetaryTargetById,
  getPlanetaryTargetsForPlanet,
  type PlanetaryTargetRecord,
} from '../data/planetaryTargets';

interface ExploreViewProps {
  activeBody: PlanetaryBodyId;
  selectedSiteId: string;
  selectedPlanetaryTargetId?: string;
  onChangeBody: (body: PlanetaryBodyId) => void;
  onSelectSiteId: (siteId: string) => void;
  onSelectPlanetaryTarget?: (targetId: string) => void;
  onCompareEarthSite: (siteId: string) => void;
  onFindEarthAnalogues?: (targetId: string, suggestedEarthSiteId?: string) => void;
  onNextStep: () => void;
}

function formatCoord(val: number, posLabel: string, negLabel: string): string {
  const hemi = val >= 0 ? posLabel : negLabel;
  return `${Math.abs(val).toFixed(3)}° ${hemi}`;
}

export function ExploreView({
  activeBody,
  selectedSiteId,
  selectedPlanetaryTargetId,
  onChangeBody,
  onSelectSiteId,
  onSelectPlanetaryTarget,
  onCompareEarthSite,
  onFindEarthAnalogues,
  onNextStep,
}: ExploreViewProps) {
  const globeRef = useRef<PlanetaryGlobeHandle | null>(null);
  const globeStageRef = useRef<HTMLDivElement | null>(null);

  const terrainCandidates = useMemo(
    () => getTerrainCandidateSites(ANALOG_DATA),
    []
  );
  const materialsOnlySites = useMemo(
    () => getMaterialsOnlySites(ANALOG_DATA),
    []
  );

  const marsTargets = useMemo(() => getPlanetaryTargetsForPlanet('mars'), []);
  const moonTargets = useMemo(() => getPlanetaryTargetsForPlanet('moon'), []);

  const [selectedMarsTargetId, setSelectedMarsTargetId] = useState<string>(
    selectedPlanetaryTargetId && selectedPlanetaryTargetId.startsWith('mars-')
      ? selectedPlanetaryTargetId
      : 'mars-jezero'
  );
  const [selectedMoonTargetId, setSelectedMoonTargetId] = useState<string>(
    selectedPlanetaryTargetId && selectedPlanetaryTargetId.startsWith('moon-')
      ? selectedPlanetaryTargetId
      : 'moon-connecting-ridge'
  );

  const currentMarsTarget: PlanetaryTargetRecord = useMemo(
    () => getPlanetaryTargetById(selectedMarsTargetId) ?? marsTargets[0],
    [selectedMarsTargetId, marsTargets]
  );
  const currentMoonTarget: PlanetaryTargetRecord = useMemo(
    () => getPlanetaryTargetById(selectedMoonTargetId) ?? moonTargets[0],
    [selectedMoonTargetId, moonTargets]
  );

  const allMarkers = useMemo(() => getPlanetaryMarkers(), []);
  const bodyDef = PLANET_DEFINITIONS[activeBody];
  const bodyLayers = PLANET_LAYERS[activeBody];
  const bodyMarkers = useMemo(
    () => allMarkers.filter((m) => m.body === activeBody),
    [allMarkers, activeBody]
  );

  const selectedSite: EarthSite = useMemo(
    () =>
      ANALOG_DATA.sites.find((s) => s.id === selectedSiteId) ??
      terrainCandidates[0] ??
      ANALOG_DATA.sites[0],
    [selectedSiteId, terrainCandidates]
  );

  const [selectedLayerId, setSelectedLayerId] = useState<string>(bodyLayers[0].id);
  const [modisDate, setModisDate] = useState<string>(getDefaultEarthModisDate());
  const [showGraticule, setShowGraticule] = useState<boolean>(true);
  const [layerDrawerOpen, setLayerDrawerOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Slidable top-left Active Body HUD
  const [hudExpanded, setHudExpanded] = useState<boolean>(true);
  const [hudDragOffset, setHudDragOffset] = useState<number>(0);
  const [isDraggingHud, setIsDraggingHud] = useState<boolean>(false);
  const hudPanelRef = useRef<HTMLDivElement | null>(null);
  const hudDragRef = useRef<{
    pointerId: number;
    startX: number;
    moved: boolean;
    captured: boolean;
    width: number;
  } | null>(null);

  // Coordinate Inspector State
  const [selectOnMapMode, setSelectOnMapMode] = useState<boolean>(false);
  const [latInput, setLatInput] = useState<string>(
    activeBody === 'moon'
      ? String(currentMoonTarget.coordinates.lat)
      : activeBody === 'mars'
        ? String(currentMarsTarget.coordinates.lat)
        : String(selectedSite.centre.lat)
  );
  const [lonInput, setLonInput] = useState<string>(
    activeBody === 'moon'
      ? String(currentMoonTarget.coordinates.lon)
      : activeBody === 'mars'
        ? String(currentMarsTarget.coordinates.lon)
        : String(selectedSite.centre.lon)
  );
  const [coordError, setCoordError] = useState<string | null>(null);
  const [pickedCoord, setPickedCoord] = useState<{ lat: number; lon: number } | null>(
    null
  );

  const [hoverCoords, setHoverCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  // Imagery state
  const [imageryResult, setImageryResult] = useState<LocationImageryResult>({
    status: 'idle',
    locationId: '',
    images: [],
    archiveLinks: [],
  });
  const [activeModalImage, setActiveModalImage] =
    useState<SurfaceObservationImage | null>(null);

  const activeLayer = useMemo(
    () => bodyLayers.find((l) => l.id === selectedLayerId) ?? bodyLayers[0],
    [bodyLayers, selectedLayerId]
  );

  const [tileResult, setTileResult] = useState<TileLoadResult>({
    status: 'loading',
    loadedTiles: 0,
    totalTiles: 0,
    layerId: activeLayer.id,
    effectiveDate: activeLayer.imageryDate,
    officialUrl: activeLayer.officialUrl,
  });

  // Reset layer and camera when body changes
  useEffect(() => {
    const nextLayers = PLANET_LAYERS[activeBody];
    setSelectedLayerId(nextLayers[0].id);
    setPickedCoord(null);
    setCoordError(null);

    if (activeBody === 'moon') {
      setLatInput(String(currentMoonTarget.coordinates.lat));
      setLonInput(String(currentMoonTarget.coordinates.lon));
      globeRef.current?.viewSouthPole();
    } else if (activeBody === 'mars') {
      setLatInput(String(currentMarsTarget.coordinates.lat));
      setLonInput(String(currentMarsTarget.coordinates.lon));
      globeRef.current?.flyToLatLon(
        currentMarsTarget.coordinates.lat,
        currentMarsTarget.coordinates.lon,
        1.85
      );
    } else {
      setLatInput(String(selectedSite.centre.lat));
      setLonInput(String(selectedSite.centre.lon));
      globeRef.current?.flyToLatLon(
        selectedSite.centre.lat,
        selectedSite.centre.lon,
        1.95
      );
    }
  }, [activeBody]);

  // Sync lat/lon input when Earth site selection changes
  useEffect(() => {
    if (activeBody === 'earth') {
      setPickedCoord(null);
      setCoordError(null);
      setLatInput(String(selectedSite.centre.lat));
      setLonInput(String(selectedSite.centre.lon));
      globeRef.current?.flyToLatLon(
        selectedSite.centre.lat,
        selectedSite.centre.lon,
        1.92
      );
    }
  }, [selectedSite.id, activeBody]);

  // Load NASA WMTS layer mosaic
  useEffect(() => {
    const controller = new AbortController();
    setTileResult({
      status: 'loading',
      loadedTiles: 0,
      totalTiles: 0,
      layerId: activeLayer.id,
      effectiveDate: activeLayer.supportsDateSelection
        ? modisDate
        : activeLayer.imageryDate,
      officialUrl: activeLayer.officialUrl,
    });

    loadPlanetaryLayer(activeBody, activeLayer, modisDate, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setTileResult(result);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setTileResult({
          status: 'unavailable',
          loadedTiles: 0,
          totalTiles: 0,
          layerId: activeLayer.id,
          effectiveDate: activeLayer.supportsDateSelection
            ? modisDate
            : activeLayer.imageryDate,
          officialUrl: activeLayer.officialUrl,
          errorMessage:
            err instanceof Error
              ? err.message
              : 'NASA imagery service could not be reached.',
        });
      });

    return () => controller.abort();
  }, [activeBody, activeLayer, modisDate]);

  // Fetch verified NASA imagery for Moon / Earth coordinate
  useEffect(() => {
    const locationId =
      activeBody === 'moon'
        ? pickedCoord
          ? `coord-${pickedCoord.lat.toFixed(2)}-${pickedCoord.lon.toFixed(2)}`
          : ANALOG_DATA.reference.id
        : selectedSite.id;

    const coords =
      activeBody === 'moon'
        ? pickedCoord ?? ANALOG_DATA.reference.centre
        : pickedCoord ?? selectedSite.centre;

    const controller = new AbortController();
    setImageryResult({
      status: 'loading',
      locationId,
      images: [],
      archiveLinks: [],
    });

    fetchLocationSurfaceImagery(activeBody, locationId, coords, controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) {
          setImageryResult(res);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setImageryResult({
          status: 'unavailable',
          locationId,
          images: [],
          archiveLinks: [],
          errorMessage:
            err instanceof Error
              ? err.message
              : 'Unable to query planetary imagery archive.',
        });
      });

    return () => controller.abort();
  }, [activeBody, selectedSite.id, pickedCoord]);

  // Fullscreen keyboard & browser sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const handleToggleFullscreen = async () => {
    if (isFullscreen) {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // fallback handled
        }
      }
      setIsFullscreen(false);
      return;
    }
    setIsFullscreen(true);
    try {
      if (globeStageRef.current?.requestFullscreen) {
        await globeStageRef.current.requestFullscreen();
      }
    } catch {
      // fixed-inset fallback remains active
    }
  };

  const handleSelectMarkerFromGlobe = useCallback(
    (marker: PlanetaryFeatureMarker) => {
      setPickedCoord(null);
      setSelectOnMapMode(false);
      if (marker.body === 'mars') {
        setSelectedMarsTargetId(marker.id);
        onSelectPlanetaryTarget?.(marker.id);
        const target = getPlanetaryTargetById(marker.id);
        if (target) {
          setLatInput(String(target.coordinates.lat));
          setLonInput(String(target.coordinates.lon));
          globeRef.current?.flyToLatLon(target.coordinates.lat, target.coordinates.lon, 1.85);
        }
      } else if (marker.body === 'moon') {
        setSelectedMoonTargetId(marker.id);
        onSelectPlanetaryTarget?.(marker.id);
        const target = getPlanetaryTargetById(marker.id);
        if (target) {
          setLatInput(String(target.coordinates.lat));
          setLonInput(String(target.coordinates.lon));
          globeRef.current?.flyToLatLon(target.coordinates.lat, target.coordinates.lon, 1.85);
        }
      } else if (marker.linkedSiteId) {
        onSelectSiteId(marker.linkedSiteId);
      }
    },
    [onSelectSiteId, onSelectPlanetaryTarget]
  );

  const handleSelectCoordinateFromGlobe = useCallback(
    (coords: { lat: number; lon: number }) => {
      if (!selectOnMapMode && activeBody === 'earth') {
        // Still allow inspecting clicked point cleanly
      }
      setPickedCoord(coords);
      setLatInput(coords.lat.toFixed(3));
      setLonInput(coords.lon.toFixed(3));
      setCoordError(null);
      setSelectOnMapMode(false);
    },
    [selectOnMapMode, activeBody]
  );

  const handleGoToCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = Number(latInput);
    const lon = Number(lonInput);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      setCoordError('Enter a valid latitude between -90 and 90 degrees.');
      return;
    }
    if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
      setCoordError('Enter a valid longitude between -180 and 180 degrees.');
      return;
    }

    setCoordError(null);
    setPickedCoord({ lat, lon });
    setSelectOnMapMode(false);
    globeRef.current?.flyToLatLon(lat, lon, 1.85);
  };

  const handleResetView = () => {
    if (activeBody === 'moon') {
      setPickedCoord(null);
      globeRef.current?.viewSouthPole();
    } else if (activeBody === 'mars') {
      setPickedCoord(null);
      globeRef.current?.flyToLatLon(
        currentMarsTarget.coordinates.lat,
        currentMarsTarget.coordinates.lon,
        1.85
      );
    } else {
      globeRef.current?.resetGlobalView();
    }
  };

  const ref = ANALOG_DATA.reference;
  const bounds = ref.aoi.bounds_polar_stereographic_xy_m;
  const hasAoiBounds =
    bounds.xmin !== null &&
    bounds.xmax !== null &&
    bounds.ymin !== null &&
    bounds.ymax !== null;

  const moonSlopeMetric = ref.metrics.slope_deg;
  const moonRoughnessMetric = ref.metrics.roughness_m;
  const moonSlopeVerified =
    !moonSlopeMetric.placeholder &&
    moonSlopeMetric.scored &&
    moonSlopeMetric.p50 !== null;
  const moonRoughnessVerified =
    !moonRoughnessMetric.placeholder &&
    moonRoughnessMetric.scored &&
    moonRoughnessMetric.p50 !== null;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
        {/* LEFT COLUMN: 3-Way Planet Selector + Grouped Sites / Targets */}
        <aside className="lg:col-span-3 space-y-4">
          <SurfacePanel className="p-4 space-y-4">
            <div
              role="group"
              aria-label="Select planetary body"
              className="grid grid-cols-3 gap-1 rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-1"
            >
              {(['earth', 'moon', 'mars'] as PlanetaryBodyId[]).map((bodyId) => {
                const active = activeBody === bodyId;
                return (
                  <button
                    key={bodyId}
                    type="button"
                    onClick={() => onChangeBody(bodyId)}
                    aria-pressed={active}
                    className={`min-h-[36px] rounded-[6px] px-2 text-xs font-semibold uppercase cursor-pointer terra-transition ${
                      active
                        ? 'bg-[var(--terra-amber)] text-[#0a0c0f]'
                        : 'text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)]'
                    }`}
                  >
                    {bodyId}
                  </button>
                );
              })}
            </div>

            {/* MARS TARGETS LIST */}
            {activeBody === 'mars' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--terra-border)] pb-2">
                  <p className="font-mono text-xs text-[var(--terra-amber)] font-medium">
                    Mars exploration targets ({marsTargets.length})
                  </p>
                  <span className="font-mono text-[10px] uppercase text-[var(--terra-ink-muted)]">
                    MRO / MGS
                  </span>
                </div>
                <ul className="space-y-2">
                  {marsTargets.map((target) => {
                    const isSelected = selectedMarsTargetId === target.targetId;
                    return (
                      <li key={target.targetId}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMarsTargetId(target.targetId);
                            onSelectPlanetaryTarget?.(target.targetId);
                            setLatInput(String(target.coordinates.lat));
                            setLonInput(String(target.coordinates.lon));
                            globeRef.current?.flyToLatLon(
                              target.coordinates.lat,
                              target.coordinates.lon,
                              1.85
                            );
                          }}
                          className={`w-full rounded-[var(--terra-radius-sm)] border p-3 text-left cursor-pointer terra-transition ${
                            isSelected
                              ? 'border-[var(--terra-amber)] bg-[var(--terra-amber-soft)] ring-1 ring-[var(--terra-amber)]/40'
                              : 'border-[var(--terra-border)] bg-[var(--terra-bg)] hover:border-[var(--terra-border-strong)]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold text-[var(--terra-ink)]">
                              {target.name}
                            </p>
                            <span className="font-mono text-[10px] text-[var(--terra-amber)]">
                              {target.elevationKm} km
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-[var(--terra-ink-secondary)] line-clamp-1">
                            {target.subheading}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-[var(--terra-ink-muted)] tabular-nums">
                            {formatCoord(target.coordinates.lat, 'N', 'S')},{' '}
                            {formatCoord(target.coordinates.lon, 'E', 'W')}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* MOON TARGETS LIST */}
            {activeBody === 'moon' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--terra-border)] pb-2">
                  <p className="font-mono text-xs text-[var(--terra-amber)] font-medium">
                    Lunar base candidates ({moonTargets.length})
                  </p>
                  <span className="font-mono text-[10px] uppercase text-[var(--terra-ink-muted)]">
                    LRO LOLA
                  </span>
                </div>
                <ul className="space-y-2">
                  {moonTargets.map((target) => {
                    const isSelected = selectedMoonTargetId === target.targetId;
                    return (
                      <li key={target.targetId}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMoonTargetId(target.targetId);
                            onSelectPlanetaryTarget?.(target.targetId);
                            setLatInput(String(target.coordinates.lat));
                            setLonInput(String(target.coordinates.lon));
                            globeRef.current?.flyToLatLon(
                              target.coordinates.lat,
                              target.coordinates.lon,
                              1.85
                            );
                          }}
                          className={`w-full rounded-[var(--terra-radius-sm)] border p-3 text-left cursor-pointer terra-transition ${
                            isSelected
                              ? 'border-[var(--terra-amber)] bg-[var(--terra-amber-soft)] ring-1 ring-[var(--terra-amber)]/40'
                              : 'border-[var(--terra-border)] bg-[var(--terra-bg)] hover:border-[var(--terra-border-strong)]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold text-[var(--terra-ink)]">
                              {target.name}
                            </p>
                            <Moon className="h-3.5 w-3.5 shrink-0 text-[var(--terra-amber)]" />
                          </div>
                          <p className="mt-0.5 text-[11px] text-[var(--terra-ink-secondary)] line-clamp-1">
                            {target.subheading}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-[var(--terra-amber)] tabular-nums">
                            {formatCoord(target.coordinates.lat, 'N', 'S')},{' '}
                            {formatCoord(target.coordinates.lon, 'E', 'W')}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* EARTH SITES LIST */}
            {activeBody === 'earth' && (
              <>
                {/* Group 1: Terrain Candidates */}
                <div className="space-y-1.5">
                  <p className="font-mono text-xs text-[#5ec8e5]">
                    Terrain candidates ({terrainCandidates.length})
                  </p>
                  <ul className="space-y-1.5">
                    {terrainCandidates.map((site) => {
                      const selected =
                        activeBody === 'earth' && selectedSite.id === site.id;
                      return (
                        <li key={site.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectSiteId(site.id);
                              onChangeBody('earth');
                            }}
                            className={`w-full rounded-[var(--terra-radius-sm)] border p-3 text-left cursor-pointer terra-transition ${
                              selected
                                ? 'border-[#5ec8e5] bg-[#5ec8e5]/10'
                                : 'border-[var(--terra-border)] bg-[var(--terra-bg)] hover:border-[var(--terra-border-strong)]'
                            }`}
                          >
                            <p className="text-xs font-medium text-[var(--terra-ink)]">
                              {site.name}
                            </p>
                            <p className="mt-0.5 font-mono text-xs text-[var(--terra-ink-muted)] tabular-nums">
                              {formatCoord(site.centre.lat, 'N', 'S')},{' '}
                              {formatCoord(site.centre.lon, 'E', 'W')}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Group 2: Materials Only */}
                <div className="space-y-1.5">
                  <p className="font-mono text-xs text-[var(--terra-sage)]">
                    Materials only ({materialsOnlySites.length})
                  </p>
                  <ul className="space-y-1.5">
                    {materialsOnlySites.map((site) => {
                      const selected =
                        activeBody === 'earth' && selectedSite.id === site.id;
                      return (
                        <li key={site.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectSiteId(site.id);
                              onChangeBody('earth');
                            }}
                            className={`w-full rounded-[var(--terra-radius-sm)] border p-3 text-left cursor-pointer terra-transition ${
                              selected
                                ? 'border-[var(--terra-sage)] bg-[var(--terra-sage-soft)]'
                                : 'border-[var(--terra-border)] bg-[var(--terra-bg)] hover:border-[var(--terra-border-strong)]'
                            }`}
                          >
                            <p className="text-xs font-medium text-[var(--terra-ink)]">
                              {site.name}
                            </p>
                            <p className="mt-0.5 font-mono text-xs text-[var(--terra-ink-muted)] tabular-nums">
                              {formatCoord(site.centre.lat, 'N', 'S')},{' '}
                              {formatCoord(site.centre.lon, 'E', 'W')}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </SurfacePanel>
        </aside>

        {/* CENTRE COLUMN: Interactive 3D Map + Non-Overlapping Layer Panel */}
        <section className="lg:col-span-5 space-y-3">
          {/* Layer Toggle Bar Outside Globe */}
          <SurfacePanel className="p-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-xs text-[var(--terra-amber)] truncate">
                  {activeBody === 'moon'
                    ? currentMoonTarget.name
                    : activeBody === 'mars'
                      ? currentMarsTarget.name
                      : selectedSite.name}
                </p>
                <p className="text-xs text-[var(--terra-ink-muted)] truncate">
                  {activeBody === 'moon'
                    ? hasAoiBounds
                      ? `AOI bounds: ${bounds.xmin} to ${bounds.xmax} m`
                      : 'AOI centre pending · AOI bounds pending'
                    : activeBody === 'mars'
                      ? `${currentMarsTarget.subheading} · Elevation ${currentMarsTarget.elevationKm} km`
                      : `Pinned ${bodyMarkers.length} sites from analog_data.json`}
                </p>
              </div>

              <Button
                variant={layerDrawerOpen ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setLayerDrawerOpen((p) => !p)}
                aria-expanded={layerDrawerOpen}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Layers ({bodyLayers.length})</span>
              </Button>
            </div>

            {layerDrawerOpen && (
              <div className="border-t border-[var(--terra-border)] pt-3 space-y-2.5">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {bodyLayers.map((layer) => {
                    const active = layer.id === activeLayer.id;
                    const disabled = !layer.tileServiceAvailable;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && setSelectedLayerId(layer.id)}
                        title={disabled ? layer.unavailableReason : layer.description}
                        className={`rounded-[var(--terra-radius-sm)] border p-2.5 text-left terra-transition ${
                          disabled
                            ? 'border-[var(--terra-border)] bg-[var(--terra-bg)]/60 opacity-70 cursor-not-allowed'
                            : active
                              ? 'border-[var(--terra-amber)] bg-[var(--terra-amber-soft)] cursor-pointer'
                              : 'border-[var(--terra-border)] bg-[var(--terra-bg)] hover:border-[var(--terra-border-strong)] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-[var(--terra-ink)]">
                            {layer.name}
                          </span>
                          <span className="font-mono text-xs uppercase text-[var(--terra-ink-muted)]">
                            {layer.category}
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-xs text-[var(--terra-ink-muted)]">
                          {disabled
                            ? 'Unavailable on globe'
                            : `${layer.spatialResolution}`}
                        </p>
                        {disabled && layer.unavailableReason && (
                          <p className="mt-1 text-xs text-[var(--terra-ink-muted)] leading-snug">
                            {layer.unavailableReason}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--terra-border)] pt-2.5">
                  <label className="flex items-center gap-2 text-xs text-[var(--terra-ink-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGraticule}
                      onChange={(e) => setShowGraticule(e.target.checked)}
                      className="accent-[var(--terra-amber)]"
                    />
                    <span>30° coordinate grid</span>
                  </label>

                  {activeLayer.supportsDateSelection && (
                    <label className="inline-flex items-center gap-2 text-xs text-[var(--terra-ink-secondary)]">
                      <Calendar className="h-3.5 w-3.5 text-[var(--terra-amber)]" />
                      <span>Date</span>
                      <input
                        type="date"
                        value={modisDate}
                        max={getDefaultEarthModisDate()}
                        onChange={(e) => setModisDate(e.target.value)}
                        className="rounded-[6px] border border-[var(--terra-border)] bg-[var(--terra-bg)] px-2 py-1 font-mono text-xs text-[var(--terra-ink)]"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}
          </SurfacePanel>

          {/* 3D Globe Stage */}
          <div
            ref={globeStageRef}
            className={
              isFullscreen
                ? 'fixed inset-0 z-40 h-screen w-screen overflow-hidden bg-[#07090c]'
                : 'relative h-[480px] sm:h-[560px] overflow-hidden rounded-[var(--terra-radius-lg)] border border-[var(--terra-border)] bg-[#07090c]'
            }
          >
            <PlanetaryGlobeCanvas
              ref={globeRef}
              body={bodyDef}
              tileResult={tileResult}
              markers={bodyMarkers}
              selectedMarkerId={activeBody === 'earth' ? selectedSite.id : null}
              showGraticule={showGraticule}
              onHoverCoords={setHoverCoords}
              onSelectMarker={handleSelectMarkerFromGlobe}
              onSelectCoordinate={handleSelectCoordinateFromGlobe}
            />

            {/* Slidable Top-Left Active Body HUD */}
            <div className="pointer-events-none absolute left-0 top-3.5 z-10 max-w-[calc(100%-1rem)] sm:max-w-sm overflow-visible">
              <div
                ref={hudPanelRef}
                onPointerDown={(e) => {
                  const width = hudPanelRef.current?.offsetWidth ?? 300;
                  hudDragRef.current = {
                    pointerId: e.pointerId,
                    startX: e.clientX,
                    moved: false,
                    captured: false,
                    width,
                  };
                }}
                onPointerMove={(e) => {
                  const drag = hudDragRef.current;
                  if (!drag || drag.pointerId !== e.pointerId) return;
                  const dx = e.clientX - drag.startX;
                  if (Math.abs(dx) > 4) {
                    drag.moved = true;
                    if (!drag.captured) {
                      drag.captured = true;
                      setIsDraggingHud(true);
                      e.currentTarget.setPointerCapture(e.pointerId);
                    }
                  }
                  if (!drag.captured) return;
                  const maxSlide = Math.max(80, drag.width - 36);
                  const clamped = hudExpanded
                    ? Math.max(-maxSlide, Math.min(12, dx))
                    : Math.max(-12, Math.min(maxSlide, dx));
                  setHudDragOffset(clamped);
                }}
                onPointerUp={(e) => {
                  const drag = hudDragRef.current;
                  if (!drag || drag.pointerId !== e.pointerId) return;
                  const dx = e.clientX - drag.startX;
                  if (drag.captured && e.currentTarget.hasPointerCapture(e.pointerId)) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  }
                  if (drag.moved) {
                    if (hudExpanded && dx < -40) setHudExpanded(false);
                    else if (!hudExpanded && dx > 40) setHudExpanded(true);
                  }
                  setHudDragOffset(0);
                  setIsDraggingHud(false);
                  window.setTimeout(() => {
                    if (hudDragRef.current === drag) hudDragRef.current = null;
                  }, 0);
                }}
                onPointerCancel={() => {
                  hudDragRef.current = null;
                  setHudDragOffset(0);
                  setIsDraggingHud(false);
                }}
                style={{
                  transform: hudExpanded
                    ? `translateX(calc(12px + ${hudDragOffset}px))`
                    : `translateX(calc(-100% + 36px + ${hudDragOffset}px))`,
                  transition: isDraggingHud
                    ? 'none'
                    : 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="pointer-events-auto flex items-stretch overflow-hidden rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[#12151af0] touch-none select-none cursor-grab active:cursor-grabbing"
              >
                <div aria-hidden={!hudExpanded} className="min-w-0 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium text-[var(--terra-amber)] whitespace-nowrap">
                      {bodyDef.name.toUpperCase()}
                    </span>
                    {tileResult.status === 'loading' && (
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-ink-muted)] whitespace-nowrap">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Loading</span>
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-[var(--terra-ink)] truncate">
                    {activeLayer.name}
                  </p>
                  <p className="font-mono text-xs text-[var(--terra-ink-muted)] truncate">
                    {activeLayer.spatialResolution}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hudDragRef.current?.moved) return;
                    setHudExpanded((prev) => !prev);
                  }}
                  aria-expanded={hudExpanded}
                  aria-label={
                    hudExpanded
                      ? 'Slide to hide active layer info'
                      : 'Slide to show active layer info'
                  }
                  className="flex w-9 shrink-0 items-center justify-center border-l border-[var(--terra-border)] bg-[var(--terra-surface-elevated)] text-[var(--terra-ink-secondary)] hover:text-[var(--terra-amber)] cursor-pointer"
                >
                  {hudExpanded ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-[var(--terra-amber)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Fullscreen Quick Switcher */}
            {isFullscreen && (
              <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[#12151af0] p-1">
                {(['earth', 'moon', 'mars'] as PlanetaryBodyId[]).map((bodyId) => (
                  <button
                    key={bodyId}
                    type="button"
                    onClick={() => onChangeBody(bodyId)}
                    aria-pressed={activeBody === bodyId}
                    className={`min-h-[32px] rounded-[6px] px-3 text-xs font-semibold uppercase cursor-pointer ${
                      activeBody === bodyId
                        ? 'bg-[var(--terra-amber)] text-[#0a0c0f]'
                        : 'text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)]'
                    }`}
                  >
                    {bodyId}
                  </button>
                ))}
              </div>
            )}

            {/* Unavailable Tiles Alert */}
            {tileResult.status === 'unavailable' && (
              <div className="absolute left-3.5 bottom-14 z-20 max-w-sm rounded-[var(--terra-radius-md)] border border-[var(--terra-danger)]/60 bg-[#171214f5] p-3.5">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--terra-danger)] mt-0.5" />
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-semibold text-[var(--terra-ink)]">
                      Layer tiles unavailable
                    </p>
                    <p className="text-xs text-[var(--terra-ink-secondary)]">
                      {tileResult.errorMessage}
                    </p>
                    <a
                      href={tileResult.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-amber)] hover:underline"
                    >
                      <span>Open official NASA source</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Right-Side Zoom, Reset & Fullscreen Controls */}
            <div className="absolute right-3.5 bottom-14 z-10 flex flex-col gap-1 rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[#12151af0] p-1.5">
              <button
                type="button"
                onClick={() => globeRef.current?.zoomIn()}
                aria-label="Zoom in globe"
                title="Zoom in"
                className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--terra-ink)] hover:bg-[var(--terra-surface-hover)] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => globeRef.current?.zoomOut()}
                aria-label="Zoom out globe"
                title="Zoom out"
                className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--terra-ink)] hover:bg-[var(--terra-surface-hover)] cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="h-px bg-[var(--terra-border)]" />
              <button
                type="button"
                onClick={handleResetView}
                aria-label="Reset globe view"
                title={activeBody === 'moon' ? 'Center South Pole' : 'Reset global view'}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--terra-amber)] hover:bg-[var(--terra-surface-hover)] cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleToggleFullscreen}
                aria-pressed={isFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen globe' : 'Fullscreen globe'}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen globe'}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--terra-ink)] hover:bg-[var(--terra-surface-hover)] cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 text-[var(--terra-amber)]" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Bottom Coordinate, Scale & Source Bar */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--terra-border)] bg-[#0e1116f5] px-3.5 py-2 text-xs">
              <span className="font-mono text-[var(--terra-ink)] tabular-nums">
                {hoverCoords
                  ? `${formatCoord(hoverCoords.lat, 'N', 'S')} · ${formatCoord(
                      hoverCoords.lon,
                      'E',
                      'W'
                    )}`
                  : selectOnMapMode
                    ? 'Click any point on the globe to read its coordinates'
                    : 'Drag to rotate · scroll to zoom'}
              </span>

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="text-[var(--terra-ink-muted)] hidden sm:inline">
                  Scale: {activeLayer.spatialResolution}
                </span>
                <a
                  href={activeLayer.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--terra-amber)] hover:underline"
                >
                  <span>NASA source</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Coordinate Controls + Selected Area Profile + Mineralogy + Imagery */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Coordinate Panel */}
          <SurfacePanel className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[var(--terra-ink)]">
                Coordinate panel
              </h2>
              <button
                type="button"
                onClick={() => setSelectOnMapMode((p) => !p)}
                aria-pressed={selectOnMapMode}
                className={`inline-flex items-center gap-1.5 rounded-[var(--terra-radius-sm)] border px-2.5 py-1 font-mono text-xs cursor-pointer terra-transition ${
                  selectOnMapMode
                    ? 'border-[var(--terra-amber)] bg-[var(--terra-amber-soft)] text-[var(--terra-amber-hover)]'
                    : 'border-[var(--terra-border)] bg-[var(--terra-bg)] text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)]'
                }`}
              >
                <Crosshair className="h-3.5 w-3.5" />
                <span>{selectOnMapMode ? 'Click globe...' : 'Select on map'}</span>
              </button>
            </div>

            <form onSubmit={handleGoToCoords} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1 text-xs">
                  <span className="font-mono text-[var(--terra-ink-muted)]">
                    Latitude (-90 to 90)
                  </span>
                  <input
                    type="text"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    aria-label="Latitude"
                    className="min-h-[36px] w-full rounded-[6px] border border-[var(--terra-border)] bg-[var(--terra-bg)] px-2.5 font-mono text-xs text-[var(--terra-ink)]"
                  />
                </label>

                <label className="space-y-1 text-xs">
                  <span className="font-mono text-[var(--terra-ink-muted)]">
                    Longitude (-180 to 180)
                  </span>
                  <input
                    type="text"
                    value={lonInput}
                    onChange={(e) => setLonInput(e.target.value)}
                    aria-label="Longitude"
                    className="min-h-[36px] w-full rounded-[6px] border border-[var(--terra-border)] bg-[var(--terra-bg)] px-2.5 font-mono text-xs text-[var(--terra-ink)]"
                  />
                </label>
              </div>

              {coordError && (
                <p role="alert" className="text-xs text-[var(--terra-danger)]">
                  {coordError}
                </p>
              )}

              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs text-[var(--terra-ink-muted)] truncate">
                  CRS:{' '}
                  {activeBody === 'moon'
                    ? 'South Polar Stereographic (AOI) / IAU Moon 2000'
                    : activeBody === 'mars'
                      ? 'IAU Mars 2000 / Areocentric Equirectangular'
                      : 'EPSG:4326 (WGS 84)'}
                </p>
                <Button type="submit" variant="outline" size="sm">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Go to</span>
                </Button>
              </div>
            </form>

            {pickedCoord && (
              <p className="rounded-[6px] border border-[var(--terra-border)] bg-[var(--terra-bg)] px-2.5 py-1.5 font-mono text-xs text-[var(--terra-ink-secondary)]">
                Inspecting coordinates: {formatCoord(pickedCoord.lat, 'N', 'S')},{' '}
                {formatCoord(pickedCoord.lon, 'E', 'W')}
              </p>
            )}
          </SurfacePanel>

          {/* DEDICATED MARS REGION PROFILE */}
          {activeBody === 'mars' ? (
            <SurfacePanel tone="elevated" className="p-4 sm:p-5 space-y-4">
              <div className="space-y-1.5 border-b border-[var(--terra-border)] pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[var(--terra-amber)]">
                    {currentMarsTarget.missionContext}
                  </span>
                  <span className="rounded-[4px] border border-[var(--terra-amber)]/40 bg-[var(--terra-amber)]/10 px-2 py-0.5 font-mono text-[11px] text-[var(--terra-amber)]">
                    {currentMarsTarget.targetType}
                  </span>
                </div>
                <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                  {currentMarsTarget.name}
                </h2>
                <p className="text-xs text-[var(--terra-ink-secondary)]">
                  {currentMarsTarget.subheading}
                </p>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--terra-ink-muted)] pt-1">
                  <span className="text-[var(--terra-amber)]">
                    {formatCoord(currentMarsTarget.coordinates.lat, 'N', 'S')},{' '}
                    {formatCoord(currentMarsTarget.coordinates.lon, 'E', 'W')}
                  </span>
                  <span>·</span>
                  <span>Elevation: {currentMarsTarget.elevationKm} km</span>
                </div>
              </div>

              {/* Action Button: Find Earth Analogues */}
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  onFindEarthAnalogues?.(
                    currentMarsTarget.targetId,
                    currentMarsTarget.recommendedEarthSites[0]
                  );
                }}
              >
                <GitCompare className="h-3.5 w-3.5" />
                <span>Find Earth Analogues for {currentMarsTarget.name.split('(')[0]}</span>
              </Button>

              {/* Geological Setting */}
              <div className="space-y-1.5 text-xs">
                <p className="font-mono text-[var(--terra-amber)]">Geological context</p>
                <p className="text-[var(--terra-ink-secondary)] leading-relaxed">
                  {currentMarsTarget.geologicalContext}
                </p>
              </div>

              {/* Key Minerals */}
              <div className="space-y-1.5 text-xs">
                <p className="font-mono text-[var(--terra-sage)]">Key detected minerals</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentMarsTarget.keyMinerals.map((min) => (
                    <span
                      key={min}
                      className="rounded-[4px] border border-[var(--terra-border)] bg-[var(--terra-bg)] px-2 py-1 font-mono text-[11px] text-[var(--terra-ink)]"
                    >
                      {min}
                    </span>
                  ))}
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 space-y-1 text-xs">
                <p className="font-mono text-[var(--terra-ink-muted)]">
                  Environmental conditions:
                </p>
                <p className="text-[var(--terra-ink)] leading-relaxed">
                  {currentMarsTarget.environmentalConditions}
                </p>
              </div>

              {/* Relevance to Exploration */}
              <div className="space-y-1.5 text-xs">
                <p className="font-mono text-[var(--terra-amber)]">
                  Relevance to planetary exploration
                </p>
                <p className="text-[var(--terra-ink-secondary)] leading-relaxed">
                  {currentMarsTarget.relevanceToExploration}
                </p>
              </div>

              {/* Recommended Earth Analog Themes */}
              <div className="space-y-1.5 text-xs border-t border-[var(--terra-border)] pt-3">
                <p className="font-mono text-[#5ec8e5]">Recommended Earth analogue themes</p>
                <ul className="space-y-1 text-[var(--terra-ink-secondary)]">
                  {currentMarsTarget.recommendedEarthAnalogThemes.map((thm) => (
                    <li key={thm}>· {thm}</li>
                  ))}
                </ul>
              </div>

              {/* Authentic Mars Orbital Imagery (HiRISE, CTX) */}
              <div className="border-t border-[var(--terra-border)] pt-3 space-y-2">
                <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                  Documented orbital observation
                </p>
                {currentMarsTarget.observations.map((obs) => (
                  <div
                    key={obs.observationId}
                    className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-2.5 space-y-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModalImage({
                          id: obs.observationId,
                          title: obs.title,
                          spacecraft: obs.spacecraft,
                          cameraOrInstrument: obs.instrument,
                          acquisitionDate: obs.acquisitionDate,
                          thumbnailUrl: obs.imageUrl,
                          fullSizeUrl: obs.fullSizeUrl,
                          originalSourceUrl: obs.sourceUrl,
                          imageType: 'orbital',
                          description: obs.description,
                        })
                      }
                      className="relative block w-full overflow-hidden rounded-[6px] aspect-[16/9] bg-[#07090c] cursor-pointer"
                    >
                      <img
                        src={obs.imageUrl}
                        alt={obs.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-2 top-2">
                        <ImageTypeBadge type="orbital" />
                      </div>
                    </button>
                    <div className="space-y-0.5 text-xs">
                      <p className="font-medium text-[var(--terra-ink)]">{obs.title}</p>
                      <p className="font-mono text-[var(--terra-ink-muted)]">
                        {obs.spacecraft} · {obs.instrument} · {obs.resolution}
                      </p>
                      <a
                        href={obs.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[var(--terra-amber)] hover:underline pt-1"
                      >
                        <span>Open NASA PDS / HiRISE archive</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Available Datasets */}
              <div className="border-t border-[var(--terra-border)] pt-3 space-y-2 text-xs">
                <p className="font-mono text-[var(--terra-ink-muted)]">
                  Open scientific datasets
                </p>
                <div className="space-y-1.5">
                  {currentMarsTarget.datasets.map((ds) => (
                    <div
                      key={ds.datasetName}
                      className="flex items-center justify-between gap-2 rounded-[6px] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-2"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--terra-ink)] truncate">
                          {ds.datasetName}
                        </p>
                        <p className="font-mono text-[11px] text-[var(--terra-ink-muted)]">
                          {ds.sourceOrganisation} · {ds.instrument}
                        </p>
                      </div>
                      <a
                        href={ds.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--terra-amber)] hover:underline shrink-0"
                      >
                        <span>Archive</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </SurfacePanel>
          ) : activeBody === 'moon' ? (
            <SurfacePanel tone="elevated" className="p-4 sm:p-5 space-y-4">
              <div className="space-y-1.5 border-b border-[var(--terra-border)] pb-3">
                <p className="font-mono text-xs text-[var(--terra-amber)]">
                  Lunar reference area
                </p>
                <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                  {currentMoonTarget.name}
                </h2>
                <p className="font-mono text-xs text-[var(--terra-amber)]">
                  {formatCoord(currentMoonTarget.coordinates.lat, 'N', 'S')},{' '}
                  {formatCoord(currentMoonTarget.coordinates.lon, 'E', 'W')}
                </p>
              </div>

              {/* Action Button: Find Earth Analogues for Moon */}
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  onFindEarthAnalogues?.(
                    currentMoonTarget.targetId,
                    currentMoonTarget.recommendedEarthSites[0]
                  );
                }}
              >
                <GitCompare className="h-3.5 w-3.5" />
                <span>Find Earth Analogues for {currentMoonTarget.name.split('(')[0]}</span>
              </Button>

              <div className="space-y-2 text-xs">
                <p className="text-[var(--terra-ink-secondary)] leading-relaxed">
                  {ref.notes}
                </p>
                <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 space-y-1">
                  <p className="font-mono text-[var(--terra-ink-muted)]">
                    <InfoTooltip termKey="aoi" label="AOI bounds (polar-stereographic):" />
                  </p>
                  {hasAoiBounds ? (
                    <p className="font-mono text-[var(--terra-ink)] tabular-nums">
                      xmin {bounds.xmin}, xmax {bounds.xmax}, ymin {bounds.ymin}, ymax{' '}
                      {bounds.ymax} m
                    </p>
                  ) : (
                    <p className="font-mono text-[var(--terra-amber)]">
                      AOI bounds pending ({ref.aoi.fill_from})
                    </p>
                  )}
                </div>
              </div>

              {/* Moon elevation, slope, roughness — only if verified in JSON */}
              <div className="space-y-2 border-t border-[var(--terra-border)] pt-3">
                <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                  Selected-area terrain status
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 rounded-[6px] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-2.5">
                    <span className="text-[var(--terra-ink)]">Elevation</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[var(--terra-ink-muted)]">
                        Pending verified dataset
                      </span>
                      <ValueTag kind="no_data" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-[6px] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-2.5">
                    <span className="text-[var(--terra-ink)]">
                      <InfoTooltip termKey="slope" label="Slope" />
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[var(--terra-amber)]">
                        {moonSlopeVerified
                          ? `p50 ${formatMetricValue(moonSlopeMetric.p50)} ${
                              moonSlopeMetric.unit
                            }`
                          : 'Pending verified dataset'}
                      </span>
                      <ValueTag kind={getMetricValueTag(moonSlopeMetric)} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-[6px] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-2.5">
                    <span className="text-[var(--terra-ink)]">
                      <InfoTooltip termKey="roughness" label="Roughness" />
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[var(--terra-amber)]">
                        {moonRoughnessVerified
                          ? `p50 ${formatMetricValue(moonRoughnessMetric.p50)} ${
                              moonRoughnessMetric.unit
                            }`
                          : 'Pending verified dataset'}
                      </span>
                      <ValueTag kind={getMetricValueTag(moonRoughnessMetric)} />
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={ref.coordinate_source}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-amber)] hover:underline"
              >
                <span>PGDA Product 78 (Coordinate &amp; Site01 source)</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              {/* Verified NASA LROC South Pole Orbital Image */}
              <div className="border-t border-[var(--terra-border)] pt-3 space-y-2">
                <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                  Documented orbital imagery
                </p>
                {imageryResult.status === 'loading' && (
                  <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                    Checking NASA Moon Trek LROC WAC tile...
                  </p>
                )}
                {imageryResult.status === 'ready' &&
                  imageryResult.images.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-2.5 space-y-2"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveModalImage(img)}
                        className="relative block w-full overflow-hidden rounded-[6px] aspect-[16/9] bg-[#07090c] cursor-pointer"
                      >
                        <img
                          src={img.thumbnailUrl}
                          alt={img.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute left-2 top-2">
                          <ImageTypeBadge type="orbital" />
                        </div>
                      </button>
                      <div className="space-y-0.5 text-xs">
                        <p className="font-medium text-[var(--terra-ink)]">{img.title}</p>
                        <p className="font-mono text-[var(--terra-ink-muted)]">
                          {img.spacecraft} · {img.cameraOrInstrument}
                        </p>
                        <p className="font-mono text-[var(--terra-ink-muted)]">
                          {img.acquisitionDate} · ID: {img.id}
                        </p>
                        <a
                          href={img.originalSourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[var(--terra-amber)] hover:underline"
                        >
                          <span>Open NASA LROC archive</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                {imageryResult.status === 'unavailable' && (
                  <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 text-xs space-y-1.5">
                    <p className="text-[var(--terra-ink-secondary)]">
                      {imageryResult.errorMessage}
                    </p>
                    <a
                      href="https://data.lroc.im-ldi.com/lroc/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[var(--terra-amber)] hover:underline"
                    >
                      <span>Open LROC Data Archive</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </SurfacePanel>
          ) : (
            <div className="space-y-4">
              <SurfacePanel tone="elevated" className="p-4 sm:p-5 space-y-4">
                <div className="space-y-1 border-b border-[var(--terra-border)] pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[#5ec8e5]">
                      {selectedSite.terrain_suitable
                        ? 'Terrain candidate'
                        : 'Materials-only site'}
                    </span>
                    <span className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      role: {selectedSite.role}
                    </span>
                  </div>
                  <h2 className="text-xl font-medium text-[var(--terra-ink)]">
                    {selectedSite.name}
                  </h2>
                  <p className="font-mono text-xs text-[var(--terra-ink-muted)] tabular-nums">
                    {formatCoord(selectedSite.centre.lat, 'N', 'S')},{' '}
                    {formatCoord(selectedSite.centre.lon, 'E', 'W')}
                  </p>
                </div>

                {/* Action or Materials-only Notice */}
                {selectedSite.terrain_suitable ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => onCompareEarthSite(selectedSite.id)}
                  >
                    <GitCompare className="h-3.5 w-3.5" />
                    <span>Compare this site</span>
                  </Button>
                ) : (
                  <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border-strong)] bg-[var(--terra-bg)] px-3 py-2 text-xs text-[var(--terra-ink-secondary)]">
                    Terrain comparison not available - materials reference only
                  </div>
                )}

                {/* AOI & Coordinate Source */}
                <div className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 space-y-1.5 text-xs">
                  <p className="font-mono text-[var(--terra-ink-muted)]">
                    <InfoTooltip termKey="aoi" label="Area of Interest (AOI):" />
                  </p>
                  {selectedSite.aoi ? (
                    <p className="text-[var(--terra-ink)]">
                      {selectedSite.aoi.shape} (
                      {selectedSite.aoi.radius_km !== undefined
                        ? `radius ${selectedSite.aoi.radius_km} km`
                        : `${selectedSite.aoi.size_km} km`}
                      ) · Mask: {formatNullableString(selectedSite.aoi.mask)}
                    </p>
                  ) : (
                    <p className="text-[var(--terra-ink-muted)]">
                      no data (no terrain AOI defined)
                    </p>
                  )}
                  <a
                    href={selectedSite.coordinate_source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[var(--terra-amber)] hover:underline"
                  >
                    <span>Coordinate source link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Available Measurements with Value Tags */}
                <div className="space-y-2">
                  <p className="font-mono text-xs text-[#5ec8e5]">
                    Available measurements
                  </p>
                  {METRIC_KEYS.map((key) => {
                    const m = selectedSite.metrics[key];
                    const meta = METRIC_META[key];
                    const tagKind = getMetricValueTag(m);
                    return (
                      <div
                        key={key}
                        className="rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] p-3 space-y-1 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-[var(--terra-ink)]">
                            {meta.label} ({m.unit})
                          </span>
                          <div className="flex items-center gap-1.5">
                            {!m.scored && <NotScoredBadge />}
                            <ValueTag kind={tagKind} />
                          </div>
                        </div>
                        <p className="text-[var(--terra-ink-muted)]">{meta.plainMeaning}</p>
                        {tagKind === 'no_data' ? (
                          <p className="font-mono text-[var(--terra-ink-muted)]">
                            {!m.scored
                              ? 'Not scored for terrain comparison'
                              : 'Data unavailable'}
                          </p>
                        ) : (
                          <p className="font-mono text-[#5ec8e5] tabular-nums">
                            p5 {formatMetricValue(m.p5)} · p50 {formatMetricValue(m.p50)}{' '}
                            · p95 {formatMetricValue(m.p95)} {m.unit}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Evidence Quality & Data Issues */}
                <div className="space-y-1.5 text-xs">
                  <p className="font-mono text-[var(--terra-amber)]">
                    Evidence quality &amp; data issues
                  </p>
                  <ul className="space-y-1 text-[var(--terra-ink-secondary)]">
                    {selectedSite.data_issues.map((issue) => (
                      <li key={issue}>· {issue}</li>
                    ))}
                  </ul>
                </div>

                {/* Study Area Imagery Gallery (Verified Location-Specific Sources) */}
                <div className="space-y-3 border-t border-[var(--terra-border)] pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Study area imagery
                    </p>
                    {(() => {
                      const verifiedMedia = getVerifiedMediaForSite(selectedSite.id);
                      return (
                        <span className="font-mono text-xs text-[var(--terra-ink-muted)]">
                          {verifiedMedia.length > 0
                            ? `${verifiedMedia.length} verified ${
                                verifiedMedia.length === 1 ? 'record' : 'records'
                              }`
                            : '0 verified records'}
                        </span>
                      );
                    })()}
                  </div>

                  {(() => {
                    const verifiedMedia = getVerifiedMediaForSite(selectedSite.id);
                    if (verifiedMedia.length === 0) {
                      return <TerrainImage item={null} aspectClass="aspect-[16/10]" />;
                    }
                    return (
                      <div className="space-y-4">
                        {verifiedMedia.map((mediaItem, idx) => (
                          <TerrainImage
                            key={mediaItem.id}
                            item={mediaItem}
                            priority={idx === 0}
                            onInspect={(selected) =>
                              setActiveModalImage(toSurfaceObservationImage(selected))
                            }
                          />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </SurfacePanel>

              {/* PHASE 7: Dedicated Mineralogy Panel (Never part of the terrain score) */}
              <SurfacePanel
                id="materials-panel"
                className="p-4 sm:p-5 space-y-3 border-[var(--terra-sage)]/45"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--terra-border)] pb-2.5">
                  <h3 className="text-sm font-semibold text-[var(--terra-ink)]">
                    Mineralogy (not part of the terrain score)
                  </h3>
                  {selectedSite.mineralogy && (
                    <AgreementBadge agreement={selectedSite.mineralogy.agreement} />
                  )}
                </div>

                {selectedSite.mineralogy ? (
                  <div className="space-y-2.5 text-xs">
                    <p className="text-[var(--terra-ink-secondary)] leading-relaxed">
                      {selectedSite.mineralogy.summary}
                    </p>
                    <div className="space-y-1">
                      <p className="font-mono text-[var(--terra-ink-muted)]">
                        Literature references
                      </p>
                      <ul className="space-y-1">
                        {selectedSite.mineralogy.references.map((url) => (
                          <li key={url}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[var(--terra-amber)] hover:underline break-all"
                            >
                              <span>{url}</span>
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--terra-ink-muted)]">
                    <span>No mineralogy record in analog_data.json for this site.</span>
                    <ValueTag kind="no_data" />
                  </div>
                )}
              </SurfacePanel>
            </div>
          )}
        </aside>
      </div>

      {/* Single Next Step Footer */}
      <div className="flex justify-end border-t border-[var(--terra-border)] pt-5">
        <Button variant="primary" size="md" onClick={onNextStep}>
          <span>
            {activeBody === 'mars'
              ? `Next step: Discover Earth Analogues for ${currentMarsTarget.name.split('(')[0]}`
              : activeBody === 'moon'
                ? `Next step: Discover Earth Analogues for ${currentMoonTarget.name.split('(')[0]}`
                : `Next step: Discover Earth Analogue Study Areas`}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <SurfaceImageModal
        image={activeModalImage}
        onClose={() => setActiveModalImage(null)}
      />
    </div>
  );
}
