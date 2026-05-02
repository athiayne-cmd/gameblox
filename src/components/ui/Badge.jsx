const VARIANTS = {
  purple:  'bg-gaming-purple/15 text-gaming-purple border border-gaming-purple/30',
  cyan:    'bg-gaming-cyan/15 text-gaming-cyan border border-gaming-cyan/30',
  neon:    'bg-gaming-neon/15 text-gaming-neon border border-gaming-neon/30',
  gold:    'bg-gaming-gold/15 text-gaming-gold border border-gaming-gold/30',
  red:     'bg-gaming-red/15 text-gaming-red border border-gaming-red/30',
  green:   'bg-gaming-green/15 text-gaming-green border border-gaming-green/30',
  default: 'bg-gaming-card border border-gaming-border text-gaming-text-secondary',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-heading font-semibold
      ${VARIANTS[variant]} ${className}
    `}>
      {children}
    </span>
  )
}
