import type { TileLoadResult } from '../types/terra';

export type MatrixScheme = 'gibs_epsg4326_288' | 'trek_eq_default028mm';

interface StitchOptions {
  layerId: string;
  effectiveDate: string;
  officialUrl: string;
  scheme: MatrixScheme;
  zoomLevel: number;
  buildTileUrl: (z: number, y: number, x: number) => string;
  signal?: AbortSignal;
}

function loadCorsImage(url: string, signal?: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    const onAbort = () => {
      img.src = '';
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    img.onload = () => {
      signal?.removeEventListener('abort', onAbort);
      resolve(img);
    };

    img.onerror = () => {
      signal?.removeEventListener('abort', onAbort);
      reject(new Error(`Failed to load WMTS tile: ${url}`));
    };

    img.src = url;
  });
}

export async function loadEquirectangularTileMosaic({
  layerId,
  effectiveDate,
  officialUrl,
  scheme,
  zoomLevel,
  buildTileUrl,
  signal,
}: StitchOptions): Promise<TileLoadResult> {
  const isGibs288 = scheme === 'gibs_epsg4326_288';

  const cols = isGibs288 ? 5 : Math.pow(2, zoomLevel + 1);
  const rows = isGibs288 ? 3 : Math.pow(2, zoomLevel);
  const tileSize = isGibs288 ? 512 : 256;

  // GIBS EPSG:4326 z=2 spans 360deg (5 * 72deg) by 180deg (2.5 * 72deg)
  const sourceWidth = cols * tileSize;
  const sourceHeight = isGibs288 ? 2.5 * tileSize : rows * tileSize;
  const totalTiles = cols * rows;

  const jobs: { x: number; y: number; url: string }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      jobs.push({ x, y, url: buildTileUrl(zoomLevel, y, x) });
    }
  }

  let loadedCount = 0;
  const results = await Promise.allSettled(
    jobs.map(async (job) => {
      const img = await loadCorsImage(job.url, signal);
      loadedCount += 1;
      return { ...job, img };
    })
  );

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const succeeded = results.filter(
    (r): r is PromiseFulfilledResult<{ x: number; y: number; url: string; img: HTMLImageElement }> =>
      r.status === 'fulfilled'
  );

  if (succeeded.length === 0) {
    return {
      status: 'unavailable',
      loadedTiles: 0,
      totalTiles,
      layerId,
      effectiveDate,
      officialUrl,
      errorMessage:
        'Unable to retrieve WMTS tiles from the NASA service. Network access, CORS headers, or the selected imagery date may be unavailable.',
    };
  }

  // Render onto equirectangular 2048x1024 canvas
  const stagingCanvas = document.createElement('canvas');
  stagingCanvas.width = sourceWidth;
  stagingCanvas.height = sourceHeight;
  const stagingCtx = stagingCanvas.getContext('2d');

  if (!stagingCtx) {
    return {
      status: 'unavailable',
      loadedTiles: 0,
      totalTiles,
      layerId,
      effectiveDate,
      officialUrl,
      errorMessage: '2D canvas context could not be initialized for tile stitching.',
    };
  }

  stagingCtx.fillStyle = '#0A0C0F';
  stagingCtx.fillRect(0, 0, sourceWidth, sourceHeight);

  for (const item of succeeded) {
    const { x, y, img } = item.value;
    stagingCtx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
  }

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = 2048;
  finalCanvas.height = 1024;
  const finalCtx = finalCanvas.getContext('2d');

  if (!finalCtx) {
    return {
      status: 'ready',
      canvas: stagingCanvas,
      loadedTiles: loadedCount,
      totalTiles,
      layerId,
      effectiveDate,
      officialUrl,
    };
  }

  finalCtx.drawImage(stagingCanvas, 0, 0, finalCanvas.width, finalCanvas.height);

  return {
    status: 'ready',
    canvas: finalCanvas,
    loadedTiles: succeeded.length,
    totalTiles,
    layerId,
    effectiveDate,
    officialUrl,
  };
}
