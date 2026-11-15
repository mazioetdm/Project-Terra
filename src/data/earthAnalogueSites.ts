import { STUDY_AREA_IMAGES, type StudyAreaImageRecord } from './studyAreaImages';

export type AnalogueClassification =
  | 'established_analogue'
  | 'candidate_analogue'
  | 'materials_reference';

export type PlanetaryRelevance = 'both' | 'moon' | 'mars';

export type EnvironmentType =
  | 'Impact crater'
  | 'Polar periglacial desert'
  | 'High-altitude alpine permafrost'
  | 'Layered igneous complex'
  | 'Active basaltic volcano'
  | 'Hyper-arid playa & clay basin'
  | 'Arctic permafrost & patterned ground';

export interface EarthAnalogueSiteRecord {
  siteId: string;
  name: string;
  subheading: string;
  coordinates: { lat: number; lon: number };
  country: string;
  classification: AnalogueClassification;
  environmentType: EnvironmentType;
  planetaryRelevance: PlanetaryRelevance;
  geologicalCharacteristics: string;
  potentialPlanetaryRelevance: string;
  evidenceStatus: 'Strong supporting evidence' | 'Moderate supporting evidence' | 'Limited supporting evidence' | 'Materials reference only';
  knownLimitations: string[];
  coordinateSource: string;
  targetConnections: {
    moonTargets: string[];
    marsTargets: string[];
  };
  analogyExplanation: {
    whatIsSimilar: string;
    whatIsDifferent: string;
    whySimilarityMatters: string;
    experimentsPossible: string;
    technologyToTest: string;
    explorationRiskReduction: string;
    whatCannotBeReproduced: string;
  };
}

export const EARTH_ANALOGUE_SITES: EarthAnalogueSiteRecord[] = [
  // 1. MISTASTIN / KAMESTASTIN CRATER
  {
    siteId: 'kamestastin',
    name: 'Mistastin / Kamestastin Crater',
    subheading: 'Central Anorthosite Uplift & Impact Melt Sheet · Labrador, Canada',
    coordinates: { lat: 55.883, lon: -63.3 },
    country: 'Canada (Newfoundland and Labrador)',
    classification: 'established_analogue',
    environmentType: 'Impact crater',
    planetaryRelevance: 'both',
    geologicalCharacteristics:
      'A 28-km-wide complex meteorite impact structure formed ~36 million years ago in Archean anorthosite target rocks. Contains a prominent central uplift island (Horseshoe Island) preserving shocking of pristine anorthosites and extensive crystalline impact-melt sheets and breccias.',
    potentialPlanetaryRelevance:
      'Direct terrestrial analog for lunar highland craters and Artemis south polar anorthosites. Also provides valuable insight into Martian impact melt cooling and hydrothermal alteration inside complex craters.',
    evidenceStatus: 'Strong supporting evidence',
    knownLimitations: [
      'Glacial erosion has partially modified rim morphology and deepened the central lake basin.',
      'Boreal tundra vegetation and summer soil moisture contrast with desiccated lunar and Martian regolith.',
      'Target anorthosite contains minor terrestrial oxidation absent in pristine lunar plagioclase.',
    ],
    coordinateSource: 'https://science.nasa.gov/earth/earth-observatory/violent-formation-for-mistastin-lake-148491/',
    targetConnections: {
      moonTargets: ['moon-connecting-ridge', 'moon-malapert'],
      marsTargets: ['mars-jezero'],
    },
    analogyExplanation: {
      whatIsSimilar:
        'Target rock lithology: genuine shock-metamorphosed anorthosite crust with diaplectic plagioclase glass (maskelynite) and impact melt sheets comparable to the lunar highlands.',
      whatIsDifferent:
        'Central crater filled by a lake; presence of post-impact glacial scouring and subarctic vegetation.',
      whySimilarityMatters:
        'Allows Artemis astronauts and robotic spectral instruments to calibrate identification of shocked plagioclase, maskelynite, and impact-melt rocks before lunar operations.',
      experimentsPossible:
        'In-situ field reflectance spectroscopy, autonomous rock coring in impactite bedrock, and handheld XRF geochemical mapping.',
      technologyToTest:
        'Astronaut rock hammer and sample-bagging protocols, rover mobility over blocky impact melt, and drills.',
      explorationRiskReduction:
        'Prevents misidentification of shock-melted anorthosite as unshocked volcanic rocks during Artemis EVA sampling.',
      whatCannotBeReproduced:
        'Lunar 1/6th gravity, vacuum, solar wind irradiation, and cryogenic shadow trap temperatures (40 K).',
    },
  },

  // 2. HAUGHTON IMPACT STRUCTURE
  {
    siteId: 'haughton',
    name: 'Haughton Impact Structure',
    subheading: 'High-Arctic Polar Impact Desert · Devon Island, Nunavut',
    coordinates: { lat: 75.383, lon: -89.667 },
    country: 'Canada (Nunavut)',
    classification: 'established_analogue',
    environmentType: 'Polar periglacial desert',
    planetaryRelevance: 'both',
    geologicalCharacteristics:
      'A 23-km complex impact structure formed ~39 Ma in a 1.7 km thick Ordovician-Silurian carbonate-dominated sedimentary sequence over crystalline basement. Located in an unglaciated polar desert with permafrost, shatter cones, polymict impact breccias, and incised meltwater valleys.',
    potentialPlanetaryRelevance:
      'Premier analog for both lunar impact craters and Martian periglacial/permafrost terrain. Used extensively by NASA Ames and CSA for rover mobility, EVA simulation, and drilling trials.',
    evidenceStatus: 'Strong supporting evidence',
    knownLimitations: [
      'Target sequence is dominated by dolomite and limestone, unlike silicate-dominated lunar highland target rock.',
      'Active Arctic permafrost thaw cycles and surface seasonal runoff create gullies driven by liquid water.',
      'Atmospheric pressure is terrestrial (1013 mbar vs 6 mbar on Mars or 0 mbar on Moon).',
    ],
    coordinateSource: 'https://science.nasa.gov/earth/earth-observatory/mars-researchers-rendezvous-on-remote-arctic-island-2585/',
    targetConnections: {
      moonTargets: ['moon-connecting-ridge'],
      marsTargets: ['mars-jezero', 'mars-gale', 'mars-utopia'],
    },
    analogyExplanation: {
      whatIsSimilar:
        'Continuous cold, barren polar desert devoid of trees; rocky frost-rubble regolith; allochthonous crater breccia; deeply incised channel networks resembling Martian valley systems.',
      whatIsDifferent:
        'Sedimentary carbonate target bedrock; active Arctic summer freeze-thaw; terrestrial gravity and atmosphere.',
      whySimilarityMatters:
        'Provides harsh operational test conditions for long-duration rover autonomous navigation, robotic drilling into permafrost, and astronaut spacesuit EVA mobility.',
      experimentsPossible:
        'Ground-penetrating radar profiling of ice/rock interfaces, autonomous rover traverse routing across obstacle fields, and drill bit wear analysis.',
      technologyToTest:
        'NASA K-10 and rover autonomous navigation stacks, pressurized rover operational cadence, deep permafrost coring drills.',
      explorationRiskReduction:
        'Reduces risk of rover immobilization in fractured Arctic frost rubble and tests telemetry latency during field exploration.',
      whatCannotBeReproduced:
        'Martian atmospheric carbon dioxide composition, low gravity, and absence of biological contamination.',
    },
  },

  // 3. TAGLANG LA PASS
  {
    siteId: 'taglang_la',
    name: 'Taglang La Pass',
    subheading: 'High-Altitude Himalayan Periglacial Ridge · Ladakh, India',
    coordinates: { lat: 33.509, lon: 77.771 },
    country: 'India (Ladakh)',
    classification: 'established_analogue',
    environmentType: 'High-altitude alpine permafrost',
    planetaryRelevance: 'both',
    geologicalCharacteristics:
      'High-altitude Himalayan mountain pass at 5,328 meters (17,582 ft) above sea level. Characterized by severe periglacial shattering, continuous frost wedging, expansive scree aprons, high solar UV radiation, and near-desert precipitation levels.',
    potentialPlanetaryRelevance:
      'Excellent geomorphological analogue for steep lunar south polar ridges (Connecting Ridge / Malapert) and Martian high-relief rocky slopes with mechanical talus accumulation.',
    evidenceStatus: 'Moderate supporting evidence',
    knownLimitations: [
      'Himalayan tectonic collision setting differs structurally from impact-excavated crater rims.',
      'Atmospheric pressure is reduced (~500 mbar) but still significantly higher than Moon (0) or Mars (~6 mbar).',
      'Road cuts and seasonal vehicle traffic cross the summit pass.',
    ],
    coordinateSource: 'https://worldview.earthdata.nasa.gov/?v=77.55,33.35,78.00,33.67&l=ASTER_GDEM_Color_Shaded_Relief',
    targetConnections: {
      moonTargets: ['moon-connecting-ridge', 'moon-malapert'],
      marsTargets: ['mars-valles-marineris'],
    },
    analogyExplanation: {
      whatIsSimilar:
        'Steep slope distribution (median slopes ~17°), extensive angular frost-shattered blockfields, high UV irradiance, and severe diurnal thermal transitions.',
      whatIsDifferent:
        'Tectonic orogeny origin; monsoonal regional weather influences; oxygenated atmosphere.',
      whySimilarityMatters:
        'Offers accessible high-angle talus slopes and permafrost scree to evaluate rover wheel traction and slope climbing thresholds on loose rubble.',
      experimentsPossible:
        'Slope trafficability tests on angular loose rock, solar panel dust accumulation and UV degradation rates.',
      technologyToTest:
        'High-torque rover drivetrains, autonomous hazard detection on steep scree, astronaut uphill locomotion fatigue.',
      explorationRiskReduction:
        'Reduces risk of rover slippage or rollover when ascending steep crater rim terrain at the lunar south pole or Martian canyon walls.',
      whatCannotBeReproduced:
        'Lunar vacuum, 1/6th g gravity, and deep cryogenic shadow conditions.',
    },
  },

  // 4. ATACAMA DESERT (Newly Proposed Candidate)
  {
    siteId: 'atacama_desert',
    name: 'Atacama Desert (Yungay Hyper-Arid Core)',
    subheading: 'Hyper-Arid Salar & Desiccated Clay Basin · Antofagasta, Chile',
    coordinates: { lat: -24.08, lon: -70.02 },
    country: 'Chile',
    classification: 'candidate_analogue',
    environmentType: 'Hyper-arid playa & clay basin',
    planetaryRelevance: 'mars',
    geologicalCharacteristics:
      'The driest non-polar desert on Earth, with rainfall absent for decades. Features nitrate- and perchlorate-bearing soils, dry saline crusts (salars), desiccated clay playa sediments, and an extreme limit for soil microbial life.',
    potentialPlanetaryRelevance:
      'The preeminent terrestrial geochemical and soil analog for Mars surface regolith (Jezero Crater & Gale Crater), particularly for testing perchlorate chemistry and life detection instruments.',
    evidenceStatus: 'Strong supporting evidence',
    knownLimitations: [
      'Terrestrial atmospheric pressure (1 bar) and warm daytime temperatures (up to 35°C).',
      'Presence of trace subterranean halophilic endolithic microbes, unlike lifeless Martian surface.',
      'Gravity is full terrestrial 1g.',
    ],
    coordinateSource: 'https://search.earthdata.nasa.gov/',
    targetConnections: {
      moonTargets: [],
      marsTargets: ['mars-jezero', 'mars-gale'],
    },
    analogyExplanation: {
      whatIsSimilar:
        'Extreme aridity, naturally occurring soil perchlorates and sulfates, intensely oxidized surface regolith, and sparse UV-sterilized soils.',
      whatIsDifferent:
        'Warm ambient temperatures; terrestrial atmospheric pressure and composition; absence of CO₂ frost.',
      whySimilarityMatters:
        'Serves as the benchmark test ground for life-detection instruments, sample drill caching, and perchlorate soil processing for ISRU.',
      experimentsPossible:
        'Testing microfluidic biochemical assays, organic extraction in the presence of oxidants, and deep regolith sample drilling.',
      technologyToTest:
        'Mars sample caching mechanisms, seal integrity under abrasive dust, and robotic soil scooping systems.',
      explorationRiskReduction:
        'Validates that sample return drilling tools do not cross-contaminate or destroy trace bio-organic signatures in perchlorate-rich soil.',
      whatCannotBeReproduced:
        'Martian 0.38g gravity, thin 6 mbar CO₂ atmosphere, and subzero average temperatures.',
    },
  },

  // 5. SVALBARD HIGH ARCTIC (Newly Proposed Candidate)
  {
    siteId: 'svalbard_permafrost',
    name: 'Svalbard High Arctic (Bockfjorden & Longyearbyen)',
    subheading: 'Polygonal Ground, Basalt Volcanism & Permafrost · Spitsbergen, Norway',
    coordinates: { lat: 78.22, lon: 15.65 },
    country: 'Norway (Svalbard Archipelago)',
    classification: 'candidate_analogue',
    environmentType: 'Arctic permafrost & patterned ground',
    planetaryRelevance: 'mars',
    geologicalCharacteristics:
      'Arctic archipelago underlain by continuous permafrost with distinct ice-wedge polygons, sorted stone circles, pingo structures, and unique subglacial volcanic centers (Sverrefjell volcano) where basalt erupted through ice.',
    potentialPlanetaryRelevance:
      'Key analog for Utopia Planitia and northern Martian plains where ground ice and periglacial patterned ground dominate, as well as volcano-ice interactions.',
    evidenceStatus: 'Strong supporting evidence',
    knownLimitations: [
      'Maritime Arctic climate with seasonal snow cover and summer thaw active layer.',
      'Terrestrial biology (mosses, lichens, tundra soils) present in lowlands.',
      'Surface water actively flows during summer melt.',
    ],
    coordinateSource: 'https://opensciencedata.esa.int/',
    targetConnections: {
      moonTargets: [],
      marsTargets: ['mars-utopia', 'mars-jezero'],
    },
    analogyExplanation: {
      whatIsSimilar:
        'Thermal-contraction polygon networks, massive ground ice deposits, permafrost drilling challenges, and volcano-ice hydrothermal mineral precipitates.',
      whatIsDifferent:
        'Active maritime polar atmosphere; liquid water runoffs in summer; marine proximity.',
      whySimilarityMatters:
        'Essential for qualifying ground-penetrating radar (similar to SHARAD / Zhurong RoPeR) and testing ice-coring drill bits in cryogenic frozen soil.',
      experimentsPossible:
        'GPR sounding of active permafrost layer, robotic ice-drilling with minimal melting, and hydrothermal carbonate sinter analysis.',
      technologyToTest:
        'Subsurface radar antennas, automated core extraction and freezing chambers, low-temperature rover battery packs.',
      explorationRiskReduction:
        'Prevents drill jamming in adhesive frozen soil-ice mixtures during in-situ water resource harvesting.',
      whatCannotBeReproduced:
        'Martian atmospheric dryness and carbon dioxide sublimation dynamics.',
    },
  },

  // 6. STILLWATER COMPLEX (Materials-Only Reference)
  {
    siteId: 'stillwater',
    name: 'Stillwater Complex',
    subheading: 'Archean Layered Mafic-to-Ultramafic Intrusion · Beartooth Mtns, Montana, USA',
    coordinates: { lat: 45.386, lon: -109.903 },
    country: 'United States',
    classification: 'materials_reference',
    environmentType: 'Layered igneous complex',
    planetaryRelevance: 'both',
    geologicalCharacteristics:
      'A 2.71-billion-year-old layered mafic-to-ultramafic stratiform intrusion spanning ~48 km along the northern Beartooth Mountains. Features thick cumulate anorthosite bands (up to 80% plagioclase), chromitite seams, norites, and pyroxenites.',
    potentialPlanetaryRelevance:
      'PRIMARY MATERIALS REFERENCE: The best terrestrial mineralogical and geochemical match for lunar ferroan anorthosite crust and Martian deep-crustal cumulate rocks. EXCLUDED FROM TERRAIN COMPARISONS due to mountainous alpine relief.',
    evidenceStatus: 'Materials reference only',
    knownLimitations: [
      'Steep alpine mountain topography produced by Cenozoic glacial carving; NOT an analog for lunar or Martian terrain.',
      'Contains terrestrial hydrous alteration minerals (serpentine, chlorite) along fault zones.',
      'Active underground platinum-palladium mining infrastructure.',
    ],
    coordinateSource: 'https://science.nasa.gov/earth/earth-observatory/montanas-moon-like-rocks-146650/',
    targetConnections: {
      moonTargets: ['moon-connecting-ridge'],
      marsTargets: ['mars-olympus-mons'],
    },
    analogyExplanation: {
      whatIsSimilar:
        'Cumulate mineralogy: rhythmically layered plagioclase-rich anorthosite, chromite, and orthopyroxene with crystallisation sequences paralleling lunar magma ocean differentiation.',
      whatIsDifferent:
        'Alpine canyon terrain, pine forests, glacial valleys, and terrestrial groundwater alteration.',
      whySimilarityMatters:
        'Provides authentic hand-sample specimens and quarry exposures for testing Raman and NIR spectrometers, X-ray diffraction, and regolith simulant production.',
      experimentsPossible:
        'Petrographic thin-section analysis, spectral library generation for lunar highlands, simulant feedstock extraction.',
      technologyToTest:
        'Handheld mineral identification instruments, automated rock grinding and microscopic imagers.',
      explorationRiskReduction:
        'Calibrates spectral algorithms to distinguish true anorthosite from surrounding gabbroic rocks.',
      whatCannotBeReproduced:
        'Lunar impact comminution, agglutinates, space weathering patinas, and lack of hydrous alteration.',
    },
  },

  // 7. MIYAKE-JIMA (Materials-Only Reference)
  {
    siteId: 'miyake_jima',
    name: 'Miyake-jima Volcanic Island',
    subheading: 'Active Basaltic Volcano & Fresh Lava Flows · Izu Archipelago, Japan',
    coordinates: { lat: 34.079, lon: 139.529 },
    country: 'Japan',
    classification: 'materials_reference',
    environmentType: 'Active basaltic volcano',
    planetaryRelevance: 'mars',
    geologicalCharacteristics:
      'An 8-km-wide active basaltic stratovolcano in the Izu-Bonin arc. Features young Holocene fissure-fed aa and pahoehoe lava flows (notably the 1983 eruption), a prominent 2000 collapse caldera at Mount Oyama, and intense volcanic gas venting.',
    potentialPlanetaryRelevance:
      'PRIMARY MATERIALS & PROCESS REFERENCE: Fresh, unweathered basaltic lava surfaces and collapse calderas analogue for young Martian volcanic plains (Elysium Planitia / Olympus Mons). EXCLUDED FROM TERRAIN COMPARISONS.',
    evidenceStatus: 'Materials reference only',
    knownLimitations: [
      'Maritime subtropical island climate with abundant rain, vegetation recovery, and ocean wave erosion.',
      'Active sulfur dioxide volcanic gas hazards require special monitoring.',
      'Island topography does not represent vast Martian lava plateaus.',
    ],
    coordinateSource: 'https://science.nasa.gov/earth/earth-observatory/return-to-miyakejima-85803/',
    targetConnections: {
      moonTargets: [],
      marsTargets: ['mars-olympus-mons', 'mars-jezero'],
    },
    analogyExplanation: {
      whatIsSimilar:
        'Fresh, sharp, glassy basaltic aa and pahoehoe crusts, scoria deposits, and explosive collapse calderas resembling young Martian volcanic features.',
      whatIsDifferent:
        'Subtropical ocean climate; dense vegetation recovering on slopes; humid marine atmosphere.',
      whySimilarityMatters:
        'Tests rover wheel durability against jagged, razor-sharp basaltic crusts and evaluates sensors in chemically active volcanic terrains.',
      experimentsPossible:
        'Wheel tread abrasion tests on fresh aa lava, gas sensor calibration in sulfur-rich environments.',
      technologyToTest:
        'Flexible titanium mesh rover wheels, automated obstacle clearance over jagged volcanic ridges.',
      explorationRiskReduction:
        'Identifies catastrophic tire puncture and sidewall tearing risks before rovers traverse fresh Martian lava fields.',
      whatCannotBeReproduced:
        'Martian atmospheric pressure and lack of atmospheric oxidation.',
    },
  },
];

export function getEarthAnalogueById(siteId: string): EarthAnalogueSiteRecord | undefined {
  return EARTH_ANALOGUE_SITES.find((s) => s.siteId === siteId);
}

export function getEarthAnaloguesByClassification(classification: AnalogueClassification): EarthAnalogueSiteRecord[] {
  return EARTH_ANALOGUE_SITES.filter((s) => s.classification === classification);
}

export function getEarthAnaloguesByPlanetaryRelevance(relevance: 'all' | 'moon' | 'mars'): EarthAnalogueSiteRecord[] {
  if (relevance === 'all') return EARTH_ANALOGUE_SITES;
  return EARTH_ANALOGUE_SITES.filter((s) => s.planetaryRelevance === relevance || s.planetaryRelevance === 'both');
}
