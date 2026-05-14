import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// ─── Types 

interface User {
    _id: string;
    name: string;
    email: string;
}

interface Project {
    _id: string;
    name: string;
}

interface FormData {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    assignedTo: string;
    project: string;
}

// ─── Component 

export default function CreateTask() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        assignedTo: "",
        project: "",
    });

    const { id } = useParams();
    const isEditMode = Boolean(id);

    // ── Data fetching 

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (id) fetchTaskById();
    }, [id]);

    const fetchProjects = async () => {
        try {
            const { data } = await API.get("/projects");
            setProjects(data.projects || []);
        } catch {
            toast.error("Failed to load projects");
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await API.get("/users");
            setUsers(data.users || []);
        } catch {
            toast.error("Failed to load users");
        }
    };

    const fetchTaskById = async () => {
        try {
            setFetching(true);
            const { data } = await API.get(`/tasks/${id}`);
            const task = data.task;
            // ✅ Populate formData — controlled inputs will now reflect these values
            setFormData({
                title: task.title || "",
                description: task.description || "",
                dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
                priority: task.priority || "Medium",
                assignedTo: task.assignedTo?._id || "",
                project: task.project?._id || "",
            });
        } catch {
            toast.error("Failed to load task");
        } finally {
            setFetching(false);
        }
    };

    // ── Handlers 

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await API.put(`/tasks/${id}`, formData);
                toast.success("Task updated successfully");
            } else {
                await API.post("/tasks", formData);
                toast.success("Task created successfully");
            }
            navigate("/dashboard/tasks");
        } catch (error: any) {
            toast.error(error.response.data.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ── Loading skeleton while fetching existing task ──────────────────────

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-24 text-gray-400">
                <Loader2 size={28} className="animate-spin mr-2 text-green-500" />
                <span className="text-sm">Loading task…</span>
            </div>
        );
    }

    // ── Render ─────────────────────────────────────────────────────────────

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between justify-start gap-3 md:gap-0 items-center mb-10">
                <div className="w-full md:w-fit">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? "Edit Task" : "Create Task"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {isEditMode
                            ? "Update the details below and save."
                            : "Fill in the details to assign a new task."}
                    </p>
                </div>
                <Link
                    to="/dashboard/tasks"
                    className="flex w-full md:w-fit justify-center items-center gap-1.5 text-md rounded-sm bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
                >
                    See All Tasks
                </Link>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="mx-auto border border-gray-200 bg-green-50/30 p-3 md:p-6 md:max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 rounded-sm shadow-sm"
            >

                {/* Task Title */}
                <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Task Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Design landing page"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-green-50/40 p-3 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                    />
                </div>

                {/* Description */}
                <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        placeholder="Brief description of the task…"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-green-50/40 p-3 rounded-sm text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                    />
                </div>

                {/* Due Date */}
                <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <input
                        title="Select due date"
                        type="date"
                        name="dueDate"
                        required
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-green-50/40 p-3 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                    />
                </div>

                {/* Priority */}
                <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <select
                        title="Select priority level"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-green-50/40 p-3 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {/* Assigned To */}
                <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Assigned To</label>
                    <select
                        title="Select user to assign"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-green-50/40 p-3 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Project */}
                <div className="col-span-2 md:col-span-1 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Project</label>
                    <select
                        title="Select associated project"
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        className="w-full border border-gray-200 bg-green-50/40 p-3 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400"
                    >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                            <option key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="col-span-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-colors text-white px-6 py-3 mt-3 rounded-sm font-medium text-sm cursor-pointer"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading
                        ? isEditMode ? "Saving…" : "Creating…"
                        : isEditMode ? "Save Changes" : "Create Task"
                    }
                </button>

            </form>
        </div>
    );
}