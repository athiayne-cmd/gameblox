export default function Input({
  label, error, hint, icon, iconRight,
  className = '', inputClassName = '', ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-heading font-medium text-gaming-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gaming-text-muted">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full bg-gaming-surface border border-gaming-border rounded-xl px-4 py-3
            text-gaming-text-primary placeholder:text-gaming-text-muted
            focus:outline-none focus:border-gaming-purple focus:ring-2 focus:ring-gaming-purple/20
            transition-all duration-200 font-body text-sm
            ${icon ? 'pl-10' : ''}
            ${iconRight ? 'pr-10' : ''}
            ${error ? 'border-gaming-red focus:border-gaming-red focus:ring-gaming-red/20' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gaming-text-muted">
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-gaming-red font-body">{error}</p>}
      {hint && !error && <p className="text-xs text-gaming-text-muted font-body">{hint}</p>}
    </div>
  )
}
