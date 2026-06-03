import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number      // 0–100
  color?: string
  height?: number
  label?: string
  showValue?: boolean
  className?: string
}

export function ProgressBar({
  value,
  color = '#A68A64',
  height = 6,
  label,
  showValue = false,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-[#6E6E73]">{label}</span>}
          {showValue && <span className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">{clamped}%</span>}
        </div>
      )}
      <div
        className="w-full bg-[#E8E5E0] dark:bg-[#2C2C2A] rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}
