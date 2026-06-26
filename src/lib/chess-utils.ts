import { Chess } from 'chess.js';
import type { MoveClass, AnnotatedMove, AccuracyStats, PlayerStats, Evaluation } from '@/types';

// ── Move Classification ─────────────────────────────────────────

export function classifyMove(cpLoss: number, isCheckmate?: boolean): MoveClass {
  if (isCheckmate) return 'brilliant';
  if (cpLoss <= 0)   return 'best';
  if (cpLoss <= 10)  return 'excellent';
  if (cpLoss <= 30)  return 'good';
  if (cpLoss <= 100) return 'inaccuracy';
  if (cpLoss <= 250) return 'mistake';
  return 'blunder';
}

export const MOVE_CLASS_META: Record<
  MoveClass,
  { label: string; symbol: string; color: string; bg: string; description: string }
> = {
  brilliant:  { label: 'Brilliant',  symbol: '!!', color: '#4E9EE8', bg: 'rgba(78,158,232,0.15)', description: 'An exceptional, engine-level move' },
  best:       { label: 'Best',       symbol: '★',  color: '#52B788', bg: 'rgba(82,183,136,0.15)', description: 'The top computer move' },
  excellent:  { label: 'Excellent',  symbol: '✓',  color: '#52B788', bg: 'rgba(82,183,136,0.12)', description: 'Nearly optimal play' },
  good:       { label: 'Good',       symbol: '',   color: '#9A8F7E', bg: 'rgba(154,143,126,0.1)', description: 'A solid move' },
  inaccuracy: { label: 'Inaccuracy', symbol: '?!', color: '#D4BC44', bg: 'rgba(212,188,68,0.15)', description: 'A small mistake — there was a better option' },
  mistake:    { label: 'Mistake',    symbol: '?',  color: '#E07A52', bg: 'rgba(224,122,82,0.15)', description: 'A significant error that hurt your position' },
  blunder:    { label: 'Blunder',    symbol: '??', color: '#E05252', bg: 'rgba(224,82,82,0.15)', description: 'A serious mistake that may lose material or the game' },
  miss:       { label: 'Miss',       symbol: '✗',  color: '#E07A52', bg: 'rgba(224,122,82,0.1)', description: 'Missed a strong opportunity' },
};

// ── Evaluation helpers ──────────────────────────────────────────

/** Normalize evaluation to white's perspective (positive = white winning). */
export function evalFromWhite(evaluation: Evaluation, color: 'w' | 'b'): number {
  if (evaluation.type === 'mate') {
    const mateVal = evaluation.value > 0 ? 10000 : -10000;
    return color === 'b' ? -mateVal : mateVal;
  }
  return color === 'b' ? -evaluation.value : evaluation.value;
}

/** Convert centipawns to a win percentage (0–100) for white. */
export function cpToWinPct(cp: number): number {
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

/** Format evaluation for display: "+1.5", "-0.3", "M5", "M-3" */
export function formatEval(evaluation: Evaluation | undefined, color: 'w' | 'b' = 'w'): string {
  if (!evaluation) return '0.0';
  if (evaluation.type === 'mate') {
    const sign = evaluation.value > 0 ? '' : '-';
    return `M${sign}${Math.abs(evaluation.value)}`;
  }
  const v = evalFromWhite(evaluation, color) / 100;
  return (v >= 0 ? '+' : '') + v.toFixed(2);
}

// ── Accuracy calculation ────────────────────────────────────────

/**
 * Calculate player accuracy (0–100) from a list of annotated moves.
 * Uses the "chess.com-style" formula: accuracy = avg(win% before − win% after clamped to 0).
 */
export function calculateAccuracy(moves: AnnotatedMove[], color: 'w' | 'b'): number {
  const playerMoves = moves.filter(m => m.color === color && m.evalBefore && m.evalAfter);
  if (playerMoves.length === 0) return 100;

  const scores = playerMoves.map(m => {
    const before = cpToWinPct(
      m.evalBefore!.type === 'cp'
        ? evalFromWhite(m.evalBefore!, color === 'w' ? 'w' : 'b')
        : (m.evalBefore!.value > 0 ? (color === 'w' ? 10000 : -10000) : (color === 'w' ? -10000 : 10000))
    );
    const after = cpToWinPct(
      m.evalAfter!.type === 'cp'
        ? evalFromWhite(m.evalAfter!, color === 'w' ? 'w' : 'b')
        : (m.evalAfter!.value > 0 ? (color === 'w' ? 10000 : -10000) : (color === 'w' ? -10000 : 10000))
    );
    // Loss in win percentage, clamped to [0, 100]
    return Math.max(0, before - after);
  });

  const avgLoss = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * avgLoss) - 3.1669));
}

export function buildAccuracyStats(moves: AnnotatedMove[]): AccuracyStats {
  const build = (color: 'w' | 'b'): PlayerStats => {
    const playerMoves = moves.filter(m => m.color === color);
    const classified = playerMoves.filter(m => m.classification);
    const countOf = (cls: MoveClass) => classified.filter(m => m.classification === cls).length;
    const cpLosses = playerMoves.filter(m => m.cpLoss !== undefined).map(m => m.cpLoss!);
    return {
      accuracy: Math.round(calculateAccuracy(moves, color)),
      brilliant:  countOf('brilliant'),
      best:       countOf('best'),
      excellent:  countOf('excellent'),
      good:       countOf('good'),
      inaccuracy: countOf('inaccuracy'),
      mistake:    countOf('mistake'),
      blunder:    countOf('blunder'),
      averageCpLoss: cpLosses.length ? Math.round(cpLosses.reduce((a, b) => a + b, 0) / cpLosses.length) : 0,
    };
  };
  return { white: build('w'), black: build('b') };
}

// ── PGN helpers ─────────────────────────────────────────────────

export function extractPgnHeader(pgn: string, tag: string): string {
  const match = pgn.match(new RegExp(`\\[${tag}\\s+"([^"]*)"\\]`));
  return match ? match[1] : '';
}

export function pgnToMoves(pgn: string): string[] {
  // Strip headers and comments, return list of SAN moves
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
    return chess.history();
  } catch {
    return [];
  }
}

/** Build a sequence of FENs from a PGN. Returns [startFEN, ...fenAfterEachMove]. */
export function pgnToFenSequence(pgn: string): string[] {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch {
    return [new Chess().fen()];
  }
  const history = chess.history({ verbose: true });

  // Replay from start
  const replay = new Chess();
  const fens: string[] = [replay.fen()];
  for (const move of history) {
    replay.move(move);
    fens.push(replay.fen());
  }
  return fens;
}

/** Convert a SAN move to UCI notation given a FEN position. */
export function sanToUci(san: string, fen: string): string {
  try {
    const chess = new Chess(fen);
    const move = chess.move(san);
    return move ? `${move.from}${move.to}${move.promotion ?? ''}` : san;
  } catch {
    return san;
  }
}

/** Get all move data (SAN, UCI, FEN before/after) from PGN. */
export function getVerboseHistory(pgn: string): Array<{
  san: string; uci: string; fenBefore: string; fenAfter: string;
  color: 'w' | 'b'; moveNumber: number;
}> {
  const chess = new Chess();
  try { chess.loadPgn(pgn); } catch { return []; }
  const history = chess.history({ verbose: true });

  const replay = new Chess();
  return history.map((m, i) => {
    const fenBefore = replay.fen();
    const moveNumber = Math.floor(i / 2) + 1;
    const color = m.color as 'w' | 'b';
    replay.move(m);
    const fenAfter = replay.fen();
    const uci = `${m.from}${m.to}${m.promotion ?? ''}`;
    return { san: m.san, uci, fenBefore, fenAfter, color, moveNumber };
  });
}
