import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { EditIcon, Eye, Loader2, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const ITEMS_PER_PAGE = 5;

export default function Tasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] =
        useState(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    // Fetch Tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);

            const { data } = await API.get(
                "/tasks/all"
            );

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
    const handlePageChange = (page) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Delete Task
    const deleteTask = async (
        taskId: string
    ) => {
        const confirmDelete = window.confirm(
            "Delete this task?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(
                `/tasks/${taskId}`
            );

            toast.success("Task Deleted");

            fetchTasks();

        } catch (error) {
            console.log(error);
        }
    };

    const navigate = useNavigate();
    const updateTask = async (taskId: string) => {
        navigate(`/dashboard/create-task/${taskId}`)
    }

    const viewTask = (id:string) => {
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
                return "bg-green-100 text-green-700";

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
                return "bg-blue-600 text-white";

            case "Completed":
                return "bg-green-600 text-white";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32 text-gray-400">
                <Loader2 size={30} className="animate-spin text-indigo-500 mr-2" />
                <span className="text-sm">Loading Tasks...</span>
            </div>
        );
    }

    return (
        <section>
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row justify-between items-center mb-6">
                <div className=" flex flex-col">
                    <h3 className="text-3xl font-bold"> All  Tasks</h3>
                    <span className="text-sm text-gray-500">
                        track and manage all your team's tasks in one place
                    </span>
                </div>
                <button className='text-md w-full md:w-fit rounded-sm bg-indigo-500 px-4 py-2 text-white'>
                    <Link to="/dashboard/create-task">Create Task</Link>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-sm">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-indigo-500 text-white">
                        <tr className=''>
                            <th className="px-5 py-4 font-semibold">
                                Title
                            </th>

                            <th className="px-5 py-4 font-semibold">
                                Project
                            </th>

                            <th className="px-5 py-4 font-semibold">
                                Assigned To
                            </th>

                            <th className="px-5 py-4 font-semibold">
                                Due Date
                            </th>

                            <th className="px-5 py-4 font-semibold">
                                Priority
                            </th>

                            <th className="px-5 py-4 font-semibold">
                                Status
                            </th>

                            <th className="px-5 py-4 font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedTasks &&
                            paginatedTasks.map(
                                (task: any) => (
                                    <tr
                                        key={
                                            task._id
                                        }
                                        className=" hover:bg-gray-50 border border-gray-200"
                                    >
                                        {/* Title */}
                                        <td className="px-5 py-4">
                                            <div>
                                                <h2 className="font-semibold">
                                                    {
                                                        task.title
                                                    }
                                                </h2>

                                                <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                                                    {
                                                        task.description
                                                    }
                                                </p>
                                            </div>
                                        </td>

                                        {/* Project */}
                                        <td className="px-5 py-4">
                                            {
                                                task
                                                    ?.project
                                                    ?.name
                                            }
                                        </td>

                                        {/* Assigned User */}
                                        <td className="px-5 py-4 ">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-sm bg-indigo-600 text-white flex items-center justify-center uppercase font-bold">
                                                    {task
                                                        ?.assignedTo
                                                        ?.name?.[0] ||
                                                        "U"}
                                                </div>

                                                <div>
                                                    <p className="font-medium uppercase">
                                                        {task?.assignedTo?.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {
                                                            task
                                                                ?.assignedTo
                                                                ?.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Due Date */}
                                        <td className="px-5 py-4">
                                            {new Date(
                                                task.dueDate
                                            ).toLocaleDateString()}
                                        </td>

                                        {/* Priority */}
                                        <td className="px-5 py-4 ">
                                            <span
                                                className={`px-3 py-1 rounded-sm text-xs font-semibold ${priorityColor(
                                                    task.priority
                                                )}`}
                                            >
                                                {
                                                    task.priority
                                                }
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4 ">
                                            <select
                                                title="title"
                                                disabled={loading}
                                                value={
                                                    task.status
                                                }
                                                onChange={(e) =>
                                                    updateStatus(
                                                        task._id,
                                                        e.target.value
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-sm text-sm outline-none ${statusColor(task.status)}`} >
                                                <option value="Pending">
                                                    Pending
                                                </option>

                                                <option value="In Progress">
                                                    In Progress
                                                </option>

                                                <option value="Completed">
                                                    Completed
                                                </option>
                                            </select>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            {(user?.role ===
                                                "Admin" ||
                                                user?._id ===
                                                task?.createdBy) && (
                                                    <button
                                                        title="btn"
                                                        onClick={() =>
                                                            deleteTask(
                                                                task._id
                                                            )
                                                        }
                                                        className="p-2 rounded-sm text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </button>
                                                )}
                                            {(user?.role ===
                                                "Admin" ||
                                                user?._id ===
                                                task?.createdBy) && (
                                                    <button
                                                        title="btn"
                                                        onClick={() => updateTask(task._id)}
                                                        className="p-2 rounded-sm text-green-500 hover:bg-red-50">
                                                        <EditIcon size={18} />
                                                    </button>
                                                )}
                                            {/* view */}
                                            {(user?.role ===
                                                "Admin" ||
                                                user?._id ===
                                                task?.createdBy) && (
                                                    <button
                                                        title="btn"
                                                        onClick={() => viewTask(task._id)}
                                                        className="p-2 rounded-sm text-green-500 hover:bg-red-50">
                                                        <Eye size={18} />
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

            {/* // paination */}
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
                        className={`px-4 py-2 rounded-sm border text-sm font-medium transition
                                    
                                    ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"
                            }
                                `}
                    >
                        Next
                    </button>

                </div>
            )}
        </section>
    );
}