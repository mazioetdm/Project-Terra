import { Fragment } from 'react';

interface MetadataLineProps {
  items: (string | undefined | null)[];
  mono?: boolean;
  className?: string;
}

export function MetadataLine({ items, mono = false, className = '' }: MetadataLineProps) {
  const filtered = items.filter((item): item is string => Boolean(item && item.trim()));

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--terra-ink-muted)] ${
        mono ? 'font-mono tabular-nums' : ''
      } ${className}`}
    >
      {filtered.map((item, idx) => (
        <Fragment key={`${item}-${idx}`}>
          {idx > 0 && (
            <span aria-hidden="true" className="text-[var(--terra-border-strong)] select-none">
              ·
            </span>
          )}
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}
