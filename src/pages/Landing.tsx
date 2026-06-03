import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { featureHighlights } from '../data/mockData'
import { Button } from '../components/ui/Button'

import { fadeUpVariants } from '../utils/animations'

const fadeUp = fadeUpVariants

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
}

const benefits = [
  'Natural language food logging',
  'AI-personalized workouts',
  'Daily wellness scoring',
  'Beautiful weekly insights',
  'Mindful journal prompts',
  'Fully offline capable',
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#111110] overflow-x-hidden">
      {/* ── Header ────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#FAF8F5]/80 dark:bg-[#111110]/80 backdrop-blur-xl border-b border-[#E8E5E0]/50 dark:border-[#2C2C2A]/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1D1D1F] dark:bg-[#F5F3EF] flex items-center justify-center">
              <span className="text-white dark:text-[#1D1D1F] text-xs font-bold">Æ</span>
            </div>
            <span className="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F3EF] tracking-tight">Aethel</span>
          </div>
          <Link to="/dashboard">
            <Button size="sm" variant="primary">Open App</Button>
          </Link>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EFE9] dark:bg-[#2C2C2A] text-[#A68A64] text-xs font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E8B7E] animate-pulse" />
            Intelligent Wellness — Now in Beta
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF] leading-[1.05] mb-6"
          >
            Wellness that<br />
            <span className="text-[#A68A64]">understands you.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-xl text-[#6E6E73] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Aethel is a calm, intelligent companion for your fitness and nutrition journey. 
            No noise, no pressure — just thoughtful guidance at your own pace.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/dashboard">
              <Button size="lg" variant="primary" className="gap-2">
                Begin your journey
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Button size="lg" variant="ghost">
              Watch overview
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Product Showcase ──────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl bg-[#1D1D1F] dark:bg-[#1C1C1A] overflow-hidden p-8 sm:p-12"
          >
            {/* Mock dashboard preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Wellness Score', value: '84', sub: 'Excellent today', color: '#5E8B7E' },
                { label: 'Calories', value: '1,240', sub: 'of 2,000 kcal', color: '#A68A64' },
                { label: 'Water', value: '1.8L', sub: 'of 2.5L goal', color: '#7B9BAF' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="bg-white/5 rounded-2xl p-5"
                >
                  <p className="text-white/40 text-xs mb-2">{stat.label}</p>
                  <p className="text-3xl font-semibold text-white mb-1">{stat.value}</p>
                  <p className="text-xs" style={{ color: stat.color }}>{stat.sub}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-5 space-y-3">
                <p className="text-white/40 text-xs">Today's Activity</p>
                {['Morning Walk — 25 min', 'Strength Training — 45 min'].map(act => (
                  <div key={act} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5E8B7E]" />
                    <p className="text-white/70 text-sm">{act}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 rounded-2xl p-5 space-y-2">
                <p className="text-white/40 text-xs">Daily Insight</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  "Your activity consistency this week is exceptional. 
                  A gentle reminder that rest is equally part of your progress."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF] mb-4">
              Everything you need.<br />Nothing you don't.
            </h2>
            <p className="text-[#6E6E73] text-lg max-w-xl mx-auto">
              A carefully considered set of tools designed to support your wellbeing without overwhelming it.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {featureHighlights.map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                className="bg-white dark:bg-[#1C1C1A] border border-[#E8E5E0] dark:border-[#2C2C2A] rounded-2xl p-7 hover:border-[#C8C4BD] dark:hover:border-[#3C3C3A] transition-colors duration-200"
              >
                <span className="text-2xl text-[#A68A64] mb-4 block">{feat.icon}</span>
                <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F3EF] mb-2">{feat.title}</h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Benefits List ─────────────────────────────── */}
      <section className="py-16 px-6 bg-white dark:bg-[#1C1C1A]">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <CheckCircle size={18} className="text-[#5E8B7E] shrink-0" />
                <span className="text-[#1D1D1F] dark:text-[#F5F3EF] text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F3EF] mb-5">
              Your wellness journey<br />starts now.
            </h2>
            <p className="text-[#6E6E73] mb-8 text-lg">
              Join thousands who've found a calmer, more intentional approach to health.
            </p>
            <Link to="/dashboard">
              <Button size="lg" variant="accent" className="gap-2">
                Get started — it's free
                <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-[#E8E5E0] dark:border-[#2C2C2A] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1D1D1F] dark:bg-[#F5F3EF] flex items-center justify-center">
              <span className="text-white dark:text-[#1D1D1F] text-xs font-bold">Æ</span>
            </div>
            <span className="text-sm text-[#6E6E73]">Aethel © 2025</span>
          </div>
          <p className="text-xs text-[#9E9EA3]">
            Crafted with care for your wellbeing.
          </p>
        </div>
      </footer>
    </div>
  )
}
