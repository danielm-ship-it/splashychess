'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type Variant = 'gold' | 'ghost' | 'danger' | 'subtle';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  gold:   'bg-gold-gradient text-sage-bg font-semibold shadow-gold-sm hover:shadow-gold hover:brightness-110 disabled:opacity-50',
  ghost:  'border border-gold-border text-gold-500 hover:bg-gold-muted hover:text-gold-300 disabled:opacity-40',
  danger: 'border border-red-800/50 text-red-400 hover:bg-red-900/20 disabled:opacity-40',
  subtle: 'text-cream-muted hover:text-cream-DEFAULT hover:bg-white/5 disabled:opacity-40',
};

const SIZES: Record<Size, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-6 text-base gap-2.5 rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'ghost', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={[
        'inline-flex items-center justify-center font-body transition-all duration-150 cursor-pointer select-none',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <span className="spinner w-4 h-4 flex-shrink-0" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
);
Button.displayName = 'Button';
