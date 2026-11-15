export type AppRoute =
  | 'overview'
  | 'explore'
  | 'compare'
  | 'ranking'
  | 'evidence';

export type EvidenceTab = 'data-sources' | 'methodology';

export type PlanetaryBodyId = 'earth' | 'moon';

export type LayerCategory =
  | 'imagery'
  | 'elevation'
  | 'slope'
  | 'roughness'
  | 'geology';

export type DatasetTemporalClass =
  | 'Near-real-time imagery'
  | 'Recently updated imagery'
  | 'Historical observations'
  | 'Static reference maps'
  | 'Placeholder demo statistics';

export interface LayerLegendStop {
  label: string;
  color: string;
  detail?: string;
}

export interface PlanetaryLayerConfig {
  id: string;
  body: PlanetaryBodyId;
  name: string;
  category: LayerCategory;
  providerName: string;
  productId: string;
  temporalClass: DatasetTemporalClass;
  imageryDate: string;
  supportsDateSelection?: boolean;
  crs: string;
  spatialResolution: string;
  officialUrl: string;
  capabilitiesUrl: string;
  tileUrlTemplate: string;
  description: string;
  legend?: LayerLegendStop[];
  tileServiceAvailable: boolean;
  unavailableReason?: string;
}

export interface PlanetaryBodyDefinition {
  id: PlanetaryBodyId;
  name: string;
  subtitle: string;
  meanRadiusKm: string;
  coordinateReference: string;
  primaryProvider: string;
  ambientTintHex: string;
  atmosphereRimHex: string;
}

export interface PlanetaryFeatureMarker {
  id: string;
  body: PlanetaryBodyId;
  name: string;
  featureType: 'Terrain Candidate' | 'Materials-Only Reference';
  lat: number;
  lon: number;
  summary: string;
  linkedSiteId?: string;
  sourceUrl: string;
}

export interface TileLoadResult {
  status: 'loading' | 'ready' | 'unavailable';
  canvas?: HTMLCanvasElement;
  loadedTiles: number;
  totalTiles: number;
  layerId: string;
  effectiveDate: string;
  errorMessage?: string;
  officialUrl: string;
}

export type ObservationPerspective = 'orbital' | 'rover-ground';

export type ImageTypeTag =
  | 'ground photograph'
  | 'field photograph'
  | 'geological outcrop'
  | 'orbital'
  | 'aerial'
  | 'geological map'
  | 'elevation model'
  | 'illustrative';

export interface SurfaceObservationImage {
  id: string;
  title: string;
  caption?: string;
  thumbnailUrl: string;
  fullSizeUrl: string;
  assetManifestUrl?: string;
  originalSourceUrl: string;
  acquisitionDate: string;
  isHistorical: boolean;
  missionContext: string;
  spacecraft: string;
  cameraOrInstrument: string;
  perspective: ObservationPerspective;
  perspectiveDetailLabel: string;
  verifiedRegionLabel: string;
  sourceLabel: string;
  credit?: string;
  imageTypeTag?: ImageTypeTag;
}

export interface LocationImageryResult {
  status: 'idle' | 'loading' | 'ready' | 'empty' | 'unavailable';
  locationId: string;
  images: SurfaceObservationImage[];
  archiveLinks: { label: string; url: string }[];
  notes?: string;
  emptyReason?: string;
  errorMessage?: string;
}

export interface VerifiedStudyMediaItem {
  id: string;
  siteId: string;
  title: string;
  alt: string;
  caption: string;
  imageUrl: string;
  fullSizeUrl: string;
  originalSourceUrl: string;
  sourceOrganisation: string;
  photographerOrInstrument: string;
  acquisitionDate: string;
  attribution: string;
  license?: string;
  verificationStatus?: string;
  verifiedRegionLabel: string;
  imageTypeTag: ImageTypeTag;
  galleryCategory: 'surface' | 'remote_sensing';
  perspective: ObservationPerspective;
  aspectClass: string;
}

// --- Scientific Honesty Value Tagging ---

export type ValueStatusTagKind = 'measured' | 'derived' | 'demo' | 'no_data';

// --- Strict Typed Schema Matching src/data/analog_data.json ---

export type MetricKey = 'slope_deg' | 'roughness_m' | 'temp_diurnal_range_K';

export type SiteRole = 'terrain_and_mineralogy' | 'terrain' | 'mineralogy_only';

export type MineralogyAgreement = 'supported' | 'disputed' | 'proposed';

export interface MetricStats {
  unit: string;
  p5: number | null;
  p50: number | null;
  p95: number | null;
  dataset: string;
  url: string;
  retrieved: string | null;
  placeholder: boolean;
  scored: boolean;
}

export interface LatLonPoint {
  lat: number;
  lon: number;
}

export interface PolarStereographicBounds {
  xmin: number | null;
  xmax: number | null;
  ymin: number | null;
  ymax: number | null;
}

export interface LunarReferenceAoi {
  shape: string;
  size_km: number;
  bounds_polar_stereographic_xy_m: PolarStereographicBounds;
  fill_from: string;
}

export interface EarthSiteAoi {
  shape: string;
  radius_km?: number;
  size_km?: number;
  mask: string | null;
  land_fraction_kept?: number | null;
  note?: string;
}

export interface MineralogyInfo {
  summary: string;
  agreement: MineralogyAgreement | string;
  references: string[];
}

export interface LunarReference {
  id: string;
  name: string;
  body: string;
  centre: LatLonPoint | null;
  aoi: LunarReferenceAoi;
  coordinate_source: string;
  metrics: Record<MetricKey, MetricStats>;
  notes: string;
}

export interface EarthSite {
  id: string;
  name: string;
  role: SiteRole;
  centre: LatLonPoint;
  aoi: EarthSiteAoi | null;
  coordinate_source: string;
  terrain_suitable: boolean;
  data_issues: string[];
  metrics: Record<MetricKey, MetricStats>;
  mineralogy: MineralogyInfo | null;
}

export interface ScoringConfig {
  method: string;
  weights: Record<MetricKey, number>;
  weights_note: string;
  show_rank_stability: boolean;
}

export interface AnalogDataset {
  _readme: string;
  schema_version: string;
  scoring: ScoringConfig;
  global_limitations: string[];
  reference: LunarReference;
  sites: EarthSite[];
}

export interface DatasetProvenanceRecord {
  id: string;
  datasetName: string;
  organisation: string;
  variable: string;
  productIdentifier: string;
  url: string;
  observationDate: string;
  spatialResolution: string;
  units: string;
  uncertainty: string;
  coordinateReferenceSystem: string;
  limitation: string;
  unverifiedDetails: string[];
  applicableBody: 'Earth' | 'Moon' | 'Earth & Moon';
  temporalClass: DatasetTemporalClass;
}
