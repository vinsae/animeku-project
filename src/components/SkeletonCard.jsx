/**
 * src/components/SkeletonCard.jsx
 * Shimmer placeholder shown while anime cards are loading.
 */

export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden">
      {/* Poster skeleton */}
      <div className="skeleton aspect-[3/4] rounded-xl" />
      {/* Title skeleton */}
      <div className="mt-2 space-y-1.5 px-0.5">
        <div className="skeleton h-3.5 rounded-md w-full" />
        <div className="skeleton h-3.5 rounded-md w-3/4" />
      </div>
    </div>
  )
}

/**
 * Grid of skeleton cards
 */
export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/**
 * Skeleton for detail page
 */
export function SkeletonDetail() {
  return (
    <div className="animate-pulse2 space-y-4 p-4">
      <div className="flex gap-4">
        <div className="skeleton w-32 h-44 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="skeleton h-5 rounded w-3/4" />
          <div className="skeleton h-4 rounded w-1/2" />
          <div className="skeleton h-3 rounded w-1/3" />
          <div className="skeleton h-3 rounded w-2/5" />
          <div className="skeleton h-3 rounded w-1/4" />
        </div>
      </div>
      <div className="skeleton h-20 rounded-xl" />
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="skeleton h-9 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton for watch page
 */
export function SkeletonWatch() {
  return (
    <div className="space-y-4">
      <div className="skeleton w-full" style={{ paddingBottom: '56.25%', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0 }} />
      </div>
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 rounded w-3/4" />
        <div className="skeleton h-4 rounded w-1/2" />
        <div className="grid grid-cols-5 gap-2 mt-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="skeleton h-9 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
