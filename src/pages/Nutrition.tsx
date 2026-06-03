import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Apple, Camera, Trash2, Sparkles, Plus } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { useApp } from '../context/AppContext'
import { aiService } from '../services/ai'
import type { FoodEntry, MacroNutrients } from '../types'
import { generateId, formatTime, percentage } from '../utils'

const MACRO_COLORS = {
  protein: '#5E8B7E',
  carbs: '#A68A64',
  fat: '#7B9BAF',
}

function MacroStat({ label, value, color, goal }: { label: string; value: number; color: string; goal: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-[#6E6E73]">{label}</span>
        <span className="font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">{value}g</span>
      </div>
      <ProgressBar value={percentage(value, goal)} color={color} height={4} />
    </div>
  )
}

function FoodEntryCard({ entry, onRemove }: { entry: FoodEntry; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 py-3.5 border-b border-[#F2EFE9] dark:border-[#2C2C2A] last:border-0">
        <div className="w-10 h-10 rounded-xl bg-[#F2EFE9] dark:bg-[#2C2C2A] flex items-center justify-center shrink-0">
          <Apple size={16} className="text-[#A68A64]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF] truncate">{entry.description}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-[#6E6E73]">{entry.time}</span>
            <span className="text-xs text-[#D4804A] font-medium">{entry.macros.calories} kcal</span>
            <div className="flex gap-2">
              {[
                { label: 'P', value: entry.macros.protein },
                { label: 'C', value: entry.macros.carbs },
                { label: 'F', value: entry.macros.fat },
              ].map(m => (
                <span key={m.label} className="text-xs text-[#9E9EA3]">{m.label} {m.value}g</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={entry.source === 'ai' ? 'accent' : 'muted'}>{entry.source}</Badge>
          <button
            onClick={onRemove}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9E9EA3] hover:bg-red-50 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Nutrition() {
  const { state, dispatch, todayFoodEntries, todayCalories, todayMacros } = useApp()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<MacroNutrients | null>(null)
  const [analysisDescription, setAnalysisDescription] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const calorieGoal = state.user?.preferences.dailyCalorieGoal ?? 2000
  const proteinGoal = Math.round(calorieGoal * 0.3 / 4)
  const carbsGoal = Math.round(calorieGoal * 0.45 / 4)
  const fatGoal = Math.round(calorieGoal * 0.25 / 9)

  async function analyzeFood() {
    if (!input.trim()) return
    setLoading(true)
    setAnalysisResult(null)

    const macros = await aiService.analyzeNutrition(input)
    setAnalysisResult(macros)
    setAnalysisDescription(input)
    setLoading(false)
  }

  function confirmEntry() {
    if (!analysisResult) return
    const entry: FoodEntry = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      description: analysisDescription,
      macros: analysisResult,
      source: 'ai',
    }
    dispatch({ type: 'ADD_FOOD_ENTRY', payload: entry })
    setInput('')
    setAnalysisResult(null)
    setAnalysisDescription('')
    setImagePreview(null)
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
      setInput(`Photo: ${file.name} — Please analyze this meal`)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-full px-5 pt-8 pb-6 max-w-3xl mx-auto lg:max-w-none lg:px-8 lg:pt-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-2">Track</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF]">Nutrition</h1>
        <p className="text-[#6E6E73] mt-1">Describe what you ate in plain language.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-5"
        >
          {/* Natural Language Input */}
          <Card padding="lg">
            <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-4">Log Food</p>

            <Textarea
              placeholder="e.g. Two eggs scrambled, two slices of toast with butter and a glass of orange juice"
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={4}
              className="mb-3"
            />

            {/* Image upload */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden mb-2">
                  <img src={imagePreview} alt="Food" className="w-full h-32 object-cover" />
                  <button
                    onClick={() => { setImagePreview(null); setInput('') }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-[#E8E5E0] dark:border-[#2C2C2A] rounded-xl flex items-center justify-center gap-2 text-sm text-[#6E6E73] hover:border-[#A68A64]/40 hover:bg-[#FAF8F5] transition-all"
                >
                  <Camera size={16} />
                  Upload food photo
                </button>
              )}
            </div>

            <Button
              fullWidth
              variant="primary"
              loading={loading}
              onClick={analyzeFood}
              disabled={!input.trim()}
            >
              <Sparkles size={15} />
              Analyze
            </Button>
          </Card>

          {/* Analysis Result */}
          <AnimatePresence>
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Card padding="lg" className="border-[#A68A64]/30">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73]">Analysis</p>
                    <Badge variant="accent">AI</Badge>
                  </div>
                  <p className="text-sm text-[#6E6E73] mb-4 leading-relaxed">"{analysisDescription}"</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#FFF3E8] rounded-xl p-3 text-center">
                      <p className="text-2xl font-semibold text-[#D4804A]">{analysisResult.calories}</p>
                      <p className="text-xs text-[#D4804A]/70 mt-0.5">kcal</p>
                    </div>
                    {[
                      { label: 'Protein', value: analysisResult.protein, color: MACRO_COLORS.protein },
                      { label: 'Carbs', value: analysisResult.carbs, color: MACRO_COLORS.carbs },
                      { label: 'Fat', value: analysisResult.fat, color: MACRO_COLORS.fat },
                    ].map(m => (
                      <div key={m.label} className="bg-[#FAF8F5] dark:bg-[#111110] rounded-xl p-3 text-center">
                        <p className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F3EF]">{m.value}g</p>
                        <p className="text-xs text-[#6E6E73] mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button fullWidth variant="primary" onClick={confirmEntry}>
                      <Plus size={15} />
                      Add to log
                    </Button>
                    <Button variant="ghost" onClick={() => setAnalysisResult(null)}>
                      Discard
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Today's Log */}
        <div className="lg:col-span-2 space-y-5">
          {/* Daily Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card padding="lg">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73]">Today's Nutrition</p>
                <div className="text-right">
                  <span className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EF]">{todayCalories}</span>
                  <span className="text-sm text-[#6E6E73] ml-1">/ {calorieGoal} kcal</span>
                </div>
              </div>

              <ProgressBar
                value={percentage(todayCalories, calorieGoal)}
                color="#D4804A"
                height={8}
                className="mb-5"
              />

              <div className="grid grid-cols-3 gap-4">
                <MacroStat label="Protein" value={todayMacros.protein} color={MACRO_COLORS.protein} goal={proteinGoal} />
                <MacroStat label="Carbs" value={todayMacros.carbs} color={MACRO_COLORS.carbs} goal={carbsGoal} />
                <MacroStat label="Fat" value={todayMacros.fat} color={MACRO_COLORS.fat} goal={fatGoal} />
              </div>
            </Card>
          </motion.div>

          {/* Food Log List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card padding="lg">
              <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-4">Food Log</p>
              {todayFoodEntries.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F2EFE9] dark:bg-[#2C2C2A] flex items-center justify-center mx-auto mb-3">
                    <Apple size={22} className="text-[#A68A64]" />
                  </div>
                  <p className="text-[#6E6E73] text-sm">Nothing logged yet today.</p>
                  <p className="text-xs text-[#9E9EA3] mt-1">Describe your meals in natural language to get started.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {todayFoodEntries.map(entry => (
                    <FoodEntryCard
                      key={entry.id}
                      entry={entry}
                      onRemove={() => dispatch({ type: 'REMOVE_FOOD_ENTRY', payload: entry.id })}
                    />
                  ))}
                </AnimatePresence>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
