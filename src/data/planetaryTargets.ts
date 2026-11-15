import type { PlanetaryBodyId } from '../types/terra';

export interface PlanetaryTargetObservation {
  observationId: string;
  instrument: string;
  spacecraft: string;
  title: string;
  description: string;
  imageUrl: string;
  fullSizeUrl: string;
  sourceUrl: string;
  acquisitionDate: string;
  resolution: string;
  productType: 'orbital_hirise' | 'orbital_ctx' | 'orbital_themis' | 'orbital_mola' | 'orbital_lroc';
}

export interface PlanetaryTargetRecord {
  targetId: string;
  planet: 'moon' | 'mars';
  name: string;
  subheading: string;
  coordinates: { lat: number; lon: number };
  targetType: 'Permanent Base Candidate' | 'Landing & Rover Exploration Target' | 'Volcanic Target' | 'Canyon / Stratigraphic Target';
  missionContext: string;
  elevationKm: number | string;
  geologicalContext: string;
  keyMinerals: string[];
  environmentalConditions: string;
  relevanceToExploration: string;
  recommendedEarthAnalogThemes: string[];
  recommendedEarthSites: string[];
  sourceUrl: string;
  observations: PlanetaryTargetObservation[];
  datasets: {
    datasetName: string;
    instrument: string;
    sourceOrganisation: string;
    url: string;
    status: 'Verified' | 'Accessible Archive';
  }[];
}

export const PLANETARY_TARGETS: PlanetaryTargetRecord[] = [
  // =========================================================================
  // MOON TARGETS
  // =========================================================================
  {
    targetId: 'moon-connecting-ridge',
    planet: 'moon',
    name: 'Connecting Ridge (Lunar South Pole)',
    subheading: 'Shackleton–de Gerlache Rim · Artemis Exploration Area',
    coordinates: { lat: -89.45, lon: 0.0 },
    targetType: 'Permanent Base Candidate',
    missionContext: 'Artemis Exploration Zone (Lunar South Polar Highlands)',
    elevationKm: 0.85,
    geologicalContext:
      'High-relief rim ridge connecting Shackleton and de Gerlache craters within the South Pole-Aitken (SPA) basin rim. Dominated by highly shock-metamorphosed, heavily cratered anorthositic highlands megaregolith with deep permanently shadowed cold traps adjacent to sunlit peaks.',
    keyMinerals: ['Anorthositic plagioclase', 'Agglutinitic impact glass', 'Pyroxene', 'Ilmenite (trace)', 'Potential volatile ice in cold traps'],
    environmentalConditions:
      'Extreme thermal cycle (40 K cold traps up to 220 K peak diurnal sunlit surfaces), high radiation environment, hard vacuum (<10⁻¹² mbar), micro-meteorite bombardment, low sun elevation angles causing prolonged horizontal shadowing.',
    relevanceToExploration:
      'Prime candidate for permanent lunar base infrastructure due to extended quasi-continuous solar illumination on ridge crests, direct line-of-sight communications to Earth, and short access distances to cryogenic volatiles in shadowed crater interiors.',
    recommendedEarthAnalogThemes: [
      'High-latitude impact craters with shock-metamorphosed anorthosite',
      'Extreme cold-climate polar permafrost and frost-shattered regolith',
      'Rough mountain ridges with periglacial talus'
    ],
    recommendedEarthSites: ['kamestastin', 'haughton', 'taglang_la', 'stillwater'],
    sourceUrl: 'https://pgda.gsfc.nasa.gov/products/78',
    observations: [
      {
        observationId: 'LROC_WAC_SHACKLETON_POLAR',
        instrument: 'LROC WAC',
        spacecraft: 'Lunar Reconnaissance Orbiter (LRO)',
        title: 'LRO WAC South Pole Illumination & Morphology Mosaic',
        description:
          'Monochrome Wide Angle Camera mosaic centered on Shackleton crater and Connecting Ridge showing low-angle shadow distribution.',
        imageUrl: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/148000/148491/mistastin_oli_2017254.jpg',
        fullSizeUrl: 'https://trek.nasa.gov/moon/',
        sourceUrl: 'https://data.lroc.im-ldi.com/lroc/',
        acquisitionDate: '2009–2013 LRO Nominal Mission',
        resolution: '100 m / pixel',
        productType: 'orbital_lroc',
      },
    ],
    datasets: [
      {
        datasetName: 'Barker Site01 LOLA 5 m Slope Map',
        instrument: 'LRO LOLA',
        sourceOrganisation: 'NASA GSFC / PGDA',
        url: 'https://pgda.gsfc.nasa.gov/products/78',
        status: 'Verified',
      },
      {
        datasetName: 'LRO Diviner Lunar Radiometer Polar Temperatures',
        instrument: 'LRO Diviner',
        sourceOrganisation: 'UCLA / NASA PDS Geosciences',
        url: 'https://pds-geosciences.wustl.edu/missions/lro/diviner.htm',
        status: 'Verified',
      },
    ],
  },
  {
    targetId: 'moon-malapert',
    planet: 'moon',
    name: 'Malapert Mountain (Peak of Eternal Light Candidate)',
    subheading: 'South Polar Highlands · 86.0°S, 2.7°E',
    coordinates: { lat: -86.04, lon: 2.72 },
    targetType: 'Permanent Base Candidate',
    missionContext: 'Artemis Candidate Landing and Communications Relay Zone',
    elevationKm: 5.0,
    geologicalContext:
      'Massive ancient pre-Nectarian massif elevated ~5,000 meters above surrounding crater floor terrain. Composed of pristine lunar highland crustal materials subjected to billions of years of impact processing.',
    keyMinerals: ['Ferroan anorthosite', 'Highland regolith breccia', 'Orthopyroxene'],
    environmentalConditions:
      'Near-continuous solar illumination during southern lunar summer; constant grazing solar incidence angles; continuous line-of-sight to Earth.',
    relevanceToExploration:
      'Strategic lunar south pole communications relay hub and early base outpost location, providing elevated line-of-sight to polar craters.',
    recommendedEarthAnalogThemes: ['High-altitude rocky massifs', 'Extreme elevation alpine permafrost'],
    recommendedEarthSites: ['taglang_la', 'kamestastin'],
    sourceUrl: 'https://ode.rsl.wustl.edu/moon/',
    observations: [],
    datasets: [
      {
        datasetName: 'LRO LOLA Global Altimetry 128 ppd',
        instrument: 'LRO LOLA',
        sourceOrganisation: 'NASA GSFC',
        url: 'https://pds-geosciences.wustl.edu/missions/lro/lola.htm',
        status: 'Verified',
      },
    ],
  },

  // =========================================================================
  // MARS TARGETS
  // =========================================================================
  {
    targetId: 'mars-jezero',
    planet: 'mars',
    name: 'Jezero Crater (Perseverance Landing Site)',
    subheading: 'Ancient River Delta & Paleolake · Isidis Planitia Rim',
    coordinates: { lat: 18.38, lon: 77.58 },
    targetType: 'Landing & Rover Exploration Target',
    missionContext: 'NASA Mars 2020 Mission / Perseverance Rover Exploration',
    elevationKm: -2.5,
    geologicalContext:
      'A 45-km-wide Noachian-Hesperian impact crater that once hosted an open-basin lake. Features a prominent fan-shaped river delta with stratified clays, mudstones, carbonates, and igneous basaltic floor units.',
    keyMinerals: ['Mg-rich smectite clays', 'Magnesite & carbonates', 'Olivine-rich basaltic floor units', 'Silica-rich aqueous minerals'],
    environmentalConditions:
      'Surface atmospheric pressure ~6.1 mbar (CO₂ dominated), diurnal temperature swing -90°C to +20°C, high UV flux, seasonal dust storm cycles, desiccated surface regolith.',
    relevanceToExploration:
      'Premier Mars sample return caching site. Investigating biosignature preservation in fine-grained lacustrine sediments and testing rover mobility across layered delta scarps, boulder fields, and sand dunes.',
    recommendedEarthAnalogThemes: [
      'Terrestrial river deltas and lake sediment deposits',
      'Hyper-arid clay and carbonate playas (e.g. Atacama)',
      'Basaltic volcanic terrain interacting with water'
    ],
    recommendedEarthSites: ['atacama_desert', 'haughton', 'miyake_jima'],
    sourceUrl: 'https://mars.nasa.gov/mars2020/',
    observations: [
      {
        observationId: 'ESP_068294_1985',
        instrument: 'HiRISE',
        spacecraft: 'Mars Reconnaissance Orbiter (MRO)',
        title: 'HiRISE Sub-Meter View of Jezero Crater Western Delta Scarp',
        description:
          'High-resolution orbital observation showing stratified sedimentary layers and fractured delta deposits traversed by the Perseverance rover.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jezero_crater_delta_HiRISE.jpg/1280px-Jezero_crater_delta_HiRISE.jpg',
        fullSizeUrl: 'https://www.uahirise.org/ESP_068294_1985',
        sourceUrl: 'https://hirise.lpl.arizona.edu/',
        acquisitionDate: '2021-02-18 (MRO Orbit)',
        resolution: '0.25 m / pixel',
        productType: 'orbital_hirise',
      },
    ],
    datasets: [
      {
        datasetName: 'MRO HiRISE Reduced Data Record (RDR)',
        instrument: 'HiRISE (High Resolution Imaging Science Experiment)',
        sourceOrganisation: 'NASA / University of Arizona',
        url: 'https://hirise.lpl.arizona.edu/',
        status: 'Verified',
      },
      {
        datasetName: 'MRO CRISM Targeted Mineralogical Spectra',
        instrument: 'CRISM (Compact Reconnaissance Imaging Spectrometer for Mars)',
        sourceOrganisation: 'NASA PDS Geosciences / JHU-APL',
        url: 'https://pds-geosciences.wustl.edu/missions/mro/crism.htm',
        status: 'Accessible Archive',
      },
      {
        datasetName: 'Mars Odyssey THEMIS Daytime IR 100m Mosaic',
        instrument: 'THEMIS IR',
        sourceOrganisation: 'ASU / NASA Mars Trek',
        url: 'https://trek.nasa.gov/mars/',
        status: 'Verified',
      },
    ],
  },
  {
    targetId: 'mars-gale',
    planet: 'mars',
    name: 'Gale Crater (Curiosity Landing Site)',
    subheading: 'Mount Sharp (Aeolis Mons) · 4.59°S, 137.42°E',
    coordinates: { lat: -4.59, lon: 137.42 },
    targetType: 'Landing & Rover Exploration Target',
    missionContext: 'NASA Mars Science Laboratory / Curiosity Rover Traverse',
    elevationKm: -4.5,
    geologicalContext:
      'A 154-km-wide complex impact crater with a 5.5-km-high central sedimentary mound (Mount Sharp). Preserves a chronological record of transition from ancient wet conditions (clay-bearing strata) to drying conditions (sulfate-rich beds and windblown sandstones).',
    keyMinerals: ['Smectite clays', 'Calcium & magnesium sulfates', 'Hematite', 'Feldspar & pyroxene in basaltic sands'],
    environmentalConditions:
      'Low atmospheric pressure (~7 mbar), strong katabatic slope winds, actively migrating dark basaltic sand dunes (Bagnold Dunes), thermal swings from -85°C to 0°C.',
    relevanceToExploration:
      'Validates long-range rover mobility across steep sedimentary slopes, sharp wheel-abrasive bedrock, and active dune fields while deciphering Mars habitability history.',
    recommendedEarthAnalogThemes: [
      'Layered sedimentary rock outcrops',
      'Terrestrial active basaltic dune fields and aeolian transport',
      'Evaporite and sulfate basins'
    ],
    recommendedEarthSites: ['atacama_desert', 'stillwater', 'haughton'],
    sourceUrl: 'https://mars.nasa.gov/msl/',
    observations: [
      {
        observationId: 'PSP_001488_1750',
        instrument: 'HiRISE',
        spacecraft: 'Mars Reconnaissance Orbiter (MRO)',
        title: 'Gale Crater Lower Mount Sharp Sedimentary Layers (HiRISE)',
        description:
          'Sub-meter resolution imaging of rhythmic sulfate- and clay-bearing bedrock layers along the Curiosity rover ascent path.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Mount_Sharp_from_Curiosity_sol_2.jpg/1280px-Mount_Sharp_from_Curiosity_sol_2.jpg',
        fullSizeUrl: 'https://mars.nasa.gov/msl/multimedia/images/',
        sourceUrl: 'https://hirise.lpl.arizona.edu/',
        acquisitionDate: '2012-08-06',
        resolution: '0.25 m / pixel',
        productType: 'orbital_hirise',
      },
    ],
    datasets: [
      {
        datasetName: 'MGS MOLA Topography 128 ppd',
        instrument: 'MOLA (Mars Orbiter Laser Altimeter)',
        sourceOrganisation: 'NASA GSFC / PDS',
        url: 'https://pds-geosciences.wustl.edu/missions/mgs/mola.htm',
        status: 'Verified',
      },
      {
        datasetName: 'MRO CTX Global Mosaic',
        instrument: 'Context Camera (CTX)',
        sourceOrganisation: 'MSSS / NASA PDS',
        url: 'https://www.msss.com/mro/ctx/',
        status: 'Accessible Archive',
      },
    ],
  },
  {
    targetId: 'mars-olympus-mons',
    planet: 'mars',
    name: 'Olympus Mons (Volcanic Giant)',
    subheading: 'Tharsis Volcanic Province · 18.65°N, 226.20°E',
    coordinates: { lat: 18.65, lon: 226.2 },
    targetType: 'Volcanic Target',
    missionContext: 'Planetary Volcanology Reference & Future Low-Pressure Exploration',
    elevationKm: 21.3,
    geologicalContext:
      'The largest known shield volcano in the solar system, spanning ~600 km across and rising 21.3 km above Mars datum. Composed of thousands of individual basaltic lava flows, lava tubes, collapse calderas, and surrounding cliff-like basal scarps up to 8 km high.',
    keyMinerals: ['Tholeiitic basalt', 'Olivine', 'Pyroxene', 'Plagioclase cumulates'],
    environmentalConditions:
      'Extremely thin atmosphere at summit (<1 mbar), extreme cosmic radiation exposure, cold temperatures down to -120°C, dry unweathered basaltic lava surfaces.',
    relevanceToExploration:
      'Critical analog for studying deep shield volcanism, colossal lava tube structural integrity for subterranean human shelters, and planetary scale basalt flows.',
    recommendedEarthAnalogThemes: [
      'Basaltic lava flows, aa and pahoehoe crusts (e.g. Miyake-jima, Hawaii)',
      'Layered mafic-ultramafic igneous complexes (e.g. Stillwater Complex)'
    ],
    recommendedEarthSites: ['miyake_jima', 'stillwater'],
    sourceUrl: 'https://trek.nasa.gov/mars/',
    observations: [],
    datasets: [
      {
        datasetName: 'MGS MOLA Global Elevation Map',
        instrument: 'MOLA',
        sourceOrganisation: 'NASA GSFC',
        url: 'https://trek.nasa.gov/mars/',
        status: 'Verified',
      },
    ],
  },
  {
    targetId: 'mars-valles-marineris',
    planet: 'mars',
    name: 'Valles Marineris (Coprates Chasma)',
    subheading: 'Grand Martian Canyon System · 13.9°S, 59.2°W',
    coordinates: { lat: -13.9, lon: -59.2 },
    targetType: 'Canyon / Stratigraphic Target',
    missionContext: 'Stratigraphic Deep Crustal Exploration & Slope Lineae Monitoring',
    elevationKm: -8.0,
    geologicalContext:
      'A continent-scale tectonic rift system extending over 4,000 km in length and up to 10 km deep. Exposes kilometers of volcanic and sedimentary crustal stratigraphy along sheer canyon walls, colossal landslides, and recurring slope lineae (RSL) sites.',
    keyMinerals: ['Hydrated sulfates', 'Hematite', 'Basaltic crustal strata', 'Opals and phyllosilicates'],
    environmentalConditions:
      'Higher surface atmospheric pressure at canyon floors (~9 mbar), localized morning ground fogs, intense wind shear along canyon rims.',
    relevanceToExploration:
      'Exposes deep Mars crustal stratigraphy without drilling; testbed for high-relief canyon terrain operations, autonomous drone flights, and slope stability.',
    recommendedEarthAnalogThemes: ['Deep rocky canyons, steep cliffs, landslide scree', 'Alpine rock-cuts and fault scarps'],
    recommendedEarthSites: ['taglang_la', 'stillwater'],
    sourceUrl: 'https://ode.rsl.wustl.edu/mars/',
    observations: [],
    datasets: [
      {
        datasetName: 'MRO HiRISE Regional Terrain Extracts',
        instrument: 'HiRISE',
        sourceOrganisation: 'University of Arizona',
        url: 'https://hirise.lpl.arizona.edu/',
        status: 'Accessible Archive',
      },
    ],
  },
  {
    targetId: 'mars-utopia',
    planet: 'mars',
    name: 'Utopia Planitia (Zhurong Landing & Subsurface Ice Basin)',
    subheading: 'Northern Lowlands · 25.1°N, 109.9°E',
    coordinates: { lat: 25.1, lon: 109.9 },
    targetType: 'Landing & Rover Exploration Target',
    missionContext: 'SHARAD Subsurface Ice Mapping / Zhurong Rover Study Area',
    elevationKm: -4.1,
    geologicalContext:
      'Massive northern plains impact basin underlain by extensive deposits of water ice confirmed by SHARAD orbital radar and rover ground-penetrating radar. Features scalloped depressions, periglacial polygonal ground, and sedimentary volcanic plains.',
    keyMinerals: ['Subsurface water-ice sheet', 'Silicate dust and regolith', 'Hydrated minerals'],
    environmentalConditions:
      'Cold northern lowlands climate (-110°C winter to -10°C summer), seasonal atmospheric pressure cycle, high subsurface thermal stability.',
    relevanceToExploration:
      'High-priority candidate for in-situ resource utilization (ISRU) water ice extraction for future human Mars missions, and testing permafrost drilling technologies.',
    recommendedEarthAnalogThemes: [
      'High-Arctic permafrost, ground ice, and patterned ground (e.g. Devon Island)',
      'Glacial and periglacial moraines'
    ],
    recommendedEarthSites: ['haughton', 'svalbard_permafrost', 'taglang_la'],
    sourceUrl: 'https://pds-geosciences.wustl.edu/missions/mro/sharad.htm',
    observations: [],
    datasets: [
      {
        datasetName: 'MRO SHARAD Subsurface Radar Observations',
        instrument: 'SHARAD (Shallow Radar)',
        sourceOrganisation: 'ASI / NASA JPL',
        url: 'https://pds-geosciences.wustl.edu/missions/mro/sharad.htm',
        status: 'Accessible Archive',
      },
    ],
  },
];

export function getPlanetaryTargetsForPlanet(planet: 'moon' | 'mars'): PlanetaryTargetRecord[] {
  return PLANETARY_TARGETS.filter((t) => t.planet === planet);
}

export function getPlanetaryTargetById(targetId: string): PlanetaryTargetRecord | undefined {
  return PLANETARY_TARGETS.find((t) => t.targetId === targetId);
}
