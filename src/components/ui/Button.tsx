import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--terra-amber)] text-[#0A0C0F] font-semibold hover:bg-[var(--terra-amber-hover)] border border-transparent',
  secondary:
    'bg-[var(--terra-sage)] text-[var(--terra-ink)] hover:bg-[#6a9579] border border-transparent',
  outline:
    'bg-[var(--terra-surface-elevated)] text-[var(--terra-ink)] border border-[var(--terra-border-strong)] hover:bg-[var(--terra-surface-hover)]',
  ghost:
    'bg-transparent text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)] hover:bg-[var(--terra-surface-elevated)] border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-xs font-medium',
  md: 'min-h-[42px] px-5 py-2.5 text-sm font-medium',
  lg: 'min-h-[46px] px-6 py-3 text-sm font-medium',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--terra-radius-sm)] whitespace-nowrap shrink-0 cursor-pointer terra-transition disabled:opacity-45 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
