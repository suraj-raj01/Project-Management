import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import { AlertCircle, Edit, Eye, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import TableSkeleton from "../skeleton/TableSkeleton";
import { getUserFromStorage } from "../helpers/GetUserInfo";
const ITEMS_PER_PAGE = 7;

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [projectloading, projectsetLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const user = getUserFromStorage();

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            projectsetLoading(true);
            const { data } = await API.get("/projects");
            // console.log(data);
            setProjects(data?.projects || []);
        } catch (error) {
            console.log(error);
        } finally {
            projectsetLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const totalPages = Math.ceil(
        projects.length / ITEMS_PER_PAGE
    );

    // paginated projects
    const paginatedProjects = useMemo(() => {
        const startIndex =
            (currentPage - 1) * ITEMS_PER_PAGE;

        const endIndex =
            startIndex + ITEMS_PER_PAGE;

        return projects.slice(startIndex, endIndex);
    }, [projects, currentPage]);

    // page change
    const handlePageChange = (page: any) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const navigate = useNavigate();
    // Edit Handler
    const handleEdit = (id: string) => {
        navigate(`/dashboard/projects/edit/${id}`);
    };

    // Delete Handler
    const handleDelete = async (id: string) => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                        Delete Project
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Are you sure you want to delete this project?
                    </p>

                    <p className="text-xs text-red-500 mt-2">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                projectsetLoading(true);

                                await API.delete(`/projects/${id}`);
                                toast.dismiss(t.id);
                                toast.success("Project Deleted Successfully");
                                fetchProjects();
                            } catch (error) {
                                console.log(error);
                                toast.error("Failed to delete project");
                            } finally {
                                projectsetLoading(false);
                            }
                        }}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-sm hover:bg-red-600 transition"
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

    if (user.role === "Member") return <div className="min-h-140 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
            <AlertCircle size={24} />
            <h1 className="text-3xl font-bold">Unauthorized</h1>
            <p>You do not have permission to access this page</p>
        </div>
    </div>

    if (projectloading) return (
        <TableSkeleton />
    )

    return (
        <section>
            {/* Projects Header */}
            <div className="flex md:flex-row flex-col w-full justify-between items-start gap-4 mb-3">
                <div>
                    <h1 className="text-2xl font-bold">
                        Projects
                    </h1>
                    <p className="text-gray-500 text-sm">Manage and track your projects</p>
                </div>
                <div className="flex items-center w-full md:w-fit justify-end">
                    <Link to="/dashboard/projects/create" className="border-teal-500 border-b-2 bg-linear-to-br from-teal-600 to-orange-300 text-white px-4 py-2 rounded-sm transition flex items-center justify-end">
                      <Plus size={18}/>  Add Project
                    </Link>
                </div>
            </div>

            {/* Projects Table */}
            <div className="overflow-x-auto rounded-sm rounded-b-xs bg-white border border-teal-50">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-teal-500 text-white">
                        <tr>
                            <th className="px-3 py-4 text-center font-semibold">
                                Index
                            </th>
                            <th className="px-3 py-4 font-semibold">
                                Project Name
                            </th>

                            <th className="px-3 py-4 font-semibold">
                                Description
                            </th>

                            <th className="px-3 py-4 font-semibold">
                                Created At
                            </th>

                            {user?.role !== "Member" && (
                                <th className="px-3 py-4 font-semibold text-center">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedProjects &&
                            paginatedProjects.length > 0 ? (
                            paginatedProjects.map(
                                (project: any, index:number) => (
                                    <tr key={project._id} className="border-b border-gray-100 hover:bg-teal-50/40 transition">

                                        <td className="px-3 py-2">
                                            <div>
                                                <h2 className="font-semibold text-center">
                                                    {index+1}
                                                </h2>
                                            </div>
                                        </td>
                                        {/* Project Name */}
                                        <td className="px-3 py-2 bg-teal-100 min-w-40">
                                            <div>
                                                <h2 className="font-semibold">
                                                    {project.name}
                                                </h2>
                                            </div>
                                        </td>

                                        {/* Description */}
                                        <td className="px-3 py-2 max-w-sm">
                                            <p className="line-clamp-2 min-w-60">
                                                {project.description}
                                            </p>
                                        </td>

                                        {/* Created At */}
                                        <td className="px-3 py-2 text-gray-500 min-w-30">
                                            {new Date(
                                                project.createdAt
                                            ).toLocaleDateString("en-Us", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>

                                        {/* Actions */}
                                        {user?.role !== "Member" && (
                                            <td className="px-3 py-2 bg-teal-100">
                                                <div className="flex items-center justify-center">
                                                    {/* Edit */}
                                                    <button
                                                        title="Edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                project._id
                                                            )
                                                        }
                                                        className="p-2 rounded-sm text-teal-600 hover:bg-teal-50 transition"
                                                    >
                                                        <Edit size={16} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        title="Delete"
                                                        onClick={() => handleDelete(project._id)}
                                                        className="p-2 rounded-sm text-red-500 hover:bg-red-50 transition"
                                                    >
                                                        <Trash2 size={16} className="text-red-500" />
                                                    </button>
                                                    {/* View */}
                                                    <button
                                                        title="View"
                                                        onClick={() =>
                                                            navigate(`/dashboard/projects/view/${project._id}`)
                                                        }
                                                        className="p-2 rounded-sm text-teal-500 hover:bg-teal-50 transition"
                                                    >
                                                        <Eye size={16} className="text-teal-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={user?.role === "Admin" ? 5 : 4}
                                    className="text-center py-10 font-bold   text-gray-500"
                                >
                                    {projectloading? "Loading Projects...": "Projects not found"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {paginatedProjects.length > 0 && (
                <div className="px-2 py-3 border border-gray-300 bg-teal-100 text-xs text-gray-800 flex items-center justify-between">
                    <span>
                        Showing{" "}
                        {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, paginatedProjects.length)}
                        {" "}–{" "}
                        {Math.min(currentPage * ITEMS_PER_PAGE, paginatedProjects.length)}
                        {" "}of {paginatedProjects.length} task{paginatedProjects.length !== 1 ? "s" : ""}
                    </span>
                    {paginatedProjects.length < projects.length ? (
                        <span className="text-teal-400">(Filtered from {projects.length} task)</span>
                    ) : null}
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
        </section>
    );
}