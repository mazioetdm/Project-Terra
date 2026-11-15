import { ANALOG_DATA } from '../data/analogData';
import type {
  LocationImageryResult,
  SurfaceObservationImage,
} from '../types/terra';

const LROC_ARCHIVE_URL = 'https://data.lroc.im-ldi.com/lroc/';
const LROC_SEARCH_URL = 'https://data.lroc.im-ldi.com/lroc/search';
const MOON_TREK_URL = 'https://trek.nasa.gov/moon/';

function formatLatLonTag(lat: number, lon: number): string {
  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lonStr}`;
}

async function buildVerifiedLrocWacTile(
  coords: { lat: number; lon: number } | null,
  verifiedLabel: string,
  signal?: AbortSignal
): Promise<{ image: SurfaceObservationImage | null; error?: string }> {
  const z = 5;
  const cols = Math.pow(2, z + 1); // 64
  const rows = Math.pow(2, z); // 32

  const x = coords
    ? Math.min(cols - 1, Math.max(0, Math.floor(((coords.lon + 180) / 360) * cols)))
    : 32;
  const y = coords
    ? Math.min(rows - 1, Math.max(0, Math.floor(((90 - coords.lat) / 180) * rows)))
    : rows - 1; // South polar row (-84.375 to -90 deg)

  const tileUrl = `https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/${z}/${y}/${x}.jpg`;

  try {
    const headRes = await fetch(tileUrl, { method: 'HEAD', signal });
    if (!headRes.ok) {
      return {
        image: null,
        error: `Moon Trek LROC WAC tile endpoint returned HTTP ${headRes.status}.`,
      };
    }
  } catch (err) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    return {
      image: null,
      error:
        err instanceof Error
          ? `Unable to reach NASA Moon Trek LROC WAC tiles (${err.message}).`
          : 'Unable to reach NASA Moon Trek LROC WAC tiles.',
    };
  }

  const lonWest = -180 + (x / cols) * 360;
  const lonEast = -180 + ((x + 1) / cols) * 360;
  const latNorth = 90 - (y / rows) * 180;
  const latSouth = 90 - ((y + 1) / rows) * 180;

  return {
    image: {
      id: `LRO_WAC_303ppd_Z${z}_Y${y}_X${x}`,
      title: `LROC WAC Regional Mosaic Tile — ${verifiedLabel}`,
      caption: `Verified equirectangular tile (${latSouth.toFixed(2)}° to ${latNorth.toFixed(
        2
      )}° lat, ${lonWest.toFixed(2)}° to ${lonEast.toFixed(
        2
      )}° lon) from the 100 m/px LROC Wide Angle Camera Global Morphology Mosaic.`,
      thumbnailUrl: tileUrl,
      fullSizeUrl: tileUrl,
      originalSourceUrl: LROC_ARCHIVE_URL,
      acquisitionDate: '2009–2013 LRO Nominal Mapping Phase',
      isHistorical: true,
      missionContext: 'Orbital Mosaic (LRO Nominal Mission, 2009–2013)',
      spacecraft: 'Lunar Reconnaissance Orbiter (LRO)',
      cameraOrInstrument: 'LROC WAC (Wide Angle Camera)',
      perspective: 'orbital',
      perspectiveDetailLabel: 'Orbital Regional Mosaic Tile',
      verifiedRegionLabel: verifiedLabel,
      sourceLabel: 'NASA Moon Trek / ASU LROC WAC 303ppd',
      credit: 'NASA / GSFC / Arizona State University (LROC)',
      imageTypeTag: 'orbital',
    },
  };
}

export async function fetchMoonLocationImagery(
  locationId: string,
  coords: { lat: number; lon: number } | null,
  signal?: AbortSignal
): Promise<LocationImageryResult> {
  const archiveLinks = [
    { label: 'LROC Data Archive (NAC / WAC)', url: LROC_ARCHIVE_URL },
    { label: 'LROC Coordinate Search', url: LROC_SEARCH_URL },
    { label: 'PGDA Site01 Product 78', url: ANALOG_DATA.reference.coordinate_source },
    { label: 'NASA Moon Trek', url: MOON_TREK_URL },
  ];

  const verifiedLabel =
    locationId === ANALOG_DATA.reference.id
      ? ANALOG_DATA.reference.name
      : coords
        ? formatLatLonTag(coords.lat, coords.lon)
        : 'Lunar South Pole';

  const wacRes = await buildVerifiedLrocWacTile(coords, verifiedLabel, signal);
  const images: SurfaceObservationImage[] = wacRes.image ? [wacRes.image] : [];

  if (images.length === 0) {
    return {
      status: 'unavailable',
      locationId,
      images: [],
      archiveLinks,
      errorMessage:
        wacRes.error ??
        'Unable to retrieve verified LROC WAC mosaic tile for this lunar location.',
    };
  }

  const note =
    locationId === ANALOG_DATA.reference.id
      ? 'Connecting Ridge AOI centre is pending (defined in polar-stereographic metres from Site01 GeoTIFF). Showing the verified south polar LROC WAC tile; inspect native polar-stereographic frames via PGDA Product 78 or LROC Archive.'
      : 'Showing the verified LROC WAC mosaic tile covering these coordinates. Browse coordinate-indexed LROC NAC frames at data.lroc.im-ldi.com/lroc/search.';

  return {
    status: 'ready',
    locationId,
    images,
    archiveLinks,
    notes: note,
  };
}
