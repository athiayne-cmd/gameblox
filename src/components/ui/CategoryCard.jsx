import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        to={`/marketplace?categorie=${category.id}`}
        className={`
          flex flex-col items-center gap-3 p-5 rounded-2xl text-center
          border ${category.border} ${category.bg}
          hover:shadow-purple-glow transition-all duration-300 group cursor-pointer block
          bg-gaming-card/60 backdrop-blur-sm
        `}
      >
        <div className={`
          w-14 h-14 rounded-2xl flex items-center justify-center text-3xl
          bg-gradient-to-br ${category.gradient} shadow-gaming
          group-hover:shadow-purple-glow transition-all duration-300
        `}>
          {category.icon}
        </div>
        <div>
          <p className="font-heading font-semibold text-gaming-text-primary text-sm leading-tight">
            {category.name}
          </p>
          <p className="text-xs text-gaming-text-muted mt-0.5 font-body">
            {category.count} produits
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
