import type { FoodEntry, WaterEntry, JournalEntry, ActivityEntry } from '../types'

const today = new Date().toISOString().split('T')[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

export const sampleFoodEntries: FoodEntry[] = [
  {
    id: 'f1',
    date: today,
    time: '08:30',
    description: 'Greek yogurt with berries and granola',
    macros: { calories: 320, protein: 18, carbs: 42, fat: 8 },
    source: 'ai',
  },
  {
    id: 'f2',
    date: today,
    time: '12:45',
    description: 'Grilled chicken salad with avocado',
    macros: { calories: 480, protein: 38, carbs: 22, fat: 24 },
    source: 'ai',
  },
  {
    id: 'f3',
    date: yesterday,
    time: '07:00',
    description: 'Oatmeal with banana and almond butter',
    macros: { calories: 420, protein: 12, carbs: 68, fat: 14 },
    source: 'manual',
  },
]

export const sampleWaterEntries: WaterEntry[] = [
  { id: 'w1', date: today, amount: 250, time: '07:00' },
  { id: 'w2', date: today, amount: 350, time: '09:30' },
  { id: 'w3', date: today, amount: 250, time: '12:00' },
]

export const sampleJournalEntries: JournalEntry[] = [
  {
    id: 'j1',
    date: yesterday,
    mood: 'good',
    reflection: 'Had a productive morning and managed to fit in a 30-minute walk. Feeling centered.',
    gratitude: 'Grateful for the quiet morning light and a good night\'s sleep.',
    intentions: 'Stay present during meetings. Drink more water.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const sampleActivityEntries: ActivityEntry[] = [
  { id: 'a1', date: today, type: 'Walking', duration: 25, calories: 120 },
  { id: 'a2', date: yesterday, type: 'Strength Training', duration: 45, calories: 280 },
]

export const featureHighlights = [
  {
    icon: '◈',
    title: 'Intelligent Tracking',
    description: 'Log nutrition with natural language. Simply describe what you ate and let Aethel handle the rest.',
  },
  {
    icon: '✦',
    title: 'Personalized Workouts',
    description: 'Workouts tailored to your time, location, and fitness level. No generic plans.',
  },
  {
    icon: '◇',
    title: 'Wellness Insights',
    description: 'Understand your patterns with beautiful, minimal visualizations that respect your attention.',
  },
  {
    icon: '○',
    title: 'Daily Reflection',
    description: 'A calm space to check in with yourself. Mood, gratitude, and intention — all in one place.',
  },
]
