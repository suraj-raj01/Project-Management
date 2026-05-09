import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import {
    CalendarDays,
    FolderKanban,
    Flag,
    CircleCheckBig,
    User,
    Mail,
} from "lucide-react";

import API from "../services/api";

export default function TaskView() {
    const [task, setTask] = useState<any>(null);

    const [fetching, setFetching] =
        useState(false);

    const { id } = useParams();

    // Fetch Task
    const fetchTaskById = async () => {
        try {
            setFetching(true);

            const { data } = await API.get(
                `/tasks/${id}`
            );

            setTask(data.task);

        } catch {
            toast.error(
                "Failed to load task"
            );
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (id) fetchTaskById();
    }, [id]);

    // Priority Colors
    const priorityColor = (
        priority: string
    ) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-600";

            case "Medium":
                return "bg-yellow-100 text-yellow-700";

            case "Low":
                return "bg-green-100 text-green-700";

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
                return "bg-green-100 text-green-700";

            case "In Progress":
                return "bg-blue-100 text-blue-700";

            case "Pending":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Loading State
    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <h2 className="text-gray-500 text-lg">
                    Loading Task...
                </h2>
            </div>
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
            <div className="bg-white rounded-sm shadow border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {task.title}
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Created on{" "}
                                {new Date(
                                    task.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span
                                className={`px-4 py-2 rounded-sm text-sm font-semibold ${priorityColor(
                                    task.priority
                                )}`}
                            >
                                {task.priority} Priority
                            </span>

                            <span
                                className={`px-4 py-2 rounded-sm text-sm font-semibold ${statusColor(
                                    task.status
                                )}`}
                            >
                                {task.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left */}
                    <div className="lg:col-span-2">
                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-3">
                                Description
                            </h2>

                            <p className="text-gray-700 leading-relaxed">
                                {
                                    task.description
                                }
                            </p>
                        </div>

                        {/* Project */}
                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <FolderKanban
                                    className="text-blue-500"
                                    size={22}
                                />

                                <h2 className="text-lg font-bold">
                                    Project
                                </h2>
                            </div>

                            <h3 className="font-semibold text-lg">
                                {
                                    task.project
                                        ?.name
                                }
                            </h3>

                            <p className="text-gray-600 mt-2">
                                {
                                    task.project
                                        ?.description
                                }
                            </p>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-5">
                        {/* Assigned User */}
                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-5">
                            <h2 className="text-lg font-bold mb-4">
                                Assigned To
                            </h2>

                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-sm bg-indigo-500 text-white flex items-center justify-center text-xl font-bold uppercase">
                                    {task
                                        ?.assignedTo
                                        ?.name?.[0] ||
                                        "U"}
                                </div>

                                <div>
                                    <h3 className="font-semibold uppercase">
                                        {
                                            task
                                                ?.assignedTo
                                                ?.name
                                        }
                                    </h3>

                                    <p className="text-gray-500 text-sm">
                                        {
                                            task
                                                ?.assignedTo
                                                ?.email
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Task Info */}
                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-5">
                            <h2 className="text-lg font-bold mb-4">
                                Task Details
                            </h2>

                            <div className="space-y-4">
                                {/* Due Date */}
                                <div className="flex items-center gap-3">
                                    <CalendarDays
                                        size={18}
                                        className="text-gray-500"
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
                                        className="text-gray-500"
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
                                        className="text-gray-500"
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
                                        className="text-gray-500"
                                    />

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Assigned User
                                        </p>

                                        <p className="font-medium">
                                            {
                                                task
                                                    ?.assignedTo
                                                    ?.name
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <Mail
                                        size={18}
                                        className="text-gray-500"
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
                        </div>

                        {/* Footer */}
                        <div className="text-xs text-gray-400 text-center">
                            Last updated{" "}
                            {new Date(
                                task.updatedAt
                            ).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}