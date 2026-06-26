// ── Move classification ─────────────────────────────────────────
export type MoveClass =
  | 'brilliant'   // !! - creative, engine-level move
  | 'best'        // = same as engine's top choice
  | 'excellent'   // very small centipawn loss (< 10 cp)
  | 'good'        // small loss (10–30 cp)
  | 'inaccuracy'  // ?! moderate loss (30–100 cp)
  | 'mistake'     // ?  significant loss (100–250 cp)
  | 'blunder'     // ?? severe loss (250+ cp) or losing material
  | 'miss';       // missed a winning sequence

// ── Engine evaluation ───────────────────────────────────────────
export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;          // centipawns (positive = white winning) or moves to mate
  depth: number;
  bestMove: string;       // UCI notation
  pv: string[];           // principal variation in UCI
}

// ── Annotated move ──────────────────────────────────────────────
export interface AnnotatedMove {
  index: number;
  moveNumber: number;
  color: 'w' | 'b';
  san: string;            // Standard Algebraic Notation e.g. "Nf3"
  uci: string;            // UCI e.g. "g1f3"
  fen: string;            // FEN after this move
  fenBefore: string;      // FEN before this move
  evalBefore?: Evaluation;
  evalAfter?: Evaluation;
  cpLoss?: number;        // centipawn loss compared to best move
  classification?: MoveClass;
  bestMoveSan?: string;
  comment?: string;
}

// ── Opening ─────────────────────────────────────────────────────
export interface Opening {
  eco: string;
  name: string;
  variation?: string;
  pgn: string;
}

// ── Game accuracy stats ─────────────────────────────────────────
export interface AccuracyStats {
  white: PlayerStats;
  black: PlayerStats;
}

export interface PlayerStats {
  accuracy: number;         // 0–100
  brilliant: number;
  best: number;
  excellent: number;
  good: number;
  inaccuracy: number;
  mistake: number;
  blunder: number;
  averageCpLoss: number;
}

// ── Saved game ──────────────────────────────────────────────────
export interface SavedGame {
  id: string;
  pgn: string;
  date: string;
  white?: string;
  black?: string;
  result?: string;
  opening?: Opening;
  accuracy?: AccuracyStats;
  annotatedMoves?: AnnotatedMove[];
  analysedAt: number;     // Unix timestamp
}

// ── Analysis state ──────────────────────────────────────────────
export type AnalysisStatus =
  | 'idle'
  | 'parsing'
  | 'analyzing'       // Stockfish running per-move analysis
  | 'complete'
  | 'error';

// ── Coach request/response ───────────────────────────────────────
export interface CoachRequest {
  pgn: string;
  moveIndex?: number;
  playerColor?: 'white' | 'black' | 'both';
  focusArea?: string;
}

export interface CoachResponse {
  advice: string;
  error?: string;
}

// ── Navigation ──────────────────────────────────────────────────
export type NavView = 'analyze' | 'history' | 'coach' | 'settings';
