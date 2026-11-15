import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SurfaceImageModal } from './components/globe/SurfaceImageModal';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import {
  ANALOG_DATA,
  getTerrainCandidateSites,
  hasAnyPlaceholderMetric,
} from './data/analogData';
import type {
  AppRoute,
  DatasetProvenanceRecord,
  EarthSite,
  PlanetaryBodyId,
  SurfaceObservationImage,
} from './types/terra';
import { CompareView } from './views/CompareView';
import { EvidenceView } from './views/EvidenceView';
import { ExploreView } from './views/ExploreView';
import { OverviewView } from './views/OverviewView';
import { RankingView } from './views/RankingView';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const terrainCandidates = getTerrainCandidateSites(ANALOG_DATA);
  const firstTerrainSiteId = terrainCandidates[0]?.id ?? ANALOG_DATA.sites[0].id;

  const [activeBody, setActiveBody] = useState<PlanetaryBodyId>('moon');
  const [selectedSiteId, setSelectedSiteId] = useState<string>(firstTerrainSiteId);
  const [compareEarthSiteId, setCompareEarthSiteId] =
    useState<string>(firstTerrainSiteId);
  const [datasetQuery, setDatasetQuery] = useState<string>('');
  const [activeModalImage, setActiveModalImage] =
    useState<SurfaceObservationImage | null>(null);

  const showPlaceholderBanner = hasAnyPlaceholderMetric(ANALOG_DATA);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route]);

  const handleOpenExploreBody = (body: PlanetaryBodyId) => {
    setActiveBody(body);
    setRoute('explore');
  };

  const handleSelectSearchSite = (site: EarthSite) => {
    setSelectedSiteId(site.id);
    if (site.terrain_suitable) {
      setCompareEarthSiteId(site.id);
    }
    setActiveBody('earth');
    setRoute('explore');
  };

  const handleSelectSearchLunar = () => {
    setActiveBody('moon');
    setRoute('explore');
  };

  const handleSelectSearchDataset = (record: DatasetProvenanceRecord) => {
    setDatasetQuery(record.datasetName);
    setRoute('evidence');
  };

  const handleCompareEarthSite = (siteId: string) => {
    const isTerrainCandidate = terrainCandidates.some((s) => s.id === siteId);
    if (!isTerrainCandidate) return;
    setSelectedSiteId(siteId);
    setCompareEarthSiteId(siteId);
    setRoute('compare');
  };

  const handleOpenCompareBreakdown = () => {
    setRoute('compare');
    window.setTimeout(() => {
      document
        .getElementById('analogy-breakdown')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div className="min-h-screen bg-[var(--terra-bg)] text-[var(--terra-ink)] overflow-x-hidden">
      <Sidebar
        currentRoute={route}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onNavigate={setRoute}
      />

      <div className="flex min-h-screen flex-col lg:pl-[232px]">
        <TopBar
          currentRoute={route}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onSelectSite={handleSelectSearchSite}
          onSelectLunarReference={handleSelectSearchLunar}
          onSelectDataset={handleSelectSearchDataset}
        />

        {showPlaceholderBanner && (
          <div
            role="alert"
            className="border-b border-[var(--terra-danger)] bg-[#2a1014] px-4 py-2.5 sm:px-6"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 text-center font-mono text-xs font-semibold text-[#ffd8d8]">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--terra-danger)]" />
              <span>PLACEHOLDER VALUES - demo numbers, not real measurements.</span>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          {route === 'overview' && (
            <OverviewView
              dataset={ANALOG_DATA}
              onNavigate={setRoute}
              onOpenExploreBody={handleOpenExploreBody}
              onOpenCompareBreakdown={handleOpenCompareBreakdown}
            />
          )}

          {route === 'explore' && (
            <ExploreView
              activeBody={activeBody}
              selectedSiteId={selectedSiteId}
              onChangeBody={setActiveBody}
              onSelectSiteId={(id) => {
                setSelectedSiteId(id);
                if (terrainCandidates.some((s) => s.id === id)) {
                  setCompareEarthSiteId(id);
                }
              }}
              onCompareEarthSite={handleCompareEarthSite}
              onNextStep={() => setRoute('compare')}
            />
          )}

          {route === 'compare' && (
            <CompareView
              dataset={ANALOG_DATA}
              selectedEarthSiteId={compareEarthSiteId}
              onSelectEarthSite={(id) => {
                setCompareEarthSiteId(id);
                setSelectedSiteId(id);
              }}
              onOpenMaterialsPanel={() => setRoute('explore')}
              onNextStep={() => setRoute('ranking')}
            />
          )}

          {route === 'ranking' && (
            <RankingView
              dataset={ANALOG_DATA}
              onSelectSite={(id: string) => {
                setSelectedSiteId(id);
                if (terrainCandidates.some((s) => s.id === id)) {
                  setCompareEarthSiteId(id);
                }
                setRoute('compare');
              }}
              onNextStep={() => setRoute('evidence')}
            />
          )}

          {route === 'evidence' && (
            <EvidenceView
              initialDatasetQuery={datasetQuery}
              onNextStep={() => setRoute('overview')}
            />
          )}
        </main>
      </div>

      <SurfaceImageModal
        image={activeModalImage}
        onClose={() => setActiveModalImage(null)}
      />
    </div>
  );
}
