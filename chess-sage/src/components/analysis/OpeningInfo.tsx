'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export function OpeningInfo() {
  const { opening } = useGameStore();

  if (!opening) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 p-3 glass-subtle rounded-xl"
    >
      <BookOpen size={14} className="text-gold-500 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-gold-700 bg-gold-muted px-1.5 py-0.5 rounded font-semibold">
            {opening.eco}
          </span>
          <span className="text-xs font-semibold text-cream-DEFAULT truncate">
            {opening.name}
          </span>
        </div>
        {opening.variation && (
          <p className="text-[11px] text-cream-muted mt-0.5">{opening.variation}</p>
        )}
      </div>
    </motion.div>
  );
}
