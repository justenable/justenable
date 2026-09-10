const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');
const t = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    screens: {
      xxxs: '300px',
      xxs: '360px',
      xs: '475px',
      ...defaultTheme.screens, // sm 640, md 768, lg 1024, xl 1280, 2xl 1536
      nav: '1180px', // desktop nav bar; below this the panel takes over
    },
    extend: {
      colors: {
        canvas: t('canvas'),
        surface: t('surface'),
        'surface-raised': t('surface-raised'),
        'accent-soft': t('accent-soft'),
        border: t('border'),
        'border-strong': t('border-strong'),
        ink: t('ink'),
        'ink-muted': t('ink-muted'),
        'ink-subtle': t('ink-subtle'),
        accent: t('accent'),
        'accent-hover': t('accent-hover'),
        'accent-text': t('accent-text'),
        'accent-contrast': t('accent-contrast'),
        focus: t('focus'),
        screen: t('screen'),
      },
      fontFamily: {
        display: ['"Archivo Variable"', '"Archivo Fallback"', '"Arial Narrow"', 'Arial', 'Helvetica', 'sans-serif'],
        sans: ['"IBM Plex Sans Variable"', '"IBM Plex Sans"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.25rem, 1.5rem + 3.5vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-l': ['clamp(1.75rem, 1.2rem + 2.2vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '650' }],
        'heading-m': ['clamp(1.5rem, 1.15rem + 1.5vw, 2.125rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '650' }],
        'heading-s': ['clamp(1.25rem, 1.05rem + 0.8vw, 1.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        lead: ['clamp(1.125rem, 1rem + 0.5vw, 1.25rem)', { lineHeight: '1.55' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-s': ['0.875rem', { lineHeight: '1.5' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '600' }],
        tag: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'mono-value': ['0.9375rem', { lineHeight: '1.5' }],
        'mono-value-l': ['clamp(1.125rem, 1rem + 0.8vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1.4' }],
        button: ['0.9375rem', { lineHeight: '1', letterSpacing: '0.01em', fontWeight: '600' }],
        nav: ['0.9375rem', { lineHeight: '1', fontWeight: '500' }],
      },
      maxWidth: { container: '90rem' },
      borderRadius: { 1: 'var(--radius-1)', 2: 'var(--radius-2)' },
      boxShadow: { popover: 'var(--shadow-popover)', header: 'var(--shadow-header)' },
      transitionDuration: { 1: 'var(--dur-1)', 2: 'var(--dur-2)', reveal: 'var(--dur-reveal)' },
      transitionTimingFunction: { out: 'var(--ease-out)', std: 'var(--ease-std)' },
      zIndex: {
        panel: 'var(--z-panel)',
        header: 'var(--z-header)',
        popover: 'var(--z-popover)',
        skip: 'var(--z-skip)',
      },
    },
  },
  plugins: [
    // Archivo's width axis is exposed by fontsource as font-stretch (62% to 125%).
    // Drive it with font-stretch, never font-variation-settings.
    plugin(({ addUtilities }) =>
      addUtilities({
        '.stretch-75': { fontStretch: '75%' },
        '.stretch-85': { fontStretch: '85%' },
        '.stretch-100': { fontStretch: '100%' },
        '.stretch-112': { fontStretch: '112%' },
      })
    ),
  ],
};
