import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import { AlertCircle, EditIcon, Eye, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../helpers/GetUserInfo";
import TableSkeleton from "../skeleton/TableSkeleton";
const ITEMS_PER_PAGE = 7;

export default function Tasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("")

    const user = getUserFromStorage();

    // Fetch Tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/tasks/all");
            setTasks(data.tasks || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const q = search.toLowerCase();

            const matchSearch =
                task?.title.toLowerCase().includes(q) ||
                task?.description.toLowerCase().includes(q) ||
                task?.assignedTo?.name.toLowerCase().includes(q) ||
                task?.project?.name.toLowerCase().includes(q) ||
                task?.priority.toLowerCase().includes(q) ||
                task?.status.toLowerCase().includes(q);

            const matchStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [tasks, search, statusFilter]);

    // Update Status
    const updateStatus = async (
        taskId: string,
        status: string
    ) => {
        try {
            setLoading(true);
            await API.put(`/tasks/${taskId}`, { status });
            fetchTasks();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

    const totalPages = Math.ceil(
        filteredTasks.length / ITEMS_PER_PAGE
    );

    // paginated tasks
    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        const endIndex = startIndex + ITEMS_PER_PAGE;

        return filteredTasks.slice(startIndex, endIndex);
    }, [tasks, filteredTasks, currentPage]);

    // page change
    const handlePageChange = (page: any) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Delete Task
    const deleteTask = async (taskId: string) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                        Delete Task
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Are you sure you want to delete this task?
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                await API.delete(`/tasks/${taskId}`);
                                toast.dismiss(t.id);
                                toast.success("Task Deleted Successfully");
                                fetchTasks();
                            } catch (error) {
                                console.log(error);
                                toast.error("Failed to delete task");
                            }
                        }}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            style: {
                borderRadius: "4px",
                background: "#fff",
                color: "#111827",
                padding: "12px",
            },
        });
    };

    const navigate = useNavigate();
    const updateTask = async (taskId: string) => {
        navigate(`/dashboard/create-task/${taskId}`)
    }

    const viewTask = (id: string) => {
        navigate(`/dashboard/task-view/${id}`)
    }

    // Priority Badge
    const priorityColor = (
        priority: string
    ) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-600";

            case "Medium":
                return "bg-yellow-400";

            case "Low":
                return "bg-teal-100 text-teal-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Status Badge
    const statusColor = (
        status: string
    ) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-400";

            case "In Progress":
                return "bg-orange-400 text-white";

            case "Completed":
                return "bg-teal-600 text-white";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (user.role !== "Admin") return <div className="min-h-140 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
            <AlertCircle size={24} />
            <h1 className="text-3xl font-bold">Unauthorized</h1>
            <p>You do not have permission to access this page</p>
        </div>
    </div>

    if (loading) {
        return (
            <TableSkeleton />
        );
    }

    return (
        <section>
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row justify-between items-center mb-2">
                <div className=" flex flex-col w-full md:w-auto">
                    <h3 className="text-3xl font-bold"> All  Tasks</h3>
                    <span className="text-sm text-gray-500">
                        track and manage all your team's tasks in one place
                    </span>
                </div>
                <button className='text-md w-full md:w-fit rounded-sm bg-teal-500 px-4 py-2 text-white'>
                    <Link to="/dashboard/create-task">Create Task</Link>
                </button>
            </div>

            <div className="flex flex-col md:flex-row py-2 items-center justify-between gap-2">
                {/* search */}
                <div className="relative flex-1 md:max-w-96 w-full">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
                    />
                </div>
                {/* filter by status */}
                <div className="w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className={`border border-gray-200 px-3 py-2 md:w-auto w-full rounded-sm text-sm outline-none ${statusColor(statusFilter)}`}>
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-teal-500 text-white">
                        <tr className='uppercase'>
                            <th className="px-5 py-4 min-w-50 font-semibold"> Title </th>
                            <th className="px-5 py-4 min-w-50 font-semibold">Projects </th>
                            <th className="px-5 py-4 font-semibold">  Assigned To </th>
                            <th className="px-5 py-4 min-w-30 font-semibold"> Due Date </th>
                            <th className="px-5 py-4 font-semibold"> Priority </th>
                            <th className="px-5 py-4 font-semibold"> Status </th>
                            <th className="px-5 py-4 font-semibold"> Actions </th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedTasks &&
                            paginatedTasks.map(
                                (task: any) => (
                                    <tr key={task._id} className="hover:bg-gray-50 border-b border-gray-100" >
                                        {/* Title */}
                                        <td className="px-2 py-1 md:min-w-30 bg-teal-100">
                                            <div>
                                                <h2 className="font-semibold line-clamp-1">  {task.title} </h2>
                                                <p className="text-gray-500 text-xs mt-1 line-clamp-1">  {task.description}</p>
                                            </div>
                                        </td>

                                        {/* Project */}
                                        <td className="px-3 py-1 md:min-w-40">
                                            {task?.project?.name}
                                        </td>

                                        {/* Assigned User */}
                                        <td className="px-3 min-w-50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-teal-600 text-white flex items-center justify-center uppercase font-bold">
                                                    {task?.assignedTo?.name?.[0] || "U"}
                                                </div>

                                                <div>
                                                    <p className="font-medium uppercase hover:text-teal-500 hover:underline cursor-pointer" onClick={() => navigate(`/dashboard/users/${task?.assignedTo?._id}/view`)}>
                                                        {task?.assignedTo?.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {task?.assignedTo?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Due Date */}
                                        <td className="px-3 md:min-w-30">
                                            {new Date(task.dueDate).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })}
                                        </td>

                                        {/* Priority */}
                                        <td className="px-3">
                                            <span
                                                className={`px-3 py-1 rounded-sm text-xs font-semibold ${priorityColor(
                                                    task.priority
                                                )}`} >
                                                {task.priority}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-3">
                                            <select
                                                title="status"
                                                disabled={loading}
                                                value={task.status}
                                                onChange={(e) => updateStatus(task._id, e.target.value)}
                                                className={`px-3 py-1 rounded-sm text-sm outline-none ${statusColor(task.status)}`} >
                                                <option value="Pending"> Pending </option>
                                                <option value="In Progress"> In Progress </option>
                                                <option value="Completed"> Completed </option>
                                            </select>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-3 py-2 flex items-center bg-teal-100">
                                            {(user?.role === "Admin" || user?._id === task?.createdBy) && (
                                                <button
                                                    title="Delete Task"
                                                    onClick={() => deleteTask(task._id)}
                                                    className="p-2 rounded-sm text-red-500 hover:bg-red-50">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            {(user?.role === "Admin" || user?._id === task?.createdBy) && (
                                                <button
                                                    title="Edit Task"
                                                    onClick={() => updateTask(task._id)}
                                                    className="p-2 rounded-sm text-teal-500 hover:bg-red-50">
                                                    <EditIcon size={16} />
                                                </button>
                                            )}
                                            {/* view */}
                                            {(user?.role === "Admin" || user?._id === task?.createdBy) && (
                                                <button
                                                    title="View Task"
                                                    onClick={() => viewTask(task._id)}
                                                    className="p-2 rounded-sm text-teal-500 hover:bg-red-50">
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            {!loading && paginatedTasks.length > 0 && (
                <div className="px-2 py-3 border border-gray-300 bg-teal-100 text-xs text-gray-800 flex items-center justify-between">
                    <span>
                        Showing{" "}
                        {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredTasks.length)}
                        {" "}–{" "}
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredTasks.length)}
                        {" "}of {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                    </span>
                    {filteredTasks.length < tasks.length ? (
                        <span className="text-teal-400">(Filtered from {tasks.length} task)</span>
                    ) : null}
                </div>
            )}
            {/* // paination */}
            <div className="mt-5 flex items-center justify-between gap-2">
                {/* <div className="flex bg-gray-200 border border-gray-300 rounded px-3 py-1 items-center justify-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                </div> */}
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
        </section>
    );
}