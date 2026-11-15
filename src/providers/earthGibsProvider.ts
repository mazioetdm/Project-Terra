import type { PlanetaryBodyDefinition, PlanetaryLayerConfig, TileLoadResult } from '../types/terra';
import { loadEquirectangularTileMosaic } from './tileStitcher';

export const EARTH_BODY: PlanetaryBodyDefinition = {
  id: 'earth',
  name: 'Earth',
  subtitle: 'Terrestrial Study Areas Body',
  meanRadiusKm: '6,371.0 km',
  coordinateReference: 'EPSG:4326 (WGS 84 Geographic)',
  primaryProvider: 'NASA Earthdata GIBS / Worldview',
  ambientTintHex: '#5b8269',
  atmosphereRimHex: '#6c8ea4',
};

export function getDefaultEarthModisDate(): string {
  // Use 2 days prior to current UTC date to ensure complete global granule availability
  const now = new Date();
  now.setUTCDate(now.getUTCDate() - 2);
  return now.toISOString().slice(0, 10);
}

export const EARTH_LAYERS: PlanetaryLayerConfig[] = [
  {
    id: 'earth-blue-marble',
    body: 'earth',
    name: 'Blue Marble Shaded Relief',
    category: 'imagery',
    providerName: 'NASA Earthdata GIBS',
    productId: 'BlueMarble_ShadedRelief_Bathymetry',
    temporalClass: 'Static reference maps',
    imageryDate: '2004 Composite Reference',
    supportsDateSelection: false,
    crs: 'EPSG:4326',
    spatialResolution: '500 m (TileMatrixSet: 500m)',
    officialUrl: 'https://worldview.earthdata.nasa.gov/',
    capabilitiesUrl:
      'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml',
    tileUrlTemplate:
      'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/{z}/{y}/{x}.jpeg',
    description:
      'Global cloud-free MODIS terrestrial composite combined with bathymetric and topographic shaded relief.',
    tileServiceAvailable: true,
    legend: [
      { label: 'Bare Regolith / Rock', color: '#B89E78' },
      { label: 'Vegetated Cover', color: '#4B644A' },
      { label: 'Snow / Ice', color: '#E2E6EA' },
      { label: 'Ocean Bathymetry', color: '#1A3045' },
    ],
  },
  {
    id: 'earth-modis-terra',
    body: 'earth',
    name: 'MODIS Terra True Color',
    category: 'imagery',
    providerName: 'NASA Earthdata GIBS',
    productId: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    temporalClass: 'Near-real-time imagery',
    imageryDate: getDefaultEarthModisDate(),
    supportsDateSelection: true,
    crs: 'EPSG:4326',
    spatialResolution: '250 m (TileMatrixSet: 250m)',
    officialUrl: 'https://worldview.earthdata.nasa.gov/',
    capabilitiesUrl:
      'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml',
    tileUrlTemplate:
      'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{Time}/250m/{z}/{y}/{x}.jpg',
    description:
      'Daily global surface reflectance imagery from Terra MODIS showing clouds, snow cover, and terrain.',
    tileServiceAvailable: true,
    legend: [
      { label: 'Land Surface', color: '#A38B6B' },
      { label: 'Cloud / Haze', color: '#ECEEF0' },
      { label: 'Water', color: '#1F354D' },
    ],
  },
  {
    id: 'earth-glo30-elevation',
    body: 'earth',
    name: 'Copernicus DEM GLO-30 (Elevation)',
    category: 'elevation',
    providerName: 'ESA / Copernicus / AWS Open Data',
    productId: 'Copernicus_DSM_COG_10_GLO30',
    temporalClass: 'Static reference maps',
    imageryDate: '2010–2015 TanDEM-X Baseline',
    supportsDateSelection: false,
    crs: 'EPSG:4326',
    spatialResolution: '30 m (1 arc-second)',
    officialUrl: 'https://registry.opendata.aws/copernicus-dem/',
    capabilitiesUrl: 'https://registry.opendata.aws/copernicus-dem/',
    tileUrlTemplate: '',
    description:
      '30 m global Digital Surface Model used as the Earth terrain baseline in analog_data.json.',
    tileServiceAvailable: false,
    unavailableReason:
      'Disabled on globe: Copernicus GLO-30 is distributed as Cloud-Optimized GeoTIFFs on AWS rather than an RGB WMTS tile service.',
  },
  {
    id: 'earth-glo30-slope',
    body: 'earth',
    name: 'GLO-30 Computed Slope Layer',
    category: 'slope',
    providerName: 'Copernicus DEM GLO-30 Derived',
    productId: 'Copernicus_GLO30_Slope',
    temporalClass: 'Static reference maps',
    imageryDate: 'Derived from GLO-30',
    supportsDateSelection: false,
    crs: 'EPSG:4326 / local UTM',
    spatialResolution: '30 m',
    officialUrl: 'https://registry.opendata.aws/copernicus-dem/',
    capabilitiesUrl: 'https://registry.opendata.aws/copernicus-dem/',
    tileUrlTemplate: '',
    description: 'Surface slope angle derived locally per Earth study area AOI.',
    tileServiceAvailable: false,
    unavailableReason:
      'Disabled on globe: slope rasters are computed per study-area AOI from GeoTIFFs, not streamed as global WMTS tiles.',
  },
  {
    id: 'earth-glo30-roughness',
    body: 'earth',
    name: 'GLO-30 RMS Roughness Layer',
    category: 'roughness',
    providerName: 'Copernicus DEM GLO-30 Derived',
    productId: 'Copernicus_GLO30_Roughness',
    temporalClass: 'Static reference maps',
    imageryDate: 'Derived from GLO-30',
    supportsDateSelection: false,
    crs: 'EPSG:4326 / local UTM',
    spatialResolution: '30 m',
    officialUrl: 'https://registry.opendata.aws/copernicus-dem/',
    capabilitiesUrl: 'https://registry.opendata.aws/copernicus-dem/',
    tileUrlTemplate: '',
    description: 'RMS height residual computed over matched windows on Earth study area AOIs.',
    tileServiceAvailable: false,
    unavailableReason:
      'Disabled on globe: RMS roughness is computed per AOI from GLO-30 tiles and is not published as a global WMTS layer.',
  },
  {
    id: 'earth-geology-overlay',
    body: 'earth',
    name: 'Lithology & Anorthosite Reference Layer',
    category: 'geology',
    providerName: 'USGS / Literature References',
    productId: 'Site_Mineralogy_Catalog',
    temporalClass: 'Static reference maps',
    imageryDate: 'Published literature',
    supportsDateSelection: false,
    crs: 'EPSG:4326',
    spatialResolution: 'Site-level geological mapping',
    officialUrl: 'https://mrdata.usgs.gov/',
    capabilitiesUrl: 'https://mrdata.usgs.gov/',
    tileUrlTemplate: '',
    description:
      'Geological context documenting anorthosite targets (Kamestastin, Stillwater) and volcanics.',
    tileServiceAvailable: false,
    unavailableReason:
      'Disabled on globe: no global geological WMTS tile layer is mounted; inspect site mineralogy in the profile panel.',
  },
];

export async function loadEarthGibsLayer(
  layer: PlanetaryLayerConfig,
  selectedDate: string,
  signal?: AbortSignal
): Promise<TileLoadResult> {
  if (!layer.tileServiceAvailable) {
    return {
      status: 'unavailable',
      loadedTiles: 0,
      totalTiles: 0,
      layerId: layer.id,
      effectiveDate: layer.imageryDate,
      officialUrl: layer.officialUrl,
      errorMessage: layer.unavailableReason ?? 'Earth layer endpoint is not configured.',
    };
  }

  const effectiveDate = layer.supportsDateSelection ? selectedDate : layer.imageryDate;

  return loadEquirectangularTileMosaic({
    layerId: layer.id,
    effectiveDate,
    officialUrl: layer.officialUrl,
    scheme: 'gibs_epsg4326_288',
    zoomLevel: 2,
    signal,
    buildTileUrl: (z, y, x) => {
      if (layer.id === 'earth-modis-terra') {
        return `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${effectiveDate}/250m/${z}/${y}/${x}.jpg`;
      }
      return `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/${z}/${y}/${x}.jpeg`;
    },
  });
}
