import {
  AlertTriangle,
  Ban,
  Calculator,
  Camera,
  CheckCircle2,
  FlaskConical,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Map as MapIcon,
  MinusCircle,
  Mountain,
  Plane,
  Satellite,
} from 'lucide-react';
import type { ImageTypeTag, ValueStatusTagKind } from '../../types/terra';

interface ValueTagProps {
  kind: ValueStatusTagKind;
  className?: string;
}

export function ValueTag({ kind, className = '' }: ValueTagProps) {
  if (kind === 'measured') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-sage)]/60 bg-[var(--terra-sage-soft)] px-1.5 py-0.5 font-mono text-xs text-[#9bc4a9] whitespace-nowrap ${className}`}
      >
        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>measured</span>
      </span>
    );
  }

  if (kind === 'derived') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[#5ec8e5]/45 bg-[#5ec8e5]/10 px-1.5 py-0.5 font-mono text-xs text-[#5ec8e5] whitespace-nowrap ${className}`}
      >
        <Calculator className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>derived</span>
      </span>
    );
  }

  if (kind === 'demo') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-amber)]/50 bg-[var(--terra-amber-soft)] px-1.5 py-0.5 font-mono text-xs text-[var(--terra-amber-hover)] whitespace-nowrap ${className}`}
      >
        <FlaskConical className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>demo value</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-border-strong)] bg-[var(--terra-bg)] px-1.5 py-0.5 font-mono text-xs text-[var(--terra-ink-muted)] whitespace-nowrap ${className}`}
    >
      <MinusCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>no data</span>
    </span>
  );
}

export function NotScoredBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-border-strong)] bg-[var(--terra-surface-elevated)] px-1.5 py-0.5 font-mono text-xs text-[var(--terra-ink-muted)] whitespace-nowrap ${className}`}
    >
      <Ban className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>not scored</span>
    </span>
  );
}

export function AgreementBadge({
  agreement,
  className = '',
}: {
  agreement: string;
  className?: string;
}) {
  const norm = agreement.toLowerCase();
  if (norm === 'supported') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-sage)]/55 bg-[var(--terra-sage-soft)] px-2 py-0.5 font-mono text-xs text-[#9bc4a9] ${className}`}
      >
        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>supported</span>
      </span>
    );
  }
  if (norm === 'disputed') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-amber)]/55 bg-[var(--terra-amber-soft)] px-2 py-0.5 font-mono text-xs text-[var(--terra-amber-hover)] ${className}`}
      >
        <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>disputed</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-border-strong)] bg-[var(--terra-bg)] px-2 py-0.5 font-mono text-xs text-[var(--terra-ink-secondary)] ${className}`}
    >
      <HelpCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{agreement}</span>
    </span>
  );
}

export function ImageTypeBadge({
  type,
  className = '',
}: {
  type: ImageTypeTag;
  className?: string;
}) {
  if (type === 'ground photograph') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-amber)]/65 bg-[#17110beb] px-1.5 py-0.5 font-mono text-xs text-[var(--terra-amber-hover)] ${className}`}
      >
        <Camera className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>Ground photograph</span>
      </span>
    );
  }
  if (type === 'field photograph') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-amber)]/55 bg-[#17110beb] px-1.5 py-0.5 font-mono text-xs text-[var(--terra-amber-hover)] ${className}`}
      >
        <Camera className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>Field photograph</span>
      </span>
    );
  }
  if (type === 'geological outcrop') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[#e5a85e]/60 bg-[#17120beb] px-1.5 py-0.5 font-mono text-xs text-[#f2c48d] ${className}`}
      >
        <Mountain className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>Geological outcrop</span>
      </span>
    );
  }
  if (type === 'orbital') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-sage)]/60 bg-[#0d1410eb] px-1.5 py-0.5 font-mono text-xs text-[#9bc4a9] ${className}`}
      >
        <Satellite className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>Orbital imagery</span>
      </span>
    );
  }
  if (type === 'aerial') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[#5ec8e5]/50 bg-[#0d1418eb] px-1.5 py-0.5 font-mono text-xs text-[#5ec8e5] ${className}`}
      >
        <Plane className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>Aerial photograph</span>
      </span>
    );
  }
  if (type === 'geological map') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[#5ec8e5]/50 bg-[#0d1418eb] px-1.5 py-0.5 font-mono text-xs text-[#5ec8e5] ${className}`}
      >
        <MapIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>Geological map</span>
      </span>
    );
  }
  if (type === 'elevation model') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-sage)]/60 bg-[#0d1410eb] px-1.5 py-0.5 font-mono text-xs text-[#9bc4a9] ${className}`}
      >
        <Layers className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>Elevation model</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-border-strong)] bg-[#12151aeb] px-1.5 py-0.5 font-mono text-xs text-[var(--terra-ink-secondary)] ${className}`}
    >
      <ImageIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>illustrative</span>
    </span>
  );
}

export function StabilityBadge({
  stable,
  className = '',
}: {
  stable: boolean;
  className?: string;
}) {
  return stable ? (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-sage)]/55 bg-[var(--terra-sage-soft)] px-2 py-0.5 font-mono text-xs text-[#9bc4a9] ${className}`}
    >
      <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>stable</span>
    </span>
  ) : (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] border border-[var(--terra-amber)]/55 bg-[var(--terra-amber-soft)] px-2 py-0.5 font-mono text-xs text-[var(--terra-amber-hover)] ${className}`}
    >
      <Layers className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>unstable</span>
    </span>
  );
}
