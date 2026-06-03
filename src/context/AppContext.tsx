import React, { createContext, useContext, useEffect, useReducer } from 'react'
import type { AppStore, FoodEntry, WaterEntry, WorkoutPlan, JournalEntry, WellnessScore, User } from '../types'

// ─── Initial State ────────────────────────────────────────────────────────────

const defaultUser: User = {
  id: '1',
  name: 'Alex',
  email: 'alex@aethel.app',
  createdAt: new Date().toISOString(),
  preferences: {
    theme: 'light',
    notifications: true,
    units: 'metric',
    dailyCalorieGoal: 2000,
    dailyWaterGoal: 2500,
    dailyStepGoal: 8000,
  },
}

const initialState: AppStore = {
  user: defaultUser,
  theme: 'light',
  foodEntries: [],
  waterEntries: [],
  workoutPlans: [],
  journalEntries: [],
  wellnessScores: generateMockScores(),
  activityEntries: [],
}

function generateMockScores(): WellnessScore[] {
  const scores: WellnessScore[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    scores.push({
      date: date.toISOString().split('T')[0],
      score: 60 + Math.floor(Math.random() * 35),
      components: {
        activity: 50 + Math.floor(Math.random() * 45),
        nutrition: 55 + Math.floor(Math.random() * 40),
        sleep: 60 + Math.floor(Math.random() * 35),
        mindfulness: 40 + Math.floor(Math.random() * 55),
      },
    })
  }
  return scores
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_FOOD_ENTRY'; payload: FoodEntry }
  | { type: 'REMOVE_FOOD_ENTRY'; payload: string }
  | { type: 'ADD_WATER_ENTRY'; payload: WaterEntry }
  | { type: 'ADD_WORKOUT_PLAN'; payload: WorkoutPlan }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'LOAD_STATE'; payload: Partial<AppStore> }

function reducer(state: AppStore, action: Action): AppStore {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'ADD_FOOD_ENTRY':
      return { ...state, foodEntries: [...state.foodEntries, action.payload] }
    case 'REMOVE_FOOD_ENTRY':
      return { ...state, foodEntries: state.foodEntries.filter(e => e.id !== action.payload) }
    case 'ADD_WATER_ENTRY':
      return { ...state, waterEntries: [...state.waterEntries, action.payload] }
    case 'ADD_WORKOUT_PLAN':
      return { ...state, workoutPlans: [action.payload, ...state.workoutPlans] }
    case 'ADD_JOURNAL_ENTRY':
      return { ...state, journalEntries: [...state.journalEntries, action.payload] }
    case 'UPDATE_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
      }
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppStore
  dispatch: React.Dispatch<Action>
  todayFoodEntries: FoodEntry[]
  todayWaterTotal: number
  todayCalories: number
  todayMacros: { protein: number; carbs: number; fat: number }
  wellnessScoreToday: number
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('aethel_state')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...init, ...parsed, wellnessScores: parsed.wellnessScores?.length ? parsed.wellnessScores : init.wellnessScores }
      }
    } catch { /* ignore */ }
    return init
  })

  // Persist to localStorage
  useEffect(() => {
    const { wellnessScores: _ws, ...rest } = state
    localStorage.setItem('aethel_state', JSON.stringify({ ...rest, wellnessScores: state.wellnessScores }))
  }, [state])

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.theme])

  const today = new Date().toISOString().split('T')[0]

  const todayFoodEntries = state.foodEntries.filter(e => e.date === today)
  const todayWaterTotal = state.waterEntries
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0)
  const todayCalories = todayFoodEntries.reduce((sum, e) => sum + e.macros.calories, 0)
  const todayMacros = todayFoodEntries.reduce(
    (acc, e) => ({
      protein: acc.protein + e.macros.protein,
      carbs: acc.carbs + e.macros.carbs,
      fat: acc.fat + e.macros.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 }
  )

  const latestScore = state.wellnessScores[state.wellnessScores.length - 1]
  const wellnessScoreToday = latestScore?.score ?? 72

  return (
    <AppContext.Provider
      value={{ state, dispatch, todayFoodEntries, todayWaterTotal, todayCalories, todayMacros, wellnessScoreToday }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
