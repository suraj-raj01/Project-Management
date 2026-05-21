import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    CalendarDays,
    FolderKanban,
    UserCircle2
} from "lucide-react";

import API from "../../services/api";

interface ProjectType {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;

    createdBy: {
        _id: string;
        name: string;
        email: string;
    };

    members: string[];
}

export default function ProjectView() {
    const { id } = useParams();

    const [project, setProject] = useState<ProjectType | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/projects/${id}`);
                // console.log(data)
                setProject(data?.project);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-full mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-30 w-full  bg-gray-200 rounded-sm"></div>

                    <div className="bg-white rounded-sm border border-gray-100">
                        <div className="flex gap-5 justify-start">
                            <div className="h-24 w-72 animate-pulse bg-gray-200 rounded-sm mb-4"></div>
                            <div className="h-24 w-70 animate-pulse bg-gray-200 rounded-sm"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="h-28 bg-gray-100 rounded-sm"></div>
                            <div className="h-28 bg-gray-100 rounded-sm"></div>
                            <div className="h-28 bg-gray-100 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-full">

            {project ? (
                <div className="space-y-6">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-sm p-6 md:p-8 text-white shadow-xl">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-sm bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <FolderKanban size={28} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-teal-100 uppercase tracking-widest">
                                            Project Details
                                        </p>

                                        <h1 className="text-2xl md:text-3xl font-bold">
                                            {project.name}
                                        </h1>
                                    </div>
                                </div>

                                <p className="text-teal-50 leading-relaxed max-w-3xl line-clamp-2">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Admin */}
                        <div className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-sm bg-teal-100 text-teal-600 flex items-center justify-center">
                                    <UserCircle2 size={28} />
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-500 tracking-wide">
                                        Project Admin
                                    </p>

                                    <h3 className="text-lg font-bold text-gray-800 uppercase">
                                        {project.createdBy?.name}
                                    <p className="text-xs font-normal -mt-2 lowercase">
                                        {project.createdBy?.email}
                                    </p>
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Created Date */}
                        <div className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-sm bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <CalendarDays size={28} />
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-500 tracking-wide">
                                        Created On
                                    </p>

                                    <h3 className="text-lg font-bold text-gray-800">
                                        {new Date(
                                            project.createdAt
                                        ).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Description */}
                    <div className="bg-white border border-gray-100 rounded-sm p-5 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800">
                            Project Description
                        </h2>

                        <p className="text-gray-600 leading-8">
                            {project.description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 px-1">
                        <p>
                            Last updated:{" "}
                            {new Date(
                                project.updatedAt
                            ).toLocaleDateString()}
                        </p>

                        <p>Project ID: {project._id}</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-sm border border-gray-100 p-12 text-center shadow-sm">
                    <FolderKanban
                        size={60}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="text-2xl font-bold text-gray-700 mt-5">
                        Project Not Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        The project you are looking for does not exist.
                    </p>
                </div>
            )}
        </div>
    );
}