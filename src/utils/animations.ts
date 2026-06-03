import type { Variants } from 'framer-motion'

// Cubic bezier ease — typed as tuple for Framer Motion v12 compatibility
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
}

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

export const fadeUpSlowVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
}

export function staggeredFadeUp(i: number): object {
  return {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease, delay: i * 0.1 },
  }
}
