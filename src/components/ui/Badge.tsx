interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'muted'
  size?: 'sm' | 'md'
}

const variants = {
  default: 'bg-[#F2EFE9] dark:bg-[#2C2C2A] text-[#1D1D1F] dark:text-[#F5F3EF]',
  accent: 'bg-[#F5EFE6] text-[#A68A64]',
  success: 'bg-[#EBF2F0] text-[#5E8B7E]',
  muted: 'bg-[#E8E5E0] dark:bg-[#2C2C2A] text-[#6E6E73]',
}

const sizes = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}
