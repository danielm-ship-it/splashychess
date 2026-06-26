import type { Opening } from '@/types';

// Curated list of the most common chess openings with ECO codes.
// Matched by checking if PGN move-list starts with the opening's moves.
const OPENINGS: Opening[] = [
  // A-series: Flank openings
  { eco: 'A00', name: "Polish Opening",            pgn: '1. b4' },
  { eco: 'A01', name: "Nimzo-Larsen Attack",       pgn: '1. b3' },
  { eco: 'A02', name: "Bird's Opening",            pgn: '1. f4' },
  { eco: 'A04', name: "Réti Opening",              pgn: '1. Nf3' },
  { eco: 'A05', name: "Réti Opening",      variation:'King\'s Indian Attack', pgn: '1. Nf3 Nf6' },
  { eco: 'A10', name: "English Opening",           pgn: '1. c4' },
  { eco: 'A15', name: "English Opening",   variation:'Anglo-Indian Defense', pgn: '1. c4 Nf6' },
  { eco: 'A20', name: "English Opening",   variation:'King\'s English Variation', pgn: '1. c4 e5' },
  { eco: 'A30', name: "English Opening",   variation:'Symmetrical', pgn: '1. c4 c5' },
  { eco: 'A40', name: "Queen's Pawn Opening",      pgn: '1. d4 e6' },
  { eco: 'A45', name: "Indian Defense",            pgn: '1. d4 Nf6' },
  { eco: 'A46', name: "Indian Defense",    variation:'London System', pgn: '1. d4 Nf6 2. Nf3' },
  { eco: 'A48', name: "London System",             pgn: '1. d4 Nf6 2. Nf3 g6' },
  { eco: 'A50', name: "Indian Defense",   variation:'Old Indian', pgn: '1. d4 Nf6 2. c4 d6' },
  { eco: 'A51', name: "Budapest Gambit",           pgn: '1. d4 Nf6 2. c4 e5' },
  { eco: 'A57', name: "Benko Gambit",              pgn: '1. d4 Nf6 2. c4 c5 3. d5 b5' },
  { eco: 'A60', name: "Benoni Defense",            pgn: '1. d4 Nf6 2. c4 c5 3. d5 e6' },
  { eco: 'A80', name: "Dutch Defense",             pgn: '1. d4 f5' },
  { eco: 'A84', name: "Dutch Defense",    variation:'Stonewall', pgn: '1. d4 f5 2. c4 Nf6 3. Nc3 e6' },
  // D-series: Closed games
  { eco: 'D00', name: "Queen's Pawn Game",         pgn: '1. d4 d5' },
  { eco: 'D02', name: "London System",             pgn: '1. d4 d5 2. Nf3 Nf6 3. Bf4' },
  { eco: 'D06', name: "Queen's Gambit",            pgn: '1. d4 d5 2. c4' },
  { eco: 'D10', name: "Slav Defense",              pgn: '1. d4 d5 2. c4 c6' },
  { eco: 'D20', name: "Queen's Gambit Accepted",   pgn: '1. d4 d5 2. c4 dxc4' },
  { eco: 'D30', name: "Queen's Gambit Declined",   pgn: '1. d4 d5 2. c4 e6' },
  { eco: 'D35', name: "Queen's Gambit Declined",  variation:'Exchange Variation', pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5' },
  { eco: 'D37', name: "Queen's Gambit Declined",  variation:'Classical', pgn: '1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Be7 5. Bf4' },
  { eco: 'D43', name: "Semi-Slav Defense",         pgn: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6' },
  { eco: 'D44', name: "Semi-Slav Defense",        variation:'Anti-Moscow', pgn: '1. d4 d5 2. c4 c6 3. Nc3 Nf6 4. Nf3 e6 5. Bg5 dxc4' },
  { eco: 'D50', name: "Queen's Gambit Declined",  variation:'With Bg5', pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5' },
  { eco: 'D70', name: "Neo-Grünfeld Defense",      pgn: '1. d4 Nf6 2. c4 g6 3. f3 d5' },
  { eco: 'D80', name: "Grünfeld Defense",          pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 d5' },
  { eco: 'D85', name: "Grünfeld Defense",         variation:'Exchange', pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4' },
  // E-series: Indian defenses
  { eco: 'E00', name: "Catalan Opening",           pgn: '1. d4 Nf6 2. c4 e6 3. g3' },
  { eco: 'E10', name: "Queen's Indian Defense",   variation:'Blumenfeld Gambit', pgn: '1. d4 Nf6 2. c4 e6 3. Nf3 c5 4. d5 b5' },
  { eco: 'E12', name: "Queen's Indian Defense",    pgn: '1. d4 Nf6 2. c4 e6 3. Nf3 b6' },
  { eco: 'E20', name: "Nimzo-Indian Defense",      pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4' },
  { eco: 'E21', name: "Nimzo-Indian Defense",     variation:'Three Knights', pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3' },
  { eco: 'E32', name: "Nimzo-Indian Defense",     variation:'Classical', pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2' },
  { eco: 'E40', name: "Nimzo-Indian Defense",     variation:'4. e3', pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3' },
  { eco: 'E60', name: "King's Indian Defense",     pgn: '1. d4 Nf6 2. c4 g6' },
  { eco: 'E62', name: "King's Indian Defense",    variation:'Fianchetto', pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. Nf3 d6 5. g3' },
  { eco: 'E70', name: "King's Indian Defense",    variation:'Averbakh', pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Be2 O-O 6. Bg5' },
  { eco: 'E80', name: "King's Indian Defense",    variation:'Sämisch', pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f3' },
  { eco: 'E90', name: "King's Indian Defense",    variation:'Classical', pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3' },
  { eco: 'E97', name: "King's Indian Defense",    variation:'Mar del Plata', pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. Ne1 Nd7' },
  // B-series: Semi-open games
  { eco: 'B00', name: "King's Pawn Opening",       pgn: '1. e4' },
  { eco: 'B01', name: "Scandinavian Defense",      pgn: '1. e4 d5' },
  { eco: 'B02', name: "Alekhine's Defense",        pgn: '1. e4 Nf6' },
  { eco: 'B06', name: "Modern Defense",            pgn: '1. e4 g6' },
  { eco: 'B07', name: "Pirc Defense",              pgn: '1. e4 d6 2. d4 Nf6' },
  { eco: 'B10', name: "Caro-Kann Defense",         pgn: '1. e4 c6' },
  { eco: 'B12', name: "Caro-Kann Defense",        variation:'Advance Variation', pgn: '1. e4 c6 2. d4 d5 3. e5' },
  { eco: 'B13', name: "Caro-Kann Defense",        variation:'Exchange', pgn: '1. e4 c6 2. d4 d5 3. exd5 cxd5' },
  { eco: 'B14', name: "Caro-Kann Defense",        variation:'Panov Attack', pgn: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4' },
  { eco: 'B17', name: "Caro-Kann Defense",        variation:'Steinitz', pgn: '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nd7' },
  { eco: 'B20', name: "Sicilian Defense",          pgn: '1. e4 c5' },
  { eco: 'B21', name: "Sicilian Defense",         variation:'Smith-Morra Gambit', pgn: '1. e4 c5 2. d4 cxd4 3. c3' },
  { eco: 'B22', name: "Sicilian Defense",         variation:'Alapin', pgn: '1. e4 c5 2. c3' },
  { eco: 'B23', name: "Sicilian Defense",         variation:'Closed', pgn: '1. e4 c5 2. Nc3' },
  { eco: 'B30', name: "Sicilian Defense",         variation:'Old Sicilian', pgn: '1. e4 c5 2. Nf3 Nc6' },
  { eco: 'B31', name: "Sicilian Defense",         variation:'Nimzowitsch-Rossolimo', pgn: '1. e4 c5 2. Nf3 Nc6 3. Bb5' },
  { eco: 'B32', name: "Sicilian Defense",         variation:'Open, 2.Nf3 Nc6', pgn: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4' },
  { eco: 'B40', name: "Sicilian Defense",         variation:'2.Nf3 e6', pgn: '1. e4 c5 2. Nf3 e6' },
  { eco: 'B43', name: "Sicilian Defense",         variation:'Kan', pgn: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6' },
  { eco: 'B44', name: "Sicilian Defense",         variation:'Taimanov', pgn: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6' },
  { eco: 'B50', name: "Sicilian Defense",         variation:'2.Nf3 d6', pgn: '1. e4 c5 2. Nf3 d6' },
  { eco: 'B51', name: "Sicilian Defense",         variation:'Moscow', pgn: '1. e4 c5 2. Nf3 d6 3. Bb5+' },
  { eco: 'B54', name: "Sicilian Defense",         variation:'Dragon/Scheveningen', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3' },
  { eco: 'B56', name: "Sicilian Defense",         variation:'Classical', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6' },
  { eco: 'B57', name: "Sicilian Defense",         variation:'Sozin', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bc4' },
  { eco: 'B60', name: "Sicilian Defense",         variation:'Richter-Rauzer', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5' },
  { eco: 'B70', name: "Sicilian Defense",         variation:'Dragon', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6' },
  { eco: 'B72', name: "Sicilian Defense",         variation:'Dragon, Classical', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3' },
  { eco: 'B78', name: "Sicilian Defense",         variation:'Dragon, Yugoslav Attack', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2' },
  { eco: 'B80', name: "Sicilian Defense",         variation:'Scheveningen', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6' },
  { eco: 'B84', name: "Sicilian Defense",         variation:'Scheveningen, Classical', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6 6. Be2 a6' },
  { eco: 'B86', name: "Sicilian Defense",         variation:'Sozin Attack', pgn: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6 6. Bc4' },
  { eco: 'B90', name: "Sicilian Defense",         variation:'Najdorf', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6' },
  { eco: 'B92', name: "Sicilian Defense",         variation:'Najdorf, 6.Be2', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2' },
  { eco: 'B96', name: "Sicilian Defense",         variation:'Najdorf, Poisoned Pawn', pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Qb6' },
  // C-series: Open games
  { eco: 'C00', name: "French Defense",            pgn: '1. e4 e6' },
  { eco: 'C01', name: "French Defense",           variation:'Exchange', pgn: '1. e4 e6 2. d4 d5 3. exd5 exd5' },
  { eco: 'C02', name: "French Defense",           variation:'Advance', pgn: '1. e4 e6 2. d4 d5 3. e5' },
  { eco: 'C05', name: "French Defense",           variation:'Tarrasch', pgn: '1. e4 e6 2. d4 d5 3. Nd2' },
  { eco: 'C10', name: "French Defense",           variation:'Rubinstein', pgn: '1. e4 e6 2. d4 d5 3. Nc3 dxe4' },
  { eco: 'C11', name: "French Defense",           variation:'Classical', pgn: '1. e4 e6 2. d4 d5 3. Nc3 Nf6' },
  { eco: 'C16', name: "French Defense",           variation:'Winawer', pgn: '1. e4 e6 2. d4 d5 3. Nc3 Bb4' },
  { eco: 'C20', name: "King's Pawn Game",          pgn: '1. e4 e5' },
  { eco: 'C21', name: "King's Gambit",             pgn: '1. e4 e5 2. f4' },
  { eco: 'C22', name: "Center Game",               pgn: '1. e4 e5 2. d4 exd4 3. Qxd4' },
  { eco: 'C24', name: "Bishop's Opening",          pgn: '1. e4 e5 2. Bc4' },
  { eco: 'C25', name: "Vienna Game",               pgn: '1. e4 e5 2. Nc3' },
  { eco: 'C30', name: "King's Gambit Declined",    pgn: '1. e4 e5 2. f4 Bc5' },
  { eco: 'C40', name: "King's Knight Opening",     pgn: '1. e4 e5 2. Nf3' },
  { eco: 'C41', name: "Philidor Defense",          pgn: '1. e4 e5 2. Nf3 d6' },
  { eco: 'C42', name: "Petrov's Defense",          pgn: '1. e4 e5 2. Nf3 Nf6' },
  { eco: 'C44', name: "King's Pawn Game",         variation:'Scotch', pgn: '1. e4 e5 2. Nf3 Nc6 3. d4' },
  { eco: 'C45', name: "Scotch Game",               pgn: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4' },
  { eco: 'C46', name: "Three Knights Game",        pgn: '1. e4 e5 2. Nf3 Nc6 3. Nc3' },
  { eco: 'C47', name: "Four Knights Game",         pgn: '1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6' },
  { eco: 'C50', name: "Italian Game",              pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4' },
  { eco: 'C51', name: "Evans Gambit",              pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4' },
  { eco: 'C54', name: "Italian Game",             variation:'Giuoco Piano', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3' },
  { eco: 'C55', name: "Two Knights Defense",       pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6' },
  { eco: 'C57', name: "Two Knights Defense",      variation:'Fried Liver Attack', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7' },
  { eco: 'C60', name: "Ruy Lopez",                 pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5' },
  { eco: 'C65', name: "Ruy Lopez",                variation:'Berlin Defense', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6' },
  { eco: 'C68', name: "Ruy Lopez",                variation:'Exchange', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6' },
  { eco: 'C70', name: "Ruy Lopez",                variation:'Morphy Defense', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6' },
  { eco: 'C72', name: "Ruy Lopez",                variation:'Modern Steinitz Defense', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 d6' },
  { eco: 'C78', name: "Ruy Lopez",                variation:'Archangel', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O b5 6. Bb3 Bc5' },
  { eco: 'C80', name: "Ruy Lopez",                variation:'Open Defense', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4' },
  { eco: 'C84', name: "Ruy Lopez",                variation:'Closed Defense', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6' },
  { eco: 'C92', name: "Ruy Lopez",                variation:'Closed, Flohr-Zaitsev', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Bb7' },
  { eco: 'C97', name: "Ruy Lopez",                variation:'Chigorin Defense', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4' },
];

/**
 * Detect the opening played in a game.
 * Matches the longest opening sequence found at the start of the game's PGN moves.
 */
export function detectOpening(moves: string[]): Opening | null {
  // Build a simplified move string from the history
  const movesStr = moves.join(' ');
  
  let best: Opening | null = null;
  let bestLen = 0;

  for (const opening of OPENINGS) {
    // Strip move numbers from opening PGN for comparison
    const openingMoves = opening.pgn
      .replace(/\d+\.\s*/g, '')
      .trim()
      .split(/\s+/);

    // Check if game starts with these moves
    if (openingMoves.length > bestLen) {
      const matches = openingMoves.every((m, i) => moves[i] === m);
      if (matches) {
        best = opening;
        bestLen = openingMoves.length;
      }
    }
  }

  return best;
}

export { OPENINGS };
