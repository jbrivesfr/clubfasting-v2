import React from 'react';

interface StreakMilestonesProps {
  user: any;
}

export default function StreakMilestones({ user }: StreakMilestonesProps) {
  const streakDays = user?.streakDays || 0;
  const milestones = [7, 14, 30, 100];

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4" aria-label="Jalons de série">
      <span className="text-sm font-medium text-zinc-500 mr-2">Jalons :</span>
      {milestones.map((ms) => {
        const unlocked = streakDays >= ms;
        return (
          <div
            key={ms}
            className={`flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
              unlocked
                ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
                : 'bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-500 dark:border-zinc-700/50'
            }`}
          >
            {ms}j
          </div>
        );
      })}
    </div>
  );
}
