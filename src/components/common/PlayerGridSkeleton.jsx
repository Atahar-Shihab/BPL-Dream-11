const PlayerCardSkeleton = () => (
  <article className="player-card animate-pulse dark:border-neutral-800 dark:bg-neutral-900">
    <div className="player-photo-wrap bg-neutral-200 dark:bg-neutral-800" />
    <div className="player-card-body space-y-3">
      <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      <div className="flex justify-between">
        <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 w-1/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
      <div className="flex justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="h-4 w-1/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-2/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-3 w-2/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
      <div className="flex justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <div className="h-4 w-1/5 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-8 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
      </div>
    </div>
  </article>
);

const PlayerGridSkeleton = ({ count = 6 }) => (
  <div className="player-grid">
    {Array.from({ length: count }, (_, i) => (
      <PlayerCardSkeleton key={i} />
    ))}
  </div>
);

export default PlayerGridSkeleton;
