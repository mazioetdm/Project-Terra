import type { ImageTypeTag, SurfaceObservationImage, VerifiedStudyMediaItem } from '../types/terra';

export type StudyImageTypeValue = 'illustrative';

export type ImageVerificationStatus =
  | 'Verified'
  | 'Partially verified'
  | 'Pending verification'
  | 'Unavailable';

export interface StudyAreaImageRecord {
  imageId: string;
  siteId: string;
  imageUrl: string;
  fullSizeUrl: string;
  originalSourcePage: string;
  photographer: string;
  sourceOrganisation: string;
  imageType: StudyImageTypeValue;
  imageTitle: string;
  imageCaption: string;
  captureDate: string;
  license: string;
  attribution: string;
  verificationStatus: ImageVerificationStatus;
  verifiedRegionLabel: string;
  galleryCategory: 'surface' | 'remote_sensing';
}

export const STUDY_AREA_IMAGES: StudyAreaImageRecord[] = [
  // =========================================================================
  // 1. MISTASTIN / KAMESTASTIN CRATER (kamestastin)
  // =========================================================================
  {
    imageId: 'img-mistastin-melt-outcrop',
    siteId: 'kamestastin',
    imageUrl:
      'https://www.asc-csa.gc.ca/images/astronautes/que-font-les-astronautes/simulations-de-missions-spatiales/formation-en-geologie-fusion-impact-cratere-mistasin-labrador.jpg',
    fullSizeUrl:
      'https://www.asc-csa.gc.ca/images/astronautes/que-font-les-astronautes/simulations-de-missions-spatiales/formation-en-geologie-fusion-impact-cratere-mistasin-labrador.jpg',
    originalSourcePage:
      'https://www.asc-csa.gc.ca/eng/astronauts/about-the-job/space-mission-simulations/training-in-geology.asp',
    photographer: 'Gordon Osinski',
    sourceOrganisation: 'Canadian Space Agency (CSA)',
    imageType: 'illustrative',
    imageTitle: 'Mistastin (Kamestastin) Crater study location reference',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2023 (CSA Archive)',
    license: 'Canadian Space Agency Non-Commercial Open Attribution',
    attribution: 'Canadian Space Agency (CSA) · Photo credit: Gordon Osinski.',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Kamestastin / Mistastin crater, Labrador, Canada (55.883° N, 63.300° W)',
    galleryCategory: 'surface',
  },
  {
    imageId: 'img-mistastin-oli',
    siteId: 'kamestastin',
    imageUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/148000/148491/mistastin_oli_2017254.jpg',
    fullSizeUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/148000/148491/mistastin_oli_2017254_lrg.jpg',
    originalSourcePage:
      'https://science.nasa.gov/earth/earth-observatory/violent-formation-for-mistastin-lake-148491/',
    photographer: 'Landsat 8 OLI · Lauren Dauphin',
    sourceOrganisation: 'NASA Earth Observatory / U.S. Geological Survey',
    imageType: 'illustrative',
    imageTitle: 'Mistastin Lake Landsat 8 OLI Orbital View',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2017-09-11',
    license: 'Public domain',
    attribution: 'NASA Earth Observatory image by Lauren Dauphin, using Landsat data from the USGS.',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Kamestastin / Mistastin crater, Labrador, Canada (55.883° N, 63.300° W)',
    galleryCategory: 'remote_sensing',
  },

  // =========================================================================
  // 2. HAUGHTON IMPACT STRUCTURE (haughton)
  // =========================================================================
  {
    imageId: 'img-haughton-edge-ground',
    siteId: 'haughton',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Edge_of_Haughton_Crater_%282672692755%29.jpg/1280px-Edge_of_Haughton_Crater_%282672692755%29.jpg',
    fullSizeUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/bc/Edge_of_Haughton_Crater_%282672692755%29.jpg',
    originalSourcePage: 'https://commons.wikimedia.org/wiki/File:Edge_of_Haughton_Crater_(2672692755).jpg',
    photographer: 'Haughton-Mars Project',
    sourceOrganisation: 'Haughton-Mars Project / Wikimedia Commons',
    imageType: 'illustrative',
    imageTitle: 'Haughton Impact Structure study location reference',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2008-07-15',
    license: 'Public domain',
    attribution: 'Haughton-Mars Project via Wikimedia Commons (Public domain).',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Haughton crater, Devon Island, Nunavut, Canada (75.383° N, 89.667° W)',
    galleryCategory: 'surface',
  },
  {
    imageId: 'img-haughton-misr',
    siteId: 'haughton',
    imageUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/2000/2585/PIA03714.jpg',
    fullSizeUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/2000/2585/PIA03714_lrg.jpg',
    originalSourcePage:
      'https://science.nasa.gov/earth/earth-observatory/mars-researchers-rendezvous-on-remote-arctic-island-2585/',
    photographer: 'Terra MISR Science Team',
    sourceOrganisation: 'NASA Earth Observatory / GSFC / LaRC / JPL',
    imageType: 'illustrative',
    imageTitle: 'Devon Island and Haughton Impact Structure (Terra MISR orbital view)',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2001-06-28',
    license: 'Public domain',
    attribution: 'Image courtesy NASA/GSFC/LaRC/JPL, MISR Team (Public domain).',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Haughton crater, Devon Island, Nunavut, Canada (75.383° N, 89.667° W)',
    galleryCategory: 'remote_sensing',
  },

  // =========================================================================
  // 3. TAGLANG LA, LADAKH (taglang_la)
  // =========================================================================
  {
    imageId: 'img-taglang-summit',
    siteId: 'taglang_la',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Taglang_La.jpg/1280px-Taglang_La.jpg',
    fullSizeUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Taglang_La.jpg',
    originalSourcePage: 'https://commons.wikimedia.org/wiki/File:Taglang_La.jpg',
    photographer: 'Kiran Kulkarni',
    sourceOrganisation: 'Wikimedia Commons (Category: Taglang La)',
    imageType: 'illustrative',
    imageTitle: 'Taglang La study location reference',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2014-07-14',
    license: 'CC BY-SA 4.0',
    attribution: 'Kiran Kulkarni via Wikimedia Commons (CC BY-SA 4.0).',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Taglang La pass, Ladakh, India (33.5085° N, 77.7714° E)',
    galleryCategory: 'surface',
  },
  {
    imageId: 'img-taglang-gdem',
    siteId: 'taglang_la',
    imageUrl:
      'https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=ASTER_GDEM_Color_Shaded_Relief&CRS=EPSG:4326&BBOX=33.35,77.55,33.67,78.00&FORMAT=image/png&WIDTH=800&HEIGHT=600',
    fullSizeUrl:
      'https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=ASTER_GDEM_Color_Shaded_Relief&CRS=EPSG:4326&BBOX=33.35,77.55,33.67,78.00&FORMAT=image/png&WIDTH=1200&HEIGHT=900',
    originalSourcePage:
      'https://worldview.earthdata.nasa.gov/?v=77.55,33.35,78.00,33.67&l=ASTER_GDEM_Color_Shaded_Relief',
    photographer: 'Terra ASTER GDEM Science Team',
    sourceOrganisation: 'NASA EOSDIS Worldview / METI',
    imageType: 'illustrative',
    imageTitle: 'Taglang La Pass 30 m Shaded-Relief Elevation Model (ASTER GDEM)',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: 'ASTER GDEM Composite',
    license: 'Public domain',
    attribution: 'NASA EOSDIS Worldview / NASA-METI ASTER Global Digital Elevation Model.',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Taglang La pass, Ladakh, India (33.5085° N, 77.7714° E)',
    galleryCategory: 'remote_sensing',
  },

  // =========================================================================
  // 4. STILLWATER COMPLEX, MONTANA (stillwater)
  // =========================================================================
  {
    imageId: 'img-stillwater-doublets',
    siteId: 'stillwater',
    imageUrl: 'https://iugs-geoheritage.org/wp-content/uploads/2022/07/046-1_The-Stillwater-Complex.jpg',
    fullSizeUrl: 'https://iugs-geoheritage.org/wp-content/uploads/2022/07/046-1_The-Stillwater-Complex.jpg',
    originalSourcePage: 'https://iugs-geoheritage.org/geoheritage_sites/the-stillwater-complex/',
    photographer: 'IUGS Geoheritage Site #046 Archive',
    sourceOrganisation: 'IUGS International Commission on Geoheritage',
    imageType: 'illustrative',
    imageTitle: 'Stillwater Complex study location reference',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2022-07',
    license: 'licence: check source page',
    attribution: 'IUGS International Commission on Geoheritage (Site #046).',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Stillwater Complex, Montana, USA (45.3861° N, 109.9031° W)',
    galleryCategory: 'surface',
  },
  {
    imageId: 'img-stillwater-oli',
    siteId: 'stillwater',
    imageUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/146000/146650/stillwater_oli-srtm_2018222.jpg',
    fullSizeUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/146000/146650/stillwater_oli-srtm_2018222_lrg.jpg',
    originalSourcePage:
      'https://science.nasa.gov/earth/earth-observatory/montanas-moon-like-rocks-146650/',
    photographer: 'Landsat 8 OLI & SRTM · Joshua Stevens',
    sourceOrganisation: 'NASA Earth Observatory / U.S. Geological Survey',
    imageType: 'illustrative',
    imageTitle: 'Stillwater Complex Layered Intrusions (Landsat 8 OLI & SRTM view)',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2018-08-10',
    license: 'Public domain',
    attribution:
      'NASA Earth Observatory image by Joshua Stevens, using Landsat data from the USGS and SRTM topography.',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Stillwater Complex, Montana, USA (45.3861° N, 109.9031° W)',
    galleryCategory: 'remote_sensing',
  },

  // =========================================================================
  // 5. MIYAKE-JIMA, JAPAN (miyake_jima)
  // =========================================================================
  {
    imageId: 'img-miyakejima-lava-field',
    siteId: 'miyake_jima',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Experience_the_Volcano_Hiking_Trail.jpg/1280px-Experience_the_Volcano_Hiking_Trail.jpg',
    fullSizeUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Experience_the_Volcano_Hiking_Trail.jpg',
    originalSourcePage: 'https://commons.wikimedia.org/wiki/File:Experience_the_Volcano_Hiking_Trail.jpg',
    photographer: 'LT sfm',
    sourceOrganisation: 'Wikimedia Commons',
    imageType: 'illustrative',
    imageTitle: 'Miyake-jima study location reference',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2021-03-13',
    license: 'CC BY-SA 3.0',
    attribution: 'LT sfm via Wikimedia Commons (CC BY-SA 3.0).',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Miyake-jima, Japan (34.079° N, 139.529° E)',
    galleryCategory: 'surface',
  },
  {
    imageId: 'img-miyakejima-oli',
    siteId: 'miyake_jima',
    imageUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/85000/85803/miyakajima_oli_2015042.jpg',
    fullSizeUrl:
      'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/85000/85803/miyakajima_oli_2015042_lrg.jpg',
    originalSourcePage:
      'https://science.nasa.gov/earth/earth-observatory/return-to-miyakejima-85803/',
    photographer: 'Landsat 8 OLI · Jesse Allen',
    sourceOrganisation: 'NASA Earth Observatory / U.S. Geological Survey',
    imageType: 'illustrative',
    imageTitle: 'Miyake-jima Island Landsat 8 OLI Orbital View',
    imageCaption: 'Illustrative image, not a photograph of the study area',
    captureDate: '2015-02-11',
    license: 'Public domain',
    attribution: 'NASA Earth Observatory image by Jesse Allen, using Landsat data from the USGS.',
    verificationStatus: 'Verified',
    verifiedRegionLabel: 'Miyake-jima, Japan (34.079° N, 139.529° E)',
    galleryCategory: 'remote_sensing',
  },
];

function mapImageTypeToTag(imageType: StudyImageTypeValue): ImageTypeTag {
  return 'illustrative';
}

export function getStudyImagesForSite(siteId: string): StudyAreaImageRecord[] {
  return STUDY_AREA_IMAGES.filter((img) => img.siteId === siteId);
}

export function getPrimarySurfaceImagesForSite(siteId: string): StudyAreaImageRecord[] {
  return STUDY_AREA_IMAGES.filter(
    (img) => img.siteId === siteId && img.galleryCategory === 'surface'
  );
}

export function getSecondaryRemoteImagesForSite(siteId: string): StudyAreaImageRecord[] {
  return STUDY_AREA_IMAGES.filter(
    (img) => img.siteId === siteId && img.galleryCategory === 'remote_sensing'
  );
}

export function studyImageToVerifiedMedia(img: StudyAreaImageRecord): VerifiedStudyMediaItem {
  return {
    id: img.imageId,
    siteId: img.siteId,
    title: img.imageTitle,
    alt: `${img.imageTitle} (${img.imageType})`,
    caption: 'Illustrative image, not a photograph of the study area',
    imageUrl: img.imageUrl,
    fullSizeUrl: img.fullSizeUrl,
    originalSourceUrl: img.originalSourcePage,
    sourceOrganisation: img.sourceOrganisation,
    photographerOrInstrument: img.photographer,
    acquisitionDate: img.captureDate,
    attribution: img.attribution,
    license: img.license,
    verificationStatus: img.verificationStatus,
    verifiedRegionLabel: img.verifiedRegionLabel,
    imageTypeTag: 'illustrative',
    galleryCategory: img.galleryCategory,
    perspective: img.galleryCategory === 'surface' ? 'rover-ground' : 'orbital',
    aspectClass: 'aspect-[16/10]',
  };
}
