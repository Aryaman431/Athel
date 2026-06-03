import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles = {
  primary: 'bg-[#1D1D1F] dark:bg-[#F5F3EF] text-white dark:text-[#1D1D1F] hover:bg-[#2D2D2F] dark:hover:bg-white',
  secondary: 'bg-[#F2EFE9] dark:bg-[#2C2C2A] text-[#1D1D1F] dark:text-[#F5F3EF] hover:bg-[#E8E5DF] dark:hover:bg-[#3C3C3A]',
  ghost: 'bg-transparent text-[#1D1D1F] dark:text-[#F5F3EF] hover:bg-[#F2EFE9] dark:hover:bg-[#2C2C2A]',
  accent: 'bg-[#A68A64] text-white hover:bg-[#9A7D57]',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-colors duration-200 select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
