import { useEffect, useState } from 'react';
import { ExternalLink, ImageOff } from 'lucide-react';
import type { VerifiedStudyMediaItem } from '../../types/terra';
import { ImageTypeBadge } from './ValueTag';

interface TerrainImageProps {
  item: VerifiedStudyMediaItem | null;
  aspectClass?: string;
  className?: string;
  priority?: boolean;
  onInspect?: (item: VerifiedStudyMediaItem) => void;
}

function formatImageTypeLabel(tag: VerifiedStudyMediaItem['imageTypeTag']): string {
  switch (tag) {
    case 'ground photograph':
      return 'Ground photograph';
    case 'field photograph':
      return 'Field photograph';
    case 'geological outcrop':
      return 'Geological outcrop';
    case 'orbital':
      return 'Orbital imagery';
    case 'aerial':
      return 'Aerial photograph';
    case 'geological map':
      return 'Geological map';
    case 'elevation model':
      return 'Elevation model';
    default:
      return tag;
  }
}

export function TerrainImage({
  item,
  aspectClass,
  className = '',
  priority = false,
  onInspect,
}: TerrainImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [item?.id, item?.imageUrl]);

  const frameAspect = aspectClass ?? item?.aspectClass ?? 'aspect-[16/10]';

  if (!item || hasError) {
    return (
      <figure className={`m-0 ${className}`}>
        <div
          className={`flex w-full flex-col items-center justify-center gap-2.5 rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[#0e1116] p-5 text-center ${frameAspect}`}
        >
          <ImageOff className="h-6 w-6 text-[var(--terra-ink-muted)]" strokeWidth={1.5} />
          <div className="max-w-xs space-y-1">
            <p className="font-mono text-xs font-medium text-[var(--terra-ink)]">
              Verified imagery unavailable
            </p>
            <p className="text-xs text-[var(--terra-ink-muted)]">
              {item
                ? 'The verified source photograph could not be embedded in this session.'
                : 'No verified institutional photograph is linked to this category.'}
            </p>
          </div>
          {item && (
            <a
              href={item.originalSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-amber)] hover:underline"
            >
              <span>Open original source</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
        </div>
      </figure>
    );
  }

  const imageElement = (
    <img
      src={item.imageUrl}
      alt={item.alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setHasError(true)}
      className="h-full w-full object-cover"
    />
  );

  return (
    <figure className={`m-0 space-y-2.5 ${className}`}>
      <div
        className={`relative w-full overflow-hidden rounded-[var(--terra-radius-md)] border border-[var(--terra-border)] bg-[#0e1116] ${frameAspect}`}
      >
        {onInspect ? (
          <button
            type="button"
            onClick={() => onInspect(item)}
            aria-label={`Open full-size verified image: ${item.title}`}
            className="block h-full w-full cursor-pointer"
          >
            {imageElement}
          </button>
        ) : (
          imageElement
        )}

        <div className="pointer-events-none absolute left-2.5 top-2.5">
          <ImageTypeBadge type={item.imageTypeTag} />
        </div>
      </div>

      <figcaption className="space-y-1.5 text-xs leading-relaxed">
        <p className="font-medium text-[var(--terra-ink)]">{item.title}</p>
        <p className="text-[var(--terra-ink-secondary)]">{item.caption}</p>
        <dl className="grid grid-cols-1 gap-0.5 pt-0.5 font-mono text-[11px] text-[var(--terra-ink-muted)]">
          <div>
            <dt className="inline text-[var(--terra-ink-secondary)]">Type: </dt>
            <dd className="inline">{formatImageTypeLabel(item.imageTypeTag)}</dd>
          </div>
          <div>
            <dt className="inline text-[var(--terra-ink-secondary)]">Attribution: </dt>
            <dd className="inline">{item.attribution}</dd>
          </div>
          <div>
            <dt className="inline text-[var(--terra-ink-secondary)]">Date: </dt>
            <dd className="inline">{item.acquisitionDate}</dd>
          </div>
        </dl>
        <a
          href={item.originalSourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-[var(--terra-amber)] hover:underline"
        >
          <span>Source: {item.sourceOrganisation}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      </figcaption>
    </figure>
  );
}
