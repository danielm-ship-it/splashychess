'use client';

import type { MoveClass } from '@/types';
import { MOVE_CLASS_META } from '@/lib/chess-utils';

interface BadgeProps {
  classification: MoveClass;
  showSymbol?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function ClassificationBadge({ classification, showSymbol = true, size = 'sm', className = '' }: BadgeProps) {
  const meta = MOVE_CLASS_META[classification];
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-mono font-semibold ${sizeClass} ${className}`}
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      {showSymbol && meta.symbol && <span>{meta.symbol}</span>}
      <span className="font-body font-medium">{meta.label}</span>
    </span>
  );
}

interface DotBadgeProps {
  classification: MoveClass;
  className?: string;
}

export function ClassificationDot({ classification, className = '' }: DotBadgeProps) {
  const meta = MOVE_CLASS_META[classification];
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${className}`}
      style={{ backgroundColor: meta.color }}
      title={meta.label}
    />
  );
}
