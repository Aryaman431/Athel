import React from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  options: SelectOption[]
  onChange?: (value: string) => void
}

export function Select({ label, options, onChange, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          onChange={e => onChange?.(e.target.value)}
          className={`
            w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-[#E8E5E0] dark:border-[#2C2C2A]
            bg-white dark:bg-[#1C1C1A]
            text-[#1D1D1F] dark:text-[#F5F3EF]
            focus:outline-none focus:ring-2 focus:ring-[#A68A64]/30 focus:border-[#A68A64]
            transition-all duration-200 cursor-pointer
            ${className}
          `}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E73] pointer-events-none" />
      </div>
    </div>
  )
}
