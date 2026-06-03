import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Flame, Plus, Activity } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { ProgressRing } from '../components/ui/ProgressRing'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useApp } from '../context/AppContext'
import { aiService } from '../services/ai'
import { generateId, getGreeting, scoreToLabel, scoreToColor, formatWater, percentage } from '../utils'
import type { WaterEntry } from '../types'

import { containerVariants, fadeUpVariants } from '../utils/animations'

const itemVariants = fadeUpVariants

const WATER_OPTIONS = [150, 250, 350, 500]

export default function Dashboard() {
  const { state, dispatch, todayCalories, todayMacros, todayWaterTotal, wellnessScoreToday } = useApp()
  const [insight, setInsight] = useState<string>('')
  const [loadingInsight, setLoadingInsight] = useState(true)

  const user = state.user!
  const calorieGoal = user.preferences.dailyCalorieGoal
  const waterGoal = user.preferences.dailyWaterGoal

  useEffect(() => {
    aiService.getDailyInsight().then(i => {
      setInsight(i.message)
      setLoadingInsight(false)
    })
  }, [])

  function addWater(amount: number) {
    const entry: WaterEntry = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      amount,
      time: new Date().toTimeString().slice(0, 5),
    }
    dispatch({ type: 'ADD_WATER_ENTRY', payload: entry })
  }

  const scoreColor = scoreToColor(wellnessScoreToday)
  const caloriePercent = percentage(todayCalories, calorieGoal)
  const waterPercent = percentage(todayWaterTotal, waterGoal)

  return (
    <div className="min-h-full px-5 pt-8 pb-6 max-w-3xl mx-auto lg:max-w-none lg:px-8 lg:pt-10">
      {/* ── Header ───────────────────────────── */}
      <motion.div variants={itemVariants} initial="hidden" animate="show" className="mb-8">
        <p className="text-sm text-[#6E6E73] mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF]">
          {getGreeting(user.name)}
        </h1>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {/* ── Wellness Score ──────────────────── */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="h-full flex flex-col items-center justify-center py-8" padding="lg">
            <p className="text-xs font-medium text-[#6E6E73] tracking-widest uppercase mb-6">Wellness Score</p>
            <ProgressRing
              value={wellnessScoreToday}
              size={140}
              strokeWidth={10}
              color={scoreColor}
              label={`${wellnessScoreToday}`}
              sublabel={scoreToLabel(wellnessScoreToday)}
            />
            <div className="mt-6 w-full space-y-3">
              {[
                { label: 'Activity', value: state.wellnessScores[state.wellnessScores.length - 1]?.components.activity ?? 70 },
                { label: 'Nutrition', value: state.wellnessScores[state.wellnessScores.length - 1]?.components.nutrition ?? 65 },
                { label: 'Mindfulness', value: state.wellnessScores[state.wellnessScores.length - 1]?.components.mindfulness ?? 60 },
              ].map(c => (
                <ProgressBar key={c.label} label={c.label} value={c.value} color={scoreColor} showValue />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ── Right column ────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Calories */}
          <motion.div variants={itemVariants}>
            <Card padding="md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF3E8] flex items-center justify-center">
                    <Flame size={16} className="text-[#D4804A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">Calories</p>
                    <p className="text-xs text-[#6E6E73]">Daily intake</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EF]">{todayCalories.toLocaleString()}</span>
                  <span className="text-sm text-[#6E6E73] ml-1">/ {calorieGoal.toLocaleString()} kcal</span>
                </div>
              </div>
              <ProgressBar value={caloriePercent} color="#D4804A" />

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'Protein', value: todayMacros.protein, color: '#5E8B7E', unit: 'g' },
                  { label: 'Carbs', value: todayMacros.carbs, color: '#A68A64', unit: 'g' },
                  { label: 'Fat', value: todayMacros.fat, color: '#7B9BAF', unit: 'g' },
                ].map(m => (
                  <div key={m.label} className="bg-[#FAF8F5] dark:bg-[#111110] rounded-xl p-3 text-center">
                    <p className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F3EF]">{m.value}<span className="text-xs text-[#6E6E73] ml-0.5">{m.unit}</span></p>
                    <p className="text-xs text-[#6E6E73] mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Water */}
          <motion.div variants={itemVariants}>
            <Card padding="md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F2FF] flex items-center justify-center">
                    <Droplets size={16} className="text-[#4A90C4]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">Hydration</p>
                    <p className="text-xs text-[#6E6E73]">Water intake</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EF]">{formatWater(todayWaterTotal)}</span>
                  <span className="text-sm text-[#6E6E73] ml-1">/ {formatWater(waterGoal)}</span>
                </div>
              </div>
              <ProgressBar value={waterPercent} color="#4A90C4" />
              <div className="flex gap-2 mt-4">
                {WATER_OPTIONS.map(amount => (
                  <button
                    key={amount}
                    onClick={() => addWater(amount)}
                    className="flex-1 py-2 rounded-xl border border-[#E8E5E0] dark:border-[#2C2C2A] text-xs font-medium text-[#6E6E73] hover:bg-[#E8F2FF] hover:text-[#4A90C4] hover:border-[#4A90C4]/30 transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <Plus size={12} />
                    {amount < 1000 ? `${amount}ml` : `${amount / 1000}L`}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Activity Summary */}
          <motion.div variants={itemVariants}>
            <Card padding="md">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#EBF2F0] flex items-center justify-center">
                  <Activity size={16} className="text-[#5E8B7E]" />
                </div>
                <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">Today's Activity</p>
              </div>
              {state.activityEntries.filter(e => e.date === new Date().toISOString().split('T')[0]).length > 0 ? (
                <div className="space-y-2">
                  {state.activityEntries
                    .filter(e => e.date === new Date().toISOString().split('T')[0])
                    .map(entry => (
                      <div key={entry.id} className="flex items-center justify-between py-2 border-b border-[#F2EFE9] dark:border-[#2C2C2A] last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5E8B7E]" />
                          <span className="text-sm text-[#1D1D1F] dark:text-[#F5F3EF]">{entry.type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="success">{entry.duration} min</Badge>
                          <span className="text-xs text-[#6E6E73]">{entry.calories} kcal</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-[#6E6E73] text-sm">No activity logged today.</p>
                  <p className="text-xs text-[#9E9EA3] mt-1">A short walk counts too.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* ── Daily Recommendation ─────────────── */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card padding="lg" className="bg-[#1D1D1F] dark:bg-[#1C1C1A] border-[#1D1D1F]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <span className="text-white text-lg">✦</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-medium tracking-widest uppercase text-white/40">Today's Insight</p>
                  <Badge variant="muted" size="sm">
                    <span className="text-white/50">AI</span>
                  </Badge>
                </div>
                {loadingInsight ? (
                  <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse" />
                ) : (
                  <p className="text-white/85 text-base leading-relaxed">{insight}</p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
