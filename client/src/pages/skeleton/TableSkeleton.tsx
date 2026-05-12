export default function TableSkeleton({
    rows = 6,
    columns = 5,
}: {
    rows?: number;
    columns?: number;
}) {
    return (
        <div className="w-full overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm animate-pulse">

            {/* Header */}

            <div className="border-b border-gray-100 bg-gray-50 px-6 py-5">
                <div className="h-6 w-52 rounded-xl bg-gray-200" />
            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    {/* Table Head */}

                    <thead className="border-b border-gray-100 bg-gray-50">

                        <tr>
                            {Array.from({ length: columns }).map((_, i) => (
                                <th
                                    key={i}
                                    className="px-6 py-2"
                                >
                                    <div className="h-4 w-24 rounded-md bg-gray-200" />
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}

                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="border-b border-gray-100 last:border-0"
                            >
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-2"
                                    >

                                        {/* Avatar + Text */}

                                        {colIndex === 0 ? (
                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-gray-200" />

                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 rounded-md bg-gray-200" />

                                                    <div className="h-3 w-20 rounded-md bg-gray-100" />
                                                </div>
                                            </div>
                                        ) : colIndex === columns - 1 ? (

                                            /* Action Buttons */

                                            <div className="flex items-center gap-2">

                                                <div className="h-6 w-20 rounded-xl bg-gray-200" />

                                                <div className="h-6 w-20 rounded-xl bg-gray-100" />
                                            </div>

                                        ) : (

                                            /* Normal Cell */

                                            <div className="space-y-2">
                                                <div className="h-4 w-28 rounded-md bg-gray-200" />

                                                <div className="h-3 w-16 rounded-md bg-gray-100" />
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination */}

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">

                <div className="h-4 w-40 rounded-md bg-gray-200" />

                <div className="flex items-center gap-2">

                    <div className="h-8 w-10 rounded-xl bg-gray-200" />

                    <div className="h-8 w-10 rounded-xl bg-gray-100" />

                    <div className="h-8 w-10 rounded-xl bg-gray-200" />
                </div>
            </div>
        </div>
    );
}