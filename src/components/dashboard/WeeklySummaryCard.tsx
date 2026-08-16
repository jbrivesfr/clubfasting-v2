"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function WeeklySummaryCard() {
  const [loading, setLoading] = useState(true);
  const [fastCount, setFastCount] = useState<number>(0);
  const [avgWindow, setAvgWindow] = useState<number>(0);
  const [weightDelta, setWeightDelta] = useState<string>("—");

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [plannerRes, weightRes] = await Promise.all([
          fetch("/api/planner"),
          fetch("/api/weight"),
        ]);

        if (!isMounted) return;

        let count = 0;
        let windowHours = 0;

        if (plannerRes.ok) {
          const routine = await plannerRes.json();
          if (routine && routine.meals && routine.meals.length >= 2) {
            const start = routine.meals[0].time;
            const end = routine.meals[routine.meals.length - 1].time;
            windowHours = 24 - (end - start);

            // Round to nearest 0.5h
            windowHours = Math.round(windowHours * 2) / 2;

            if (routine.updated_at) {
              const daysSinceUpdate = Math.floor(
                (Date.now() - new Date(routine.updated_at).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              count = Math.min(7, Math.max(0, daysSinceUpdate));
            } else {
              // Fallback if updated_at is somehow missing but routine is active
              count = 7;
            }
          }
        }

        let delta = "—";
        if (weightRes.ok) {
          const weightData = await weightRes.json();
          if (weightData && weightData.length > 0) {
            const latest = weightData[weightData.length - 1];
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - 7);
            const targetTime = targetDate.getTime();

            let closestEntry = null;
            let smallestDiff = Infinity;

            for (let i = 0; i < weightData.length - 1; i++) {
              const entry = weightData[i];
              const entryTime = new Date(entry.date).getTime();
              const diff = Math.abs(entryTime - targetTime);
              if (diff < smallestDiff) {
                smallestDiff = diff;
                closestEntry = entry;
              }
            }

            // Only use if we actually found a previous entry that is different from latest
            if (closestEntry && closestEntry.date !== latest.date) {
              const diff = latest.weight - closestEntry.weight;
              delta = (diff > 0 ? "+" : "") + diff.toFixed(1);
            }
          }
        }

        setFastCount(count);
        setAvgWindow(windowHours);
        setWeightDelta(delta);
      } catch (err) {
        console.error("Error fetching weekly summary data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="animate-slide-up bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-white/[0.06] rounded-3xl p-6 shadow-sm flex flex-col justify-center min-h-[200px]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-slide-up bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-white/[0.06] rounded-3xl p-6 shadow-sm flex flex-col justify-center">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white">Mon bilan hebdo</h2>
        <p className="text-sm text-zinc-500 mt-1">Les 7 derniers jours</p>
      </div>

      {fastCount === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Pas encore de jeûne cette semaine — commence ton premier jeûne
          </p>
          <Link
            href="/dashboard/planner"
            className="inline-block px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Créer ma routine
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Jeûnes</span>
            <div className="text-3xl font-black font-display text-zinc-900 dark:text-white">
              {fastCount}
            </div>
            <span className="text-xs text-zinc-400 mt-1">terminés</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Moyenne</span>
            <div className="text-3xl font-black font-display text-zinc-900 dark:text-white">
              {avgWindow}h
            </div>
            <span className="text-xs text-zinc-400 mt-1">par jeûne</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Poids</span>
            <div className="text-3xl font-black font-display text-zinc-900 dark:text-white">
              {weightDelta}
            </div>
            <span className="text-xs text-zinc-400 mt-1">kg</span>
          </div>
        </div>
      )}
    </section>
  );
}
