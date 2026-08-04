'use client'

import React, { useState, useEffect } from 'react'

const STEPS = [
  {
    title: "Suivez votre jeûne quotidien",
    target: "#tool-card-weight-tracker",
  },
  {
    title: "Atteignez vos macros",
    target: "#tool-card-macros",
  },
  {
    title: "Partagez avec la communauté",
    target: "#newsfeed-section",
  }
]

export default function OnboardingTooltip() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [pos, setPos] = useState({ top: 0, left: 0, show: false })

  useEffect(() => {
    const done = localStorage.getItem('onboarding_dashboard_done')
    if (!done) {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    const updatePosition = () => {
      const targetEl = document.querySelector(STEPS[step].target)
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect()
        // position slightly below the target, or centered on it
        const top = rect.bottom + window.scrollY + 10
        const left = Math.max(10, rect.left + window.scrollX)
        setPos({ top, left, show: true })
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        // Fallback to center screen if element not found right away
        setPos({ top: window.scrollY + window.innerHeight / 2, left: window.innerWidth / 2 - 150, show: true })
      }
    }

    // Give the DOM a tiny bit of time to render dynamic content
    const t = setTimeout(updatePosition, 300)
    window.addEventListener('resize', updatePosition)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updatePosition)
    }
  }, [step, visible])

  if (!visible) return null

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      setPos({ ...pos, show: false })
    } else {
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('onboarding_dashboard_done', 'true')
    setVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-auto" />

      {/* Tooltip Card */}
      {pos.show && (
        <div
          className="absolute bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-2xl z-[51] pointer-events-auto transition-all w-[300px]"
          style={{ top: Math.min(pos.top, window.innerHeight + window.scrollY - 200), left: Math.min(pos.left, window.innerWidth - 320) }}
        >
          <div className="text-xs font-bold text-orange-500 mb-1 uppercase tracking-wider">
            Étape {step + 1} sur {STEPS.length}
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
            {STEPS[step].title}
          </h3>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleDismiss}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Passer
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors"
            >
              {step === STEPS.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
