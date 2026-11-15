import type { ReactNode } from 'react';

interface SurfacePanelProps {
  id?: string;
  children: ReactNode;
  tone?: 'base' | 'elevated';
  className?: string;
}

export function SurfacePanel({
  id,
  children,
  tone = 'base',
  className = '',
}: SurfacePanelProps) {
  const toneClass =
    tone === 'elevated'
      ? 'bg-[var(--terra-surface-elevated)] border-[var(--terra-border-strong)] shadow-[var(--terra-shadow-panel)]'
      : 'bg-[var(--terra-surface)] border-[var(--terra-border)] shadow-sm';

  return (
    <div
      id={id}
      className={`rounded-2xl border ${toneClass} terra-transition ${className}`}
    >
      {children}
    </div>
  );
}
