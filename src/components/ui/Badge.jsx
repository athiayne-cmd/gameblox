const VARIANTS = {
  purple:  'bg-gaming-purple/15 text-gaming-purple-light border border-gaming-purple/35',
  pink:    'bg-gaming-pink/12 text-gaming-pink border border-gaming-pink/35',
  cyan:    'bg-gaming-cyan/12 text-gaming-cyan border border-gaming-cyan/30',
  neon:    'bg-gaming-neon/12 text-gaming-neon border border-gaming-neon/30',
  /* Badge or — gradient animé style Premium */
  gold:    'bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c00]/15 text-[#ffd700] border border-[#ffd700]/45 shadow-[0_0_12px_rgba(255,215,0,0.25)]',
  red:     'bg-gaming-red/12 text-gaming-red border border-gaming-red/30',
  green:   'bg-gaming-neon/12 text-gaming-neon border border-gaming-neon/30',
  default: 'bg-gaming-card border border-gaming-border/70 text-gaming-text-secondary',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-heading font-semibold
      ${VARIANTS[variant] ?? VARIANTS.default} ${className}
    `}>
      {children}
    </span>
  )
}
