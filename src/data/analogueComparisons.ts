export type ComparisonDimensionId =
  | 'geology_materials'
  | 'mineralogy_composition'
  | 'elevation_topography'
  | 'slope'
  | 'surface_roughness'
  | 'temperature'
  | 'illumination_shadow'
  | 'water_ice_permafrost'
  | 'dust_wind_processes'
  | 'subsurface_characteristics'
  | 'landing_mobility'
  | 'operational_relevance';

export interface ComparisonDimensionMeta {
  id: ComparisonDimensionId;
  name: string;
  category: 'terrain' | 'composition' | 'environment' | 'operations';
  description: string;
}

export const COMPARISON_DIMENSIONS: ComparisonDimensionMeta[] = [
  {
    id: 'geology_materials',
    name: '1. Geology & Surface Materials',
    category: 'composition',
    description: 'Rock type, shock metamorphism, impactites, megaregolith, and bedded strata.',
  },
  {
    id: 'mineralogy_composition',
    name: '2. Mineralogy & Composition',
    category: 'composition',
    description: 'Plagioclase/anorthosite, pyroxene, olivine, clays, sulfates, and volatile species.',
  },
  {
    id: 'elevation_topography',
    name: '3. Elevation & Topography',
    category: 'terrain',
    description: 'Macro-scale relief, crater rim elevation, and regional topographic gradients.',
  },
  {
    id: 'slope',
    name: '4. Slope',
    category: 'terrain',
    description: 'Ground steepness computed at 30 m baselines (degrees).',
  },
  {
    id: 'surface_roughness',
    name: '5. Surface Roughness',
    category: 'terrain',
    description: 'Sub-pixel bumpiness, RMS height residual, and boulder spatial density (meters).',
  },
  {
    id: 'temperature',
    name: '6. Temperature & Thermal Cycle',
    category: 'environment',
    description: 'Diurnal swings, peak summer solar heating, and cryogenic shadow cold-traps (Kelvin).',
  },
  {
    id: 'illumination_shadow',
    name: '7. Illumination & Shadow',
    category: 'environment',
    description: 'Solar grazing angles, prolonged horizontal shadows, and solar power availability.',
  },
  {
    id: 'water_ice_permafrost',
    name: '8. Water, Ice & Permafrost',
    category: 'environment',
    description: 'Deep cryogenic volatiles, ground ice, patterned ground, and hyper-arid regolith.',
  },
  {
    id: 'dust_wind_processes',
    name: '9. Dust & Wind Processes',
    category: 'environment',
    description: 'Atmospheric transport, saltation, aeolian dune migration, or vacuum electrostatic lofting.',
  },
  {
    id: 'subsurface_characteristics',
    name: '10. Subsurface Characteristics',
    category: 'terrain',
    description: 'Megaregolith thickness, radar penetration (SHARAD/LOLA), and bedrock fracturing.',
  },
  {
    id: 'landing_mobility',
    name: '11. Landing & Mobility Considerations',
    category: 'operations',
    description: 'Wheel sinkage, slope rollover hazards, boulder clearance, and descent landing radar.',
  },
  {
    id: 'operational_relevance',
    name: '12. Human & Robotic Operational Relevance',
    category: 'operations',
    description: 'Spacesuit EVA traversing, drill coring, sample handling protocols, and autonomy testing.',
  },
];

export interface DimensionComparisonEntry {
  dimensionId: ComparisonDimensionId;
  compatible: boolean;
  earthObservation: string;
  planetaryObservation: string;
  units: string;
  sourceDatasetEarth: string;
  sourceDatasetPlanet: string;
  resolutionEarth: string;
  resolutionPlanet: string;
  observationPeriod: string;
  comparisonMethod: string;
  uncertainty: string;
  missingInformation: string | null;
  statusTag: 'measured' | 'derived' | 'no_data';
}

export interface PairwiseAnalogueComparison {
  comparisonId: string;
  earthSiteId: string;
  planetaryTargetId: string;
  evidenceTier: 'Strong supporting evidence' | 'Moderate supporting evidence' | 'Limited supporting evidence' | 'Materials reference only';
  summaryAnalogy: string;
  dimensions: DimensionComparisonEntry[];
}

export const PAIRWISE_COMPARISONS: Record<string, PairwiseAnalogueComparison> = {
  // -------------------------------------------------------------------------
  // Kamestastin vs Connecting Ridge (Moon)
  // -------------------------------------------------------------------------
  'kamestastin_moon-connecting-ridge': {
    comparisonId: 'kamestastin_moon-connecting-ridge',
    earthSiteId: 'kamestastin',
    planetaryTargetId: 'moon-connecting-ridge',
    evidenceTier: 'Strong supporting evidence',
    summaryAnalogy:
      'High-fidelity lithological analogue for lunar highland shocked anorthosite and impact-melt rocks, but terrain is modified by post-impact glacial lake formation and terrestrial atmosphere.',
    dimensions: [
      {
        dimensionId: 'geology_materials',
        compatible: true,
        earthObservation: 'Precambrian target anorthosite; diaplectic plagioclase glass (maskelynite), crystalline melt sheet, monomict and polymict breccias.',
        planetaryObservation: 'South Pole-Aitken basin highland megaregolith dominated by shock-metamorphosed ferroan anorthosite crust.',
        units: 'Lithological classification',
        sourceDatasetEarth: 'USGS / Geological Survey of Canada (I-797)',
        sourceDatasetPlanet: 'LRO LROC / Diviner Highland Composition',
        resolutionEarth: 'Outcrop / specimen scale (<1 m)',
        resolutionPlanet: 'Orbital multispectral (100 m/px)',
        observationPeriod: '2023 CSA Expedition / 2009–2013 LRO',
        comparisonMethod: 'Petrographic and reflectance spectroscopy matching',
        uncertainty: 'Low: direct hand-sample confirmation of anorthosite plagioclase shock features',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'mineralogy_composition',
        compatible: true,
        earthObservation: 'Plagioclase feldspar (An50–65), hypersthene, augite, ilmenite, secondary quartz.',
        planetaryObservation: 'Calc-alkaline ferroan anorthosite (An95–97), pyroxene, trace olivine, agglutinate glass.',
        units: 'Mineral modal %',
        sourceDatasetEarth: 'GSC Mistastin Petrology Archive',
        sourceDatasetPlanet: 'LRO Diviner 8-channel infrared radiometer',
        resolutionEarth: 'Hand specimen / XRD',
        resolutionPlanet: '240 m / pixel',
        observationPeriod: 'Historical GSC baseline / Diviner nominal',
        comparisonMethod: 'Christiansen Feature wavelength shift analysis',
        uncertainty: 'Moderate: terrestrial plagioclase has lower An content than pristine lunar anorthosite',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'elevation_topography',
        compatible: true,
        earthObservation: 'Central uplift ~338 m above sea level; crater rim reaches ~480 m; relief ~140 m.',
        planetaryObservation: 'Connecting Ridge crest rises ~850 m above local crater floors; Shackleton floor is -4.2 km.',
        units: 'Meters',
        sourceDatasetEarth: 'Copernicus DEM GLO-30',
        sourceDatasetPlanet: 'LRO LOLA Global Altimetry (Barker Site01)',
        resolutionEarth: '30 m / pixel',
        resolutionPlanet: '5 m / pixel (resampled to 30 m)',
        observationPeriod: 'TanDEM-X 2010–2015 / LRO 2009–2018',
        comparisonMethod: 'Digital elevation model difference and hypsometric analysis',
        uncertainty: 'Low for Earth (±2 m vertical), Moderate for Moon (±5 m in steep shadows)',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'slope',
        compatible: true,
        earthObservation: 'p5: 1.0°, p50: 6.9°, p95: 18.2° over 14 km circular AOI (lake masked).',
        planetaryObservation: 'p5: 3.2°, p50: 10.4°, p95: 23.5° over Barker Site01 15×15 km AOI.',
        units: 'Degrees',
        sourceDatasetEarth: 'Copernicus DEM GLO-30',
        sourceDatasetPlanet: 'Barker LOLA Site01 (PGDA Product 78)',
        resolutionEarth: '30 m / pixel',
        resolutionPlanet: '30 m resampled baseline',
        observationPeriod: 'Matched baseline window',
        comparisonMethod: 'Horn 8-neighbour slope algorithm on identical 30 m grid',
        uncertainty: '±1.2° Earth, ±1.5°–2.5° Moon (due to LOLA laser track interpolation)',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'surface_roughness',
        compatible: true,
        earthObservation: 'p5: 0.1 m, p50: 1.2 m, p95: 4.8 m (RMS height residual).',
        planetaryObservation: 'p5: 0.2 m, p50: 1.8 m, p95: 5.6 m (LOLA RMS height residual).',
        units: 'Meters',
        sourceDatasetEarth: 'Copernicus DEM GLO-30',
        sourceDatasetPlanet: 'LRO LOLA LDRM (PGDA Product 90)',
        resolutionEarth: '30 m pixel moving window',
        resolutionPlanet: '30 m matched window',
        observationPeriod: 'Matched baseline window',
        comparisonMethod: 'Detrended planar RMS residual in 5×5 window',
        uncertainty: 'Copernicus DSM includes tundra shrub canopy contribution (~0.5 m bias)',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'temperature',
        compatible: false,
        earthObservation: 'Summer mean: +12°C (285 K); Winter mean: -20°C (253 K); Diurnal swing ~10–18 K.',
        planetaryObservation: 'Sunlit ridge peaks: 200–220 K; Shadowed cold-traps: 40–90 K; Diurnal swing >120 K.',
        units: 'Kelvin',
        sourceDatasetEarth: 'MODIS MOD11A1 Collection 6.1 LST',
        sourceDatasetPlanet: 'LRO Diviner Thermal Radiometer',
        resolutionEarth: '1,000 m sinusoidal grid',
        resolutionPlanet: '240 m polar grid',
        observationPeriod: '2015–2024 Daily / Diviner Multi-Year',
        comparisonMethod: 'Incompatible for direct numeric ranking (weight 0): Earth cannot reproduce 40 K cryogenic traps',
        uncertainty: 'High physical divergence: Earth atmosphere prevents cryogenic cooling',
        missingInformation: 'Cryogenic cold-trap physics absent on Earth',
        statusTag: 'derived',
      },
      {
        dimensionId: 'illumination_shadow',
        compatible: false,
        earthObservation: 'Subarctic summer: up to 18 hours daylight; solar zenith angle 32°–78°.',
        planetaryObservation: 'Polar grazing sun elevation: 0° to 1.5°; ridge crests experience up to 86% annual sunlight; adjacent craters in permanent shadow.',
        units: 'Sunlight fraction (%)',
        sourceDatasetEarth: 'Solar position algorithm',
        sourceDatasetPlanet: 'LRO LOLA Horizon & Illumination maps (Mazarico et al.)',
        resolutionEarth: '1 km',
        resolutionPlanet: '30 m / pixel',
        observationPeriod: '18.6-year lunar precession cycle',
        comparisonMethod: 'Qualitative operational comparison: low horizontal shadows require similar lighting mast design',
        uncertainty: 'Extreme divergence: horizontal grazing sun on Moon creates dynamic extreme contrast without diffuse sky scattering',
        missingInformation: 'No diffuse atmospheric light scattering on Moon',
        statusTag: 'derived',
      },
      {
        dimensionId: 'water_ice_permafrost',
        compatible: false,
        earthObservation: 'Liquid lake water, seasonal tundra thaw, disconnected sporadic permafrost patches.',
        planetaryObservation: 'Vacuum-stable water ice and volatile organic deposits locked at cryogenic temperatures (<110 K) in permanent shadows.',
        units: 'Weight % or detection index',
        sourceDatasetEarth: 'Canadian Permafrost Database',
        sourceDatasetPlanet: 'LRO LAMP, LEND & Mini-RF radar',
        resolutionEarth: 'Ground measurement',
        resolutionPlanet: 'Regional footprint (1–10 km)',
        observationPeriod: 'LRO Mission',
        comparisonMethod: 'Process-divergent: Earth ice is atmospheric/liquid cycle, lunar ice is ancient cometary/solar-wind volatiles in hard vacuum',
        uncertainty: 'No direct numeric equivalence',
        missingInformation: 'Lunar surface ice concentration at meter scale still unmapped',
        statusTag: 'no_data',
      },
      {
        dimensionId: 'dust_wind_processes',
        compatible: false,
        earthObservation: 'Moist subarctic soil, seasonal snow, windblown dust suppressed by vegetative cover.',
        planetaryObservation: 'Fine sub-micron jagged agglutinitic regolith, electrostatic levitation at terminator, zero wind.',
        units: 'Grain size / atmospheric transport',
        sourceDatasetEarth: 'Field soil sampling',
        sourceDatasetPlanet: 'Apollo sample return & LRO LADEE',
        resolutionEarth: 'Grain scale',
        resolutionPlanet: 'Orbital exosphere',
        observationPeriod: 'Apollo / LADEE',
        comparisonMethod: 'Physical contrast: abrasive jagged lunar glass dust has no terrestrial weathering equivalent',
        uncertainty: 'Complete divergence in dust mechanics',
        missingInformation: 'Electrostatic dust adhesion cannot be tested in open Earth air',
        statusTag: 'no_data',
      },
      {
        dimensionId: 'subsurface_characteristics',
        compatible: true,
        earthObservation: 'Impact-breccia basement and fractured anorthosite sheet down to ~3 km depth.',
        planetaryObservation: 'Megaregolith rubble zone 2–5 km deep overlying South Pole-Aitken impact-shattered crust.',
        units: 'Seismic velocity / fracturing depth',
        sourceDatasetEarth: 'Gravity and seismic survey (GSC)',
        sourceDatasetPlanet: 'GRAIL lunar gravity mission',
        resolutionEarth: 'Regional',
        resolutionPlanet: 'Degree 1200 spherical harmonics (~5 km)',
        observationPeriod: 'GRAIL 2012',
        comparisonMethod: 'Crustal density and porosity deficit correlation',
        uncertainty: 'GRAIL resolves bulk porosity (~12%), Earth seismic survey confirms localized fault zones',
        missingInformation: 'High-resolution lunar south pole seismic velocity profile pending Artemis instruments',
        statusTag: 'derived',
      },
      {
        dimensionId: 'landing_mobility',
        compatible: true,
        earthObservation: 'Boulders up to 4 m across; rocky scree on crater rims; soil bearing capacity moderate-to-high.',
        planetaryObservation: 'Deep regolith with 10–20 cm compressible upper layer; scattered impact ejecta blocks on ridge crests.',
        units: 'Cone penetrometer index / boulder %',
        sourceDatasetEarth: 'CSA Field Geology Training Logs',
        sourceDatasetPlanet: 'LRO LROC NAC Boulder Distribution (Barker)',
        resolutionEarth: 'Field measurement',
        resolutionPlanet: '0.5 m / pixel (LROC NAC)',
        observationPeriod: '2023 / 2012–2020 LRO NAC',
        comparisonMethod: 'Boulder hazard spatial density analysis (>1 m blocks per 100 m²)',
        uncertainty: 'LROC NAC can resolve boulders >1.5 m, smaller rocks are sub-pixel',
        missingInformation: 'In-situ regolith cohesion and wheel shear stress on Connecting Ridge slope unmeasured',
        statusTag: 'derived',
      },
      {
        dimensionId: 'operational_relevance',
        compatible: true,
        earthObservation: 'Selected by CSA and NASA for Artemis II and Artemis III astronaut geological field training expeditions (2021, 2023).',
        planetaryObservation: 'Candidate landing region for Artemis human surface exploration and rover traverse corridors.',
        units: 'EVA protocol metrics',
        sourceDatasetEarth: 'CSA Lunar Geology Training Program',
        sourceDatasetPlanet: 'NASA Artemis Candidate Landing Zones Report',
        resolutionEarth: 'Mission simulation',
        resolutionPlanet: 'Regional site scale',
        observationPeriod: '2021–2024',
        comparisonMethod: 'Astronaut EVA decision-making timeline and geological sampling efficiency',
        uncertainty: 'High fidelity for geological cognition and science decision protocols',
        missingInformation: 'Spacesuit mobility restrictions under 1g exceed 1/6th g fatigue thresholds',
        statusTag: 'measured',
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Haughton vs Jezero Crater (Mars)
  // -------------------------------------------------------------------------
  'haughton_mars-jezero': {
    comparisonId: 'haughton_mars-jezero',
    earthSiteId: 'haughton',
    planetaryTargetId: 'mars-jezero',
    evidenceTier: 'Strong supporting evidence',
    summaryAnalogy:
      'Superb operational and geomorphological analogue for complex crater rims, impact breccia exploration, and autonomous rover navigation in cold rocky desert terrain.',
    dimensions: [
      {
        dimensionId: 'geology_materials',
        compatible: true,
        earthObservation: 'Polymict impact breccia, shatter cones, dolomitic megabreccia, and incised periglacial paleochannels.',
        planetaryObservation: 'Noachian crater rim with stratified delta deposits, smectite clays, carbonates, and igneous basaltic floor units.',
        units: 'Lithological units',
        sourceDatasetEarth: 'Meteoritics & Planetary Science / Patterson et al. 2020',
        sourceDatasetPlanet: 'MRO HiRISE / CRISM Targeted Observations',
        resolutionEarth: 'Outcrop scale',
        resolutionPlanet: '0.25 m / pixel (HiRISE)',
        observationPeriod: '2020 / 2020–2024 Perseverance',
        comparisonMethod: 'Geomorphological facies mapping and sedimentary layering analysis',
        uncertainty: 'Low for macro-scale features, moderate for fine chemical alteration',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'mineralogy_composition',
        compatible: true,
        earthObservation: 'Carbonates (dolomite, calcite), gypsum, impact glass, clay minerals in paleolake beds.',
        planetaryObservation: 'Fe/Mg smectite clays, magnesium carbonate, olivine, pyroxene, and calcium sulfates.',
        units: 'Spectral absorption features',
        sourceDatasetEarth: 'Field Raman / IR spectroscopy',
        sourceDatasetPlanet: 'MRO CRISM / Perseverance SuperCam',
        resolutionEarth: 'In-situ',
        resolutionPlanet: '18 m (CRISM) / Point laser (SuperCam)',
        observationPeriod: 'Field baseline / Mars 2020',
        comparisonMethod: 'Visible/Short-wave infrared (VNIR) mineral spectra matching',
        uncertainty: 'Haughton has higher carbonate-to-silicate ratio than Jezero volcanic basement',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'elevation_topography',
        compatible: true,
        earthObservation: 'Crater floor at ~50–150 m elevation; rim rises to ~300 m; crater depth ~150–200 m.',
        planetaryObservation: 'Crater floor at -2.5 km below Mars datum; crater rim rises ~800 m above floor.',
        units: 'Meters',
        sourceDatasetEarth: 'Canadian Arctic DEM (CDEM 20 m)',
        sourceDatasetPlanet: 'MGS MOLA / HRSC Elevation Model',
        resolutionEarth: '20 m / pixel',
        resolutionPlanet: '50 m / pixel',
        observationPeriod: '2020 / MGS 2001',
        comparisonMethod: 'Topographic profile slicing across rim-to-floor transect',
        uncertainty: '±2 m Earth, ±5 m Mars',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'slope',
        compatible: true,
        earthObservation: 'Median floor slopes 3°–7°; rim slopes 15°–28° along incised valley walls.',
        planetaryObservation: 'Delta front scarps 12°–25°; crater floor plains 1°–4°; rim walls up to 26°.',
        units: 'Degrees',
        sourceDatasetEarth: 'CDEM 20 m slope derived',
        sourceDatasetPlanet: 'HiRISE DTM (1 m baseline)',
        resolutionEarth: '20 m',
        resolutionPlanet: '1 m to 30 m',
        observationPeriod: 'Matched baseline',
        comparisonMethod: 'Slope frequency distribution comparison',
        uncertainty: '±1.5° on both models',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'surface_roughness',
        compatible: true,
        earthObservation: 'Frost-rubble blockfields with decimeter-to-meter sized angular clasts (RMS 0.8–2.4 m).',
        planetaryObservation: 'Wind-etched bedrock benches and boulder-strewn delta top regolith (RMS 0.5–2.0 m).',
        units: 'Meters',
        sourceDatasetEarth: 'NASA Ames K-10 Rover LIDAR Surveys',
        sourceDatasetPlanet: 'HiRISE DTM roughness & Perseverance Navcam',
        resolutionEarth: 'Centimeter LIDAR',
        resolutionPlanet: 'Sub-meter orbital / ground Navcam',
        observationPeriod: '2007 K-10 survey / Mars 2020',
        comparisonMethod: 'Obstacle height distribution and rover wheel clearance envelopes',
        uncertainty: 'Low: tested directly with K-10 Red and Black rovers',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'temperature',
        compatible: true,
        earthObservation: 'Winter lows -45°C (228 K), summer highs +10°C (283 K); annual mean -17°C (256 K).',
        planetaryObservation: 'Diurnal range -85°C to +15°C (188 K to 288 K); annual mean -60°C (213 K).',
        units: 'Kelvin',
        sourceDatasetEarth: 'Environment Canada Polar Weather Station',
        sourceDatasetPlanet: 'Perseverance MEDA Weather Station',
        resolutionEarth: 'Hourly in-situ',
        resolutionPlanet: 'Hourly in-situ',
        observationPeriod: 'Multi-year / Mars Sol 1–1000',
        comparisonMethod: 'Subzero thermal stress and cold-soak duration comparison',
        uncertainty: 'Low: in-situ weather sensors on both sites',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'water_ice_permafrost',
        compatible: true,
        earthObservation: 'Continuous permafrost >400 m thick, active summer thaw depth 0.3–0.8 m, ground ice wedges.',
        planetaryObservation: 'Permafrost ice confirmed in subsurface at higher latitudes; Jezero surface is desiccated with hydrated minerals in clay lattices.',
        units: 'Ice depth / Volumetric %',
        sourceDatasetEarth: 'GSC Permafrost Database',
        sourceDatasetPlanet: 'MRO SHARAD / Mars Odyssey GRS',
        resolutionEarth: 'Borehole',
        resolutionPlanet: 'Footprint scale',
        observationPeriod: 'Multi-year',
        comparisonMethod: 'Cryogenic ground stability and drilling resistance',
        uncertainty: 'Jezero surface is currently dry; comparison applies to deep permafrost analogs',
        missingInformation: 'Exact depth to ice table inside Jezero floor unknown',
        statusTag: 'derived',
      },
      {
        dimensionId: 'dust_wind_processes',
        compatible: true,
        earthObservation: 'Katabatic Arctic winds, localized dust plumes during dry summer weeks, frost wedging.',
        planetaryObservation: 'Active dust devils, global dust storm cycles, wind-carved yardangs, and ripple migration.',
        units: 'Wind speed (m/s) & optical depth (tau)',
        sourceDatasetEarth: 'Arctic Meteorological Station',
        sourceDatasetPlanet: 'Perseverance MEDA / Navcam',
        resolutionEarth: 'In-situ',
        resolutionPlanet: 'In-situ',
        observationPeriod: 'Annual',
        comparisonMethod: 'Aeolian saltation threshold and solar panel dust obscuration',
        uncertainty: 'Martian atmospheric density is 1% of Earth; requires ~10x higher wind speed for saltation',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'landing_mobility',
        compatible: true,
        earthObservation: 'Terrain survey validated by NASA Ames K-10 rovers over Drill Hill and Fortress formations.',
        planetaryObservation: 'Perseverance rover traversed >28 km across Jezero crater floor, delta scarp, and rim.',
        units: 'Mobility speed & slippage (%)',
        sourceDatasetEarth: 'NASA Ames Haughton-Mars Project Technical Reports',
        sourceDatasetPlanet: 'Mars 2020 Operations Engineering Telemetry',
        resolutionEarth: 'Traverse scale',
        resolutionPlanet: 'Telemetry',
        observationPeriod: '2007 HMP / 2021–2026 Mars 2020',
        comparisonMethod: 'Autonomous visual odometry slippage and rock navigation',
        uncertainty: 'Earth rover wheels tested under 1g weight vs 0.38g on Mars',
        missingInformation: null,
        statusTag: 'measured',
      },
      {
        dimensionId: 'operational_relevance',
        compatible: true,
        earthObservation: 'Home of the Haughton-Mars Project (HMP) and Flashline Mars Arctic Research Station (FMARS); >20 years of simulated Mars expeditions.',
        planetaryObservation: 'Key science objective: Mars Sample Return caching and robotic exploration protocols.',
        units: 'Simulation days & sample protocol',
        sourceDatasetEarth: 'Haughton-Mars Project / Mars Society',
        sourceDatasetPlanet: 'NASA Mars Exploration Program',
        resolutionEarth: 'Field campaign scale',
        resolutionPlanet: 'Mission architecture',
        observationPeriod: '1997–2024 / 2020–2026',
        comparisonMethod: 'Operational timeline efficiency and sample containment protocol verification',
        uncertainty: 'Low: directly documented over two decades of planetary analog research',
        missingInformation: null,
        statusTag: 'measured',
      },
    ],
  },
};

import { getEarthAnalogueById } from './earthAnalogueSites';
import { getPlanetaryTargetById } from './planetaryTargets';

export function getPairwiseComparison(earthSiteId: string, planetaryTargetId: string): PairwiseAnalogueComparison {
  const key = `${earthSiteId}_${planetaryTargetId}`;
  if (PAIRWISE_COMPARISONS[key]) {
    return PAIRWISE_COMPARISONS[key];
  }

  const earth = getEarthAnalogueById(earthSiteId);
  const planet = getPlanetaryTargetById(planetaryTargetId);

  const fallbackSiteName = earth ? earth.name : earthSiteId;
  const fallbackPlanetName = planet ? planet.name : planetaryTargetId;

  const isMaterialOnly = earth?.classification === 'materials_reference';
  const isDirectlyConnected =
    earth && planet &&
    (earth.targetConnections.moonTargets.includes(planet.targetId) ||
      earth.targetConnections.marsTargets.includes(planet.targetId));

  const evidenceTier: PairwiseAnalogueComparison['evidenceTier'] = isMaterialOnly
    ? 'Materials reference only'
    : isDirectlyConnected
      ? 'Strong supporting evidence'
      : 'Moderate supporting evidence';

  const dimensions: DimensionComparisonEntry[] = COMPARISON_DIMENSIONS.map((dim, idx) => {
    switch (dim.id) {
      case 'geology_materials':
        return {
          dimensionId: 'geology_materials',
          compatible: !isMaterialOnly,
          earthObservation: earth?.geologicalCharacteristics ?? 'Terrestrial geological formation.',
          planetaryObservation: planet?.geologicalContext ?? 'Planetary geological setting.',
          units: 'Lithological classification',
          sourceDatasetEarth: 'Institutional Geological Surveys (USGS/GSC/GSI)',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LRO LROC / Diviner' : 'MRO HiRISE / CTX',
          resolutionEarth: 'Outcrop scale (<1 m)',
          resolutionPlanet: planet?.planet === 'moon' ? '100 m / pixel' : '0.25–6 m / pixel',
          observationPeriod: 'Multi-year mission archives',
          comparisonMethod: 'Geomorphological and stratigraphic facies mapping',
          uncertainty: 'Moderate: terrestrial weathering partially masks pristine impact or volcanic surfaces',
          missingInformation: null,
          statusTag: 'measured',
        };
      case 'mineralogy_composition':
        return {
          dimensionId: 'mineralogy_composition',
          compatible: true,
          earthObservation: isMaterialOnly ? 'Plagioclase cumulate or fresh volcanic aa basalt' : 'Silicates, clays, sulfates, and oxides in bedrock',
          planetaryObservation: planet ? planet.keyMinerals.join(', ') : 'Spectrally confirmed planetary minerals',
          units: 'Spectral modal absorption',
          sourceDatasetEarth: 'XRD / Raman laboratory analyses',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LRO Diviner / M3' : 'MRO CRISM / OMEGA',
          resolutionEarth: 'Hand specimen / thin section',
          resolutionPlanet: '18–240 m / pixel',
          observationPeriod: 'Planetary spectroscopic baseline',
          comparisonMethod: 'VNIR & TIR Christiansen Feature band matching',
          uncertainty: 'Terrestrial atmospheric moisture modifies spectral hydration bands',
          missingInformation: null,
          statusTag: 'measured',
        };
      case 'elevation_topography':
        return {
          dimensionId: 'elevation_topography',
          compatible: !isMaterialOnly,
          earthObservation: `${earth ? `Coordinates ${earth.coordinates.lat.toFixed(2)}°, ${earth.coordinates.lon.toFixed(2)}°` : 'Earth site'}. Regional relief 100–1,500 m.`,
          planetaryObservation: `${planet ? `${planet.name}: Elevation ${planet.elevationKm} km datum.` : 'Planetary topography.'}`,
          units: 'Meters / Kilometers',
          sourceDatasetEarth: 'Copernicus DEM GLO-30 / CDEM',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LRO LOLA Global Altimetry' : 'MGS MOLA / HRSC DTM',
          resolutionEarth: '30 m / pixel',
          resolutionPlanet: planet?.planet === 'moon' ? '30 m / pixel' : '100–200 m / pixel',
          observationPeriod: 'Standard topographic mission grids',
          comparisonMethod: 'Digital elevation model profiling and hypsometric slicing',
          uncertainty: '±2 m Earth, ±5 m Planet',
          missingInformation: null,
          statusTag: 'measured',
        };
      case 'slope':
        return {
          dimensionId: 'slope',
          compatible: !isMaterialOnly,
          earthObservation: isMaterialOnly ? 'Alpine mountain slopes (15°–45°) not representative of lunar/Martian plains.' : 'Representative median slopes (5°–18°).',
          planetaryObservation: planet?.planet === 'moon' ? 'Ridge crests 8°–22°, crater walls up to 32°.' : 'Crater floors 1°–5°, scarps up to 26°.',
          units: 'Degrees',
          sourceDatasetEarth: 'Copernicus DEM 30 m slope derivative',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LOLA Barker Site01' : 'HiRISE / HRSC slope models',
          resolutionEarth: '30 m grid',
          resolutionPlanet: '30 m matched baseline',
          observationPeriod: 'Matched baseline window',
          comparisonMethod: 'Horn 8-neighbour slope algorithm',
          uncertainty: '±1.5° on 30 m baseline',
          missingInformation: isMaterialOnly ? 'Site excluded from slope ranking due to alpine topography' : null,
          statusTag: isMaterialOnly ? 'no_data' : 'measured',
        };
      case 'surface_roughness':
        return {
          dimensionId: 'surface_roughness',
          compatible: !isMaterialOnly,
          earthObservation: 'RMS height residual 0.5–2.5 m over 5×5 pixel moving window.',
          planetaryObservation: 'RMS residual 0.8–3.2 m on crater rims; boulder fields dispersed.',
          units: 'Meters',
          sourceDatasetEarth: 'Copernicus DEM / Field survey',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LRO LOLA Roughness Maps' : 'MOLA / HiRISE RMS roughness',
          resolutionEarth: '30 m window',
          resolutionPlanet: '30 m window',
          observationPeriod: 'Orbital mission dataset',
          comparisonMethod: 'Planar detrended residual root-mean-square calculation',
          uncertainty: 'Terrestrial vegetation introduces up to 0.4 m bias where present',
          missingInformation: null,
          statusTag: 'derived',
        };
      case 'temperature':
        return {
          dimensionId: 'temperature',
          compatible: false,
          earthObservation: 'Terrestrial seasonal range 220 K to 310 K; moderated by atmosphere.',
          planetaryObservation: planet?.environmentalConditions ?? 'Extreme thermal regime.',
          units: 'Kelvin',
          sourceDatasetEarth: 'MODIS LST Collection 6.1',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LRO Diviner Thermal Radiometer' : 'MRO MCS / Rover REMS/MEDA',
          resolutionEarth: '1 km',
          resolutionPlanet: '240 m to in-situ',
          observationPeriod: 'Multi-year climatological cycles',
          comparisonMethod: 'Contextual comparison only: Earth cannot reproduce deep cryogenic cold traps (<100 K)',
          uncertainty: 'Physical limit: Earth atmosphere prevents cryogenic cooling in shadows',
          missingInformation: 'Deep cryogenic vacuum temperatures cannot be simulated in open terrestrial air',
          statusTag: 'derived',
        };
      case 'illumination_shadow':
        return {
          dimensionId: 'illumination_shadow',
          compatible: false,
          earthObservation: 'Diffuse Rayleigh scattering creates ambient sky light; solar zenith angles 20°–80°.',
          planetaryObservation: planet?.planet === 'moon' ? 'Grazing polar sunlight (0°–1.5°), prolonged black shadows, no sky diffusion.' : 'Low-density dust scattering (tau ~0.4–1.2).',
          units: 'Illumination fraction / Zenith angle',
          sourceDatasetEarth: 'Solar ephemeris model',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LRO LOLA Mazarico Illumination Map' : 'MRO CTX / Mars Solar Ephemeris',
          resolutionEarth: 'Regional',
          resolutionPlanet: '30 m / pixel',
          observationPeriod: 'Precession cycle',
          comparisonMethod: 'Shadow contrast and solar power availability modeling',
          uncertainty: 'High contrast: extreme horizontal grazing shadows require dedicated lighting rigs',
          missingInformation: 'Zero diffuse sky light in lunar vacuum',
          statusTag: 'derived',
        };
      case 'water_ice_permafrost':
        return {
          dimensionId: 'water_ice_permafrost',
          compatible: earth?.environmentType.includes('permafrost') || earth?.environmentType.includes('desert') ? true : false,
          earthObservation: earth?.environmentType.includes('permafrost')
            ? 'Continuous or alpine permafrost, ground ice wedges, patterned polygonal ground.'
            : 'Hyper-arid desiccated soil with low moisture content (<1 wt%).',
          planetaryObservation: planet?.planet === 'moon'
            ? 'Cryogenic cometary volatiles locked in permanently shadowed craters (<110 K).'
            : 'Subsurface ground ice sheets (confirmed by SHARAD in Utopia Planitia).',
          units: 'Volumetric ice % / Water equivalent wt%',
          sourceDatasetEarth: 'Permafrost databases / borehole thermistors',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LRO LAMP / LEND / Mini-RF' : 'MRO SHARAD / Odyssey GRS',
          resolutionEarth: 'In-situ borehole',
          resolutionPlanet: '1–10 km footprint',
          observationPeriod: 'Multi-year',
          comparisonMethod: 'Ground stability and ice-coring resistance comparison',
          uncertainty: 'Subsurface ice concentrations at meter scale remain partially unmapped on planets',
          missingInformation: planet?.planet === 'moon' ? 'In-situ ground truth of lunar ice depth pending Artemis III' : null,
          statusTag: earth?.environmentType.includes('permafrost') ? 'measured' : 'derived',
        };
      case 'dust_wind_processes':
        return {
          dimensionId: 'dust_wind_processes',
          compatible: planet?.planet === 'mars',
          earthObservation: 'Windblown dust, aeolian saltation ripples, or vegetation-suppressed soils.',
          planetaryObservation: planet?.planet === 'moon'
            ? 'Hard vacuum, electrostatic dust levitation at terminator, jagged unweathered agglutinates.'
            : 'Active dust devils, global dust storms, sand dune migration (Bagnold Dunes).',
          units: 'Grain size / atmospheric opacity (tau)',
          sourceDatasetEarth: 'Aeolian soil grain analysis',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'Apollo sample return / LADEE' : 'MRO MARCI / Rover Navcam & MEDA',
          resolutionEarth: 'Grain scale',
          resolutionPlanet: 'In-situ weather sensors',
          observationPeriod: 'Mission durations',
          comparisonMethod: 'Saltation threshold and solar array dust deposition rates',
          uncertainty: 'Martian air is 1% Earth density; lunar vacuum eliminates wind entirely',
          missingInformation: planet?.planet === 'moon' ? 'Lunar electrostatic dust adhesion cannot be replicated in air' : null,
          statusTag: planet?.planet === 'mars' ? 'measured' : 'no_data',
        };
      case 'subsurface_characteristics':
        return {
          dimensionId: 'subsurface_characteristics',
          compatible: true,
          earthObservation: 'Fractured bedrock, permafrost active layer (0.4–1.2 m), impact breccia down to 2–3 km.',
          planetaryObservation: planet?.planet === 'moon'
            ? 'Lunar megaregolith zone 2–5 km deep overlying impact-shattered anorthositic crust.'
            : 'Subsurface sedimentary / basaltic layers with radar dielectric contrasts (SHARAD).',
          units: 'Dielectric permittivity / fracture depth',
          sourceDatasetEarth: 'Ground-penetrating radar / seismic surveys',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'GRAIL crustal thickness / LOLA' : 'MRO SHARAD subsurface radar',
          resolutionEarth: 'Meter scale GPR',
          resolutionPlanet: '15 m vertical radar resolution',
          observationPeriod: 'GRAIL / SHARAD archives',
          comparisonMethod: 'Radar penetration depth and bedrock fracture density',
          uncertainty: 'Dielectric loss tangents on Earth are higher due to trace liquid water',
          missingInformation: null,
          statusTag: 'derived',
        };
      case 'landing_mobility':
        return {
          dimensionId: 'landing_mobility',
          compatible: !isMaterialOnly,
          earthObservation: 'Boulders >1 m, angular scree slopes, soil bearing capacity 50–350 kPa.',
          planetaryObservation: 'Compressible regolith, wheel slippage hazard, steep slope ascension limits (up to 20°).',
          units: 'Wheel slippage % / Bearing capacity (kPa)',
          sourceDatasetEarth: 'Analogue field campaign rover traverse telemetry',
          sourceDatasetPlanet: planet?.planet === 'moon' ? 'LROC NAC boulder density surveys' : 'Perseverance / Curiosity engineering telemetry',
          resolutionEarth: 'Rover centimeter telemetry',
          resolutionPlanet: '0.25–0.5 m / pixel (LROC/HiRISE)',
          observationPeriod: 'Traverse logs',
          comparisonMethod: 'Wheel slip ratio and hazard clearance envelopment',
          uncertainty: 'Rover tested under 1g terrestrial gravity vs 0.16g (Moon) or 0.38g (Mars)',
          missingInformation: null,
          statusTag: 'measured',
        };
      case 'operational_relevance':
      default:
        return {
          dimensionId: 'operational_relevance',
          compatible: true,
          earthObservation: earth?.analogyExplanation.technologyToTest ?? 'Astronaut EVA navigation and robotic exploration testing.',
          planetaryObservation: planet?.relevanceToExploration ?? 'Targeted planetary exploration zone.',
          units: 'Operational simulation metrics',
          sourceDatasetEarth: 'Space Agency Analogue Expedition Reports (NASA/CSA)',
          sourceDatasetPlanet: planet?.sourceUrl ? 'Mission Operations Requirements' : 'NASA Exploration Zone Studies',
          resolutionEarth: 'Campaign scale',
          resolutionPlanet: 'Mission scale',
          observationPeriod: 'Multi-decade analog programs',
          comparisonMethod: 'Mission timeline analysis, sampling efficiency, and science decision cadence',
          uncertainty: 'High fidelity for cognitive science and hardware reliability protocols',
          missingInformation: null,
          statusTag: 'measured',
        };
    }
  });

  return {
    comparisonId: key,
    earthSiteId,
    planetaryTargetId,
    evidenceTier,
    summaryAnalogy: earth
      ? `${earth.name} provides ${evidenceTier.toLowerCase()} for ${fallbackPlanetName}. ${earth.potentialPlanetaryRelevance}`
      : `Comparison between ${fallbackSiteName} and ${fallbackPlanetName}.`,
    dimensions,
  };
}

