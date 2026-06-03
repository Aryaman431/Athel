import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

export function Input({ label, hint, error, icon, suffix, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6E73]">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 rounded-xl border border-[#E8E5E0] dark:border-[#2C2C2A]
            bg-white dark:bg-[#1C1C1A]
            text-[#1D1D1F] dark:text-[#F5F3EF]
            placeholder-[#9E9EA3] dark:placeholder-[#5E5E63]
            focus:outline-none focus:ring-2 focus:ring-[#A68A64]/30 focus:border-[#A68A64]
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${suffix ? 'pr-16' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6E73] text-sm">
            {suffix}
          </div>
        )}
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-[#6E6E73]">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({ label, hint, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 rounded-xl border border-[#E8E5E0] dark:border-[#2C2C2A]
          bg-white dark:bg-[#1C1C1A]
          text-[#1D1D1F] dark:text-[#F5F3EF]
          placeholder-[#9E9EA3] dark:placeholder-[#5E5E63]
          focus:outline-none focus:ring-2 focus:ring-[#A68A64]/30 focus:border-[#A68A64]
          transition-all duration-200 resize-none
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-[#6E6E73]">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}
