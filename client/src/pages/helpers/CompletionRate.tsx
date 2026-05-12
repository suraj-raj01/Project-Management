import { CheckCircle2 } from "lucide-react";

export function CompletionRate({ completionRate,title }: { completionRate: number, title: string }) {
    return (
        <div className="bg-white border-2 border-green-200 rounded-sm px-4 md:px-6 py-2 hover:shadow-md hover:bg-green-200 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-gray-500 font-medium">
                        {title}
                    </p>
                    <h2 className="text-2xl font-bold text-green-800 mt-1">
                        {completionRate}%
                    </h2>
                </div>

                <div className="w-14 h-14 rounded-sm bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" size={28} />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="w-full h-3 bg-gray-100 rounded-sm overflow-hidden">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-green-400 to-green-600 transition-all duration-1500 ease-in-out"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span className="font-bold text-inidigo-500">
                        {completionRate}% Completed
                    </span>
                    <span>100%</span>
                </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-gray-500 mt-4">
                Great progress! Keep completing your tasks 🚀
            </p>
        </div>
    );
}