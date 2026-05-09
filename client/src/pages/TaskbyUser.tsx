import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Loader2, ListChecks, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const ITEMS_PER_PAGE = 5;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "In Progress" | "Completed";
    dueDate: string;
    project?: { _id: string; name: string };
    assignedTo?: { _id: string; name: string; email: string };
    createdBy?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<string, string> = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700",
};

const STATUS_STYLES: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-600 text-white",
    Completed: "bg-emerald-600 text-white",
};

function getUserFromStorage() {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        return {};
    }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TaskbyUser() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const user = getUserFromStorage();
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    // ── Fetch tasks by userId 

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/tasks", {
                params: { userId: user?._id }, // ✅ correct axios query param syntax
            });
            setTasks(data.tasks || []); // ✅ uncommented
        } catch (error) {
            console.error(error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) fetchTasks();
    }, [user?._id]);


    const totalPages = Math.ceil(
        tasks.length / ITEMS_PER_PAGE
    );

    // paginated tasks
    const paginatedTasks = useMemo(() => {
        const startIndex =
            (currentPage - 1) * ITEMS_PER_PAGE;

        const endIndex =
            startIndex + ITEMS_PER_PAGE;

        return tasks.slice(startIndex, endIndex);
    }, [tasks, currentPage]);

    // page change
    const handlePageChange = (page:any) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ── Update status 

    const updateStatus = async (taskId: string, status: string) => {
        try {
            setUpdatingId(taskId);
            await API.put(`/tasks/${taskId}`, { status });
            // Optimistic update — no need to refetch the whole list
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === taskId ? { ...t, status: status as Task["status"] } : t
                )
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────

    return (
        <section>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <h3 className="text-3xl font-bold flex items-center gap-2">
                        {/* <ListChecks size={26} className="text-indigo-500" /> */}
                        All Tasks
                    </h3>
                    <span className="text-sm text-gray-500 mt-0.5">
                        Track and manage all your team's tasks in one place
                    </span>
                </div>
                {/* <Link
                    to="/dashboard/create-task"
                    className="text-sm rounded-sm bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 text-white font-medium"
                >
                    + Create Task
                </Link> */}
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-sm border border-gray-200 shadow-sm">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wide">
                        <tr>
                            <th className="px-5 py-4 font-semibold">Title</th>
                            <th className="px-5 py-4 font-semibold">Project</th>
                            <th className="px-5 py-4 font-semibold">Assigned To</th>
                            <th className="px-5 py-4 font-semibold">Due Date</th>
                            <th className="px-5 py-4 font-semibold">Priority</th>
                            <th className="px-5 py-4 font-semibold">Status</th>
                            <th className="px-5 py-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 size={28} className="animate-spin text-indigo-400" />
                                        <span className="text-sm">Loading tasks…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedTasks.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-1">
                                        <ListChecks size={32} className="text-gray-300" />
                                        <span className="text-sm font-medium">No tasks found</span>
                                        <span className="text-xs">Tasks assigned to you will appear here.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedTasks.map((task) => (
                                <tr
                                    key={task._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Title */}
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-gray-900">{task.title}</p>
                                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{task.description}</p>
                                    </td>

                                    {/* Project */}
                                    <td className="px-5 py-4 text-gray-600">
                                        {task.project?.name || <span className="text-gray-400">—</span>}
                                    </td>

                                    {/* Assigned To */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center uppercase font-bold text-xs shrink-0">
                                                {task.assignedTo?.name?.[0] || "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium uppercase text-xs">{task.assignedTo?.name}</p>
                                                <p className="text-xs text-gray-400">{task.assignedTo?.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Due Date */}
                                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                        {new Date(task.dueDate).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    {/* Priority */}
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold ${PRIORITY_STYLES[task.priority] || "bg-gray-100 text-gray-600"}`}>
                                            {task.priority}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        <div className="relative">
                                            {updatingId === task._id ? (
                                                <Loader2 size={16} className="animate-spin text-indigo-400" />
                                            ) : (
                                                <select
                                                    title="Update status"
                                                    value={task.status}
                                                    onChange={(e) => updateStatus(task._id, e.target.value)}
                                                    className={`px-2.5 py-1.5 rounded-sm text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_STYLES[task.status] || "bg-gray-100 text-gray-700"}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button className="rounded-sm text-sm font-medium transition bg-white hover:bg-gray-50" onClick={()=>navigate(`/dashboard/task-view/${task._id}`)}>
                                            <span className="flex gap-2 items-center"><Eye className="text-green-500"/> View</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            {totalPages >= 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                    {/* Previous */}
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            handlePageChange(
                                currentPage - 1
                            )
                        }
                        className={`px-4 py-2 rounded-sm border text-sm font-medium transition
                                    
                                    ${currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"
                            }
                                `}
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}

                    {[...Array(totalPages)].map(
                        (_, index) => {
                            const page = index + 1;

                            return (
                                <button
                                    key={page}
                                    onClick={() =>
                                        handlePageChange(
                                            page
                                        )
                                    }
                                    className={`w-10 h-10 rounded-sm text-sm font-semibold transition
                                                
                                                ${currentPage === page
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white border hover:bg-gray-50"
                                        }
                                            `}
                                >
                                    {page}
                                </button>
                            );
                        }
                    )}

                    {/* Next */}

                    <button
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={() =>
                            handlePageChange(
                                currentPage + 1
                            )
                        }
                        className={`px-4 py-2 rounded-sm border text-sm font-medium transition ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50" } `} >
                        Next
                    </button>

                </div>
            )}
        </section>
    );
}