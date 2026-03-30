export default function Loading() {
  return (
    <div className="animate-pulse bg-background px-4 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="h-4 w-32 rounded bg-black/[0.08]" />
        <div className="mt-4 h-10 max-w-xl rounded-lg bg-black/[0.08]" />
        <div className="mt-4 h-4 max-w-2xl rounded bg-black/[0.06]" />
        <div className="mt-3 h-4 max-w-lg rounded bg-black/[0.06]" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-black/[0.06] bg-card">
              <div className="aspect-[4/3] bg-black/[0.06]" />
              <div className="space-y-3 p-5">
                <div className="h-5 max-w-[85%] rounded bg-black/[0.08]" />
                <div className="h-4 max-w-[50%] rounded bg-black/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
