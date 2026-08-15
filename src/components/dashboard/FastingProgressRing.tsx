"use client";
import React from 'react';
import { computeFastingState } from '@/lib/fasting/compute-window';

export default function FastingProgressRing({ lastMealAt }: { lastMealAt: Date | null }) {
  if (!lastMealAt) {
    return (
      <div className="max-w-xs mx-auto text-center" aria-label="Aucun repas enregistré">
        <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            className="stroke-gray-400"
            strokeWidth="8"
          />
        </svg>
        <p className="mt-4 text-sm font-medium text-gray-500">Aucun repas enregistré</p>
      </div>
    );
  }

  const { hoursElapsed, state, hoursToGoal } = computeFastingState(new Date(), lastMealAt);
  const progress = Math.min(100, (hoursElapsed / 16) * 100);
  const circumference = 2 * Math.PI * 52;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;
  const strokeColor = state === 'pre-window' ? 'stroke-gray-400' : state === 'in-window' ? 'stroke-amber-500' : 'stroke-emerald-500';

  let labelText = '';
  if (state === 'pre-window') {
    labelText = `Dernier repas il y a ${Math.floor(hoursElapsed)}h`;
  } else if (state === 'in-window') {
    labelText = `En jeûne depuis ${Math.floor(hoursElapsed)}h`;
  } else {
    labelText = `Objectif 12h atteint ✓`;
  }

  return (
    <div className="max-w-xs mx-auto text-center" aria-label={labelText}>
      <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          className="stroke-gray-200 dark:stroke-zinc-800"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          className={`${strokeColor} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
        <text
          x="60"
          y="60"
          transform="rotate(90 60 60)"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-current text-zinc-900 dark:text-white"
        >
          {Math.floor(hoursElapsed)}h
        </text>
      </svg>
      <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">{labelText}</p>
      {state !== 'goal-met' && (
        <p className="text-xs text-zinc-500 mt-1">Encore {Math.ceil(hoursToGoal)}h avant l'objectif</p>
      )}
    </div>
  );
}
