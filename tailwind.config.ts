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
          base: '#0B0B0D',
          surface1: '#161618',
          surface2: '#1F1F22',
          surface3: '#2A2A2E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E5E5E7',
          tertiary: '#9CA3AF',
          muted: '#6B7280',
        },
        status: {
          success: '#B4E600',           // 라임 그린 (메인 액센트)
          'success-soft': '#2A3D10',
          warning: '#FF8C42',           // 오렌지 (보조 액센트)
          'warning-soft': '#3D2616',
          danger: '#FF5A4A',
          'danger-soft': '#3D211F',
          idle: '#6B7280',
          'idle-soft': '#252529',
        },
        accent: {
          'bg-success': '#1A2810',
          'bg-warning': '#3D2616',
          'bg-danger': '#3D211F',
          'bg-idle': '#1F1F22',
        },
        type: {
          commit: '#5B8DEF',
          'commit-soft': '#1E2A40',
          aspire: '#B57BFF',
          'aspire-soft': '#2A1E40',
        },
        border: {
          subtle: '#2A2A2E',
          default: '#3A3A40',
          strong: '#52525C',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '26px',
        '2xl': '32px',
        '3xl': '40px',
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
        'display-hero': ['64px', { lineHeight: '68px', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display-lg':   ['48px', { lineHeight: '52px', fontWeight: '800', letterSpacing: '-0.02em' }],
        'heading-xl':   ['32px', { lineHeight: '40px', fontWeight: '800', letterSpacing: '-0.01em' }],
        'heading-lg':   ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'heading-md':   ['18px', { lineHeight: '26px', fontWeight: '700' }],
        'body-lg':      ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'body-md':      ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm':      ['13px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md':     ['12px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.06em' }],
        'label-sm':     ['11px', { lineHeight: '14px', fontWeight: '700', letterSpacing: '0.04em' }],
        'caption':      ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
