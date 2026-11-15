import { useId, useState } from 'react';
import { HelpCircle } from 'lucide-react';

export type GlossaryTermKey = 'aoi' | 'slope' | 'roughness' | 'p5_p95' | 'analogue';

const GLOSSARY_DEFINITIONS: Record<
  GlossaryTermKey,
  { term: string; definition: string }
> = {
  aoi: {
    term: 'Area of Interest (AOI)',
    definition:
      'The bounded ground area (for example a 15 km square or circle around a crater) used to collect terrain statistics instead of relying on a single point.',
  },
  slope: {
    term: 'Slope',
    definition:
      'How steep the ground is in degrees, measured from 30 m elevation models on both the Moon and Earth.',
  },
  roughness: {
    term: 'Roughness',
    definition:
      'How uneven or bumpy the ground is at small scales, calculated as the RMS height residual over matched moving windows.',
  },
  p5_p95: {
    term: 'p5–p95 range',
    definition:
      'The middle 90 percent spread of terrain values inside an AOI, leaving out the lowest 5 percent and highest 5 percent outliers. p50 is the median.',
  },
  analogue: {
    term: 'Analogue',
    definition:
      'An Earth location that shares measurable physical traits with a planetary target, used to test tools and understand limits.',
  },
};

interface InfoTooltipProps {
  termKey: GlossaryTermKey;
  label?: string;
}

export function InfoTooltip({ termKey, label }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const entry = GLOSSARY_DEFINITIONS[termKey];

  return (
    <span
      className="relative inline-flex items-center gap-1 align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {label && <span>{label}</span>}
      <button
        type="button"
        aria-label={`Explain ${entry.term}`}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[var(--terra-ink-muted)] hover:text-[var(--terra-amber)] cursor-help"
      >
        <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 bottom-full z-40 mb-2 w-64 rounded-[var(--terra-radius-sm)] border border-[var(--terra-border-strong)] bg-[#141820] p-2.5 text-left font-sans text-xs font-normal leading-relaxed text-[var(--terra-ink-secondary)] shadow-[var(--terra-shadow-panel)]"
        >
          <span className="block font-medium text-[var(--terra-ink)]">
            {entry.term}
          </span>
          <span className="mt-0.5 block">{entry.definition}</span>
        </span>
      )}
    </span>
  );
}
