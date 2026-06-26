# ♛ Splashy Chess — AI Chess Analysis Platform

A premium, open-source chess analysis platform built with Next.js, Stockfish (WASM), and Claude AI. Analyze games, detect mistakes, understand openings, and get personalized coaching — all free, mostly offline.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Interactive Board** | Navigate moves with keyboard/buttons/scrubber |
| **Stockfish Engine** | Depth-16 analysis runs 100% in your browser (WASM) |
| **Move Classification** | Brilliant · Best · Excellent · Good · Inaccuracy · Mistake · Blunder |
| **Evaluation Bar** | Animated advantage bar with mate detection |
| **Opening Detection** | 100+ ECO codes — identifies opening + variation |
| **Accuracy Score** | Per-player accuracy % + centipawn loss |
| **AI Coach** | Claude explains mistakes and gives personalized training plans |
| **Game History** | Auto-saves analyzed games to localStorage |
| **PGN Import** | Paste text or upload .pgn file |
| **Dark/Gold Theme** | Luxurious black-and-gold premium design |
| **Responsive** | Works on mobile, tablet, and desktop |

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18 or later
- An [Anthropic API key](https://console.anthropic.com) (for AI Coach feature)

### 2. Install

```bash
git clone https://github.com/yourname/chess-sage.git
cd chess-sage
npm install        # also copies stockfish.js to /public automatically
```

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
chess-sage/
├── public/
│   └── stockfish.js          ← copied from node_modules by postinstall
├── scripts/
│   └── copy-stockfish.js     ← postinstall script
├── src/
│   ├── app/
│   │   ├── api/coach/        ← AI Coach API route (Anthropic)
│   │   ├── globals.css       ← design system, fonts, animations
│   │   ├── layout.tsx        ← root layout + metadata
│   │   └── page.tsx          ← main app shell
│   ├── components/
│   │   ├── analysis/         ← AnalyzeView, AccuracyStats, OpeningInfo, HistoryView, SettingsView
│   │   ├── board/            ← ChessBoardPanel, MoveList
│   │   ├── coach/            ← CoachPanel (AI coaching UI)
│   │   ├── import/           ← PgnImporter
│   │   ├── layout/           ← Sidebar, Header
│   │   └── ui/               ← Button, Badge, EvalBar
│   ├── hooks/
│   │   ├── useStockfish.ts   ← Stockfish Web Worker integration
│   │   └── useChessGame.ts   ← full-game analysis orchestration
│   ├── lib/
│   │   ├── chess-utils.ts    ← move classification, accuracy, PGN helpers
│   │   └── openings.ts       ← 100+ ECO opening database
│   ├── store/
│   │   └── gameStore.ts      ← Zustand global state (persisted)
│   └── types/
│       └── index.ts          ← TypeScript interfaces
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── vercel.json
```

---

## 🌐 Deploy to Vercel (Free)

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts, then set environment variable in the Vercel dashboard:

```
ANTHROPIC_API_KEY = sk-ant-your-key-here
```

### Option B — GitHub + Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add `ANTHROPIC_API_KEY` in **Environment Variables**
4. Deploy 🎉

> The Stockfish WASM file is committed to `/public/stockfish.js` by the `postinstall` script, so it deploys automatically.

---

## 🔧 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | **Yes** (for AI Coach) | Get from [console.anthropic.com](https://console.anthropic.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | No | For optional persistent accounts |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | For optional persistent accounts |

Without an Anthropic key, all features work **except** the AI Coach.

---

## 🎮 How to Use

1. **Import a game** — Paste PGN text or upload a `.pgn` file. Click "Try sample" for a Fischer vs Spassky classic.
2. **Navigate** — Use arrow keys, navigation buttons, or the scrubber. The board updates in real time.
3. **Analyze** — Click **Analyze Game**. Stockfish evaluates every position at depth 16 (browser-side, no server needed).
4. **Review** — Mistakes are color-coded. Click any move to see the eval change and best alternative.
5. **AI Coach** — Go to the Coach tab and click **Get Coaching** for personalized advice from Claude.
6. **History** — All analyzed games are auto-saved to your browser's localStorage.

---

## 🏗️ Technical Notes

### Stockfish in the Browser

Stockfish runs as a Web Worker loading `/public/stockfish.js`. The `postinstall` script copies it from `node_modules/stockfish/src/stockfish.js` automatically. No server-side engine is needed.

Analysis depth is set to **16** by default — fast enough for move-by-move analysis of a full game while providing strong evaluations. Adjust `ANALYSIS_DEPTH` in `src/hooks/useChessGame.ts`.

### Move Classification Thresholds

| Class | Centipawn Loss |
|---|---|
| Best | 0 (same as engine) |
| Excellent | ≤ 10 |
| Good | ≤ 30 |
| Inaccuracy | ≤ 100 |
| Mistake | ≤ 250 |
| Blunder | > 250 |

### AI Coach

Calls `POST /api/coach` which uses `claude-opus-4-6` to generate structured coaching feedback. Includes opening identification, accuracy stats, and the top 5 critical moments.

---

## 📄 License

MIT — use freely, modify, and deploy as your own.
