function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-sm ${className}`}
            style={{
                backgroundSize: "400% 100%",
                animation: "shimmer 1.6s ease-in-out infinite",
            }}
        />
    );
}

// ─── TaskView Skeleton ────────────────────────────────────────────────────────

export default function TaskViewSkeleton() {
    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
            `}</style>

            <section className="max-w-full mx-auto">
                <div className="bg-teal-50 rounded-sm shadow border-gray-200 overflow-hidden">

                    {/* ── Header ── */}
                    <div className="border-b border-gray-200 p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Title + date */}
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-72" />
                                <Skeleton className="h-4 w-40" />
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-28 rounded-sm" />
                                <Skeleton className="h-9 w-24 rounded-sm" />
                            </div>
                        </div>
                    </div>

                    {/* ── Body ── */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ── Left col ── */}
                        <div className="lg:col-span-2">

                            {/* Description */}
                            <div className="mb-8 space-y-2">
                                <Skeleton className="h-6 w-32 mb-3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-11/12" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>

                            {/* Project card */}
                            <div className="bg-gray-50 rounded-sm p-5 space-y-3">
                                <div className="flex items-center gap-3 mb-1">
                                    {/* icon placeholder */}
                                    <Skeleton className="h-6 w-6 rounded-sm" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>

                        {/* ── Right sidebar ── */}
                        <div className="space-y-4">

                            {/* Assigned user card */}
                            <div className="bg-gray-50 rounded-sm p-4">
                                <Skeleton className="h-5 w-28 mb-4" />
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-3 w-44" />
                                    </div>
                                </div>
                            </div>

                            {/* Task details card */}
                            <div className="bg-gray-50 rounded-sm px-5 pb-4">
                                <Skeleton className="h-5 w-28 mb-4 mt-2" />

                                <div className="space-y-4">
                                    {/* 5 detail rows — icon circle + two lines each */}
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                                            <div className="space-y-1.5 flex-1">
                                                <Skeleton className="h-3 w-16" />
                                                <Skeleton className="h-4 w-28" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <Skeleton className="h-8 w-full rounded-sm mt-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
