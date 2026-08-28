export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-4 md:p-8 w-full max-w-7xl mx-auto motion-reduce:animate-none">
      {/* Header skeleton */}
      <div className="space-y-4 max-w-3xl">
        <div className="h-8 md:h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-2/3 md:w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full max-w-md"></div>
      </div>

      {/* Main dashboard content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (main content area) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress/Hero Card */}
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl h-64 w-full"></div>

          {/* List or grid items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl h-40 w-full"></div>
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl h-40 w-full"></div>
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl h-40 w-full"></div>
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl h-40 w-full"></div>
          </div>
        </div>

        {/* Right column (sidebar/stats) */}
        <div className="space-y-6">
          {/* User profile / Quick stats */}
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl h-48 w-full"></div>

          {/* Secondary widget */}
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl h-80 w-full"></div>
        </div>
      </div>
    </div>
  )
}
