export function EmptyState({ icon = '📭', title = 'Aucun message', description = 'Aucun message trouvé pour ce parcours.' }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/60 border border-[#e2d9c3] dark:border-white/[0.06] p-12 text-center">
      <div className="relative">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/[0.04] border border-[#e2d9c3] dark:border-white/[0.08] text-2xl mb-4">
          {icon}
        </div>
        <p className="text-gray-700 dark:text-zinc-300 font-medium mb-1">{title}</p>
        <p className="text-sm text-gray-500 dark:text-zinc-500">{description}</p>
      </div>
    </div>
  )
}
