import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useApp } from '../context/AppContext'
import { scoreToColor, scoreToLabel } from '../utils'
import { format, parseISO } from 'date-fns'

import { containerVariants, fadeUpVariants } from '../utils/animations'

const itemVariants = fadeUpVariants

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#1C1C1A] border border-[#E8E5E0] dark:border-[#2C2C2A] rounded-xl px-3 py-2 shadow-sm">
      <p className="text-xs text-[#6E6E73] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {Math.round(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Insights() {
  const { state, wellnessScoreToday } = useApp()

  const chartData = state.wellnessScores.map(s => ({
    date: format(parseISO(s.date), 'EEE'),
    score: s.score,
    activity: s.components.activity,
    nutrition: s.components.nutrition,
    mindfulness: s.components.mindfulness,
  }))

  const avgScore = Math.round(
    state.wellnessScores.reduce((sum, s) => sum + s.score, 0) / (state.wellnessScores.length || 1)
  )

  const latestScore = state.wellnessScores[state.wellnessScores.length - 1]
  const scoreColor = scoreToColor(wellnessScoreToday)

  // Streaks (mock)
  const activityStreak = 4
  const loggingStreak = 5

  return (
    <div className="min-h-full px-5 pt-8 pb-6 max-w-3xl mx-auto lg:max-w-none lg:px-8 lg:pt-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-2">Weekly</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF]">Your Insights</h1>
        <p className="text-[#6E6E73] mt-1">A calm reflection on your past seven days.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Weekly Avg', value: `${avgScore}`, sub: scoreToLabel(avgScore), color: scoreColor },
            { label: 'Activity Streak', value: `${activityStreak}d`, sub: 'consecutive days', color: '#5E8B7E' },
            { label: 'Logging Streak', value: `${loggingStreak}d`, sub: 'days logged', color: '#A68A64' },
            { label: 'Today', value: `${wellnessScoreToday}`, sub: scoreToLabel(wellnessScoreToday), color: scoreColor },
          ].map(stat => (
            <Card key={stat.label} padding="md">
              <p className="text-xs text-[#6E6E73] mb-2">{stat.label}</p>
              <p className="text-3xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EF] leading-none mb-1" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-[#6E6E73]">{stat.sub}</p>
            </Card>
          ))}
        </motion.div>

        {/* Wellness Score Chart */}
        <motion.div variants={itemVariants}>
          <Card padding="lg">
            <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-5">Wellness Score — 7 Days</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={scoreColor} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={scoreColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#6E6E73', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6E6E73', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={scoreColor}
                  strokeWidth={2}
                  fill="url(#scoreGrad)"
                  dot={{ fill: scoreColor, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: scoreColor }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Component Breakdown */}
        <motion.div variants={itemVariants}>
          <Card padding="lg">
            <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-5">This Week's Components</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barSize={8} barGap={2}>
                <XAxis dataKey="date" tick={{ fill: '#6E6E73', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6E6E73', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="activity" fill="#5E8B7E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nutrition" fill="#A68A64" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mindfulness" fill="#7B9BAF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-4">
              {[
                { label: 'Activity', color: '#5E8B7E' },
                { label: 'Nutrition', color: '#A68A64' },
                { label: 'Mindfulness', color: '#7B9BAF' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#6E6E73]">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Detailed breakdown */}
        {latestScore && (
          <motion.div variants={itemVariants}>
            <Card padding="lg">
              <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-5">Today's Breakdown</p>
              <div className="space-y-4">
                {[
                  { label: 'Activity', value: latestScore.components.activity, color: '#5E8B7E', description: 'Movement, exercise, and physical effort' },
                  { label: 'Nutrition', value: latestScore.components.nutrition, color: '#A68A64', description: 'Caloric balance and macro consistency' },
                  { label: 'Mindfulness', value: latestScore.components.mindfulness, color: '#7B9BAF', description: 'Reflection, journaling, and calm moments' },
                  { label: 'Sleep', value: latestScore.components.sleep, color: '#9B7EC8', description: 'Rest quality and recovery' },
                ].map(c => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">{c.label}</span>
                        <span className="text-xs text-[#9E9EA3] ml-2">{c.description}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: c.color }}>{c.value}</span>
                    </div>
                    <ProgressBar value={c.value} color={c.color} height={6} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Consistency Note */}
        <motion.div variants={itemVariants}>
          <Card padding="lg" className="bg-[#EBF2F0] dark:bg-[#1A2420] border-[#5E8B7E]/20">
            <div className="flex items-start gap-3">
              <span className="text-[#5E8B7E] text-xl mt-0.5">◈</span>
              <div>
                <p className="text-sm font-semibold text-[#5E8B7E] mb-1">Consistency is your superpower</p>
                <p className="text-sm text-[#5E8B7E]/80 leading-relaxed">
                  You've maintained a {loggingStreak}-day logging streak. Research shows that consistent tracking — even imperfect tracking — correlates strongly with long-term wellness outcomes.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
