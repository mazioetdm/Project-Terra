import { Compass } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--terra-radius-lg)] border border-[var(--terra-border)] bg-[var(--terra-surface)] px-6 py-16 text-center">
      <Compass className="h-8 w-8 text-[var(--terra-ink-muted)]" strokeWidth={1.5} />
      <h3 className="mt-4 text-xl font-medium text-[var(--terra-ink)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
