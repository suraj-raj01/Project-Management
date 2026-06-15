import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    CalendarDays,
    FolderKanban,
    Flag,
    CircleCheckBig,
    User,
    Mail,
} from "lucide-react";

import API from "../../services/api";
import TaskViewSkeleton from "../skeleton/TaskViewSkeleton";

export default function TaskView() {
    const [task, setTask] = useState<any>(null);

    const [fetching, setFetching] =
        useState(false);

    const { id } = useParams();

    // Fetch Task
    const fetchTaskById = async () => {
        try {
            setFetching(true);
            const { data } = await API.get(`/tasks/${id}`);
            setTask(data.task);
        } catch (error: any) {
            console.log(error.response.data.message)
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (id) fetchTaskById();
    }, [id]);

    const navigate = useNavigate();

    // Priority Colors
    const priorityColor = (
        priority: string
    ) => {
        switch (priority) {
            case "High":
                return "bg-red-500 text-white";

            case "Medium":
                return "bg-yellow-300 text-yellow-700";

            case "Low":
                return "bg-teal-500 text-white";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Status Colors
    const statusColor = (
        status: string
    ) => {
        switch (status) {
            case "Completed":
                return "bg-teal-400 text-white";

            case "In Progress":
                return "bg-green-400 text-white";

            case "Pending":
                return "bg-yellow-400 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Loading State
    if (fetching) {
        return (
            <TaskViewSkeleton />
        );
    }

    // No Task
    if (!task) {
        return (
            <div className="flex items-center justify-center py-20">
                <h2 className="text-red-500 text-lg">
                    Task not found
                </h2>
            </div>
        );
    }

    return (
        <section className="max-w-full mx-auto">
            {/* Card */}
            <div className="rounded-sm overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 py-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Task View
                            </h1>
                            <p className="text-gray-500">View and manage your assigned task</p>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span
                                className={`px-4 py-2 rounded-sm text-sm font-semibold ${priorityColor(task.priority )}`} >
                                {task.priority} Priority
                            </span>

                            <span
                                className={`px-4 py-2 rounded-sm text-sm font-semibold ${statusColor(task.status)}`}>
                                {task.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left */}
                    <div className="lg:col-span-2">
                        {/* Description */}
                        <div className="mb-8">
                            <p className="text-end text-gray-500 mt-2">
                                Created on{" "}
                                {new Date(
                                    task.createdAt
                                ).toLocaleDateString()}
                            </p>
                            <h2 className="text-md font-bold">
                                Task Title
                            </h2>
                            <p className="text-lg md:text-xl">{task.title}</p>
                            <h2 className="text-md font-bold mt-3">
                                Description
                            </h2>

                            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                                {task.description}
                            </p>
                        </div>

                        {/* Project */}
                        <div className="bg-gray-50 rounded-sm p-2 md:p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <FolderKanban
                                    className="text-teal-500"
                                    size={22}
                                />

                                <h2 className="text-lg font-bold">
                                    Project
                                </h2>
                            </div>

                            <h3 className="font-semibold text-lg">
                                {task.project?.name}
                            </h3>

                            <p className="text-gray-600 text-lg md:text-xl mt-2">
                                {task.project?.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="">
                        {/* Assigned User */}
                        <div className="bg-gray-50  rounded-sm p-2 md:p-4">
                            <h2 className="text-lg font-bold mb-4">
                                Assigned To
                            </h2>

                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-teal-400 text-white flex items-center justify-center text-3xl font-bold uppercase">
                                    {task?.assignedTo?.name?.[0] || "U"}
                                </div>

                                <div>
                                    <h3 title="View profile" className="font-semibold -mb-1 hover:text-teal-500 cursor-pointer text-lg uppercase" onClick={() => navigate(`/dashboard/users/${task?.assignedTo?._id}/view`)}>
                                        {task?.assignedTo?.name}
                                    </h3>

                                    <p className="text-gray-500 text-sm">
                                        {task?.assignedTo?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Task Info */}
                        <div className="bg-gray-50 rounded-sm px-2 md:px-5">
                            <h2 className="text-lg font-bold mb-2">
                                Task Details
                            </h2>

                            <div className="space-y-2">
                                {/* Due Date */}
                                <div className="flex items-center gap-3">
                                    <CalendarDays
                                        size={18}
                                        className="text-teal-500 border rounded-full h-10 w-10 p-2"
                                    />

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Due Date
                                        </p>

                                        <p className="font-medium">
                                            {new Date(
                                                task.dueDate
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div className="flex items-center gap-3">
                                    <Flag
                                        size={18}
                                        className="text-teal-500 border rounded-full h-10 w-10 p-2"
                                    />

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Priority
                                        </p>

                                        <p className="font-medium">
                                            {
                                                task.priority
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-3">
                                    <CircleCheckBig
                                        size={18}
                                        className="text-teal-500 border rounded-full h-10 w-10 p-2"
                                    />

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Status
                                        </p>

                                        <p className="font-medium">
                                            {
                                                task.status
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Assigned User */}
                                <div className="flex items-center gap-3">
                                    <User
                                        size={18}
                                        className="text-teal-500 border rounded-full h-10 w-10 p-2"
                                    />

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Assigned User
                                        </p>

                                        <p title="profile" className="font-medium capitalize cursor-pointer hover:text-teal-500" onClick={() => navigate(`/dashboard/users/${task?.assignedTo?._id}/view`)}>
                                            {
                                                task?.assignedTo?.name
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <Mail
                                        size={18}
                                        className="text-teal-500 border rounded-full h-10 w-10 p-2"
                                    />

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Email
                                        </p>

                                        <p className="font-medium">
                                            {
                                                task
                                                    ?.assignedTo
                                                    ?.email
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Footer */}
                            <div className="text-xs rounded-sm text-gray-600 text-center p-3 mt-5 bg-teal-100">
                                Last updated{" "}
                                {new Date(
                                    task.updatedAt
                                ).toLocaleString()}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}