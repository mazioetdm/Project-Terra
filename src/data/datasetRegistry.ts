export type DatasetType =
  | 'satellite_imagery'
  | 'aerial_imagery'
  | 'ground_photograph'
  | 'digital_elevation_model'
  | 'geological_map'
  | 'field_measurement'
  | 'mineralogical_data'
  | 'terrain_analysis';

export type VerificationStatus =
  | 'Verified'
  | 'Partially verified'
  | 'Pending verification'
  | 'Unavailable';

export interface DatasetRegistryRecord {
  datasetId: string;
  datasetName: string;
  siteId: string;
  scientificPurpose: string;
  sourceOrganization: string;
  sourcePageUrl: string;
  directAssetUrl?: string | null;
  datasetType: DatasetType;
  acquisitionDate: string;
  spatialResolution: string;
  coordinateReferenceSystem: string;
  units: string;
  license: string;
  attribution: string;
  verificationStatus: VerificationStatus;
}

export const DATASET_REGISTRY: DatasetRegistryRecord[] = [
  // --- MISTASTIN / KAMESTASTIN ---
  {
    datasetId: 'ds-mistastin-landsat8',
    datasetName: 'Landsat 8 OLI Mistastin Impact Structure Mosaic',
    siteId: 'kamestastin',
    scientificPurpose: 'Orbital satellite imagery of impact crater morphology and Horseshoe Island central uplift.',
    sourceOrganization: 'NASA Earth Observatory / U.S. Geological Survey',
    sourcePageUrl: 'https://science.nasa.gov/earth/earth-observatory/violent-formation-for-mistastin-lake-148491/',
    directAssetUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/148000/148491/mistastin_oli_2017254_lrg.jpg',
    datasetType: 'satellite_imagery',
    acquisitionDate: '2017-09-11',
    spatialResolution: '30 m (OLI multispectral bands)',
    coordinateReferenceSystem: 'EPSG:4326 (WGS 84)',
    units: 'Surface reflectance (dimensionless)',
    license: 'Public domain',
    attribution: 'NASA Earth Observatory image by Lauren Dauphin, using Landsat data from the USGS.',
    verificationStatus: 'Verified',
  },
  {
    datasetId: 'ds-mistastin-copernicus-glo30',
    datasetName: 'Copernicus DEM GLO-30 (Mistastin AOI)',
    siteId: 'kamestastin',
    scientificPurpose: 'Digital Surface Model for computing terrain slope (deg) and RMS height roughness (m).',
    sourceOrganization: 'European Space Agency (ESA) / Copernicus / AWS Open Data',
    sourcePageUrl: 'https://registry.opendata.aws/copernicus-dem/',
    directAssetUrl: null,
    datasetType: 'digital_elevation_model',
    acquisitionDate: '2010–2015 TanDEM-X Baseline',
    spatialResolution: '30 m (1 arc-second)',
    coordinateReferenceSystem: 'EPSG:4326 / local UTM',
    units: 'deg (slope) / m (RMS height residual)',
    license: 'Open Government / Copernicus Data Policy',
    attribution: 'ESA Copernicus DEM GLO-30 via AWS Open Data.',
    verificationStatus: 'Verified',
  },
  {
    datasetId: 'ds-mistastin-modis-lst',
    datasetName: 'MODIS MOD11A1 v061 LST (Mistastin)',
    siteId: 'kamestastin',
    scientificPurpose: 'Daily land surface temperature diurnal swing (day minus night) over 14 km circular AOI (excluding central lake).',
    sourceOrganization: 'NASA Earthdata LP DAAC',
    sourcePageUrl: 'https://doi.org/10.5067/MODIS/MOD11A1.061',
    directAssetUrl: null,
    datasetType: 'field_measurement',
    acquisitionDate: 'Collection 6.1 daily archive',
    spatialResolution: '1 km sinusoidal grid',
    coordinateReferenceSystem: 'MODIS Sinusoidal 1 km grid',
    units: 'K (diurnal range)',
    license: 'NASA Earthdata Open Access',
    attribution: 'NASA LP DAAC / MODIS Science Team.',
    verificationStatus: 'Verified',
  },

  // --- HAUGHTON CRATER ---
  {
    datasetId: 'ds-haughton-misr-orbit',
    datasetName: 'Terra MISR Multi-angle Orbital View of Devon Island',
    siteId: 'haughton',
    scientificPurpose: 'Multi-angle orbital reflectance signatures across the 23 km Haughton impact structure.',
    sourceOrganization: 'NASA Earth Observatory / GSFC / LaRC / JPL',
    sourcePageUrl: 'https://science.nasa.gov/earth/earth-observatory/mars-researchers-rendezvous-on-remote-arctic-island-2585/',
    directAssetUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/2000/2585/PIA03714_lrg.jpg',
    datasetType: 'satellite_imagery',
    acquisitionDate: '2001-06-28',
    spatialResolution: '275 m to 1.1 km multi-angle bands',
    coordinateReferenceSystem: 'EPSG:4326 (WGS 84)',
    units: 'Reflectance factor',
    license: 'Public domain',
    attribution: 'Image courtesy NASA/GSFC/LaRC/JPL, MISR Team.',
    verificationStatus: 'Verified',
  },
  {
    datasetId: 'ds-haughton-arc-rover-survey',
    datasetName: 'NASA Ames Haughton-Mars Project Rover Field Survey',
    siteId: 'haughton',
    scientificPurpose: 'Ground-level documentation of rover traverses and frost-rubble terrain inside Haughton crater.',
    sourceOrganization: 'NASA Ames Research Center',
    sourcePageUrl: 'https://images.nasa.gov/details/ARC-2007-ACD07-0170-005',
    directAssetUrl: 'https://images-assets.nasa.gov/image/ARC-2007-ACD07-0170-005/ARC-2007-ACD07-0170-005~orig.jpg',
    datasetType: 'ground_photograph',
    acquisitionDate: '2007-07-19',
    spatialResolution: 'Ground-level photographic frame',
    coordinateReferenceSystem: 'Local polar surface coordinates',
    units: 'Photographic RGB',
    license: 'Public domain',
    attribution: 'NASA Ames Research Center · Photo credit: Matt Deans (NASA).',
    verificationStatus: 'Verified',
  },
  {
    datasetId: 'ds-haughton-timpatterson-study',
    datasetName: 'T. Patterson et al. 2020 Geomatics & Elevation Study (Devon Island)',
    siteId: 'haughton',
    scientificPurpose: 'Terrain morphology, geological mapping, and 20 m digital elevation models derived from Canadian elevation data.',
    sourceOrganization: 'Carleton University / Meteoritics & Planetary Science',
    sourcePageUrl: 'https://carleton.ca/timpatterson/wp-content/uploads/Patterson.2020.Met_.Plan_.Sci_.13573.pdf',
    directAssetUrl: 'https://carleton.ca/timpatterson/wp-content/uploads/Patterson.2020.Met_.Plan_.Sci_.13573.pdf',
    datasetType: 'digital_elevation_model',
    acquisitionDate: '2020 publication baseline',
    spatialResolution: '20 m DEM grid',
    coordinateReferenceSystem: 'NAD83 / Canadian Arctic GIS',
    units: 'm (elevation / slope)',
    license: 'Academic Open Access / Meteoritics & Planetary Science',
    attribution: 'T. Patterson et al., Meteoritics & Planetary Science (2020).',
    verificationStatus: 'Verified',
  },

  // --- TAGLANG LA ---
  {
    datasetId: 'ds-taglang-la-aster-gdem',
    datasetName: 'Terra ASTER Global Digital Elevation Model (Taglang La AOI)',
    siteId: 'taglang_la',
    scientificPurpose: 'High-altitude Himalayan relief, slope (deg), and roughness (m) analysis across 15x15 km square at 33.5085N, 77.7714E.',
    sourceOrganization: 'NASA EOSDIS Worldview / METI ASTER Science Team',
    sourcePageUrl: 'https://worldview.earthdata.nasa.gov/?v=77.55,33.35,78.00,33.67&l=ASTER_GDEM_Color_Shaded_Relief',
    directAssetUrl: 'https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=ASTER_GDEM_Color_Shaded_Relief&CRS=EPSG:4326&BBOX=33.35,77.55,33.67,78.00&FORMAT=image/png&WIDTH=1200&HEIGHT=900',
    datasetType: 'digital_elevation_model',
    acquisitionDate: 'ASTER GDEM Composite',
    spatialResolution: '30 m grid',
    coordinateReferenceSystem: 'EPSG:4326 (WGS 84)',
    units: 'm (elevation) / deg (slope)',
    license: 'Public domain',
    attribution: 'NASA EOSDIS Worldview / NASA-METI ASTER GDEM.',
    verificationStatus: 'Verified',
  },
  {
    datasetId: 'ds-taglang-copernicus-dataspace',
    datasetName: 'Copernicus Data Space Ecosystem DEM & Sentinel-2 View',
    siteId: 'taglang_la',
    scientificPurpose: 'High-altitude Himalayan pass analysis and surface reflectance verification.',
    sourceOrganization: 'Copernicus Data Space Ecosystem / ESA',
    sourcePageUrl: 'https://dataspace.copernicus.eu/',
    directAssetUrl: null,
    datasetType: 'satellite_imagery',
    acquisitionDate: '2024–2026 Sentinel-2 L2A',
    spatialResolution: '10 m to 30 m',
    coordinateReferenceSystem: 'EPSG:4326 / UTM Zone 43N',
    units: 'Surface reflectance',
    license: 'Copernicus Sentinel Data Legal Notice',
    attribution: 'European Union / Copernicus Data Space Ecosystem.',
    verificationStatus: 'Partially verified',
  },

  // --- STILLWATER COMPLEX ---
  {
    datasetId: 'ds-stillwater-landsat-srtm',
    datasetName: 'Stillwater Complex Landsat 8 OLI & SRTM Satellite Mosaic',
    siteId: 'stillwater',
    scientificPurpose: 'Orbital satellite observation of the 30-mile layered mafic-to-ultramafic intrusion in the Beartooth Mountain Range.',
    sourceOrganization: 'NASA Earth Observatory / U.S. Geological Survey',
    sourcePageUrl: 'https://science.nasa.gov/earth/earth-observatory/montanas-moon-like-rocks-146650/',
    directAssetUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/146000/146650/stillwater_oli-srtm_2018222_lrg.jpg',
    datasetType: 'satellite_imagery',
    acquisitionDate: '2018-08-10',
    spatialResolution: '30 m OLI / SRTM topography',
    coordinateReferenceSystem: 'EPSG:4326 (WGS 84)',
    units: 'Surface reflectance and elevation',
    license: 'Public domain',
    attribution: 'NASA Earth Observatory image by Joshua Stevens, using Landsat data from the USGS and SRTM topography.',
    verificationStatus: 'Verified',
  },
  {
    datasetId: 'ds-stillwater-usgs-outcrop',
    datasetName: 'USGS Stillwater Complex Rock Outcrop & Thin-Section Database',
    siteId: 'stillwater',
    scientificPurpose: 'Geological mapping, drill core hand samples, anorthosite outcrops, and petrographic thin-section analysis (USGS I-797 and SIR 2014-5183).',
    sourceOrganization: 'U.S. Geological Survey (USGS)',
    sourcePageUrl: 'https://www.usgs.gov/data/stillwater-complex-rock-outcrop-database-ver-20-september-2026',
    directAssetUrl: 'https://www.usgs.gov/data/stillwater-complex-rock-outcrop-database-ver-20-september-2026',
    datasetType: 'geological_map',
    acquisitionDate: '2026 Database Release (USGS I-797 baseline)',
    spatialResolution: 'Site-level outcrop and hand-sample scale',
    coordinateReferenceSystem: 'NAD83 / UTM Zone 12N',
    units: 'Geological classification and mineralogy',
    license: 'Public domain (USGS)',
    attribution: 'U.S. Geological Survey (USGS) Stillwater Complex Rock Outcrop Database.',
    verificationStatus: 'Verified',
  },

  // --- MIYAKE-JIMA ---
  {
    datasetId: 'ds-miyakejima-landsat8',
    datasetName: 'Miyake-jima Island Landsat 8 OLI Volcano Observation',
    siteId: 'miyake_jima',
    scientificPurpose: 'Satellite monitoring of Mount Oyama summit caldera, ash blankets, and returning forest vegetation.',
    sourceOrganization: 'NASA Earth Observatory / U.S. Geological Survey',
    sourcePageUrl: 'https://science.nasa.gov/earth/earth-observatory/return-to-miyakejima-85803/',
    directAssetUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/85000/85803/miyakajima_oli_2015042_lrg.jpg',
    datasetType: 'satellite_imagery',
    acquisitionDate: '2015-02-11',
    spatialResolution: '30 m OLI multispectral',
    coordinateReferenceSystem: 'EPSG:4326 (WGS 84)',
    units: 'Surface reflectance',
    license: 'Public domain',
    attribution: 'NASA Earth Observatory image by Jesse Allen, using Landsat data from the USGS.',
    verificationStatus: 'Verified',
  },
  {
    datasetId: 'ds-miyakejima-jma-gsj',
    datasetName: 'Japan Meteorological Agency (JMA) & Geological Survey of Japan (GSJ) Volcano Dossier',
    siteId: 'miyake_jima',
    scientificPurpose: 'Volcanological report (Volcano No. 062), historical eruption data, and aerial photography documentation of Mount Oyama.',
    sourceOrganization: 'Japan Meteorological Agency / Geological Survey of Japan (GSJ)',
    sourcePageUrl: 'https://www.data.jma.go.jp/vois/data/filing/souran_eng/volcanoes/062_miyakejima.pdf',
    directAssetUrl: 'https://www.data.jma.go.jp/vois/data/filing/souran_eng/volcanoes/062_miyakejima.pdf',
    datasetType: 'geological_map',
    acquisitionDate: 'JMA Active Volcanoes of Japan Compendium',
    spatialResolution: 'Volcano-wide geological map and aerial survey',
    coordinateReferenceSystem: 'JGD2011 / Lat-Lon',
    units: 'Volcanic activity and lithology',
    license: 'Official Government Publication (JMA / GSJ)',
    attribution: 'Japan Meteorological Agency (JMA) and Geological Survey of Japan (GSJ).',
    verificationStatus: 'Verified',
  },
];
