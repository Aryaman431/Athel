import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Monitor, Download, Bell, BellOff, Target, Droplets } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useApp } from '../context/AppContext'
import { exportDataAsJson } from '../utils'

import { containerVariants, fadeUpVariants } from '../utils/animations'

const itemVariants = fadeUpVariants

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${enabled ? 'bg-[#5E8B7E]' : 'bg-[#E8E5E0] dark:bg-[#2C2C2A]'}`}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

export default function Settings() {
  const { state, dispatch } = useApp()
  const user = state.user!
  const [name, setName] = useState(user.name)
  const [calorieGoal, setCalorieGoal] = useState(String(user.preferences.dailyCalorieGoal))
  const [waterGoal, setWaterGoal] = useState(String(user.preferences.dailyWaterGoal))
  const [saved, setSaved] = useState(false)

  function saveProfile() {
    dispatch({
      type: 'SET_USER',
      payload: {
        ...user,
        name: name.trim() || user.name,
        preferences: {
          ...user.preferences,
          dailyCalorieGoal: parseInt(calorieGoal) || user.preferences.dailyCalorieGoal,
          dailyWaterGoal: parseInt(waterGoal) || user.preferences.dailyWaterGoal,
        },
      },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function setTheme(theme: 'light' | 'dark') {
    dispatch({ type: 'SET_THEME', payload: theme })
  }

  function exportData() {
    exportDataAsJson(state, `aethel-export-${new Date().toISOString().split('T')[0]}.json`)
  }

  return (
    <div className="min-h-full px-5 pt-8 pb-6 max-w-2xl mx-auto lg:px-8 lg:pt-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-2">Preferences</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF]">Settings</h1>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {/* Profile */}
        <motion.div variants={itemVariants}>
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#F2EFE9] dark:bg-[#2C2C2A] flex items-center justify-center">
                <span className="text-lg font-semibold text-[#A68A64]">{name[0]?.toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">{user.name}</p>
                <p className="text-sm text-[#6E6E73]">{user.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Calorie Goal"
                  type="number"
                  value={calorieGoal}
                  onChange={e => setCalorieGoal(e.target.value)}
                  suffix={<><Target size={14} className="inline mr-1" />kcal</>}
                />
                <Input
                  label="Water Goal"
                  type="number"
                  value={waterGoal}
                  onChange={e => setWaterGoal(e.target.value)}
                  suffix={<><Droplets size={14} className="inline mr-1" />ml</>}
                />
              </div>
              <Button
                variant={saved ? 'accent' : 'primary'}
                onClick={saveProfile}
                size="md"
              >
                {saved ? '✓ Saved' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={itemVariants}>
          <Card padding="lg">
            <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-4">Appearance</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  state.theme === 'light'
                    ? 'border-[#A68A64] bg-[#F5EFE6]'
                    : 'border-[#E8E5E0] dark:border-[#2C2C2A] hover:border-[#C8C4BD]'
                }`}
              >
                <Sun size={18} className={state.theme === 'light' ? 'text-[#A68A64]' : 'text-[#6E6E73]'} />
                <span className={`text-sm font-medium ${state.theme === 'light' ? 'text-[#A68A64]' : 'text-[#6E6E73]'}`}>Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  state.theme === 'dark'
                    ? 'border-[#A68A64] bg-[#F5EFE6] dark:bg-[#2C1F12]'
                    : 'border-[#E8E5E0] dark:border-[#2C2C2A] hover:border-[#C8C4BD]'
                }`}
              >
                <Moon size={18} className={state.theme === 'dark' ? 'text-[#A68A64]' : 'text-[#6E6E73]'} />
                <span className={`text-sm font-medium ${state.theme === 'dark' ? 'text-[#A68A64]' : 'text-[#6E6E73]'}`}>Dark</span>
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <Card padding="lg">
            <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-4">Notifications</p>
            <div className="space-y-4">
              {[
                { label: 'Daily Reminders', description: 'Gentle nudges to log and reflect', icon: Bell, key: 'notifications' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F2EFE9] dark:bg-[#2C2C2A] flex items-center justify-center">
                      <item.icon size={16} className="text-[#A68A64]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F3EF]">{item.label}</p>
                      <p className="text-xs text-[#6E6E73]">{item.description}</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={user.preferences.notifications}
                    onChange={(v) => {
                      dispatch({
                        type: 'SET_USER',
                        payload: { ...user, preferences: { ...user.preferences, notifications: v } },
                      })
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Data */}
        <motion.div variants={itemVariants}>
          <Card padding="lg">
            <p className="text-xs font-medium tracking-widest uppercase text-[#6E6E73] mb-4">Your Data</p>
            <div className="space-y-3">
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                All your data is stored locally on this device. Export a full backup at any time.
              </p>
              <Button variant="secondary" onClick={exportData} size="md">
                <Download size={16} />
                Export Data (JSON)
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div variants={itemVariants}>
          <Card padding="lg" className="text-center">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D1F] dark:bg-[#F5F3EF] flex items-center justify-center mx-auto mb-3">
              <span className="text-white dark:text-[#1D1D1F] font-bold text-sm">Æ</span>
            </div>
            <p className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F3EF]">Aethel</p>
            <p className="text-sm text-[#6E6E73] mt-1">Version 1.0.0</p>
            <p className="text-xs text-[#9E9EA3] mt-3">Crafted with care for your wellbeing.</p>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
