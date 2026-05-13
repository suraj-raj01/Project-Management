import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import {
    Mail,
    Calendar,
    AlertCircle,
    FolderKanban,
    CheckCircle2,
    Clock3,
} from "lucide-react";
import UserViewSkeleton from "../skeleton/UserViewSkeleton";

type UserType = {
    name: string;
    email: string;
};

type TaskType = {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    project?: {
        name: string;
        description: string;
    };
    assignedTo?: {
        name: string;
        email: string;
    };
};

export default function UserView() {
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<UserType>({
        name: "",
        email: "",
    });

    const [tasks, setTasks] = useState<TaskType[]>([]);

    const { id } = useParams();

    const fetchUser = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/dashboard/users/${id}`);
            setUser(data?.user);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/tasks", {
                params: { userId: id },
            });
            setTasks(data?.tasks || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchUser();
            fetchTasks();
        }
    }, [id]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-600";
            case "Medium":
                return "bg-yellow-100 text-yellow-700";
            case "Low":
                return "bg-green-100 text-green-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700";
            case "In Progress":
                return "bg-green-100 text-green-700";
            case "Pending":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) return <UserViewSkeleton />

    return (
        <div className="min-h-screen">
            <div className="max-w-full mx-auto space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            User Details
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage user information and assigned tasks
                        </p>
                    </div>
                </div>
                <>
                    {/* User Card */}
                    <div className="bg-green-50/40 border-2 border-green-100 rounded-sm p-3">
                        <div className="flex sm:flex-row sm:items-center gap-3 md:gap-8">
                            {/* Avatar */}
                            <div className="h-23 w-23 rounded-full border-3 bg-green-100 flex items-center justify-center text-5xl font-bold text-green-800">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>

                            {/* User Info */}
                            <div className="">
                                <h2 className="text-2xl uppercase font-bold text-green-800">
                                    {user.name}
                                </h2>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    <span>{user.email}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <FolderKanban className="h-4 w-4" />
                                    <span>
                                        {tasks.length} Assigned Tasks
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-green-50/40 hover:bg-green-100 border-t-4 border-green-500 shadow-md rounded-md p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Total Tasks
                                    </p>
                                    <h2 className="text-3xl font-bold mt-1">
                                        {tasks.length}
                                    </h2>
                                </div>

                                <div className="bg-green-100 p-3 rounded-sm">
                                    <FolderKanban className="text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50/40 hover:bg-green-100 border-t-4 border-green-500 shadow-md rounded-md p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Completed
                                    </p>
                                    <h2 className="text-3xl font-bold mt-1">
                                        {tasks.filter((t) => t.status === "Completed").length}
                                    </h2>
                                </div>

                                <div className="bg-green-100 p-3 rounded-sm">
                                    <CheckCircle2 className="text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50/40 hover:bg-green-100 border-t-4 border-green-500 shadow-md rounded-md p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Pending
                                    </p>
                                    <h2 className="text-3xl font-bold mt-1">
                                        {tasks.filter((t) => t.status !== "Completed").length}
                                    </h2>
                                </div>

                                <div className="bg-green-100 p-3 rounded-sm">
                                    <Clock3 className="text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div className=" rounded-sm bg-gray-50 md:p-4 p-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-green-800">
                                Assigned Tasks
                            </h2>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="text-center py-16">
                                <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-4 text-lg font-medium text-gray-700">
                                    No Tasks Found
                                </h3>
                                <p className="text-gray-500 mt-1">
                                    This user has no assigned tasks yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {tasks.map((task) => (
                                    <div key={task._id} className="rounded-md p-5 border-t-4 border-b-4 border-green-500 shadow-md hover:shadow-md transition-all bg-green-50/40 hover:bg-green-100">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                                {task.title}
                                            </h3>

                                            <span
                                                className={`text-xs px-3 py-1 rounded-sm font-medium whitespace-nowrap ${getPriorityColor(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                                            {task.description}
                                        </p>

                                        {/* Project */}
                                        <div className="mt-4">
                                            <p className="text-xs text-gray-400 mb-1">
                                                Project
                                            </p>

                                            <div className="bg-green-50 rounded-sm p-3">
                                                <p className="font-medium text-gray-700">
                                                    {task.project?.name}
                                                </p>

                                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                                    {
                                                        task.project
                                                            ?.description
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-5">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />

                                                <span>
                                                    {new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <span
                                                className={`text-xs px-3 py-1 rounded-sm font-medium ${getStatusColor(
                                                    task.status
                                                )}`}
                                            >
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            </div>
        </div>
    );
}