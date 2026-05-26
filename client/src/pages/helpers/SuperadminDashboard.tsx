import { useEffect, useState } from "react";
import { getUserFromStorage } from "./GetUserInfo";
import API from "../../services/api";
import { StatCard } from "./StatCards";

import {
    Activity,
    CheckCircle2,
    Clock,
    ListChecks,
    FolderKanban,
    Users,
    UserCheck2,
} from "lucide-react";
import AdminDashboardSkeleton from "../skeleton/DashboardSkeleton";

export default function SuperadminDashboard() {
    const user = getUserFromStorage();
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/dashboard/superadmin");
            setStats(data);
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        {
            label: "Total Tasks",
            value: stats.totalTasks || 0,
            icon: <ListChecks size={20} className="text-teal-600" />,
            iconBg: "bg-teal-100",
            trend: "All tasks",
        },
        {
            label: "Pending",
            value: stats.todoTasks || 0,
            icon: <Clock size={20} className="text-yellow-600" />,
            iconBg: "bg-yellow-100",
            trend: "Waiting to start",
        },
        {
            label: "In Progress",
            value: stats.inProgressTasks || 0,
            icon: <Activity size={20} className="text-blue-600" />,
            iconBg: "bg-blue-100",
            trend: "Active tasks",
        },
        {
            label: "Completed",
            value: stats.doneTasks || 0,
            icon: <CheckCircle2 size={20} className="text-green-600" />,
            iconBg: "bg-green-100",
            trend: "Successfully done",
        },
        {
            label: "Total Projects",
            value: stats.totalProjects || 0,
            icon: <FolderKanban size={20} className="text-purple-600" />,
            iconBg: "bg-purple-100",
            trend: "All projects",
        },
        {
            label: "Total Members",
            value: stats.totalMembers || 0,
            icon: <Users size={20} className="text-red-600" />,
            iconBg: "bg-red-100",
            trend: "Registered members",
        },
        {
            label: "Total Admins",
            value: stats.totalAdmins || 0,
            icon: <UserCheck2 size={20} className="text-green-600" />,
            iconBg: "bg-green-100",
            trend: "Registered admins",
        },
    ];

    if (stats.length == 0) return <div>
        <p className="font-bold text-red-400 text-center">Data not found</p>
    </div>

    return (
        <section className="space-y-6">
            {/* HEADER */}

            {/* LOADING */}
            {loading ? (
                <AdminDashboardSkeleton />
            ) : (
                <>
                    <div className="bg-white rounded-sm p-5 shadow-sm">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Welcome, {user?.name} 👋
                        </h1>

                        <p className="text-gray-600 mt-2">
                            This is your Superadmin Dashboard overview.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-700">Stats Overview</h2>
                        <p className="text-gray-500 text-sm">Manage and track your tasks and projects</p>
                    </div>
                    {/* STATS GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {cards.map((card, index) => (
                            <StatCard
                                key={index}
                                label={card.label}
                                value={card.value}
                                icon={card.icon}
                                iconBg={card.iconBg}
                                trend={card.trend}
                                navigation=""
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}