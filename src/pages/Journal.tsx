import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, X } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useApp } from '../context/AppContext'
import type { Mood, JournalEntry } from '../types'
import { generateId, formatDate, MOOD_LABELS, MOOD_EMOJI } from '../utils'

const MOODS: Mood[] = ['great', 'good', 'okay', 'low', 'struggling']

const moodColors: Record<Mood, { bg: string; text: string; border: string }> = {
  great: { bg: '#EBF2F0', text: '#5E8B7E', border: '#5E8B7E' },
  good: { bg: '#F5EFE6', text: '#A68A64', border: '#A68A64' },
  okay: { bg: '#F2EFE9', text: '#8E8E93', border: '#C8C4BD' },
  low: { bg: '#FFF3E8', text: '#D4804A', border: '#D4804A' },
  struggling: { bg: '#FEF0EF', text: '#C4826A', border: '#C4826A' },
}

function MoodPicker({ selected, onChange }: { selected: Mood; onChange: (m: Mood) => void }) {
  return (
    <div className="flex items-center gap-2">
      {MOODS.map(mood => {
        const colors = moodColors[mood]
        const isSelected = selected === mood
        return (
          <motion.button
            key={mood}
            whileTap={{ scale: 0.93 }}
            onClick={() => onChange(mood)}
            className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
              isSelected
                ? `border-[${colors.border}] bg-[${colors.bg}]`
                : 'border-[#E8E5E0] dark:border-[#2C2C2A] hover:border-[#C8C4BD]'
            }`}
            style={isSelected ? { borderColor: colors.border, backgroundColor: colors.bg } : {}}
          >
            <span className="text-base" style={isSelected ? { color: colors.text } : { color: '#9E9EA3' }}>
              {MOOD_EMOJI[mood]}
            </span>
            <span className="text-[10px] font-medium" style={isSelected ? { color: colors.text } : { color: '#9E9EA3' }}>
              {MOOD_LABELS[mood]}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

function EntryCard({ entry }: { entry: JournalEntry }) {
  const [expanded, setExpanded] = useState(false)
  const colors = moodColors[entry.mood]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card hover padding="md" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {MOOD_EMOJI[entry.mood]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">{formatDate(entry.date)}</p>
                <Badge variant="muted">{MOOD_LABELS[entry.mood]}</Badge>
              </div>
              {!expanded && (
                <p className="text-sm text-[#6E6E73] mt-0.5 line-clamp-1">{entry.reflection}</p>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 border-t border-[#F2EFE9] dark:border-[#2C2C2A] pt-4">
                <div>
                  <p className="text-xs font-medium text-[#6E6E73] mb-1">Reflection</p>
                  <p className="text-sm text-[#1D1D1F] dark:text-[#F5F3EF] leading-relaxed">{entry.reflection}</p>
                </div>
                {entry.gratitude && (
                  <div>
                    <p className="text-xs font-medium text-[#6E6E73] mb-1">Gratitude</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#F5F3EF] leading-relaxed">{entry.gratitude}</p>
                  </div>
                )}
                {entry.intentions && (
                  <div>
                    <p className="text-xs font-medium text-[#6E6E73] mb-1">Intentions</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#F5F3EF] leading-relaxed">{entry.intentions}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

interface JournalFormData {
  mood: Mood
  reflection: string
  gratitude: string
  intentions: string
}

export default function Journal() {
  const { state, dispatch } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<JournalFormData>({
    mood: 'good',
    reflection: '',
    gratitude: '',
    intentions: '',
  })

  const sortedEntries = [...state.journalEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  function saveEntry() {
    if (!form.reflection.trim()) return

    const entry: JournalEntry = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      mood: form.mood,
      reflection: form.reflection,
      gratitude: form.gratitude || undefined,
      intentions: form.intentions || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: entry })
    setForm({ mood: 'good', reflection: '', gratitude: '', intentions: '' })
    setShowForm(false)
  }

  return (
    <div className="min-h-full px-5 pt-8 pb-6 max-w-3xl mx-auto lg:max-w-none lg:px-8 lg:pt-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-2">Daily Reflection</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF]">Journal</h1>
          <p className="text-[#6E6E73] mt-1">A quiet space to check in with yourself.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)} className="shrink-0">
          <Plus size={16} />
          New entry
        </Button>
      </div>

      {/* Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6"
          >
            <Card padding="lg" className="border-[#A68A64]/30">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F3EF]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-[#F2EFE9] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF] mb-3">How are you feeling?</p>
                  <MoodPicker selected={form.mood} onChange={m => setForm(f => ({ ...f, mood: m }))} />
                </div>

                <Textarea
                  label="Reflection"
                  placeholder="How was your day? What's on your mind?"
                  value={form.reflection}
                  onChange={e => setForm(f => ({ ...f, reflection: e.target.value }))}
                  rows={3}
                />

                <Textarea
                  label="Gratitude (optional)"
                  placeholder="What are you grateful for today?"
                  value={form.gratitude}
                  onChange={e => setForm(f => ({ ...f, gratitude: e.target.value }))}
                  rows={2}
                />

                <Textarea
                  label="Intentions (optional)"
                  placeholder="What would make tomorrow great?"
                  value={form.intentions}
                  onChange={e => setForm(f => ({ ...f, intentions: e.target.value }))}
                  rows={2}
                />

                <Button
                  fullWidth
                  variant="primary"
                  onClick={saveEntry}
                  disabled={!form.reflection.trim()}
                >
                  Save Entry
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      {sortedEntries.length === 0 ? (
        <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F2EFE9] dark:bg-[#2C2C2A] flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-[#A68A64]" />
          </div>
          <h3 className="text-lg font-medium text-[#1D1D1F] dark:text-[#F5F3EF] mb-1">Your journal awaits</h3>
          <p className="text-[#6E6E73] text-sm max-w-xs">
            A few minutes of reflection each day can meaningfully improve your sense of clarity and wellbeing.
          </p>
          <Button className="mt-5" variant="accent" size="sm" onClick={() => setShowForm(true)}>
            Write your first entry
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedEntries.map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
