import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
    trend?: string;
    navigation?:string;
}

export function StatCard({
    label,
    value,
    icon,
    iconBg,
    trend,
    navigation
}: StatCardProps) {
    const navigate = useNavigate();
    return (
        <div className={`rounded-t-xl rounded-b-md px-2 bg-linear-to-t from-gray-100 to-emerald-0 text-white shadow-md border-t-4 border-green-500 md:px-6 py-3 hover:shadow-lg transition-all`}>
            <div className="cursor-pointer" onClick={() => { navigate(`/dashboard/${navigation}`) }}>
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
