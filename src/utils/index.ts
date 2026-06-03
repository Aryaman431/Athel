import { format, isToday, isYesterday, parseISO } from 'date-fns'

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d')
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a')
}

export function formatDateFull(dateStr: string): string {
  return format(parseISO(dateStr), 'EEEE, MMMM d')
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function percentage(value: number, total: number): number {
  if (total === 0) return 0
  return clamp(Math.round((value / total) * 100), 0, 100)
}

export function mlToOz(ml: number): number {
  return Math.round(ml / 29.574)
}

export function formatWater(ml: number, units: 'metric' | 'imperial' = 'metric'): string {
  if (units === 'imperial') return `${mlToOz(ml)} fl oz`
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`
  return `${ml}ml`
}

export function getGreeting(name?: string): string {
  const hour = new Date().getHours()
  const base = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  return name ? `${base}, ${name}` : base
}

export function scoreToLabel(score: number): string {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 55) return 'Fair'
  if (score >= 40) return 'Low'
  return 'Rest needed'
}

export function scoreToColor(score: number): string {
  if (score >= 75) return '#5E8B7E'
  if (score >= 55) return '#A68A64'
  return '#C4826A'
}

export function exportDataAsJson(data: object, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const MOOD_LABELS: Record<string, string> = {
  great: 'Great',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  struggling: 'Struggling',
}

export const MOOD_EMOJI: Record<string, string> = {
  great: '✦',
  good: '◈',
  okay: '◇',
  low: '◦',
  struggling: '○',
}
