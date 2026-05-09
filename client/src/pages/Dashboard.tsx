import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
    ListChecks,
    Clock,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Activity,
    FolderKanban,
    Users,
    TrendingUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RecentTask {
    _id: string;
    title: string;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "In Progress" | "Done";
    dueDate?: string;
    assignedTo?: { name: string };
}

interface Stats {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    overdueTasks: number;
    totalProjects?: number;
    totalUsers?: number;
    recentTasks?: RecentTask[];
}

function getUserFromStorage() {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        return {};
    }
}

// ─── Stat Card  Props

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
    trend?: string;
}

function StatCard({ label, value, icon, iconBg, trend }: StatCardProps) {
    return (
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                    {icon}
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-900">{value ?? 0}</h2>
                {trend && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <TrendingUp size={11} /> {trend}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const user = getUserFromStorage();

    // Redirect if not logged in
    useEffect(() => {
        if (!user?._id) navigate("/login");
    }, []);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/dashboard");
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // ✅ was setLoading(true) — bug fixed
        }
    };

    // ── Loading 

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32 text-gray-400">
                <Loader2 size={30} className="animate-spin text-indigo-500 mr-2" />
                <span className="text-sm">Loading dashboard…</span>
            </div>
        );
    }

    if (!stats) return null;

    // Completion percentage
    const completionPct = stats.totalTasks
        ? Math.round((stats.doneTasks / stats.totalTasks) * 100)
        : 0;

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">

            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-sm p-6 text-white shadow-md">
                <p className="text-indigo-200 text-sm font-medium">Welcome back 👋</p>
                <h1 className="text-2xl font-bold mt-1 capitalize">{user?.name || "User"}</h1>
                <p className="text-indigo-200 text-sm mt-1">
                    Here's what's happening with your tasks today.
                </p>
            </div>

            {user && user.role === "Admin" && (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <StatCard
                            label="Total Tasks"
                            value={stats.totalTasks}
                            icon={<ListChecks size={18} className="text-indigo-600" />}
                            iconBg="bg-indigo-50"
                            trend="All assigned tasks"
                        />

                        <StatCard
                            label="Pending"
                            value={stats.todoTasks}
                            icon={<Clock size={18} className="text-amber-500" />}
                            iconBg="bg-amber-50"
                            trend="Waiting to start"
                        />

                        <StatCard
                            label="In Progress"
                            value={stats.inProgressTasks}
                            icon={<Activity size={18} className="text-blue-500" />}
                            iconBg="bg-blue-50"
                            trend="Currently active"
                        />

                        <StatCard
                            label="Done"
                            value={stats.doneTasks}
                            icon={<CheckCircle2 size={18} className="text-emerald-500" />}
                            iconBg="bg-emerald-50"
                            trend={`${completionPct}% completion rate`}
                        />

                        <StatCard
                            label="Overdue"
                            value={stats.overdueTasks}
                            icon={<AlertTriangle size={18} className="text-red-500" />}
                            iconBg="bg-red-50"
                            trend="Needs attention"
                        />
                    </div>

                    {/* Secondary stats */}
                    {(stats.totalProjects !== undefined ||
                        stats.totalUsers !== undefined) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                                {stats.totalProjects !== undefined && (
                                    <StatCard
                                        label="Total Projects"
                                        value={stats.totalProjects}
                                        icon={
                                            <FolderKanban
                                                size={18}
                                                className="text-purple-500"
                                            />
                                        }
                                        iconBg="bg-purple-50"
                                    />
                                )}

                                {stats.totalUsers !== undefined && (
                                    <StatCard
                                        label="Team Members"
                                        value={stats.totalUsers}
                                        icon={
                                            <Users
                                                size={18}
                                                className="text-teal-500"
                                            />
                                        }
                                        iconBg="bg-teal-50"
                                    />
                                )}
                            </div>
                        )}

                    {/* Completion Bar */}
                    <div className="bg-white rounded-sm border border-gray-100 shadow-sm p-5 mt-4">

                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">
                                Overall Completion
                            </p>

                            <span className="text-sm font-bold text-indigo-600">
                                {completionPct}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-700"
                                style={{
                                    width: `${completionPct}%`,
                                }}
                            />
                        </div>

                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>{stats.doneTasks} done</span>
                            <span>{stats.totalTasks} total</span>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}