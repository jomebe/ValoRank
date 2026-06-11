export function LoadingSkeleton() {
  return (
    <div className="page-shell py-16">
      <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
      <div className="mt-4 h-10 w-72 max-w-full animate-pulse rounded-xl bg-white/5" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-white/[0.035]" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[22px] border border-white/5 bg-white/[0.02]"
          >
            <div className="aspect-[1.2/1] animate-pulse bg-white/[0.035]" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-white/5" />
              <div className="h-10 w-24 animate-pulse rounded-xl bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
