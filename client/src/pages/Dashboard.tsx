import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

import {
    ListChecks,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Activity,
    FolderKanban,
    Users,
    CalendarClock,
} from "lucide-react";
import { StatCard } from "./helpers/StatCards";
import { CompletionRate } from "./helpers/CompletionRate";
import { getUserFromStorage } from "./helpers/GetUserInfo";
import AdminDashboardSkeleton, { UserDashboardSkeleton } from "./skeleton/DashboardSkeleton";

interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "In Progress" | "Completed";
    project?: {
        _id: string;
        name: string;
        description: string;
    };
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface DashboardStats {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    overdueTasks: number;
    totalProjects?: number;
    totalUsers?: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [userTasks, setUserTasks] = useState<Task[]>([]);
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
            const { data } = await API.get("/dashboard");
            setStats(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserTasks = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/tasks", {
                params: { userId: user?._id },
            });
            setUserTasks(data?.tasks || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "Admin") fetchStats();
    }, []);

    useEffect(() => {
        if (user?._id) fetchUserTasks();
    }, [user?._id])

    const userTaskStats = useMemo(() => {
        if (userTasks.length === 0)
            return { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 };
        const total = userTasks.length;
        const pending = userTasks.filter((t) => t.status === "Pending").length;
        const inProgress = userTasks.filter((t) => t.status === "In Progress").length;
        const completed = userTasks.filter((t) => t.status === "Completed").length;
        const overdue = userTasks.filter(
            (t) => t.status !== "Completed" && new Date(t.dueDate) < new Date()
        ).length;
        return { total, pending, inProgress, completed, overdue };
    }, [userTasks]);

    // user dashboard task completion rate
    const completionRate = userTaskStats.total > 0
        ? Math.round((userTaskStats.completed / userTaskStats.total) * 100) : 0;

    const pendingRate = userTaskStats.total > 0
        ? Math.round((userTaskStats.pending / userTaskStats.total) * 100) : 0;

    const inProgressRate = userTaskStats.total > 0
        ? Math.round((userTaskStats.inProgress / userTaskStats.total) * 100) : 0;

    // admin dashboard task completion rate
    const completionPct = stats
        ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0;

    const pendingPct = stats
        ? Math.round((stats.todoTasks / stats.totalTasks) * 100) : 0;

    const progressPct = stats
        ? Math.round((stats.inProgressTasks / stats.totalTasks) * 100) : 0;

    const overDuePct = stats
        ? Math.round((stats.overdueTasks / stats.totalTasks) * 100) : 0;

    return (
        <>
            {/* Shimmer keyframe — injected once */}
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
            `}</style>

            <div className="space-y-5">
                {/* ── Loading skeletons ── */}
                {loading && user?.role === "Admin" && <AdminDashboardSkeleton />}
                {loading && user?.role !== "Member" && <UserDashboardSkeleton />}

                {/* ── Admin Dashboard ── */}
                {!loading && user?.role === "Admin" && stats && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-4">
                            <StatCard
                                label="Total Tasks"
                                value={stats.totalTasks}
                                icon={<ListChecks size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="All tasks"
                            />
                            <StatCard
                                label="Pending"
                                value={stats.todoTasks}
                                icon={<Clock size={20} className="text-yellow-600" />}
                                iconBg="bg-yellow-100"
                                trend="Waiting to start"
                            />
                            <StatCard
                                label="In Progress"
                                value={stats.inProgressTasks}
                                icon={<Activity size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="Active tasks"
                            />
                            <StatCard
                                label="Completed"
                                value={stats.doneTasks}
                                icon={<CheckCircle2 size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="Successfully done"
                            />
                            <StatCard
                                label="Overdue"
                                value={stats.overdueTasks}
                                icon={<AlertTriangle size={20} className="text-red-600" />}
                                iconBg="bg-red-100"
                                trend="Needs attention"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-4 gap-2">
                            <StatCard
                                label="Total Projects"
                                value={stats?.totalProjects || 0}
                                icon={<FolderKanban size={20} className="text-purple-600" />}
                                iconBg="bg-purple-100"
                            />
                            <StatCard
                                label="Team Members"
                                value={stats?.totalUsers || 0}
                                icon={<Users size={20} className="text-teal-600" />}
                                iconBg="bg-teal-100"
                            />
                        </div>
                        {/* completion rate */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <CompletionRate completionRate={completionPct} title={"Completion Rate"} />
                            <CompletionRate completionRate={pendingPct} title={"Pending Rate"} />
                            <CompletionRate completionRate={progressPct} title={"Progress Rate"} />
                            <CompletionRate completionRate={overDuePct} title={"Overdue Rate"} />
                        </div>
                    </>
                )}

                {/* ── User Dashboard ── */}
                {!loading && user?.role !== "Admin" && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <StatCard
                                label="My Tasks"
                                value={userTaskStats.total}
                                icon={<ListChecks size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="Assigned to you"
                            />
                            <StatCard
                                label="Pending"
                                value={userTaskStats.pending}
                                icon={<Clock size={20} className="text-yellow-600" />}
                                iconBg="bg-yellow-100"
                                trend="Projects in Pending"
                            />
                            <StatCard
                                label="In Progress"
                                value={userTaskStats.inProgress}
                                icon={<Activity size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="Active tasks"
                            />
                            <StatCard
                                label="Completed"
                                value={userTaskStats.completed}
                                icon={<CheckCircle2 size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="Total task completion"
                            />
                            <StatCard
                                label="Overdue"
                                value={userTaskStats.overdue}
                                icon={<CalendarClock size={20} className="text-red-600" />}
                                iconBg="bg-red-100"
                                trend="Needs attention"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <CompletionRate completionRate={completionRate} title={"Completion Rate"} />
                            <CompletionRate completionRate={pendingRate} title={"Pending Rate"} />
                            <CompletionRate completionRate={inProgressRate} title={"In Progress Rate"} />
                        </div>

                        <div className="bg-green-100 border border-green-50 rounded-sm shadow-sm md:px-6 px-2 py-5">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl text-green-800 font-bold">
                                    My Recent Tasks
                                </h2>
                            </div>

                            {userTasks.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No tasks assigned yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {userTasks.slice(0, 6).map((task) => (
                                        <div
                                            key={task._id}
                                            title="view task"
                                            className="bg-white border-2 cursor-pointer border-green-200 rounded-sm p-3 flex items-center justify-between gap-4 hover:bg-green-200 transition"
                                            onClick={() => navigate(`/dashboard/task-view/${task._id}`)}
                                        >
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {task.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {task.project?.name}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-end justify-center gap-2">
                                                <span
                                                    className={`px-3 py-1 text-xs md:w-full rounded-sm font-medium ${task.priority === "High"
                                                        ? "bg-red-100 text-red-600"
                                                        : task.priority === "Medium"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-400 text-white"
                                                        }`}
                                                >
                                                    {task.priority}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-sm font-medium ${task.status === "Completed"
                                                        ? "bg-green-500 text-white"
                                                        : task.status === "In Progress"
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-yellow-500 text-white"
                                                        }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {userTasks && userTasks.length>3?(
                                <div className="w-full flex items-center py-5">
                                <Link to='/dashboard/usertasks' className="border w-full md:w-fit text-center py-2 rounded-sm mx-auto px-5 border border-gray-200 bg-green-400 hover:bg-green-500 transition-all text-white">
                                    All Tasks
                                </Link>
                            </div>
                            ):(
                                ""
                            )}
                        </div>

                    </>
                )}
            </div>
        </>
    );
}