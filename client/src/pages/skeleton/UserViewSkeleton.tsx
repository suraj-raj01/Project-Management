export default function UserViewSkeleton() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-full mx-auto space-y-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="h-8 w-52 bg-gray-200 rounded-sm" />
                        <div className="h-4 w-72 bg-gray-200 rounded-sm mt-2" />
                    </div>
                </div>

                {/* User Card */}
                <div className="bg-teal-50/40 border-2 border-teal-100 rounded-sm p-4">
                    <div className="flex sm:flex-row sm:items-center gap-4 md:gap-8">

                        {/* Avatar */}
                        <div className="h-24 w-24 rounded-full bg-gray-200" />

                        {/* User Info */}
                        <div className="space-y-3 w-full">
                            <div className="h-7 w-48 bg-gray-200 rounded-sm" />

                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded-sm" />
                                <div className="h-4 w-56 bg-gray-200 rounded-sm" />
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded-sm" />
                                <div className="h-4 w-40 bg-gray-200 rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="bg-teal-50/40 border-2 border-teal-100 rounded-sm p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-3">
                                    <div className="h-4 w-24 bg-gray-200 rounded-sm" />
                                    <div className="h-8 w-16 bg-gray-200 rounded-sm" />
                                </div>

                                <div className="h-12 w-12 bg-gray-200 rounded-sm" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tasks Section */}
                <div className="rounded-sm bg-gray-50 md:p-4 p-3">

                    {/* Title */}
                    <div className="h-7 w-44 bg-gray-200 rounded-sm mb-6" />

                    {/* Task Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-sm p-5 border-2 border-teal-100 bg-teal-50/40"
                            >
                                {/* Top */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="h-6 w-40 bg-gray-200 rounded-sm" />
                                    <div className="h-6 w-20 bg-gray-200 rounded-sm" />
                                </div>

                                {/* Description */}
                                <div className="space-y-2 mt-4">
                                    <div className="h-4 w-full bg-gray-200 rounded-sm" />
                                    <div className="h-4 w-11/12 bg-gray-200 rounded-sm" />
                                    <div className="h-4 w-8/12 bg-gray-200 rounded-sm" />
                                </div>

                                {/* Project */}
                                <div className="mt-5">
                                    <div className="h-3 w-16 bg-gray-200 rounded-sm mb-2" />

                                    <div className="bg-white rounded-sm p-3 space-y-2">
                                        <div className="h-4 w-32 bg-gray-200 rounded-sm" />
                                        <div className="h-3 w-full bg-gray-200 rounded-sm" />
                                        <div className="h-3 w-9/12 bg-gray-200 rounded-sm" />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 bg-gray-200 rounded-sm" />
                                        <div className="h-4 w-24 bg-gray-200 rounded-sm" />
                                    </div>

                                    <div className="h-6 w-24 bg-gray-200 rounded-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}