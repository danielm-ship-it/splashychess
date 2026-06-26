import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';
import type {
  AnnotatedMove, AccuracyStats, Opening, AnalysisStatus,
  SavedGame, NavView,
} from '@/types';
import { detectOpening } from '@/lib/openings';
import { buildAccuracyStats, pgnToFenSequence, extractPgnHeader } from '@/lib/chess-utils';

interface GameState {
  // ── UI ────────────────────────────────────────────────────────
  activeView: NavView;
  setActiveView: (v: NavView) => void;

  // ── Current game ──────────────────────────────────────────────
  pgn: string;
  fens: string[];
  currentIndex: number;         // 0 = starting position
  moves: string[];              // SAN history
  annotatedMoves: AnnotatedMove[];
  opening: Opening | null;
  analysisStatus: AnalysisStatus;
  analysisProgress: number;     // 0–100
  accuracyStats: AccuracyStats | null;
  playerColor: 'white' | 'black' | 'both';
  coachAdvice: string;
  coachLoading: boolean;
  errorMessage: string;

  // ── Saved games ───────────────────────────────────────────────
  savedGames: SavedGame[];

  // ── Actions ───────────────────────────────────────────────────
  loadPgn: (pgn: string) => void;
  goToMove: (index: number) => void;
  goForward: () => void;
  goBackward: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  setAnnotatedMoves: (moves: AnnotatedMove[]) => void;
  setAnalysisStatus: (s: AnalysisStatus, progress?: number) => void;
  setAccuracyStats: (stats: AccuracyStats) => void;
  setCoachAdvice: (text: string) => void;
  setCoachLoading: (v: boolean) => void;
  setErrorMessage: (msg: string) => void;
  setPlayerColor: (c: 'white' | 'black' | 'both') => void;
  saveCurrentGame: () => void;
  deleteSavedGame: (id: string) => void;
  loadSavedGame: (game: SavedGame) => void;
  resetGame: () => void;
}

const EMPTY_CHESS_FEN = new Chess().fen();

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ── UI ──────────────────────────────────────────────────────
      activeView: 'analyze',
      setActiveView: (v) => set({ activeView: v }),

      // ── Current game ────────────────────────────────────────────
      pgn: '',
      fens: [EMPTY_CHESS_FEN],
      currentIndex: 0,
      moves: [],
      annotatedMoves: [],
      opening: null,
      analysisStatus: 'idle',
      analysisProgress: 0,
      accuracyStats: null,
      playerColor: 'both',
      coachAdvice: '',
      coachLoading: false,
      errorMessage: '',

      // ── Saved games ─────────────────────────────────────────────
      savedGames: [],

      // ── Actions ─────────────────────────────────────────────────
      loadPgn: (pgn) => {
        try {
          const chess = new Chess();
          chess.loadPgn(pgn.trim());
          const moves = chess.history();
          const fens = pgnToFenSequence(pgn);
          const opening = detectOpening(moves);

          set({
            pgn: pgn.trim(),
            fens,
            moves,
            currentIndex: fens.length - 1,
            opening,
            annotatedMoves: [],
            accuracyStats: null,
            analysisStatus: 'idle',
            analysisProgress: 0,
            coachAdvice: '',
            errorMessage: '',
          });
        } catch {
          set({ errorMessage: 'Invalid PGN — please check the format and try again.' });
        }
      },

      goToMove: (index) =>
        set({ currentIndex: Math.max(0, Math.min(index, get().fens.length - 1)) }),

      goForward: () => {
        const { currentIndex, fens } = get();
        if (currentIndex < fens.length - 1) set({ currentIndex: currentIndex + 1 });
      },

      goBackward: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) set({ currentIndex: currentIndex - 1 });
      },

      goToStart: () => set({ currentIndex: 0 }),
      goToEnd: () => set({ currentIndex: get().fens.length - 1 }),

      setAnnotatedMoves: (moves) => {
        const stats = buildAccuracyStats(moves);
        set({ annotatedMoves: moves, accuracyStats: stats });
      },

      setAnalysisStatus: (s, progress) =>
        set({ analysisStatus: s, ...(progress !== undefined ? { analysisProgress: progress } : {}) }),

      setAccuracyStats: (stats) => set({ accuracyStats: stats }),
      setCoachAdvice: (text) => set({ coachAdvice: text }),
      setCoachLoading: (v) => set({ coachLoading: v }),
      setErrorMessage: (msg) => set({ errorMessage: msg }),
      setPlayerColor: (c) => set({ playerColor: c }),

      saveCurrentGame: () => {
        const { pgn, annotatedMoves, accuracyStats, opening, savedGames } = get();
        if (!pgn) return;

        const id = `game-${Date.now()}`;
        const game: SavedGame = {
          id,
          pgn,
          date: extractPgnHeader(pgn, 'Date') || new Date().toLocaleDateString(),
          white: extractPgnHeader(pgn, 'White') || 'White',
          black: extractPgnHeader(pgn, 'Black') || 'Black',
          result: extractPgnHeader(pgn, 'Result') || '*',
          opening: opening ?? undefined,
          accuracy: accuracyStats ?? undefined,
          annotatedMoves,
          analysedAt: Date.now(),
        };
        set({ savedGames: [game, ...savedGames.slice(0, 49)] }); // keep max 50
      },

      deleteSavedGame: (id) =>
        set({ savedGames: get().savedGames.filter(g => g.id !== id) }),

      loadSavedGame: (game) => {
        const fens = pgnToFenSequence(game.pgn);
        set({
          pgn: game.pgn,
          fens,
          moves: game.annotatedMoves?.map(m => m.san) ?? [],
          currentIndex: fens.length - 1,
          annotatedMoves: game.annotatedMoves ?? [],
          accuracyStats: game.accuracy ?? null,
          opening: game.opening ?? null,
          analysisStatus: game.annotatedMoves?.length ? 'complete' : 'idle',
          analysisProgress: 100,
          coachAdvice: '',
          errorMessage: '',
          activeView: 'analyze',
        });
      },

      resetGame: () =>
        set({
          pgn: '',
          fens: [EMPTY_CHESS_FEN],
          currentIndex: 0,
          moves: [],
          annotatedMoves: [],
          opening: null,
          analysisStatus: 'idle',
          analysisProgress: 0,
          accuracyStats: null,
          coachAdvice: '',
          errorMessage: '',
        }),
    }),
    {
      name: 'splashy-chess-store',
      partialize: (state) => ({
        savedGames: state.savedGames,
        playerColor: state.playerColor,
      }),
    }
  )
);
