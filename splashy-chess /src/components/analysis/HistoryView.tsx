'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, BookOpen, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/Button';

export function HistoryView() {
  const { savedGames, deleteSavedGame, loadSavedGame } = useGameStore();

  if (savedGames.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
        <History size={36} className="text-cream-faint/30" />
        <div>
          <p className="text-sm font-semibold text-cream-muted">No saved games</p>
          <p className="text-xs text-cream-faint mt-1">
            Analyze a game and it will be saved automatically
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-cream-DEFAULT">Game History</h2>
        <span className="text-xs text-cream-faint">{savedGames.length} saved</span>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {savedGames.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: i * 0.03 }}
              className="glass-subtle rounded-xl p-3 group hover:border-gold-border/40 transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Players & result */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-cream-DEFAULT">
                    <span className="truncate">{game.white ?? 'White'}</span>
                    <span className="text-cream-faint text-[10px] font-mono shrink-0">
                      {game.result ?? '*'}
                    </span>
                    <span className="truncate">{game.black ?? 'Black'}</span>
                  </div>

                  {/* Opening */}
                  {game.opening && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <BookOpen size={10} className="text-gold-700 shrink-0" />
                      <span className="text-[10px] text-cream-faint truncate">
                        {game.opening.eco} · {game.opening.name}
                        {game.opening.variation ? `, ${game.opening.variation}` : ''}
                      </span>
                    </div>
                  )}

                  {/* Accuracy */}
                  {game.accuracy && (
                    <div className="flex items-center gap-3 mt-1.5">
                      <AccChip label="W" pct={game.accuracy.white.accuracy} />
                      <AccChip label="B" pct={game.accuracy.black.accuracy} />
                      <span className="text-[9px] text-cream-faint">{game.date}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => loadSavedGame(game)}
                    title="Load game"
                    className="!px-2"
                  >
                    <ChevronRight size={13} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteSavedGame(game.id)}
                    title="Delete"
                    className="!px-2"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AccChip({ label, pct }: { label: string; pct: number }) {
  const color = pct >= 80 ? '#52B788' : pct >= 60 ? '#D4BC44' : '#E05252';
  return (
    <span className="text-[10px] font-mono font-semibold" style={{ color }}>
      {label}: {pct}%
    </span>
  );
}
