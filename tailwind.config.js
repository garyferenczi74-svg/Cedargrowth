/*
  CedarGrowth Organics, Tailwind theme.
  Token names mirror tokens.css exactly and are canonical. Do not rename.

  The color palette fully replaces the Tailwind default so no off palette or
  literal color can survive in a route. Colors read their channels from the
  CSS variables in tokens.css, which keeps a single source of truth and lets
  every utility take an alpha modifier, for example bg-parchment/60.
*/

/** @type {import('tailwindcss').Config} */

const rgb = (token) => `rgb(var(${token}) / <alpha-value>)`;

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Full replace, not extend. The only colors that exist are CedarGrowth tokens.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',

      // Surface and ink
      parchment: rgb('--surface-parchment'),
      bone: rgb('--surface-bone'),
      clinical: rgb('--surface-clinical'),
      ink: rgb('--surface-ink'),

      // Text
      primary: rgb('--text-primary'),
      secondary: rgb('--text-secondary'),
      tertiary: rgb('--text-tertiary'),
      inverse: rgb('--text-inverse'),

      // Lines and hairlines
      hairline: rgb('--line-hairline'),
      'hairline-inverse': rgb('--line-hairline-inverse'),

      // Accent and signal. One accent, cedar, capped at four uses per screen.
      cedar: rgb('--accent-cedar'),
      verdant: rgb('--accent-verdant'),
      pass: rgb('--signal-pass'),
      attention: rgb('--signal-attention'),
      fail: rgb('--signal-fail'),

      // Wellness line pigments, marker rule or tinted plate only
      rest: rgb('--line-rest'),
      relief: rgb('--line-relief'),
      focus: rgb('--line-focus'),
      calm: rgb('--line-calm'),
      restore: rgb('--line-restore'),
    },

    // Square geometry. Everything is rounded-none, chip is the only exception.
    borderRadius: {
      none: 'var(--radius-none)',
      DEFAULT: 'var(--radius-none)',
      chip: 'var(--radius-chip)',
    },

    // Families are loaded by next/font in the root layout, which sets the
    // --font-* variables. The literal fallbacks keep raw CSS and pre hydration
    // paint sane.
    fontFamily: {
      display: ['var(--font-newsreader)', 'Georgia', 'Times New Roman', 'serif'],
      sans: ['var(--font-inter-tight)', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },

    /*
      Type scale from Section 4.2. Desktop is the base key, mobile carries the
      -m suffix, so a component reads text-display-xl-m md:text-display-xl.
      Tabular numerals are enabled on data styles through fontVariantNumeric
      in the component layer, not here.
    */
    fontSize: {
      'display-xl': ['76px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      'display-xl-m': ['40px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      'display-l': ['56px', { lineHeight: '1.10', letterSpacing: '-0.015em' }],
      'display-l-m': ['32px', { lineHeight: '1.10', letterSpacing: '-0.015em' }],
      'heading-m': ['34px', { lineHeight: '1.20', letterSpacing: '-0.01em' }],
      'heading-m-m': ['26px', { lineHeight: '1.20', letterSpacing: '-0.01em' }],
      'heading-s': ['20px', { lineHeight: '1.35', letterSpacing: '0' }],
      'heading-s-m': ['18px', { lineHeight: '1.35', letterSpacing: '0' }],
      'body-l': ['18px', { lineHeight: '1.65', letterSpacing: '0' }],
      'body-l-m': ['17px', { lineHeight: '1.65', letterSpacing: '0' }],
      'body-m': ['16px', { lineHeight: '1.65', letterSpacing: '0' }],
      'body-m-m': ['15px', { lineHeight: '1.65', letterSpacing: '0' }],
      eyebrow: ['12px', { lineHeight: '1.20', letterSpacing: '0.14em' }],
      'eyebrow-m': ['11px', { lineHeight: '1.20', letterSpacing: '0.14em' }],
      caption: ['13px', { lineHeight: '1.45', letterSpacing: '0.01em' }],
      'caption-m': ['12px', { lineHeight: '1.45', letterSpacing: '0.01em' }],
      specimen: ['12px', { lineHeight: '1.40', letterSpacing: '0.04em' }],
      'specimen-m': ['11px', { lineHeight: '1.40', letterSpacing: '0.04em' }],
      data: ['15px', { lineHeight: '1.30', letterSpacing: '0' }],
      'data-m': ['14px', { lineHeight: '1.30', letterSpacing: '0' }],
    },

    extend: {
      // Base 8 spacing ramp from Section 4.3. Default numeric scale already
      // covers 8 through 160, these fill the named gaps and the 200 step.
      spacing: {
        section: '200px',
        'page-margin': 'var(--page-margin)',
        'page-margin-mobile': 'var(--page-margin-mobile)',
        gutter: 'var(--gutter)',
        'gutter-mobile': 'var(--gutter-mobile)',
      },

      maxWidth: {
        content: 'var(--max-content)',
        editorial: 'var(--max-editorial)',
      },

      borderWidth: {
        hairline: '1px',
      },

      transitionTimingFunction: {
        cedar: 'var(--ease-cedar)',
      },

      transitionDuration: {
        reveal: '500ms',
        image: '900ms',
        hover: '240ms',
        page: '240ms',
        reduced: '120ms',
      },

      outlineWidth: {
        focus: 'var(--focus-ring-width)',
      },

      outlineOffset: {
        focus: 'var(--focus-ring-offset)',
      },

      keyframes: {
        // Reveal, opacity 0 to 1 plus a 16px rise, played once.
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Imagery settles from scale 1.06 to 1.0 on first reveal only.
        'image-settle': {
          '0%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
      },

      animation: {
        reveal: 'reveal 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'image-settle': 'image-settle 900ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
