import TableSkeleton from "./TableSkeleton";

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
                    <div className="flex flex-col md:flex-row sm:items-center gap-4 md:gap-10">

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
                    {/* Tasks */}
                    <TableSkeleton/>
                </div>
            </div>
        </div>
    );
}