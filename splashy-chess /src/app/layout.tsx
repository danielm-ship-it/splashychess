import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Splashy Chess — AI Chess Analysis',
  description: 'Analyze your chess games with engine precision and AI coaching. Detect blunders, understand openings, and improve faster.',
  keywords: ['chess', 'analysis', 'AI coach', 'Stockfish', 'improve', 'tactics'],
  authors: [{ name: 'Splashy Chess' }],
  openGraph: {
    title: 'Splashy Chess — AI Chess Analysis',
    description: 'Professional AI-powered chess analysis and coaching platform.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
