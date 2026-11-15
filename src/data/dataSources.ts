import type { DatasetProvenanceRecord } from '../types/terra';
import { ANALOG_DATA } from './analogData';
import { getDefaultEarthModisDate } from '../providers/earthGibsProvider';

function collectUnverifiedIssues(): string[] {
  const notes: string[] = [];
  if (ANALOG_DATA.reference.centre === null) {
    notes.push('Reference centre is null; AOI bounds pending Site01 GeoTIFF header (unverified)');
  }
  for (const site of ANALOG_DATA.sites) {
    for (const issue of site.data_issues) {
      if (/unverified/i.test(issue)) {
        notes.push(`${site.name}: ${issue}`);
      }
    }
  }
  return notes;
}

const unverifiedNotes = collectUnverifiedIssues();

export const DATA_PROVENANCE_RECORDS: DatasetProvenanceRecord[] = [
  {
    id: 'ds-lro-diviner',
    datasetName: 'LRO Diviner south polar gridded products',
    organisation: 'NASA PDS Geosciences Node / UCLA Diviner Science Team',
    variable: 'Diurnal bolometric surface temperature range',
    productIdentifier: 'LRO Diviner South Polar Gridded Bolometric Temperature',
    url: ANALOG_DATA.reference.metrics.temp_diurnal_range_K.url,
    observationDate: `Retrieval pending (${
      ANALOG_DATA.reference.metrics.temp_diurnal_range_K.retrieved ?? 'no data'
    })`,
    spatialResolution: '240 m polar grid',
    units: ANALOG_DATA.reference.metrics.temp_diurnal_range_K.unit,
    uncertainty:
      'Bolometric brightness-temperature calibration accuracy and local-time bin coverage vary across polar shadow boundaries; local Site01 extraction unverified.',
    coordinateReferenceSystem: 'Lunar South Polar Stereographic',
    limitation:
      '240 m grid differs in spatial scale from 1 km Earth MODIS LST, and permanently shadowed lunar cold traps have no terrestrial thermal counterpart.',
    unverifiedDetails: [
      'Site01 diurnal range retrieval date unverified (retrieved: no data)',
    ],
    applicableBody: 'Moon',
    temporalClass: 'Historical observations',
  },
  {
    id: 'ds-lola-ldrm',
    datasetName: 'LRO LOLA slope and roughness (LDRM)',
    organisation: 'NASA PGDA / LRO LOLA Science Team',
    variable: 'Surface roughness (RMS height residual) and regional slope',
    productIdentifier: 'PGDA Product 90 — LRO LOLA Roughness',
    url: ANALOG_DATA.reference.metrics.roughness_m.url,
    observationDate: `Retrieval pending (${
      ANALOG_DATA.reference.metrics.roughness_m.retrieved ?? 'no data'
    })`,
    spatialResolution: 'Matched RMS height-residual baseline window',
    units: ANALOG_DATA.reference.metrics.roughness_m.unit,
    uncertainty:
      'Sensitive to laser-track interpolation density and baseline window geometry; local Site01 extraction unverified.',
    coordinateReferenceSystem: 'Lunar South Polar Stereographic (metres)',
    limitation:
      'Roughness depends strongly on baseline window size and track interpolation density; both Moon and Earth must use identical moving-window geometry.',
    unverifiedDetails: [
      'Local Site01 roughness retrieval date unverified (retrieved: no data)',
    ],
    applicableBody: 'Moon',
    temporalClass: 'Static reference maps',
  },
  {
    id: 'ds-barker-site01-dem',
    datasetName: 'Barker et al. LOLA Site01 Connecting Ridge 5 m DEM',
    organisation: 'NASA Goddard Planetary Geodynamics Data Archive (PGDA)',
    variable: 'Terrain slope and elevation',
    productIdentifier: 'Site01_final_adj_5mpp_slp.tif (Barker et al. Site01)',
    url: ANALOG_DATA.reference.coordinate_source,
    observationDate: `Retrieval pending (${
      ANALOG_DATA.reference.metrics.slope_deg.retrieved ?? 'no data'
    })`,
    spatialResolution: '5 m / pixel native product (resampled to 30 m for comparison)',
    units: ANALOG_DATA.reference.metrics.slope_deg.unit,
    uncertainty:
      'About 90 percent interpolated between LOLA altimeter tracks with a median RMS slope error of roughly 1.5 to 2.5 deg.',
    coordinateReferenceSystem:
      'Lunar South Polar Stereographic (metres; AOI bounds pending Site01 header)',
    limitation:
      'Resampled to 30 m to match Earth Copernicus GLO-30 resolution; polar-stereographic bounds and retrieval timestamp are still pending.',
    unverifiedDetails: [
      ...unverifiedNotes.filter((n) => n.includes('Reference centre')),
      'GeoTIFF header bounds and retrieval date unverified (retrieved: no data)',
    ],
    applicableBody: 'Moon',
    temporalClass: 'Static reference maps',
  },
  {
    id: 'ds-modis-mod11a1',
    datasetName: 'MODIS MOD11A1 v061',
    organisation: 'NASA Earthdata LP DAAC (Terra MODIS Land Surface Temperature)',
    variable: 'Daily land surface temperature diurnal swing (day minus night)',
    productIdentifier: 'MOD11A1.061 (Daily 1 km LST)',
    url: 'https://doi.org/10.5067/MODIS/MOD11A1.061',
    observationDate: 'Collection 6.1 daily LST archive; site extract pending',
    spatialResolution: '1 km sinusoidal grid',
    units: 'K (diurnal range)',
    uncertainty:
      'Typically ~1 K under clear-sky homogeneous land, degrading over mixed steep terrain, open water, cloud gaps, and polar winter night.',
    coordinateReferenceSystem: 'MODIS Sinusoidal 1 km grid',
    limitation:
      '1 km pixels mix slopes and aspects over steep mountain passes (Taglang La), are invalid over open water (Kamestastin central lake must be masked), and suffer polar-night or cloud-cover gaps (Haughton).',
    unverifiedDetails: unverifiedNotes.filter((n) => n.includes('MODIS')),
    applicableBody: 'Earth',
    temporalClass: 'Historical observations',
  },
  {
    id: 'ds-copernicus-glo30',
    datasetName: 'Copernicus DEM GLO-30',
    organisation: 'European Space Agency (ESA) / Copernicus / Registry of Open Data on AWS',
    variable: 'Surface elevation, derived slope (deg), and RMS height roughness (m)',
    productIdentifier: 'Copernicus DEM GLO-30 (30 m global DSM)',
    url: 'https://registry.opendata.aws/copernicus-dem/',
    observationDate: 'TanDEM-X acquisition baseline (2010–2015); local extract pending',
    spatialResolution: '30 m (1 arc-second nominal)',
    units: 'deg (slope) / m (RMS height residual)',
    uncertainty:
      'Nominal vertical accuracy better than 4 m (LE90) on moderate terrain, degrading on steep mountain walls and under forest canopy.',
    coordinateReferenceSystem: 'EPSG:4326 / local UTM projection for slope & roughness',
    limitation:
      'Earth DEMs are Digital Surface Models (DSM) rather than bare-earth terrain models (DTM), so forest canopy, buildings, and snow/ice bias slope and roughness.',
    unverifiedDetails: unverifiedNotes.filter(
      (n) =>
        n.includes('Steep slopes') ||
        n.includes('Forest canopy') ||
        n.includes('Published centres')
    ),
    applicableBody: 'Earth',
    temporalClass: 'Static reference maps',
  },
  {
    id: 'ds-nasadem',
    datasetName: 'NASADEM',
    organisation: 'NASA Earthdata MEaSUREs / LP DAAC',
    variable: 'Orthometric surface elevation (evaluated and excluded for >60 N coverage)',
    productIdentifier: 'NASADEM_HGT.001 (SRTM-reprocessed 30 m DEM)',
    url: 'https://www.earthdata.nasa.gov/fr/data/catalog/lpcloud-nasadem-hgt-001',
    observationDate: 'SRTM February 2000 mission reprocessed release',
    spatialResolution: '30 m (1 arc-second)',
    units: 'm (orthometric height)',
    uncertainty:
      'SRTM radar phase unwrapping errors on steep slopes and canopy scattering; unavailable poleward of 60 N.',
    coordinateReferenceSystem: 'EPSG:4326 / EGM96',
    limitation:
      'Latitude coverage stops at 60 N (to 56 S), so NASADEM does not cover Haughton crater at 75.383 N. Copernicus DEM GLO-30 is used across all Earth sites for consistency.',
    unverifiedDetails: [
      'Excluded from high-Arctic site Haughton (>60 N) due to SRTM orbital inclination cutoff',
    ],
    applicableBody: 'Earth',
    temporalClass: 'Static reference maps',
  },
  {
    id: 'ds-globe-tiles',
    datasetName: 'NASA Worldview GIBS & Moon Trek WMTS Basemaps',
    organisation: 'NASA Earthdata GIBS & NASA Moon Trek / ASU LROC',
    variable: 'Global optical reflectance and shaded-relief map tiles',
    productIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor / LRO_WAC_Mosaic_Global_303ppd_v02',
    url: 'https://trek.nasa.gov/moon/',
    observationDate: `Earth MODIS rolling (${getDefaultEarthModisDate()}); LROC WAC (2009–2013)`,
    spatialResolution: '250 m (Earth MODIS) / 100 m (Moon LROC WAC)',
    units: 'Optical reflectance mosaic tiles',
    uncertainty:
      'Equirectangular mosaic tiles distort high-latitude polar geometry and are strictly visual reference layers.',
    coordinateReferenceSystem: 'EPSG:4326 (Earth) / IAU Moon 2000 EQ (Moon)',
    limitation:
      'Used strictly for 3D globe visualization in Explore; never used to compute the numerical slope, roughness, or thermal statistics in analog_data.json.',
    unverifiedDetails: [],
    applicableBody: 'Earth & Moon',
    temporalClass: 'Near-real-time imagery',
  },
];
