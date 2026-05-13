export default function HeroSectionSkeleton() {
    return (
        <section className="relative overflow-hidden min-h-screen -mt-15 pt-45 pb-10 md:pb-1 md:pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 animate-pulse">

            {/* Background Blur Effects */}
            <div className="absolute top-0 left-0 w-72 md:h-72 h-50 bg-gray-300/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-300/20 blur-3xl rounded-full" />

            <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-15 items-center w-full">

                {/* Left Content Skeleton */}
                <div>

                    {/* Badge */}
                    <div className="h-10 w-72 bg-gray-100 rounded-full mb-6" />

                    {/* Heading */}
                    <div className="space-y-4">
                        <div className="h-14 w-full max-w-xl bg-gray-200 rounded-lg" />
                        <div className="h-14 w-80 bg-gray-200 rounded-lg" />
                    </div>

                    {/* Paragraph */}
                    <div className="mt-6 space-y-3">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-[90%] bg-gray-200 rounded" />
                        <div className="h-4 w-[70%] bg-gray-200 rounded" />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row items-center gap-3 mt-8">

                        <div className="h-12 w-full md:w-44 bg-gray-300 rounded-full" />

                        <div className="h-12 w-full md:w-40 bg-gray-200 rounded-full" />
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-10 md:mt-8 mt-20">

                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="md:w-auto flex flex-col text-center w-full items-center"
                            >
                                <div className="h-10 w-20 bg-gray-300 rounded mb-3" />

                                <div className="h-4 w-32 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Preview Skeleton */}
                <div className="relative">

                    <div className="bg-white/20 mt-10 md:mt-0 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl p-4 md:p-6">

                        {/* Navbar */}
                        <div className="flex items-center justify-between mb-10">

                            <div className="space-y-3">
                                <div className="h-6 w-36 bg-gray-300 rounded" />
                                <div className="h-4 w-28 bg-gray-200 rounded" />
                            </div>

                            <div className="w-11 h-11 rounded-full bg-gray-300" />
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-2 gap-2 md:gap-4">

                            {Array.from({ length: 2 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white/40 border border-white/40 rounded-md p-5"
                                >
                                    <div className="flex items-center justify-between">

                                        <div className="w-6 h-6 bg-gray-200 rounded" />

                                        <div className="h-3 w-14 bg-gray-100 rounded" />
                                    </div>

                                    <div className="h-10 w-16 bg-gray-300 rounded mt-5" />

                                    <div className="h-4 w-24 bg-gray-200 rounded mt-2" />
                                </div>
                            ))}

                            {/* Large Card */}
                            <div className="col-span-2 bg-gradient-to-r from-gray-300 to-gray-300 rounded-lg p-6">

                                <div className="flex items-center justify-between">

                                    <div className="space-y-3">
                                        <div className="h-4 w-28 bg-white/40 rounded" />

                                        <div className="h-12 w-20 bg-white/50 rounded" />
                                    </div>

                                    <div className="w-16 h-16 bg-white/30 rounded-full" />
                                </div>

                                <div className="mt-5">

                                    <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                                        <div className="w-[75%] h-full bg-white/60 rounded-full" />
                                    </div>

                                    <div className="h-4 w-44 bg-white/30 rounded mt-3" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Decorations */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-400/20 blur-2xl rounded-full" />

                    <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gray-400/20 blur-2xl rounded-full" />
                </div>
            </div>
        </section>
    );
}