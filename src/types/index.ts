// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  units: 'metric' | 'imperial'
  dailyCalorieGoal: number
  dailyWaterGoal: number // in ml
  dailyStepGoal: number
}

// ─── Wellness & Activity ──────────────────────────────────────────────────────

export interface WellnessScore {
  date: string
  score: number // 0–100
  components: {
    activity: number
    nutrition: number
    sleep: number
    mindfulness: number
  }
}

export interface ActivityEntry {
  id: string
  date: string
  type: string
  duration: number // minutes
  calories: number
  notes?: string
}

export interface WaterEntry {
  id: string
  date: string
  amount: number // ml
  time: string
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export interface MacroNutrients {
  calories: number
  protein: number // g
  carbs: number   // g
  fat: number     // g
  fiber?: number  // g
}

export interface FoodEntry {
  id: string
  date: string
  time: string
  description: string
  macros: MacroNutrients
  imageUrl?: string
  source: 'manual' | 'ai' | 'photo'
}

export interface NutritionGoal {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// ─── Workout ──────────────────────────────────────────────────────────────────

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'
export type WorkoutLocation = 'home' | 'gym' | 'outdoor'

export interface WorkoutGeneratorInput {
  availableTime: number // minutes
  location: WorkoutLocation
  fitnessLevel: FitnessLevel
  focusArea?: string
}

export interface Exercise {
  name: string
  sets?: number
  reps?: string
  duration?: string
  rest?: string
  instructions: string
  muscleGroups: string[]
}

export interface WorkoutPlan {
  id: string
  title: string
  description: string
  duration: number
  difficulty: FitnessLevel
  location: WorkoutLocation
  exercises: Exercise[]
  warmup: string[]
  cooldown: string[]
  generatedAt: string
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export type Mood = 'great' | 'good' | 'okay' | 'low' | 'struggling'

export interface JournalEntry {
  id: string
  date: string
  mood: Mood
  reflection: string
  gratitude?: string
  intentions?: string
  createdAt: string
  updatedAt: string
}

// ─── Insights ────────────────────────────────────────────────────────────────

export interface WeeklyTrend {
  week: string
  wellnessScore: number
  activityMinutes: number
  caloriesAvg: number
  waterAvg: number
}

export interface DailyInsight {
  id: string
  date: string
  message: string
  type: 'motivation' | 'tip' | 'achievement' | 'reminder'
  icon: string
}

// ─── Store State ──────────────────────────────────────────────────────────────

export interface AppStore {
  user: User | null
  theme: 'light' | 'dark'
  foodEntries: FoodEntry[]
  waterEntries: WaterEntry[]
  workoutPlans: WorkoutPlan[]
  journalEntries: JournalEntry[]
  wellnessScores: WellnessScore[]
  activityEntries: ActivityEntry[]
}
