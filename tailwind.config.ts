import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0A0A0B',
          surface1: '#141416',
          surface2: '#1C1C1F',
          surface3: '#252529',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E5E5E7',
          tertiary: '#9CA3AF',
          muted: '#6B7280',
        },
        status: {
          success: '#22D37E',
          'success-soft': '#1F3D2D',
          warning: '#F5C043',
          'warning-soft': '#3D3320',
          danger: '#FF5A4A',
          'danger-soft': '#3D211F',
          idle: '#6B7280',
          'idle-soft': '#252529',
        },
        accent: {
          'bg-success': '#1A4030',
          'bg-warning': '#403320',
          'bg-danger': '#4A2520',
          'bg-idle': '#252529',
        },
        type: {
          commit: '#5B8DEF',
          'commit-soft': '#1E2A40',
          aspire: '#B57BFF',
          'aspire-soft': '#2A1E40',
        },
        border: {
          subtle: '#252529',
          default: '#33333A',
          strong: '#4A4A52',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-hero': ['56px', { lineHeight: '64px', fontWeight: '700' }],
        'heading-xl': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'heading-lg': ['22px', { lineHeight: '30px', fontWeight: '600' }],
        'heading-md': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'label-sm': ['11px', { lineHeight: '16px', fontWeight: '600' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
