import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Camera,
  ExternalLink,
  History,
  Loader2,
  Satellite,
  X,
} from 'lucide-react';
import { resolveNasaAssetFullSizeUrl } from '../../providers/nasaImageLibraryClient';
import type { SurfaceObservationImage } from '../../types/terra';

interface SurfaceImageModalProps {
  image: SurfaceObservationImage | null;
  onClose: () => void;
}

export function SurfaceImageModal({ image, onClose }: SurfaceImageModalProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [resolving, setResolving] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    if (!image) return;
    setImgError(false);
    setResolvedUrl(image.fullSizeUrl || image.thumbnailUrl);

    if (!image.assetManifestUrl) {
      setResolving(false);
      return;
    }

    const controller = new AbortController();
    setResolving(true);

    resolveNasaAssetFullSizeUrl(
      image.assetManifestUrl,
      image.fullSizeUrl || image.thumbnailUrl,
      controller.signal
    )
      .then((url) => {
        if (!controller.signal.aborted) {
          setResolvedUrl(url);
          setResolving(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResolving(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [image]);

  useEffect(() => {
    if (!image) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  const isOrbital = image.perspective === 'orbital';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="surface-image-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090ce8] p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[var(--terra-radius-lg)] border border-[var(--terra-border-strong)] bg-[var(--terra-surface)] shadow-[var(--terra-shadow-panel)]">
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--terra-border)] px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span
                className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 ${
                  isOrbital
                    ? 'border-[var(--terra-sage)]/50 bg-[var(--terra-sage-soft)] text-[#9bc4a9]'
                    : 'border-[var(--terra-amber)]/50 bg-[var(--terra-amber-soft)] text-[var(--terra-amber-hover)]'
                }`}
              >
                {isOrbital ? (
                  <Satellite className="h-3 w-3" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
                <span>
                  {isOrbital ? 'ORBITAL OBSERVATION' : 'SURFACE / GROUND-LEVEL'}
                </span>
              </span>

              {image.isHistorical && (
                <span className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-border-strong)] bg-[var(--terra-bg)] px-2 py-0.5 text-[var(--terra-ink-secondary)]">
                  <History className="h-3 w-3 text-[var(--terra-amber)]" />
                  <span>HISTORICAL IMAGERY</span>
                </span>
              )}

              <span className="text-[var(--terra-ink-muted)] truncate">
                ID: {image.id}
              </span>
            </div>

            <h2
              id="surface-image-modal-title"
              className="mt-1.5 font-display text-xl font-medium text-[var(--terra-ink)]"
            >
              {image.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close full-size image viewer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--terra-radius-sm)] border border-[var(--terra-border)] bg-[var(--terra-bg)] text-[var(--terra-ink-secondary)] hover:border-[var(--terra-border-strong)] hover:text-[var(--terra-ink)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main Split Content: Full-Size Image + Metadata */}
        <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
          {/* Image Canvas */}
          <div className="relative flex min-h-[280px] items-center justify-center bg-[#07090c] p-4 lg:col-span-7 xl:col-span-8">
            {resolving && (
              <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--terra-border)] bg-[#12151af0] px-2.5 py-1 font-mono text-xs text-[var(--terra-ink-secondary)]">
                <Loader2 className="h-3 w-3 animate-spin text-[var(--terra-amber)]" />
                <span>Resolving full-size asset</span>
              </div>
            )}

            {imgError ? (
              <div className="max-w-sm rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[var(--terra-surface)] p-5 text-center">
                <AlertCircle className="mx-auto h-6 w-6 text-[var(--terra-amber)]" />
                <p className="mt-2 text-xs font-medium text-[var(--terra-ink)]">
                  Direct preview could not be loaded in browser
                </p>
                <p className="mt-1 text-xs text-[var(--terra-ink-muted)]">
                  Use the original NASA or LROC source link to inspect the native archive product.
                </p>
              </div>
            ) : (
              <img
                src={resolvedUrl || image.thumbnailUrl}
                alt={`${image.title} — ${image.spacecraft} (${image.cameraOrInstrument})`}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (resolvedUrl !== image.thumbnailUrl) {
                    setResolvedUrl(image.thumbnailUrl);
                  } else {
                    setImgError(true);
                  }
                }}
                className="max-h-[64vh] w-auto max-w-full rounded-[4px] border border-[var(--terra-border)] object-contain"
              />
            )}
          </div>

          {/* Provenance & Metadata Rail */}
          <div className="flex flex-col justify-between border-t border-[var(--terra-border)] bg-[var(--terra-surface-elevated)] p-5 lg:col-span-5 lg:border-l lg:border-t-0 xl:col-span-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--terra-amber)]">
                  Observation Metadata
                </h3>
                <dl className="mt-3 space-y-2.5 text-xs">
                  <div>
                    <dt className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Perspective
                    </dt>
                    <dd className="mt-0.5 text-[var(--terra-ink)]">
                      {image.perspectiveDetailLabel}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Spacecraft / Mission
                    </dt>
                    <dd className="mt-0.5 text-[var(--terra-ink)]">{image.spacecraft}</dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Camera / Instrument
                    </dt>
                    <dd className="mt-0.5 font-mono text-[var(--terra-ink)]">
                      {image.cameraOrInstrument}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Acquisition Date
                    </dt>
                    <dd className="mt-0.5 font-mono text-[var(--terra-ink)] tabular-nums">
                      {image.acquisitionDate}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Temporal Classification
                    </dt>
                    <dd className="mt-0.5 text-[var(--terra-ink-secondary)]">
                      {image.missionContext}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Verified Region
                    </dt>
                    <dd className="mt-0.5 text-[var(--terra-ink)]">
                      {image.verifiedRegionLabel}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Image Identifier
                    </dt>
                    <dd className="mt-0.5 font-mono text-xs text-[var(--terra-ink)] break-all">
                      {image.id}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-mono text-xs text-[var(--terra-ink-muted)]">
                      Source &amp; Attribution
                    </dt>
                    <dd className="mt-0.5 text-[var(--terra-ink-secondary)]">
                      {image.sourceLabel}
                      {image.credit ? ` · ${image.credit}` : ''}
                    </dd>
                  </div>
                </dl>
              </div>

              {image.caption && (
                <div className="border-t border-[var(--terra-border)] pt-3">
                  <p className="font-mono text-xs text-[var(--terra-ink-muted)]">
                    Archive Caption
                  </p>
                  <p className="mt-1 max-h-36 overflow-y-auto text-xs leading-relaxed text-[var(--terra-ink-secondary)]">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-[var(--terra-border)] pt-4">
              <a
                href={image.originalSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-[var(--terra-radius-sm)] bg-[var(--terra-amber)] px-4 text-xs font-semibold text-[#0a0c0f] hover:bg-[var(--terra-amber-hover)] terra-transition"
              >
                <span>Open Original Source</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
