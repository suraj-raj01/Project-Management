import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

import {
    ListChecks,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Activity,
    FolderKanban,
    Users,
} from "lucide-react";
import { StatCard } from "../helpers/StatCards";
import { CompletionRate } from "../helpers/CompletionRate";
import { getUserFromStorage } from "../helpers/GetUserInfo";
import AdminDashboardSkeleton from "../skeleton/DashboardSkeleton";


interface DashboardStats {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    overdueTasks: number;
    totalProjects?: number;
    totalUsers?: number;
}

// ─── Dashboard 

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const navigate = useNavigate();

    const user = getUserFromStorage();

    useEffect(() => {
        if (!user?._id) {
            navigate("/login");
        }
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/dashboard", user?._id);
            // console.log(data, 'data')
            setStats(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "Admin") fetchStats();
    }, []);

    // admin dashboard task completion rate
    const completionPct = stats
        ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0;

    const pendingPct = stats
        ? Math.round((stats.todoTasks / stats.totalTasks) * 100) : 0;

    const progressPct = stats
        ? Math.round((stats.inProgressTasks / stats.totalTasks) * 100) : 0;

    const overDuePct = stats
        ? Math.round((stats.overdueTasks / stats.totalTasks) * 100) : 0;

    if (loading) return <AdminDashboardSkeleton />

    return (
        <>
            <div className="space-y-5 transition-all duration-1500 ease-in-out">
                {!loading && user?.role === "Admin" && stats && (
                    <>
                        <div>
                            <h2 className="text-xl font-bold text-gray-700">Stats Overview</h2>
                            <p className="text-gray-500 text-sm">Manage and track your tasks and projects</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-4">
                            <StatCard
                                label="Total Tasks"
                                value={stats.totalTasks}
                                icon={<ListChecks size={20} className="text-teal-600" />}
                                iconBg="bg-teal-200"
                                trend="All tasks"
                                navigation=""
                            />
                            <StatCard
                                label="Pending"
                                value={stats.todoTasks}
                                icon={<Clock size={20} className="text-yellow-600" />}
                                iconBg="bg-yellow-100"
                                trend="Waiting to start"
                                navigation=""
                            />
                            <StatCard
                                label="In Progress"
                                value={stats.inProgressTasks}
                                icon={<Activity size={20} className="text-teal-600" />}
                                iconBg="bg-teal-200"
                                trend="Active tasks"
                                navigation=""
                            />
                            <StatCard
                                label="Completed"
                                value={stats.doneTasks}
                                icon={<CheckCircle2 size={20} className="text-teal-600" />}
                                iconBg="bg-teal-200"
                                trend="Successfully done"
                                navigation=""
                            />
                            <StatCard
                                label="Overdue"
                                value={stats.overdueTasks}
                                icon={<AlertTriangle size={20} className="text-red-600" />}
                                iconBg="bg-red-100"
                                trend="Needs attention"
                                navigation=""
                            />
                        </div>

                        <div className="">
                            <h3 className="text-lg font-bold text-gray-700">Projects Overview</h3>
                            <p className="text-sm text-gray-500">Manage and track your projects and members</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 md:gap-4 gap-2">
                            <StatCard
                                label="Total Projects"
                                value={stats?.totalProjects || 0}
                                icon={<FolderKanban size={20} className="text-purple-600" />}
                                iconBg="bg-purple-100"
                                navigation="projects"
                            />
                            <StatCard
                                label="Team Members"
                                value={stats?.totalUsers || 0}
                                icon={<Users size={20} className="text-teal-600" />}
                                iconBg="bg-teal-100"
                                navigation="users"
                            />
                        </div>
                        {/* completion rate */}
                        <div>
                            <h3 className="text-lg text-gray-700 font-bold">Task Completion Rate</h3>
                            <p className="text-gray-500 text-sm">Track your team's task completion rate and progress over time</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            <CompletionRate completionRate={completionPct} title={"Completion Rate"} />
                            <CompletionRate completionRate={pendingPct} title={"Pending Rate"} />
                            <CompletionRate completionRate={progressPct} title={"Progress Rate"} />
                            <CompletionRate completionRate={overDuePct} title={"Overdue Rate"} />
                        </div>
                    </>
                )}

            </div>
        </>
    );
}