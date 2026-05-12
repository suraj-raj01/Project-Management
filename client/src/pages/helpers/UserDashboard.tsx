import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

import {
    ListChecks,
    Clock,
    CheckCircle2,
    Activity,
    CalendarClock,
} from "lucide-react";
import { StatCard } from "../helpers/StatCards";
import { CompletionRate } from "../helpers/CompletionRate";
import { getUserFromStorage } from "../helpers/GetUserInfo";
import { UserDashboardSkeleton } from "../skeleton/DashboardSkeleton";

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

export default function UserDashboard() {
    const [loading, setLoading] = useState(false);
    const [userTasks, setUserTasks] = useState<Task[]>([]);
    const navigate = useNavigate();

    const user = getUserFromStorage();

    useEffect(() => {
        if (!user?._id) {
            navigate("/login");
        }
    }, []);

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

    const inOverDue = userTaskStats.total > 0
        ? Math.round((userTaskStats?.overdue / userTaskStats.total) * 100) : 0;

    if(loading) return(
        <UserDashboardSkeleton/>
    )

    return (
        <>

            <div className="space-y-5">
                {/* ── User Dashboard ── */}
                {!loading && user?.role !== "Admin" && (
                    <>
                        <div>
                            <h2 className="text-xl font-bold text-gray-700">Stats Overview</h2>
                            <p className="text-gray-500 text-sm">Manage and track your tasks and projects</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            <StatCard
                                label="My Tasks"
                                value={userTaskStats.total}
                                icon={<ListChecks size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="Assigned to you"
                                navigation=""
                            />
                            <StatCard
                                label="Pending"
                                value={userTaskStats.pending}
                                icon={<Clock size={20} className="text-yellow-600" />}
                                iconBg="bg-yellow-100"
                                trend="Projects in Pending"
                                navigation=""
                            />
                            <StatCard
                                label="In Progress"
                                value={userTaskStats.inProgress}
                                icon={<Activity size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="Active tasks"
                                navigation=""
                            />
                            <StatCard
                                label="Completed"
                                value={userTaskStats.completed}
                                icon={<CheckCircle2 size={20} className="text-green-600" />}
                                iconBg="bg-green-200"
                                trend="Total task completion"
                                navigation=""
                            />
                            <StatCard
                                label="Overdue"
                                value={userTaskStats.overdue}
                                icon={<CalendarClock size={20} className="text-red-600" />}
                                iconBg="bg-red-100"
                                trend="Needs attention"
                                navigation=""
                            />
                        </div>

                        <div>
                            <h3 className="text-lg text-gray-700 font-bold">Task Completion Rate</h3>
                            <p className="text-gray-500 text-sm">Track your team's task completion rate and progress over time</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                            <CompletionRate completionRate={completionRate} title={"Completion Rate"} />
                            <CompletionRate completionRate={pendingRate} title={"Pending Rate"} />
                            <CompletionRate completionRate={inProgressRate} title={"In Progress Rate"} />
                            <CompletionRate completionRate={inOverDue} title={"In Over Due"} />
                        </div>

                        <div className="bg-green-50 border border-green-50 rounded-sm shadow-sm md:px-6 px-2 py-5">
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
                                            className="bg-white border-2 cursor-pointer border-gray-100 rounded-md shadow-md p-3 flex items-center justify-between gap-4 hover:bg-green-200 transition"
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

                            {userTasks && userTasks.length > 3 ? (
                                <div className="w-full flex items-center py-5">
                                    <Link to='/dashboard/usertasks' className="border w-full md:w-fit text-center py-2 rounded-sm mx-auto px-5 border border-gray-200 bg-green-400 hover:bg-green-500 transition-all text-white">
                                        All Tasks
                                    </Link>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>

                    </>
                )}
            </div>
        </>
    );
}