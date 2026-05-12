import { TrendingUp } from "lucide-react";

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
    trend?: string;
}

export function StatCard({
    label,
    value,
    icon,
    iconBg,
    trend,
}: StatCardProps) {
    return (
        <div className="bg-green-50  border-2 border-green-200 rounded-sm px-2 md:px-6 py-2  hover:shadow-md hover:bg-green-200 transition-all">
            <div className="">
                <div>
                    <p className="text-sm text-gray-500 font-medium">
                        {label}
                    </p>

                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">
                            {value}
                        </h2>

                        <div
                            className={`w-10 h-10 rounded-sm flex items-center justify-center ${iconBg}`}
                        >
                            {icon}
                        </div>
                    </div>
                    {trend && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <TrendingUp size={12} />
                            {trend}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
