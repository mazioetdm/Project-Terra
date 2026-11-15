import type { PlanetaryBodyDefinition, PlanetaryLayerConfig, TileLoadResult } from '../types/terra';
import { loadEquirectangularTileMosaic } from './tileStitcher';

export const MOON_BODY: PlanetaryBodyDefinition = {
  id: 'moon',
  name: 'Moon',
  subtitle: 'Lunar South Pole Reference Body',
  meanRadiusKm: '1,737.4 km',
  coordinateReference: 'Lunar South Polar Stereographic (AOI) / IAU Moon 2000 EQ (Mosaic)',
  primaryProvider: 'NASA Moon Trek / LRO Mission Archive',
  ambientTintHex: '#9c9b97',
  atmosphereRimHex: '#7d8187',
};

export const MOON_LAYERS: PlanetaryLayerConfig[] = [
  {
    id: 'moon-lro-wac',
    body: 'moon',
    name: 'LROC WAC Global Morphology Mosaic',
    category: 'imagery',
    providerName: 'NASA Moon Trek / ASU LROC',
    productId: 'LRO_WAC_Mosaic_Global_303ppd_v02',
    temporalClass: 'Historical observations',
    imageryDate: '2009–2013 LRO Nominal Mission',
    crs: 'Moon Equirectangular (default028mm)',
    spatialResolution: '100 m / pixel (303 ppd)',
    officialUrl: 'https://trek.nasa.gov/moon/',
    capabilitiesUrl:
      'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/WMTSCapabilities.xml',
    tileUrlTemplate:
      'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    description:
      'Global monochrome reflectance mosaic from the Lunar Reconnaissance Orbiter Wide Angle Camera.',
    tileServiceAvailable: true,
    legend: [
      { label: 'Highlands (High Albedo)', color: '#C6C5C0' },
      { label: 'Maria (Low Albedo)', color: '#535458' },
    ],
  },
  {
    id: 'moon-lola-elevation',
    body: 'moon',
    name: 'LRO LOLA Color Shaded Relief',
    category: 'elevation',
    providerName: 'NASA Moon Trek / GSFC LOLA',
    productId: 'LRO_LOLA_ClrShade_Global_128ppd_v04',
    temporalClass: 'Static reference maps',
    imageryDate: 'LRO LOLA Global Altimetry Release v04',
    crs: 'Moon Equirectangular (default028mm)',
    spatialResolution: '~237 m / pixel (128 ppd)',
    officialUrl: 'https://trek.nasa.gov/moon/',
    capabilitiesUrl:
      'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04/1.0.0/WMTSCapabilities.xml',
    tileUrlTemplate:
      'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04/1.0.0/default/default028mm/{z}/{y}/{x}.png',
    description:
      'Color-coded laser altimetry topography and hillshade from the Lunar Orbiter Laser Altimeter.',
    tileServiceAvailable: true,
    legend: [
      { label: 'Deep Basin (-9 km)', color: '#2F4C8F' },
      { label: 'Mid Plains (0 km)', color: '#4E9A74' },
      { label: 'Highlands (+10 km)', color: '#D15B3E' },
    ],
  },
  {
    id: 'moon-site01-slope',
    body: 'moon',
    name: 'Barker LOLA Site01 5 m Slope Map',
    category: 'slope',
    providerName: 'NASA PGDA (Product 78)',
    productId: 'Site01_final_adj_5mpp_slp.tif',
    temporalClass: 'Static reference maps',
    imageryDate: 'PGDA Site01 Polar Stereographic GeoTIFF',
    crs: 'Lunar South Polar Stereographic (m)',
    spatialResolution: '5 m / pixel (resampled to 30 m)',
    officialUrl: 'https://pgda.gsfc.nasa.gov/products/78',
    capabilitiesUrl: 'https://pgda.gsfc.nasa.gov/products/78',
    tileUrlTemplate: '',
    description:
      'Polar-stereographic slope GeoTIFF over the Connecting Ridge Site01 region.',
    tileServiceAvailable: false,
    unavailableReason:
      'Disabled on globe: PGDA Product 78 is distributed as a polar-stereographic GeoTIFF rather than a public WMTS tile service.',
  },
  {
    id: 'moon-lola-roughness',
    body: 'moon',
    name: 'LRO LOLA Roughness Map (LDRM)',
    category: 'roughness',
    providerName: 'NASA PGDA (Product 90)',
    productId: 'LRO_LOLA_LDRM_Roughness',
    temporalClass: 'Static reference maps',
    imageryDate: 'PGDA Product 90 Archive',
    crs: 'Lunar South Polar Stereographic (m)',
    spatialResolution: 'Matched baseline window',
    officialUrl: 'https://pgda.gsfc.nasa.gov/products/90',
    capabilitiesUrl: 'https://pgda.gsfc.nasa.gov/products/90',
    tileUrlTemplate: '',
    description:
      'RMS height-residual surface roughness map derived from LOLA laser altimeter profiles.',
    tileServiceAvailable: false,
    unavailableReason:
      'Disabled on globe: PGDA Product 90 LDRM roughness rasters are not published as browser WMTS tiles.',
  },
  {
    id: 'moon-geologic-map',
    body: 'moon',
    name: 'USGS Unified Global Geologic Map (1:5M)',
    category: 'geology',
    providerName: 'USGS Astrogeology',
    productId: 'USGS_SIM_3469_Unified_Geologic_Map',
    temporalClass: 'Static reference maps',
    imageryDate: '2020 Unified Synthesis',
    crs: 'Moon Equirectangular',
    spatialResolution: '1:5,000,000 Synthesis',
    officialUrl:
      'https://astrogeology.usgs.gov/search/map/Moon/Geology/Unified_Geologic_Map_of_the_Moon_GIS_v2',
    capabilitiesUrl: 'https://trek.nasa.gov/moon/',
    tileUrlTemplate: '',
    description:
      'Synthesized global lunar stratigraphic units compiled from orbital mapping.',
    tileServiceAvailable: false,
    unavailableReason:
      'Disabled on globe: USGS 1:5M geologic vector/raster polygons are not served as a public WMTS tile layer.',
  },
];

export async function loadMoonTrekLayer(
  layer: PlanetaryLayerConfig,
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
      errorMessage: layer.unavailableReason ?? 'Moon Trek layer endpoint is unavailable.',
    };
  }

  return loadEquirectangularTileMosaic({
    layerId: layer.id,
    effectiveDate: layer.imageryDate,
    officialUrl: layer.officialUrl,
    scheme: 'trek_eq_default028mm',
    zoomLevel: 2,
    signal,
    buildTileUrl: (z, y, x) => {
      if (layer.id === 'moon-lola-elevation') {
        return `https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04/1.0.0/default/default028mm/${z}/${y}/${x}.png`;
      }
      return `https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/${z}/${y}/${x}.jpg`;
    },
  });
}
