import { motion } from 'framer-motion'

/* Positions déterministes (pas de Math.random au render) */
const DOTS = [
  { x: 8,  y: 12, s: 3, d: 6.0, delay: 0.0, pink: false },
  { x: 22, y: 78, s: 2, d: 7.5, delay: 0.8, pink: true  },
  { x: 37, y: 35, s: 4, d: 5.5, delay: 1.5, pink: false },
  { x: 52, y: 90, s: 2, d: 8.0, delay: 0.3, pink: false },
  { x: 65, y: 20, s: 3, d: 6.5, delay: 2.1, pink: true  },
  { x: 78, y: 55, s: 2, d: 7.0, delay: 0.6, pink: false },
  { x: 90, y: 10, s: 4, d: 5.0, delay: 1.8, pink: true  },
  { x: 14, y: 50, s: 2, d: 8.5, delay: 1.0, pink: false },
  { x: 45, y: 65, s: 3, d: 6.0, delay: 2.5, pink: false },
  { x: 83, y: 82, s: 2, d: 7.5, delay: 0.4, pink: true  },
  { x: 30, y: 15, s: 2, d: 5.5, delay: 1.2, pink: false },
  { x: 70, y: 40, s: 3, d: 6.8, delay: 0.9, pink: true  },
  { x: 56, y: 8,  s: 2, d: 7.2, delay: 1.7, pink: false },
  { x: 4,  y: 88, s: 4, d: 5.8, delay: 2.3, pink: false },
  { x: 95, y: 60, s: 2, d: 8.2, delay: 0.7, pink: true  },
  { x: 18, y: 30, s: 3, d: 6.3, delay: 1.4, pink: false },
  { x: 40, y: 95, s: 2, d: 7.8, delay: 0.2, pink: true  },
  { x: 75, y: 70, s: 3, d: 5.2, delay: 1.9, pink: false },
]

export default function Particles({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>

      {/* Petits points lumineux */}
      {DOTS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width:  p.s * 2.5,
            height: p.s * 2.5,
            background: p.pink
              ? `radial-gradient(circle, rgba(255,0,200,0.85) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(139,0,255,0.85) 0%, transparent 70%)`,
            filter: `blur(${p.s * 0.7}px)`,
          }}
          animate={{
            y:       [0, -(18 + p.s * 3), 8, -14, 0],
            x:       [0, p.s * 3, -p.s * 2, p.s * 4, 0],
            opacity: [0.4, 0.9, 0.6, 0.85, 0.4],
          }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Grandes orbes lumineuses */}
      <motion.div
        className="absolute"
        style={{
          width: 500, height: 500,
          left: '-8%', top: '5%',
          background: 'radial-gradient(circle, rgba(139,0,255,0.12) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute"
        style={{
          width: 400, height: 400,
          right: '-6%', bottom: '15%',
          background: 'radial-gradient(circle, rgba(255,0,200,0.1) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute"
        style={{
          width: 300, height: 300,
          left: '40%', bottom: '30%',
          background: 'radial-gradient(circle, rgba(139,0,255,0.07) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
    </div>
  )
}
