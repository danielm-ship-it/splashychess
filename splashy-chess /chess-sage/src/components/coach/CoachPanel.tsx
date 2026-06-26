'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles, User, Users, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/Button';

export function CoachPanel() {
  const {
    pgn, annotatedMoves, opening, accuracyStats,
    coachAdvice, coachLoading, playerColor,
    setCoachAdvice, setCoachLoading, setPlayerColor,
  } = useGameStore();

  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(true);

  const askCoach = async () => {
    if (!pgn) return;
    setCoachLoading(true);
    setError('');
    setCoachAdvice('');

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pgn,
          playerColor,
          annotatedMoves: annotatedMoves.map(m => ({
            san: m.san, classification: m.classification,
            cpLoss: m.cpLoss, moveNumber: m.moveNumber,
            color: m.color, bestMoveSan: m.bestMoveSan,
          })),
          opening,
          accuracyStats,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setCoachAdvice(data.advice ?? '');
    } catch (e) {
      setError('Network error — please try again.');
    } finally {
      setCoachLoading(false);
    }
  };

  if (!pgn) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
        <BrainCircuit size={32} className="text-cream-faint/40" />
        <div>
          <p className="text-sm font-semibold text-cream-muted">No game loaded</p>
          <p className="text-xs text-cream-faint mt-1">Import a PGN to get AI coaching</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold-sm">
          <BrainCircuit size={14} className="text-sage-bg" />
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold text-cream-DEFAULT">AI Coach</h2>
          <p className="text-[10px] text-cream-faint">Powered by Claude</p>
        </div>
      </div>

      {/* Player color selector */}
      <div className="flex gap-2">
        {(['white', 'black', 'both'] as const).map(c => (
          <button
            key={c}
            onClick={() => setPlayerColor(c)}
            className={[
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-100 border',
              playerColor === c
                ? 'bg-gold-muted border-gold-border text-gold-300'
                : 'border-white/5 text-cream-faint hover:text-cream-muted hover:border-white/10',
            ].join(' ')}
          >
            {c === 'both' ? <Users size={12} /> : <User size={12} />}
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Analyze reminder */}
      {annotatedMoves.length === 0 && (
        <div className="text-[11px] text-cream-faint bg-gold-muted/40 border border-gold-border/20 rounded-lg p-2.5">
          💡 Run <strong className="text-gold-500">Analyze Game</strong> first for deeper insights — the coach will use engine evaluations.
        </div>
      )}

      {/* Request coaching */}
      <Button
        variant="gold"
        size="md"
        className="w-full"
        icon={coachLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        onClick={askCoach}
        disabled={coachLoading}
        loading={coachLoading}
      >
        {coachLoading ? 'Thinking…' : coachAdvice ? 'Refresh Advice' : 'Get Coaching'}
      </Button>

      {error && (
        <p className="text-xs text-red-400 bg-red-900/10 border border-red-800/30 rounded-lg p-2.5">
          {error}
        </p>
      )}

      {/* Advice output */}
      <AnimatePresence>
        {coachAdvice && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-subtle rounded-xl overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
              onClick={() => setExpanded(e => !e)}
            >
              <span className="text-xs font-semibold text-gold-500 flex items-center gap-2">
                <Sparkles size={12} /> Coach Feedback
              </span>
              {expanded ? <ChevronUp size={14} className="text-cream-faint" /> : <ChevronDown size={14} className="text-cream-faint" />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 max-h-[60vh] overflow-y-auto">
                    <div
                      className="coach-content text-[12px] text-cream-muted"
                      dangerouslySetInnerHTML={{
                        __html: coachAdvice
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/^#{1,3}\s+(.+)$/gm, '<h3>$1</h3>')
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/\n/g, '<br/>')
                          .replace(/^/, '<p>')
                          .replace(/$/, '</p>'),
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
