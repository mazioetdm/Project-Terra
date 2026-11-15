import {
  getVerifiedMediaForSite,
  toSurfaceObservationImage,
} from '../data/media';
import type { LocationImageryResult, PlanetaryBodyId } from '../types/terra';
import { fetchMoonLocationImagery } from './moonSurfaceImageryProvider';

export async function fetchLocationSurfaceImagery(
  body: PlanetaryBodyId,
  locationId: string,
  coords: { lat: number; lon: number } | null,
  signal?: AbortSignal
): Promise<LocationImageryResult> {
  if (body === 'moon') {
    return fetchMoonLocationImagery(locationId, coords, signal);
  }

  const verifiedItems = getVerifiedMediaForSite(locationId);
  const images = verifiedItems.map(toSurfaceObservationImage);

  const archiveLinks = [
    {
      label: 'NASA Earth Observatory',
      url: 'https://science.nasa.gov/earth/earth-observatory/',
    },
    {
      label: 'NASA Worldview (EOSDIS)',
      url: 'https://worldview.earthdata.nasa.gov/',
    },
    {
      label: 'Copernicus DEM GLO-30',
      url: 'https://registry.opendata.aws/copernicus-dem/',
    },
  ];

  if (images.length > 0) {
    return {
      status: 'ready',
      locationId,
      images,
      archiveLinks,
    };
  }

  return {
    status: 'empty',
    locationId,
    images: [],
    archiveLinks,
    emptyReason: 'Verified imagery unavailable for this location.',
  };
}
