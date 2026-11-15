import {
  getPrimarySurfaceImagesForSite,
  getSecondaryRemoteImagesForSite,
  getStudyImagesForSite,
  studyImageToVerifiedMedia,
} from './studyAreaImages';
import type { SurfaceObservationImage, VerifiedStudyMediaItem } from '../types/terra';

export function getVerifiedMediaForSite(siteId: string): VerifiedStudyMediaItem[] {
  return getStudyImagesForSite(siteId).map(studyImageToVerifiedMedia);
}

export function getSurfaceMediaForSite(siteId: string): VerifiedStudyMediaItem[] {
  return getPrimarySurfaceImagesForSite(siteId).map(studyImageToVerifiedMedia);
}

export function getRemoteMediaForSite(siteId: string): VerifiedStudyMediaItem[] {
  return getSecondaryRemoteImagesForSite(siteId).map(studyImageToVerifiedMedia);
}

export function toSurfaceObservationImage(
  item: VerifiedStudyMediaItem
): SurfaceObservationImage {
  const isSurface = item.galleryCategory === 'surface';
  return {
    id: item.id,
    title: item.title,
    caption: item.caption,
    thumbnailUrl: item.imageUrl,
    fullSizeUrl: item.fullSizeUrl,
    originalSourceUrl: item.originalSourceUrl,
    acquisitionDate: item.acquisitionDate,
    isHistorical: item.acquisitionDate !== 'ASTER GDEM Composite',
    missionContext: isSurface
      ? 'Verified Ground-Level / Field Surface Observation'
      : 'Verified Orbital / Aerial / Map / DEM Observation',
    spacecraft: item.sourceOrganisation,
    cameraOrInstrument: item.photographerOrInstrument,
    perspective: item.perspective,
    perspectiveDetailLabel:
      item.imageTypeTag === 'geological outcrop'
        ? 'Geological Outcrop'
        : item.imageTypeTag === 'field photograph'
          ? 'Field Photograph'
          : item.imageTypeTag === 'ground photograph'
            ? 'Ground Photograph'
            : item.imageTypeTag === 'aerial'
              ? 'Aerial Photograph'
              : item.imageTypeTag === 'geological map'
                ? 'Geological Map'
                : item.imageTypeTag === 'elevation model'
                  ? 'Elevation Model'
                  : 'Orbital Satellite Image',
    verifiedRegionLabel: item.verifiedRegionLabel,
    sourceLabel: item.sourceOrganisation,
    credit: item.license ? `${item.attribution} (${item.license})` : item.attribution,
    imageTypeTag: item.imageTypeTag,
  };
}
