import { ANALOG_DATA } from '../data/analogData';
import type {
  PlanetaryBodyDefinition,
  PlanetaryBodyId,
  PlanetaryFeatureMarker,
  PlanetaryLayerConfig,
  TileLoadResult,
} from '../types/terra';
import { EARTH_BODY, EARTH_LAYERS, loadEarthGibsLayer } from './earthGibsProvider';
import { MOON_BODY, MOON_LAYERS, loadMoonTrekLayer } from './moonTrekProvider';

export const PLANET_DEFINITIONS: Record<PlanetaryBodyId, PlanetaryBodyDefinition> = {
  earth: EARTH_BODY,
  moon: MOON_BODY,
};

export const PLANET_LAYERS: Record<PlanetaryBodyId, PlanetaryLayerConfig[]> = {
  earth: EARTH_LAYERS,
  moon: MOON_LAYERS,
};

export function getPlanetaryMarkers(): PlanetaryFeatureMarker[] {
  const earthMarkers: PlanetaryFeatureMarker[] = ANALOG_DATA.sites.map((site) => ({
    id: site.id,
    body: 'earth',
    name: site.name,
    featureType: site.terrain_suitable
      ? 'Terrain Candidate'
      : 'Materials-Only Reference',
    lat: site.centre.lat,
    lon: site.centre.lon,
    summary: site.data_issues[0] ?? 'Earth study area defined in analog_data.json.',
    linkedSiteId: site.id,
    sourceUrl: site.coordinate_source,
  }));

  return earthMarkers;
}

export async function loadPlanetaryLayer(
  body: PlanetaryBodyId,
  layer: PlanetaryLayerConfig,
  selectedDate: string,
  signal?: AbortSignal
): Promise<TileLoadResult> {
  if (body === 'earth') {
    return loadEarthGibsLayer(layer, selectedDate, signal);
  }
  return loadMoonTrekLayer(layer, signal);
}
