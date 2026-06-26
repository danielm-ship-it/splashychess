'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, History, Swords, Settings, X, Crown } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { NavView } from '@/types';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'analyze', label: 'Analyze',  icon: <Swords size={18} /> },
  { id: 'coach',   label: 'AI Coach', icon: <BrainCircuit size={18} /> },
  { id: 'history', label: 'History',  icon: <History size={18} /> },
  { id: 'settings',label: 'Settings', icon: <Settings size={18} /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { activeView, setActiveView } = useGameStore();

  const handleNav = (id: NavView) => {
    setActiveView(id);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar-overlay md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        className={[
          'fixed md:relative z-50 md:z-auto',
          'flex flex-col w-60 md:w-56 h-full min-h-screen',
          'bg-sage-surface border-r border-gold-border/40',
          'transition-transform md:transform-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-gold-border/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold-sm">
              <Crown size={16} className="text-sage-bg" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold gold-text leading-none">Splashy Chess</h1>
              <p className="text-[9px] text-cream-faint tracking-widest uppercase mt-0.5">AI Analysis</p>
            </div>
          </div>
          <button
            className="md:hidden text-cream-muted hover:text-cream-DEFAULT p-1"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNav(item.id)}
                whileTap={{ scale: 0.98 }}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-gold-muted text-gold-300 shadow-gold-sm'
                    : 'text-cream-muted hover:text-cream-DEFAULT hover:bg-white/5',
                ].join(' ')}
              >
                <span className={isActive ? 'text-gold-500' : 'text-cream-faint'}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="ml-auto w-1 h-4 rounded-full bg-gold-500"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gold-border/20">
          <p className="text-[10px] text-cream-faint text-center">
            Powered by Stockfish 16 & Claude
          </p>
        </div>
      </motion.aside>
    </>
  );
}
