/** A single shimmering bar */
function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] rounded-sm ${className}`}
            style={{
                animation: "shimmer 1.6s ease-in-out infinite",
            }}
        />
    );
}

/** Matches the shape of a single <StatCard /> */
function StatCardSkeleton() {
    return (
        <div className="bg-white border border-green-50 rounded-sm p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-3 md:w-24 w-20" />
                <Skeleton className="h-9 w-9 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
        </div>
    );
}

/** Matches the shape of <CompletionRate /> */
function CompletionRateSkeleton() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white border border-green-50 rounded-sm shadow-sm px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
            </div>
            <div className="bg-white border border-green-50 rounded-sm shadow-sm px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
            </div>
        </section>
    );
}

/** Matches the shape of a single recent-task card */
function TaskCardSkeleton() {
    return (
        <div className="bg-green-50/50 border border-green-50 rounded-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-6 w-14 rounded-sm" />
                <Skeleton className="h-6 w-20 rounded-sm" />
            </div>
        </div>
    );
}

// ─── Composed skeleton screens ────────────────────────────────────────────────

export default function AdminDashboardSkeleton() {
    return (
        <section className="space-y-5">
            {/* 5 stat cards */}
            <div>
                <Skeleton className="h-6 w-14 mb-2 rounded-sm" />
                <Skeleton className="h-2 w-80 mb-4 rounded-sm" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Completion bar */}
            <div>
                <Skeleton className="h-6 w-14 mb-2 rounded-sm" />
                <Skeleton className="h-2 w-80 mb-4 rounded-sm" />
            </div>
            <CompletionRateSkeleton />

            {/* 2 extra stat cards */}
            <div>
                <Skeleton className="h-6 w-14 mb-2 rounded-sm" />
                <Skeleton className="h-2 w-80 mb-4 rounded-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

export function UserDashboardSkeleton() {
    return (
        <section className="space-y-5">
            {/* 5 stat cards */}
            <div>
                <Skeleton className="h-6 w-14 mb-2 rounded-sm" />
                <Skeleton className="h-2 w-80 mb-4 rounded-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Completion bar */}
            <div>
                <Skeleton className="h-6 w-14 mb-2 rounded-sm" />
                <Skeleton className="h-2 w-80 mb-4 rounded-sm" />
            </div>
            <CompletionRateSkeleton />

            {/* Recent tasks panel */}
            <div>
                <Skeleton className="h-6 w-14 mb-2 rounded-sm" />
                <Skeleton className="h-2 w-80 mb-4 rounded-sm" />
            </div>
            <div className="bg-gray-50 border border-green-50 rounded-sm shadow-sm px-6 py-4 space-y-3">
                <Skeleton className="h-5 w-36 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <TaskCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}