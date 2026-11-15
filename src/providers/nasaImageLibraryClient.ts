export interface NasaImageLibraryRawItem {
  nasaId: string;
  title: string;
  description: string;
  dateCreated: string;
  center: string;
  keywords: string[];
  thumbnailUrl: string;
  assetManifestUrl: string;
  detailsPageUrl: string;
}

const assetUrlCache = new Map<string, string>();

export function ensureHttps(url: string): string {
  if (!url) return '';
  return url.replace(/^http:\/\//i, 'https://');
}

export function cleanNasaCaption(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatIsoDateUtc(iso: string): string {
  if (!iso) return 'Date unavailable';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toISOString().slice(0, 10) + ' UTC';
}

export async function searchNasaImageLibrary(
  query: string,
  pageSize = 15,
  signal?: AbortSignal
): Promise<NasaImageLibraryRawItem[]> {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(
    query
  )}&media_type=image&page_size=${pageSize}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`NASA Image Library returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as {
    collection?: {
      items?: Array<{
        href?: string;
        data?: Array<{
          nasa_id?: string;
          title?: string;
          description?: string;
          date_created?: string;
          center?: string;
          keywords?: string[];
        }>;
        links?: Array<{
          href?: string;
          rel?: string;
          render?: string;
        }>;
      }>;
    };
  };

  const items = payload.collection?.items ?? [];
  const normalized: NasaImageLibraryRawItem[] = [];

  for (const item of items) {
    const meta = item.data?.[0];
    const thumbLink =
      item.links?.find((l) => l.rel === 'preview' || l.render === 'image')?.href ??
      item.links?.[0]?.href ??
      '';
    if (!meta?.nasa_id || !thumbLink) continue;

    normalized.push({
      nasaId: meta.nasa_id,
      title: meta.title?.trim() || meta.nasa_id,
      description: cleanNasaCaption(meta.description ?? ''),
      dateCreated: meta.date_created ?? '',
      center: meta.center ?? 'NASA',
      keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
      thumbnailUrl: ensureHttps(thumbLink),
      assetManifestUrl: ensureHttps(
        item.href || `https://images-api.nasa.gov/asset/${encodeURIComponent(meta.nasa_id)}`
      ),
      detailsPageUrl: `https://images.nasa.gov/details/${encodeURIComponent(meta.nasa_id)}`,
    });
  }

  return normalized;
}

/**
 * Resolves a browser-renderable high-resolution JPEG/PNG from a NASA Image Library
 * asset manifest (explicitly skipping non-browser TIFF originals).
 */
export async function resolveNasaAssetFullSizeUrl(
  assetManifestUrl: string | undefined,
  fallbackUrl: string,
  signal?: AbortSignal
): Promise<string> {
  if (!assetManifestUrl) return fallbackUrl;
  const cached = assetUrlCache.get(assetManifestUrl);
  if (cached) return cached;

  try {
    const res = await fetch(ensureHttps(assetManifestUrl), { signal });
    if (!res.ok) return fallbackUrl;
    const json = (await res.json()) as {
      collection?: { items?: Array<{ href?: string }> };
    };
    const hrefs = (json.collection?.items ?? [])
      .map((it) => ensureHttps(it.href ?? ''))
      .filter((h) => /\.(jpe?g|png|webp)$/i.test(h));

    const preferred =
      hrefs.find((h) => /~large\.(jpe?g|png)$/i.test(h)) ??
      hrefs.find((h) => /~orig\.jpe?g$/i.test(h)) ??
      hrefs.find((h) => /~medium\.(jpe?g|png)$/i.test(h)) ??
      hrefs.find((h) => /~orig\.png$/i.test(h)) ??
      hrefs[0] ??
      fallbackUrl;

    assetUrlCache.set(assetManifestUrl, preferred);
    return preferred;
  } catch {
    return fallbackUrl;
  }
}
