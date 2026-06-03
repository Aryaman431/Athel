import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 sm:p-8',
}

export function Card({ children, className = '', hover = false, padding = 'md', ...props }: CardProps) {
  return (
    <motion.div
      className={`bg-white dark:bg-[#1C1C1A] rounded-2xl border border-[#E8E5E0] dark:border-[#2C2C2A] ${paddingMap[padding]} ${hover ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.06)' } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
