import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../services/api";
import {
    Mail,
    Calendar,
    AlertCircle,
    FolderKanban,
    CheckCircle2,
    Eye,
    UserCheck2,
    Clock,
} from "lucide-react";
import UserViewSkeleton from "../skeleton/UserViewSkeleton";

const ITEMS_PER_PAGE = 5;

type UserType = {
    name: string;
    email: string;
    role: string;
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

const STATUS_STYLES: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-teal-500 text-white",
    Completed: "bg-teal-600 text-white",
};

export default function UserView() {
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<UserType>({
        name: "",
        email: "",
        role: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");

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

    // filter tasks
    const filteredTasks = useMemo(() => {
        if (statusFilter === "All") return tasks;

        return tasks.filter(
            (task) => task.status === statusFilter
        );
    }, [tasks, statusFilter]);


    const totalPages = Math.ceil(
        filteredTasks.length / ITEMS_PER_PAGE
    );

    // paginated tasks
    const paginatedTasks = useMemo(() => {
        const startIndex =
            (currentPage - 1) * ITEMS_PER_PAGE;

        const endIndex =
            startIndex + ITEMS_PER_PAGE;

        return filteredTasks.slice(startIndex, endIndex);
    }, [filteredTasks, currentPage]);

    // page change
    const handlePageChange = (page: any) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-600";
            case "Medium":
                return "bg-yellow-100 text-yellow-700";
            case "Low":
                return "bg-teal-100 text-teal-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-teal-100 text-teal-700";
            case "In Progress":
                return "bg-teal-100 text-teal-700";
            case "Pending":
                return "bg-teal-100 text-teal-700";
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
                        <p className="text-gray-500">
                            Manage and track your assigned tasks
                        </p>
                    </div>
                </div>
                <>
                    {/* User Card */}
                    <div className="border-2 border-teal-50 rounded-sm p-3">
                        <div className="flex sm:flex-row sm:items-center gap-3 md:gap-8">
                            {/* Avatar */}
                            <div className="h-23 w-23 rounded-full border-3 bg-teal-100 flex items-center justify-center text-5xl font-bold text-teal-800">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </div>

                            {/* User Info */}
                            <div className="space-y-1">
                                <h2 className="text-2xl uppercase font-bold text-teal-800">
                                    {user.name}
                                </h2>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="h-4 w-4 border h-6 w-6 p-1 rounded-full bg-teal-600 text-white" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <UserCheck2 className="h-4 w-4 border h-6 w-6 p-1 rounded-full bg-teal-600 text-white" />
                                        <span>{user.role}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FolderKanban className="h-4 w-4 border h-6 w-6 p-1 rounded-full bg-teal-600 text-white" />
                                        <span>
                                            {tasks.length} Assigned Tasks
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="h-4 w-4 border h-6 w-6 p-1 rounded-full bg-teal-600 text-white" />
                                        <span>
                                            {tasks.filter((t) => t.status !== "Completed").length} Pending Tasks
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle2 className="h-4 w-4 border h-6 w-6 p-1 rounded-full bg-teal-600 text-white" />
                                        <span>
                                            {tasks.filter((t) => t.status === "Completed").length} Completed Tasks
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Tasks Section */}
                    <div className=" rounded-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-teal-800">
                                Assigned Tasks
                            </h2>
                            {/* filter by status */}
                            <div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className={`border border-gray-200 px-3 py-2 rounded-sm text-sm outline-none ${STATUS_STYLES[statusFilter]}`}
                                >
                                    <option value="All">All Tasks</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
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
                            <div className="overflow-x-auto rounded-sm bg-white">
                                <table className="w-full min-w-[900px]">
                                    {/* Table Header */}
                                    <thead className="bg-teal-600 text-white uppercase border-b border-teal-100">
                                        <tr>
                                            <th className="text-start px-2 py-4 text-sm font-semibold">
                                                S.No.
                                            </th>
                                            <th className="text-start px-2 py-4 text-sm font-semibold">
                                                Task
                                            </th>

                                            <th className="text-start px-2 py-4 text-sm font-semibold">
                                                Project
                                            </th>

                                            <th className="text-start px-2 py-4 text-sm font-semibold">
                                                Priority
                                            </th>

                                            <th className="text-start px-2 py-4 text-sm font-semibold">
                                                Due Date
                                            </th>

                                            <th className="text-start px-2 min-w-35 py-4 text-sm font-semibold">
                                                Status
                                            </th>
                                            <th className="text-start px-2 py-4 text-sm font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody>
                                        {paginatedTasks.map((task, index) => (
                                            <tr
                                                key={task._id}
                                                className={`border-b border-gray-100 hover:bg-teal-50/50 transition-all duration-200 ${index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50/40"
                                                    }`}
                                            >
                                                {/* Sno */}
                                                <td className="px-2 bg-teal-100">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <h3 className="font-semibold text-gray-800 line-clamp-1">
                                                            {index + 1}
                                                        </h3>
                                                    </div>
                                                </td>
                                                {/* Task */}
                                                <td className="px-2">
                                                    <div className="">
                                                        <h3 className="font-semibold text-gray-800 line-clamp-1">
                                                            {task.title}
                                                        </h3>

                                                        <p className="text-sm text-gray-500 line-clamp-2 max-w-sm">
                                                            {task.description}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Project */}
                                                <td className="">
                                                    <div className="border-teal-100 bg-teal-100 p-2 max-w-xs">
                                                        <p className="font-medium text-gray-700 line-clamp-1">
                                                            {task.project?.name}
                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                            {task.project?.description}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Priority */}
                                                <td className="px-2">
                                                    <span
                                                        className={`text-xs px-3 py-1 rounded-sm font-medium ${getPriorityColor(
                                                            task.priority
                                                        )}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </td>

                                                {/* Due Date */}
                                                <td className="px-2 min-w-35">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4 text-teal-600" />

                                                        <span>
                                                            {new Date(
                                                                task.dueDate
                                                            ).toLocaleDateString("en-GB", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-2 ">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-sm font-medium ${getStatusColor(
                                                            task.status
                                                        )}`}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-2 bg-teal-100 ">
                                                    <Link title="view" to={`/dashboard/task-view/${task._id}`} className="text-teal-600 flex items-center justify-center hover:text-teal-800">
                                                        <Eye size={25} className="bg-white w-10 rounded-sm p-1" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            </div>

            {!loading && paginatedTasks.length > 0 && (
                <div className="px-2 py-3 border border-gray-200 bg-teal-100 text-xs text-gray-800 flex items-center justify-between">
                    <span>
                        Showing{" "}
                        {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, paginatedTasks.length)}
                        {" "}–{" "}
                        {Math.min(currentPage * ITEMS_PER_PAGE, paginatedTasks.length)}
                        {" "}of {paginatedTasks.length} task{paginatedTasks.length !== 1 ? "s" : ""}
                    </span>
                </div>
            )}

            {/* pagination */}
            <div className="mt-5 flex items-center justify-between gap-2">
                {totalPages >= 1 && (
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {/* Previous */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`px-4 py-1 rounded-sm border text-sm font-medium transition
                                ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-7 rounded-sm text-sm font-semibold transition
                                        ${currentPage === page
                                            ? "bg-teal-600 text-white"
                                            : "bg-white border hover:bg-gray-50"
                                        }
                                    `} >
                                    {page}
                                </button>
                            );
                        }
                        )}

                        {/* Next */}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`px-4 py-1 rounded-sm border text-sm font-medium transition ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"} `} >
                            Next
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
}