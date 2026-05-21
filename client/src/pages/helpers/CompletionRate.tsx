import { CheckCircle2 } from "lucide-react";

export function CompletionRate({
    completionRate,
    title,
}: {
    completionRate: number;
    title: string;
}) {
    return (
        <div className="rounded-xl p-5 border border-teal-500 border-t-5 hover:shadow-lg transition-all flex flex-col items-center text-center">

            {/* Circular Progress */}
            <div
                className="relative w-25 h-25 rounded-full flex items-center justify-center"
                style={{
                    background: `conic-gradient(
                        #38c6bcff ${completionRate * 3.6}deg,
                        #e5e7eb ${completionRate * 3.6}deg
                    )`,
                }}
            >
                {/* Inner Circle */}
                <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-bold text-teal-700">
                        {completionRate}%
                    </span>
                </div>

                {/* Icon */}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
                    <CheckCircle2 className="text-teal-600" size={18} />
                </div>
            </div>

            {/* Title */}
            <h2 className="mt-2 md:text-lg font-semibold text-gray-800">
                {title}
            </h2>

            {/* Footer */}
            <p className="text-sm hidden md:block text-gray-500">
                Great progress! Keep going 🚀
            </p>
        </div>
    );
}