/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gaming: {
          bg:           '#070B14',
          surface:      '#0A1628',
          card:         '#0F1F35',
          'card-hover': '#162840',
          border:       '#1E3A5F',
          'border-light':'#2D5080',
          purple:       '#8B5CF6',
          'purple-dark':'#7C3AED',
          'purple-light':'#A78BFA',
          cyan:         '#06B6D4',
          'cyan-light': '#22D3EE',
          neon:         '#00FFB3',
          gold:         '#FBBF24',
          red:          '#EF4444',
          green:        '#10B981',
          text: {
            primary:   '#F8FAFC',
            secondary: '#94A3B8',
            muted:     '#475569',
          },
        },
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'neon-gradient':   'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 50%, #00FFB3 100%)',
        'purple-gradient': 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
        'cyan-gradient':   'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)',
        'card-gradient':   'linear-gradient(135deg, #0F1F35 0%, #0A1628 100%)',
        'hero-gradient':   'radial-gradient(ellipse at 60% 50%, #1a0a3d 0%, #070B14 60%)',
      },
      boxShadow: {
        gaming:        '0 4px 24px rgba(0,0,0,0.5)',
        'gaming-lg':   '0 8px 40px rgba(0,0,0,0.7)',
        'purple-glow': '0 0 30px rgba(139,92,246,0.45)',
        'cyan-glow':   '0 0 30px rgba(6,182,212,0.45)',
        'neon-glow':   '0 0 20px rgba(0,255,179,0.5)',
        'card-hover':  '0 8px 32px rgba(139,92,246,0.25)',
      },
      animation: {
        'gradient-x':  'gradientX 5s ease infinite',
        'float':       'float 3s ease-in-out infinite',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'marquee':     'marquee 25s linear infinite',
        'fade-up':     'fadeUp 0.5s ease forwards',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        gradientX: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '50%':     { boxShadow: '0 0 50px rgba(139,92,246,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
