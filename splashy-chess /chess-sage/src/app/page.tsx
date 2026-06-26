'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AnalyzeView } from '@/components/analysis/AnalyzeView';
import { CoachPanel } from '@/components/coach/CoachPanel';
import { HistoryView } from '@/components/analysis/HistoryView';
import { SettingsView } from '@/components/analysis/SettingsView';

export default function HomePage() {
  const { activeView } = useGameStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-sage-bg">
      {/* Sidebar */}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <Header onMenuOpen={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          {/* Page title */}
          <div className="mb-6 hidden md:block">
            <div className="flex items-baseline gap-3">
              <h1 className="font-display text-xl font-bold gold-text capitalize">
                {activeView === 'analyze' ? 'Game Analysis' :
                 activeView === 'coach'   ? 'AI Coach' :
                 activeView === 'history' ? 'Game History' : 'Settings'}
              </h1>
              <div className="h-px flex-1 bg-gold-border/30" />
            </div>
            <p className="text-xs text-cream-faint mt-1">
              {activeView === 'analyze' ? 'Import, navigate, and analyze chess games with Stockfish engine strength' :
               activeView === 'coach'   ? 'Get personalized coaching and improvement recommendations from Claude AI' :
               activeView === 'history' ? 'Browse your previously analyzed games' :
               'Configure Splashy Chess preferences'}
            </p>
          </div>

          {/* Views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeView === 'analyze' && <AnalyzeView />}
              {activeView === 'coach' && (
                <div className="max-w-2xl">
                  <div className="glass rounded-2xl p-5">
                    <CoachPanel />
                  </div>
                </div>
              )}
              {activeView === 'history' && <HistoryView />}
              {activeView === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
