/**
 * Design Tokens for Admin Dashboard
 * Provides consistent styling across all admin components
 */

export const colors = {
  // Status colors
  status: {
    active: '#10b981',      // green-500
    inactive: '#6b7280',    // gray-500
    warning: '#f59e0b',     // amber-500
    error: '#ef4444',       // red-500
    info: '#3b82f6',        // blue-500
  },
  
  // Component states
  component: {
    running: '#10b981',
    stopped: '#ef4444',
    starting: '#f59e0b',
    error: '#dc2626',
  },
  
  // Service states
  service: {
    enabled: '#10b981',
    disabled: '#6b7280',
    pending: '#f59e0b',
  },
  
  // Backgrounds
  bg: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    dark: '#1f2937',
  },
  
  // Borders
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },
  
  // Text
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
};

export const borderRadius = {
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

// Component-specific tokens
export const componentTokens = {
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadow: shadows.md,
  },
  
  badge: {
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
  },
  
  button: {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  transitions,
  componentTokens,
};

