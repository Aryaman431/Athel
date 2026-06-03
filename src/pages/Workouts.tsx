import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, Clock, MapPin, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Badge } from '../components/ui/Badge'
import { useApp } from '../context/AppContext'
import { aiService } from '../services/ai'
import type { WorkoutPlan, WorkoutGeneratorInput, FitnessLevel, WorkoutLocation } from '../types'
import { generateId } from '../utils'

const timeOptions = [
  { value: '15', label: '15 minutes' },
  { value: '20', label: '20 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
]

const locationOptions = [
  { value: 'home', label: 'Home' },
  { value: 'gym', label: 'Gym' },
  { value: 'outdoor', label: 'Outdoor' },
]

const levelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const levelColors: Record<FitnessLevel, string> = {
  beginner: '#5E8B7E',
  intermediate: '#A68A64',
  advanced: '#C4826A',
}

const locationIcons: Record<WorkoutLocation, string> = {
  home: '🏠',
  gym: '🏋️',
  outdoor: '🌿',
}

function ExerciseCard({ exercise, index }: { exercise: WorkoutPlan['exercises'][0]; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="border border-[#E8E5E0] dark:border-[#2C2C2A] rounded-2xl overflow-hidden cursor-pointer hover:border-[#C8C4BD] dark:hover:border-[#3C3C3A] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F2EFE9] dark:bg-[#2C2C2A] flex items-center justify-center text-sm font-semibold text-[#6E6E73]">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">{exercise.name}</p>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                {exercise.sets && exercise.reps ? `${exercise.sets} × ${exercise.reps}` : exercise.duration || ''}
                {exercise.rest && <span className="ml-2">· {exercise.rest} rest</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {exercise.muscleGroups.slice(0, 2).map(mg => (
              <Badge key={mg} variant="muted" size="sm">{mg}</Badge>
            ))}
            {expanded ? <ChevronUp size={16} className="text-[#6E6E73] ml-1" /> : <ChevronDown size={16} className="text-[#6E6E73] ml-1" />}
          </div>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-[#F2EFE9] dark:border-[#2C2C2A]">
                <p className="text-sm text-[#6E6E73] leading-relaxed mt-3">{exercise.instructions}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function WorkoutCard({ plan }: { plan: WorkoutPlan }) {
  const [showExercises, setShowExercises] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card padding="lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{locationIcons[plan.location]}</span>
              <Badge variant="accent">{plan.location}</Badge>
              <Badge
                variant="default"
                size="sm"
              >
                <span style={{ color: levelColors[plan.difficulty] }}>{plan.difficulty}</span>
              </Badge>
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EF] mt-1">{plan.title}</h3>
            <p className="text-sm text-[#6E6E73] mt-1 leading-relaxed max-w-lg">{plan.description}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[#6E6E73] shrink-0 ml-4">
            <Clock size={14} />
            <span className="text-sm">{plan.duration} min</span>
          </div>
        </div>

        {/* Warmup */}
        <div className="mb-4">
          <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-2">Warm-up</p>
          <div className="flex flex-wrap gap-2">
            {plan.warmup.map(w => (
              <span key={w} className="text-xs px-3 py-1 bg-[#EBF2F0] text-[#5E8B7E] rounded-full">{w}</span>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73]">Exercises ({plan.exercises.length})</p>
            <button
              onClick={() => setShowExercises(!showExercises)}
              className="text-xs text-[#A68A64] font-medium"
            >
              {showExercises ? 'Collapse' : 'Expand'}
            </button>
          </div>
          <AnimatePresence>
            {showExercises && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {plan.exercises.map((ex, i) => (
                  <ExerciseCard key={ex.name} exercise={ex} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cooldown */}
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-2">Cool-down</p>
          <div className="flex flex-wrap gap-2">
            {plan.cooldown.map(c => (
              <span key={c} className="text-xs px-3 py-1 bg-[#F5EFE6] text-[#A68A64] rounded-full">{c}</span>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function Workouts() {
  const { dispatch, state } = useApp()
  const [time, setTime] = useState('30')
  const [location, setLocation] = useState<WorkoutLocation>('home')
  const [level, setLevel] = useState<FitnessLevel>('intermediate')
  const [loading, setLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null)

  async function generateWorkout() {
    setLoading(true)
    setCurrentPlan(null)
    const input: WorkoutGeneratorInput = {
      availableTime: parseInt(time),
      location,
      fitnessLevel: level,
    }
    const plan = await aiService.generateWorkout(input)
    const withId = { ...plan, id: generateId() }
    setCurrentPlan(withId)
    dispatch({ type: 'ADD_WORKOUT_PLAN', payload: withId })
    setLoading(false)
  }

  return (
    <div className="min-h-full px-5 pt-8 pb-6 max-w-3xl mx-auto lg:max-w-none lg:px-8 lg:pt-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-2">Personalized</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF]">Workout Generator</h1>
        <p className="text-[#6E6E73] mt-1">Tell us your constraints and we'll craft the perfect session.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <Card padding="lg" className="sticky top-6">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-4">Configure</p>
              </div>

              <Select
                label="Available Time"
                options={timeOptions}
                value={time}
                onChange={v => setTime(v)}
              />

              <div>
                <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF] mb-2">Location</p>
                <div className="grid grid-cols-3 gap-2">
                  {locationOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setLocation(opt.value as WorkoutLocation)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                        location === opt.value
                          ? 'border-[#A68A64] bg-[#F5EFE6] text-[#A68A64]'
                          : 'border-[#E8E5E0] dark:border-[#2C2C2A] text-[#6E6E73] hover:border-[#C8C4BD]'
                      }`}
                    >
                      <span>{locationIcons[opt.value as WorkoutLocation]}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF] mb-2">Fitness Level</p>
                <div className="space-y-2">
                  {levelOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setLevel(opt.value as FitnessLevel)}
                      className={`w-full py-2.5 px-4 rounded-xl border text-sm text-left font-medium transition-all duration-200 ${
                        level === opt.value
                          ? 'border-[#A68A64] bg-[#F5EFE6] text-[#A68A64]'
                          : 'border-[#E8E5E0] dark:border-[#2C2C2A] text-[#6E6E73] hover:border-[#C8C4BD]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                fullWidth
                variant="primary"
                loading={loading}
                onClick={generateWorkout}
                className="mt-2"
              >
                <Sparkles size={16} />
                Generate Workout
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-5">
          {loading && (
            <Card padding="lg" className="flex flex-col items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-2 border-[#E8E5E0] border-t-[#A68A64] rounded-full mb-4"
              />
              <p className="text-[#6E6E73] text-sm">Crafting your perfect session...</p>
            </Card>
          )}

          {!loading && currentPlan && <WorkoutCard plan={currentPlan} />}

          {!loading && !currentPlan && state.workoutPlans.length === 0 && (
            <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#F2EFE9] dark:bg-[#2C2C2A] flex items-center justify-center mb-4">
                <Dumbbell size={24} className="text-[#A68A64]" />
              </div>
              <h3 className="text-lg font-medium text-[#1D1D1F] dark:text-[#F5F3EF] mb-1">Ready when you are</h3>
              <p className="text-[#6E6E73] text-sm max-w-sm">Configure your preferences and generate a personalized workout crafted just for you.</p>
            </Card>
          )}

          {/* Previous workouts */}
          {!currentPlan && state.workoutPlans.length > 0 && (
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-3">Previous Sessions</p>
              <div className="space-y-4">
                {state.workoutPlans.slice(0, 3).map(plan => (
                  <WorkoutCard key={plan.id} plan={plan} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
