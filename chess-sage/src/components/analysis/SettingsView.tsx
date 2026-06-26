'use client';

import { useState } from 'react';
import { Trash2, Info, ExternalLink } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/Button';

export function SettingsView() {
  const { savedGames, resetGame } = useGameStore();
  const [cleared, setCleared] = useState(false);

  const clearHistory = () => {
    // Access store directly to delete all
    useGameStore.setState({ savedGames: [] });
    resetGame();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h2 className="font-display text-base font-semibold text-cream-DEFAULT mb-4">Settings</h2>

        {/* About */}
        <div className="glass-subtle rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-gold-500 uppercase tracking-wider flex items-center gap-1.5">
            <Info size={12} /> About Splashy Chess
          </h3>
          <div className="space-y-1.5 text-xs text-cream-muted">
            <p>Splashy Chess is an open-source AI chess analysis platform built with:</p>
            <ul className="space-y-1 mt-2">
              {[
                ['Engine', 'Stockfish 16 (WASM, runs in your browser)'],
                ['AI Coach', 'Claude by Anthropic'],
                ['Board', 'react-chessboard + chess.js'],
                ['Framework', 'Next.js 15 + Tailwind CSS'],
                ['Storage', 'localStorage (no server required)'],
              ].map(([k, v]) => (
                <li key={k} className="flex items-start gap-2">
                  <span className="text-gold-700 shrink-0 font-medium w-16">{k}</span>
                  <span className="text-cream-faint">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Data */}
        <div className="glass-subtle rounded-xl p-4 space-y-3 mt-3">
          <h3 className="text-xs font-semibold text-gold-500 uppercase tracking-wider">Data & Storage</h3>
          <p className="text-xs text-cream-muted">
            All game data is stored locally in your browser. No account or server is required.
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-cream-faint">Saved games</span>
            <span className="font-mono text-cream-muted">{savedGames.length}</span>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={13} />}
            onClick={clearHistory}
            disabled={savedGames.length === 0}
            className="w-full"
          >
            {cleared ? '✓ Cleared' : 'Clear All History'}
          </Button>
        </div>

        {/* Links */}
        <div className="glass-subtle rounded-xl p-4 space-y-2 mt-3">
          <h3 className="text-xs font-semibold text-gold-500 uppercase tracking-wider">Resources</h3>
          {[
            ['Anthropic Console', 'https://console.anthropic.com'],
            ['Stockfish Engine', 'https://stockfishchess.org'],
            ['chess.js Library', 'https://github.com/jhlywa/chess.js'],
            ['Deployment (Vercel)', 'https://vercel.com'],
          ].map(([label, url]) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-xs text-cream-muted hover:text-gold-500 transition-colors group"
            >
              {label}
              <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
