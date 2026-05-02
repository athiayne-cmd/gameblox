import { motion } from 'framer-motion'

const VARIANTS = {
  primary: [
    'relative overflow-hidden text-white font-semibold',
    'bg-gradient-to-r from-gaming-purple to-gaming-pink',
    'shadow-btn-glow hover:shadow-btn-glow-lg',
    'hover:from-gaming-purple-light hover:to-[#ff33d6]',
    'before:absolute before:inset-0 before:bg-white/0 before:hover:bg-white/[0.07] before:transition-colors before:duration-300',
  ].join(' '),

  secondary: [
    'bg-gaming-card border border-gaming-border',
    'hover:border-gaming-purple/60 hover:bg-gaming-card-hover',
    'text-gaming-text-primary hover:text-white hover:shadow-purple-glow',
  ].join(' '),

  outline: [
    'bg-transparent border border-gaming-purple/60',
    'hover:bg-gaming-purple/10 hover:border-gaming-purple',
    'text-gaming-purple hover:shadow-purple-glow',
  ].join(' '),

  pink: [
    'bg-transparent border border-gaming-pink/60',
    'hover:bg-gaming-pink/10 hover:border-gaming-pink',
    'text-gaming-pink hover:shadow-pink-glow',
  ].join(' '),

  ghost:  'bg-transparent hover:bg-gaming-card/60 text-gaming-text-secondary hover:text-white',
  danger: 'bg-gaming-red/10 border border-gaming-red/40 hover:bg-gaming-red/20 text-gaming-red',
  neon:   'bg-gaming-neon/10 border border-gaming-neon/40 hover:bg-gaming-neon/20 text-gaming-neon hover:shadow-neon-glow',
  gold:   'bg-gradient-to-r from-[#ffd700]/15 to-[#ff8c00]/15 border border-[#ffd700]/40 hover:border-[#ffd700]/70 text-[#ffd700] hover:shadow-gold-glow',
  cyan:   'bg-gaming-cyan/10 border border-gaming-cyan/40 hover:bg-gaming-cyan/20 text-gaming-cyan',
}

const SIZES = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
}

export default function Button({
  children, variant = 'primary', size = 'md',
  className = '', disabled = false, loading = false,
  icon, iconRight, fullWidth = false, onClick, type = 'button', ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: disabled ? 1 : 1.025 }}
      className={`
        inline-flex items-center justify-center gap-2 font-heading font-semibold
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant] ?? ''} ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  )
}
