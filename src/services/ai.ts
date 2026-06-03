import type {
  WorkoutGeneratorInput,
  WorkoutPlan,
  MacroNutrients,
  DailyInsight,
  FitnessLevel,
  WorkoutLocation,
} from '../types'

const API_KEY = import.meta.env.VITE_AI_API_KEY

// ─── Mock Responses ───────────────────────────────────────────────────────────

const mockWorkouts: Record<WorkoutLocation, WorkoutPlan> = {
  home: {
    id: 'mock-home-1',
    title: 'Mindful Home Flow',
    description: 'A balanced full-body workout designed for your space at home — no equipment needed.',
    duration: 30,
    difficulty: 'intermediate',
    location: 'home',
    exercises: [
      {
        name: 'Bodyweight Squats',
        sets: 3,
        reps: '15',
        rest: '45s',
        instructions: 'Stand with feet shoulder-width apart. Lower until thighs are parallel to the floor, keeping chest tall.',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
      },
      {
        name: 'Push-Ups',
        sets: 3,
        reps: '10–12',
        rest: '45s',
        instructions: 'Start in plank position. Lower chest to the floor, then press back up maintaining a straight body line.',
        muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
      },
      {
        name: 'Reverse Lunges',
        sets: 3,
        reps: '10 each leg',
        rest: '45s',
        instructions: 'Step back with one foot, lowering the back knee toward the floor. Return to standing.',
        muscleGroups: ['Quadriceps', 'Glutes', 'Balance'],
      },
      {
        name: 'Plank Hold',
        duration: '30–45s',
        sets: 3,
        rest: '30s',
        instructions: 'Hold a forearm plank with hips level. Breathe steadily and engage your core.',
        muscleGroups: ['Core', 'Shoulders', 'Stability'],
      },
      {
        name: 'Glute Bridges',
        sets: 3,
        reps: '15',
        rest: '30s',
        instructions: 'Lie on your back, feet flat. Drive hips up squeezing glutes at the top.',
        muscleGroups: ['Glutes', 'Hamstrings', 'Lower Back'],
      },
    ],
    warmup: ['2 min light walking in place', 'Arm circles — 10 each direction', 'Hip circles — 10 each direction', 'Cat-cow stretches — 8 reps'],
    cooldown: ['Seated forward fold — 30s', 'Pigeon pose — 30s each side', 'Spinal twist — 20s each side', 'Childs pose — 45s'],
    generatedAt: new Date().toISOString(),
  },
  gym: {
    id: 'mock-gym-1',
    title: 'Structured Gym Session',
    description: 'An efficient strength-focused session using gym equipment to build functional fitness.',
    duration: 45,
    difficulty: 'intermediate',
    location: 'gym',
    exercises: [
      {
        name: 'Barbell Back Squat',
        sets: 4,
        reps: '8',
        rest: '90s',
        instructions: 'Position bar on upper traps. Squat to parallel with a neutral spine.',
        muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
      },
      {
        name: 'Incline Dumbbell Press',
        sets: 3,
        reps: '10',
        rest: '60s',
        instructions: 'Set bench to 30–45°. Press dumbbells up and slightly together at the top.',
        muscleGroups: ['Upper Chest', 'Shoulders', 'Triceps'],
      },
      {
        name: 'Cable Row',
        sets: 3,
        reps: '12',
        rest: '60s',
        instructions: 'Sit tall and pull cable to lower chest, leading with elbows.',
        muscleGroups: ['Back', 'Biceps', 'Rear Delts'],
      },
      {
        name: 'Romanian Deadlift',
        sets: 3,
        reps: '10',
        rest: '75s',
        instructions: 'Hinge at hips with slight knee bend, lowering bar along legs until tension in hamstrings.',
        muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
      },
    ],
    warmup: ['5 min treadmill walk', 'Hip flexor stretches — 30s each', 'Band pull-aparts — 15 reps', 'Goblet squats — 10 reps'],
    cooldown: ['Foam roll quads — 60s each', 'Chest doorway stretch — 30s', 'Seated hamstring stretch — 30s each', 'Deep breathing — 1 min'],
    generatedAt: new Date().toISOString(),
  },
  outdoor: {
    id: 'mock-outdoor-1',
    title: 'Outdoor Mindful Movement',
    description: 'Connect with nature while building fitness — a flowing outdoor circuit.',
    duration: 35,
    difficulty: 'beginner',
    location: 'outdoor',
    exercises: [
      {
        name: 'Brisk Walk / Easy Jog',
        duration: '8 min',
        instructions: 'Warm up with a brisk walk then transition to a comfortable jog pace.',
        muscleGroups: ['Full Body', 'Cardiovascular'],
      },
      {
        name: 'Park Bench Step-Ups',
        sets: 3,
        reps: '10 each leg',
        rest: '45s',
        instructions: 'Step up onto a bench, drive through the heel, then step down controlled.',
        muscleGroups: ['Glutes', 'Quadriceps', 'Balance'],
      },
      {
        name: 'Walking Lunges',
        sets: 2,
        reps: '20m',
        rest: '45s',
        instructions: 'Lunge forward continuously for 20 meters maintaining an upright torso.',
        muscleGroups: ['Legs', 'Core', 'Balance'],
      },
      {
        name: 'Incline Push-Ups (Bench)',
        sets: 3,
        reps: '12',
        rest: '45s',
        instructions: 'Hands on bench edge, perform push-ups in an elevated position.',
        muscleGroups: ['Chest', 'Triceps', 'Core'],
      },
    ],
    warmup: ['Easy walk — 3 min', 'Leg swings — 10 each direction', 'Arm swings — 10 reps', 'Ankle circles — 10 each'],
    cooldown: ['Easy walk — 3 min', 'Standing quad stretch — 30s each', 'Calf stretch against wall — 30s each', 'Seated forward fold — 45s'],
    generatedAt: new Date().toISOString(),
  },
}

const mockNutrition: Record<string, MacroNutrients> = {
  default: { calories: 420, protein: 22, carbs: 48, fat: 14 },
  eggs: { calories: 310, protein: 24, carbs: 28, fat: 12 },
  salad: { calories: 180, protein: 8, carbs: 22, fat: 7 },
  chicken: { calories: 520, protein: 48, carbs: 32, fat: 18 },
  pasta: { calories: 640, protein: 18, carbs: 88, fat: 16 },
  smoothie: { calories: 280, protein: 12, carbs: 42, fat: 8 },
}

const mockInsights: DailyInsight[] = [
  { id: '1', date: new Date().toISOString(), message: 'Your activity consistency this week is in the top 20%. A gentle reminder that rest is equally part of your progress.', type: 'achievement', icon: '✦' },
  { id: '2', date: new Date().toISOString(), message: 'Hydration patterns suggest you tend to under-drink in the afternoon. Try keeping water at your desk as a visual cue.', type: 'tip', icon: '◈' },
  { id: '3', date: new Date().toISOString(), message: 'Morning movement, even 10 minutes, correlates strongly with better mood scores throughout the day.', type: 'motivation', icon: '◇' },
  { id: '4', date: new Date().toISOString(), message: 'You\'ve logged 5 days in a row. Sustainable habits are built in moments exactly like this one.', type: 'motivation', icon: '✧' },
]

// ─── AI Service ───────────────────────────────────────────────────────────────

export const aiService = {
  /**
   * Generate a personalized workout plan.
   * Falls back to curated mock data when API is unavailable.
   */
  async generateWorkout(input: WorkoutGeneratorInput): Promise<WorkoutPlan> {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return adaptMockWorkout(mockWorkouts[input.location], input)
    }

    try {
      const prompt = buildWorkoutPrompt(input)
      const response = await callOpenAI(prompt)
      return parseWorkoutResponse(response, input)
    } catch (err) {
      console.warn('[AI] Workout generation failed, using mock:', err)
      return adaptMockWorkout(mockWorkouts[input.location], input)
    }
  },

  /**
   * Analyze a natural-language food description and return macros.
   * Falls back to keyword-based mock when API unavailable.
   */
  async analyzeNutrition(description: string): Promise<MacroNutrients> {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return getMockNutrition(description)
    }

    try {
      const prompt = buildNutritionPrompt(description)
      const response = await callOpenAI(prompt)
      return parseNutritionResponse(response)
    } catch (err) {
      console.warn('[AI] Nutrition analysis failed, using mock:', err)
      return getMockNutrition(description)
    }
  },

  /**
   * Get a daily motivational insight.
   */
  async getDailyInsight(): Promise<DailyInsight> {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      const idx = new Date().getDate() % mockInsights.length
      return mockInsights[idx]
    }

    try {
      const prompt = 'Generate a single, thoughtful wellness insight for today. Keep it under 40 words, calm, and empowering. No clichés.'
      const response = await callOpenAI(prompt)
      return {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        message: response,
        type: 'motivation',
        icon: '✦',
      }
    } catch {
      const idx = new Date().getDate() % mockInsights.length
      return mockInsights[idx]
    }
  },

  /**
   * Get a wellness recommendation based on recent data.
   */
  async getWellnessRecommendation(context: {
    caloriesLogged: number
    waterLogged: number
    activityMinutes: number
  }): Promise<string> {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return getContextualRecommendation(context)
    }

    try {
      const prompt = `Given: ${context.activityMinutes}min activity, ${context.caloriesLogged} kcal logged, ${context.waterLogged}ml water today. Give one short, calm wellness suggestion (under 30 words).`
      return await callOpenAI(prompt)
    } catch {
      return getContextualRecommendation(context)
    }
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function callOpenAI(prompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are Aethel, a calm, premium wellness AI. You give concise, thoughtful responses. Never use aggressive fitness language.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
  })

  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`)
  const data = await res.json()
  return data.choices[0]?.message?.content?.trim() ?? ''
}

function buildWorkoutPrompt(input: WorkoutGeneratorInput): string {
  return `Create a ${input.availableTime}-minute ${input.fitnessLevel} ${input.location} workout. 
Return JSON: { title, description, exercises: [{name, sets, reps, instructions, muscleGroups}], warmup: [string], cooldown: [string] }`
}

function buildNutritionPrompt(description: string): string {
  return `Estimate macros for: "${description}". 
Return JSON only: { calories: number, protein: number, carbs: number, fat: number }`
}

function parseWorkoutResponse(raw: string, input: WorkoutGeneratorInput): WorkoutPlan {
  try {
    const json = JSON.parse(raw.replace(/```json|```/g, '').trim())
    return {
      id: Date.now().toString(),
      generatedAt: new Date().toISOString(),
      duration: input.availableTime,
      difficulty: input.fitnessLevel,
      location: input.location,
      ...json,
    }
  } catch {
    return adaptMockWorkout(mockWorkouts[input.location], input)
  }
}

function parseNutritionResponse(raw: string): MacroNutrients {
  try {
    const json = JSON.parse(raw.replace(/```json|```/g, '').trim())
    return json
  } catch {
    return mockNutrition.default
  }
}

function getMockNutrition(description: string): MacroNutrients {
  const lower = description.toLowerCase()
  if (lower.includes('egg')) return mockNutrition.eggs
  if (lower.includes('salad')) return mockNutrition.salad
  if (lower.includes('chicken')) return mockNutrition.chicken
  if (lower.includes('pasta') || lower.includes('noodle')) return mockNutrition.pasta
  if (lower.includes('smoothie') || lower.includes('shake')) return mockNutrition.smoothie
  // Scale default by word count (rough proxy for meal size)
  const words = description.split(' ').length
  const scale = Math.max(0.5, Math.min(2, words / 5))
  return {
    calories: Math.round(mockNutrition.default.calories * scale),
    protein: Math.round(mockNutrition.default.protein * scale),
    carbs: Math.round(mockNutrition.default.carbs * scale),
    fat: Math.round(mockNutrition.default.fat * scale),
  }
}

function adaptMockWorkout(base: WorkoutPlan, input: WorkoutGeneratorInput): WorkoutPlan {
  const levelMap: Record<string, FitnessLevel> = {
    beginner: 'beginner',
    intermediate: 'intermediate',
    advanced: 'advanced',
  }
  return {
    ...base,
    id: Date.now().toString(),
    duration: input.availableTime,
    difficulty: levelMap[input.fitnessLevel] ?? 'intermediate',
    generatedAt: new Date().toISOString(),
  }
}

function getContextualRecommendation(ctx: {
  caloriesLogged: number
  waterLogged: number
  activityMinutes: number
}): string {
  if (ctx.waterLogged < 1000) return 'You\'re behind on hydration today. A glass of water now can meaningfully lift your energy and focus.'
  if (ctx.activityMinutes < 20) return 'Even a 10-minute walk can reduce cortisol and improve your mood for hours. There\'s still time today.'
  if (ctx.caloriesLogged < 400) return 'Nourishment is part of wellness. A balanced meal or snack will support your energy and recovery.'
  return 'You\'re building a beautiful habit. Keep showing up — consistency is the most powerful tool you have.'
}
