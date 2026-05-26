import { CheckCircle2 } from "lucide-react";

export function CompletionRate({
    completionRate,
    title,
}: {
    completionRate: number;
    title: string;
}) {
    return (
        <div className="p-5 rounded-md hover:shadow-lg bg-gray-100 text-white transition-all flex flex-col items-center text-center">

            {/* Circular Progress */}
            <div
                className="relative w-25 h-25 border border-gray-300 rounded-full flex items-center justify-center"
                style={{
                    background: `conic-gradient(
                        #0fd1b7 ${completionRate * 3.6}deg,
                        #fff ${completionRate * 3.6}deg
                    )`,
                }}
            >
                {/* Inner Circle */}
                <div className="w-20 h-20 border border-gray-300 bg-gray-100/80 rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-bold text-gray-800">
                        {completionRate}%
                    </span>
                </div>

                {/* Icon */}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
                    <CheckCircle2 className="text-green-600" size={18} />
                </div>
            </div>

            {/* Title */}
            <h2 className="mt-2 md:text-lg font-semibold text-teal-500">
                {title}
            </h2>

            {/* Footer */}
            <p className="text-sm hidden md:block text-gray-600">
                Great progress! Keep going 🚀
            </p>
        </div>
    );
}