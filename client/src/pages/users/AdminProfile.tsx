import { useEffect, useState } from "react";
import API from "../../services/api";
import { Users, CheckSquare, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminProfile({ id }: { id: any }) {
    const [users, setUsers] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Pagination
    const [userPage, setUserPage] = useState(1);
    const [taskPage, setTaskPage] = useState(1);
    const [projectPage, setProjectPage] = useState(1);
    const itemsPerPage = 5;

    const fetchData = async () => {
        try {
            setLoading(true);

            const [usersRes, tasksRes, projectsRes] = await Promise.all([
                API.get(`/dashboard/usersbyadmin/${id}`),
                API.get(`/dashboard/tasks/${id}`),
                API.get(`/projects`),
            ]);

            setUsers(usersRes.data?.users || []);
            setTasks(tasksRes.data?.tasks || []);
            setProjects(projectsRes.data?.projects || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // USERS PAGINATION
    const totalUserPages = Math.ceil(users.length / itemsPerPage);

    const paginatedUsers = users.slice(
        (userPage - 1) * itemsPerPage,
        userPage * itemsPerPage
    );

    // TASKS PAGINATION
    const totalTaskPages = Math.ceil(tasks.length / itemsPerPage);

    const paginatedTasks = tasks.slice(
        (taskPage - 1) * itemsPerPage,
        taskPage * itemsPerPage
    );

    // PROJECTS PAGINATION
    const totalProjectPages = Math.ceil(projects.length / itemsPerPage);

    const paginatedProjects = projects.slice(
        (projectPage - 1) * itemsPerPage,
        projectPage * itemsPerPage
    );

    const navigate = useNavigate();

    return (
        <section className="">
            {loading ? (
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="animate-pulse text-teal-600 text-lg font-semibold">
                        Loading...
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* USERS TABLE */}
                    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <Users className="text-teal-600" size={22} />
                                <h2 className="text-xl font-bold text-gray-800">
                                    Team Members
                                </h2>
                            </div>

                            <span className="text-sm text-gray-500">
                                {users.length} Users
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-teal-800 text-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-3 md:min-w-auto min-w-35">
                                            Name
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Email
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Role
                                        </th>
                                        <th className="text-left px-4 py-3 min-w-20 flex items-center justify-center">
                                            Details
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedUsers.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="border-t border-gray-200 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {user.name}
                                            </td>

                                            <td className="px-4 py-3 font-semibold text-gray-600">
                                                {user.email}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-sm text-xs font-semibold">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 bg-teal-100">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button title='view' className="text-teal-600 px-2 rounded-sm bg-teal-100 hover:text-teal-800 cursor-pointer" onClick={() => { navigate(`/dashboard/users/${user?._id}/view`) }}>
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* USERS PAGINATION */}
                        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Page {userPage} of {totalUserPages}
                            </p>

                            <div className="flex items-center gap-2">
                                <button title="previous"
                                    onClick={() =>
                                        setUserPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={userPage === 1}
                                    className="p-2 rounded-xs border-gray-300 cursor-pointer border bg-white disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <button
                                    title='next'
                                    onClick={() =>
                                        setUserPage((prev) =>
                                            Math.min(
                                                prev + 1,
                                                totalUserPages
                                            )
                                        )
                                    }
                                    disabled={userPage === totalUserPages}
                                    className="p-2 rounded-xs border-gray-300 cursor-pointer border bg-white disabled:opacity-50"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TASKS TABLE */}
                    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4  bg-gray-50">
                            <div className="flex items-center gap-2">
                                <CheckSquare
                                    className="text-indigo-600"
                                    size={22}
                                />
                                <h2 className="text-xl font-bold text-gray-800">
                                    Created Tasks
                                </h2>
                            </div>

                            <span className="text-sm text-gray-500">
                                {tasks.length} Tasks
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-teal-800 text-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-3 md:w-auto min-w-55">
                                            Title
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Priority
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Details
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedTasks.map((task) => (
                                        <tr
                                            key={task._id}
                                            className="border-t border-gray-200 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-2 font-medium text-gray-800">
                                                {task.title}
                                            </td>

                                            <td className="px-4 py-2">
                                                <span
                                                    className={`px-2 py-1 rounded-sm text-xs font-semibold
                                                    ${task.priority === "High"
                                                            ? "bg-red-100 text-red-700"
                                                            : task.priority ===
                                                                "Medium"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </td>

                                            <td className="px-4 py-2">
                                                <span
                                                    className={`px-2 py-1 rounded-sm text-xs font-semibold
                                                    ${task.status ===
                                                            "Completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-orange-100 text-orange-700"
                                                        }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 bg-teal-100 flex items-center justify-center text-teal-700 cursor-pointer" onClick={() => { navigate(`/dashboard/task-view/${task?._id}`) }}>

                                                <Eye size={18} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* TASK PAGINATION */}
                        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Page {taskPage} of {totalTaskPages}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    title="previous"
                                    onClick={() =>
                                        setTaskPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={taskPage === 1}
                                    className="p-2 rounded-xs border-gray-300 cursor-pointer border bg-white disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <button
                                    title='next'
                                    onClick={() =>
                                        setTaskPage((prev) =>
                                            Math.min(
                                                prev + 1,
                                                totalTaskPages
                                            )
                                        )
                                    }
                                    disabled={taskPage === totalTaskPages}
                                    className="p-2 rounded-xs border-gray-300 cursor-pointer border bg-white disabled:opacity-50"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PROJECTS TABLE */}
                    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden col-span-2">
                        <div className="flex items-center justify-between px-5 py-4  bg-gray-50">
                            <div className="flex items-center gap-2">
                                <CheckSquare
                                    className="text-teal-600"
                                    size={22}
                                />
                                <h2 className="text-xl font-bold text-gray-800">
                                    Created Projects
                                </h2>
                            </div>

                            <span className="text-sm text-gray-500">
                                {tasks.length} Projects
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-teal-800 text-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-3 md:w-auto min-w-55">
                                            Title
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            descriptions
                                        </th>
                                        <th className="text-left px-4 py-3 min-w-30">
                                            Created On
                                        </th>
                                        <th className="text-left px-4 py-3">
                                            Details
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedProjects.map((project) => (
                                        <tr
                                            key={project._id}
                                            className="border-t border-gray-200 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 font-medium text-gray-800">
                                                {project.name}
                                            </td>

                                            <td className="px-4 py-2">
                                                <span
                                                    className={`px-2 rounded-sm text-xs font-semibold line-clamp-2`}
                                                >
                                                    {project.description}
                                                </span>
                                            </td>

                                            <td className="px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-sm text-xs font-semibold`}
                                                >
                                                    {new Date(project.createdAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 bg-teal-100 flex items-center justify-center text-teal-700 cursor-pointer" onClick={() => { navigate(`/dashboard/projects/view/${project?._id}`) }}>

                                                <Eye size={18} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PROJECT PAGINATION */}
                        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Page {projectPage} of {totalProjectPages}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    title="previous"
                                    onClick={() =>
                                        setProjectPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={projectPage === 1}
                                    className="p-2 rounded-xs border-gray-300 cursor-pointer border bg-white disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <button
                                    title='next'
                                    onClick={() =>
                                        setProjectPage((prev) =>
                                            Math.min(
                                                prev + 1,
                                                totalProjectPages
                                            )
                                        )
                                    }
                                    disabled={projectPage === totalProjectPages}
                                    className="p-2 rounded-xs border-gray-300 cursor-pointer border bg-white disabled:opacity-50"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </section>
    );
}