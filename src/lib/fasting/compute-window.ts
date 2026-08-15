export function computeFastingState(now: Date, lastMealAt: Date | null): { hoursElapsed: number, state: 'pre-window' | 'in-window' | 'goal-met', hoursToGoal: number } {
  if (!lastMealAt) {
    return { hoursElapsed: 0, state: 'pre-window', hoursToGoal: 12 };
  }

  const msElapsed = now.getTime() - lastMealAt.getTime();
  const hoursElapsed = msElapsed / (1000 * 60 * 60);
  const hoursToGoal = Math.max(0, 12 - hoursElapsed);

  let state: 'pre-window' | 'in-window' | 'goal-met';
  if (hoursElapsed < 8) {
    state = 'pre-window';
  } else if (hoursElapsed < 12) {
    state = 'in-window';
  } else {
    state = 'goal-met';
  }

  return { hoursElapsed, state, hoursToGoal };
}
