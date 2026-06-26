'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ClipboardPaste, FileText, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/ui/Button';

const SAMPLE_PGN = `[Event "World Chess Championship"]
[Site "Reykjavik, Iceland"]
[Date "1972.07.23"]
[White "Spassky, Boris V"]
[Black "Fischer, Robert J"]
[Result "0-1"]
[ECO "D59"]

1. d4 Nf6 2. c4 e6 3. Nc3 d5 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 0-1`;

export function PgnImporter() {
  const { loadPgn, errorMessage, setErrorMessage } = useGameStore();
  const [text, setText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLoad = useCallback(() => {
    const pgn = text.trim();
    if (!pgn) { setErrorMessage('Please paste a PGN first.'); return; }
    setErrorMessage('');
    loadPgn(pgn);
  }, [text, loadPgn, setErrorMessage]);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.pgn') && file.type !== 'application/x-chess-pgn') {
      setErrorMessage('Please upload a .pgn file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      loadPgn(content);
    };
    reader.readAsText(file);
  }, [loadPgn, setErrorMessage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const loadSample = () => {
    setText(SAMPLE_PGN);
    setShowSample(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-cream-DEFAULT tracking-wide">
          Import Game
        </h2>
        <button
          onClick={() => setShowSample(s => !s)}
          className="flex items-center gap-1 text-xs text-cream-muted hover:text-gold-500 transition-colors"
        >
          Try sample {showSample ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Sample preview */}
      <AnimatePresence>
        {showSample && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-subtle p-3 rounded-lg">
              <p className="text-xs text-cream-muted mb-2">Fischer vs Spassky, 1972 World Championship</p>
              <pre className="text-[10px] text-cream-faint font-mono leading-relaxed overflow-hidden max-h-20 line-clamp-4">
                {SAMPLE_PGN.slice(0, 200)}…
              </pre>
              <Button variant="gold" size="sm" className="mt-2 w-full" onClick={loadSample}>
                Load This Game
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Paste PGN here…\n\n[Event "My Game"]\n[White "Player1"]\n[Black "Player2"]\n\n1. e4 e5 2. Nf3 Nc6 …`}
          className="w-full h-44 bg-sage-elevated border border-gold-border/30 rounded-xl p-3 text-xs font-mono text-cream-DEFAULT placeholder:text-cream-faint/50 resize-none focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-all duration-150 scrollbar-thin"
          spellCheck={false}
        />
        {text && (
          <button
            onClick={() => setText('')}
            className="absolute top-2 right-2 text-cream-faint hover:text-cream-muted transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400 flex items-center gap-1.5"
          >
            <X size={12} /> {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="gold" size="md" className="flex-1" icon={<ClipboardPaste size={15} />} onClick={handleLoad}>
          Load PGN
        </Button>
        <Button
          variant="ghost"
          size="md"
          icon={<Upload size={15} />}
          onClick={() => fileRef.current?.click()}
          title="Upload .pgn file"
        >
          File
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".pgn"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={[
          'flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed transition-all duration-150 text-xs cursor-pointer',
          dragging
            ? 'border-gold-500 bg-gold-muted text-gold-500'
            : 'border-gold-border/30 text-cream-faint hover:border-gold-border hover:text-cream-muted',
        ].join(' ')}
        onClick={() => fileRef.current?.click()}
      >
        <FileText size={13} />
        Drop a .pgn file here
      </div>
    </div>
  );
}
