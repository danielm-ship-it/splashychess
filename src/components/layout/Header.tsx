'use client';

import { Menu, Crown } from 'lucide-react';

interface HeaderProps {
  onMenuOpen: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-sage-surface/95 backdrop-blur border-b border-gold-border/30">
      <button
        onClick={onMenuOpen}
        className="p-2 rounded-lg text-cream-muted hover:text-gold-500 hover:bg-gold-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-gold-gradient flex items-center justify-center">
          <Crown size={13} className="text-sage-bg" />
        </div>
        <span className="font-display text-sm font-bold gold-text">Splashy Chess</span>
      </div>
    </header>
  );
}
