import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
const ITEMS_PER_PAGE = 6;

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [projectloading, projectsetLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            projectsetLoading(true);

            const { data } = await API.get("/projects");

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
    const handlePageChange = (page:any) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Create OR Update Project
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (editingId) { await API.put( `/projects/${editingId}`, formData );
                toast.success("Project Updated");
            } else {
                // Create
                await API.post( "/projects", formData );
                toast.success("Project Created");
            }
            // Refresh list
            fetchProjects();
            // Reset form
            setFormData({
                name: "",
                description: "",
            });

            setEditingId(null);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Get Single Project
    const getProjectById = async (id: string) => {
        try {
            setLoading(true);
            const { data } = await API.get(
                `/projects/${id}`
            );
            console.log(data, 'data')
            setFormData({
                name: data.project.name,
                description: data.project.description,
            });

            setEditingId(id);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    // Edit Handler
    const handleEdit = (id: string) => {
        getProjectById(id);
    };

    // Delete Handler
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) return;

        try {
            setLoading(true);
            await API.delete(`/projects/${id}`);
            toast.success("Project Deleted");
            fetchProjects();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            {/* Admin Form */}
            {user?.role === "Admin" ? (
                <form
                    onSubmit={handleSubmit}
                    className="border border-gray-200 md:max-w-2xl rounded-sm shadow p-6 mb-3 bg-white"
                >
                    <h2 className="text-2xl font-bold mb-5">
                        {editingId
                            ? "Update Project"
                            : "Create Project"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Project Name"
                        value={formData.name}
                        required
                        className="w-full border border-gray-300 p-3 rounded-sm mb-4"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            })
                        }
                    />

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        required
                        className="w-full border border-gray-300 p-3 rounded-sm mb-4"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description:
                                    e.target.value,
                            })
                        }
                    />

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-indigo-500 text-white px-5 py-2 rounded-sm"
                        >
                            {loading
                                ? editingId
                                    ? "Updating..."
                                    : "Creating..."
                                : editingId
                                    ? "Update Project"
                                    : "Create Project"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);

                                    setFormData({
                                        name: "",
                                        description: "",
                                    });
                                }}
                                className="bg-gray-200 px-6 py-3 rounded-sm"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                    <p className="font-bold">
                        Notice
                    </p>

                    <p>
                        You do not have permission
                        to create projects.
                    </p>
                </div>
            )}

            {/* Projects Header */}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold">
                    Projects
                </h1>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedProjects && paginatedProjects.length > 0 ? (
                    paginatedProjects.map((project: any) => (
                        <div
                            key={project._id}
                            className="border border-gray-200 flex items-start justify-between rounded-sm shadow p-4 bg-white"
                        >
                            <div>
                                <h2 className="text-lg font-bold mb-1">
                                    {project.name}
                                </h2>

                                <p className="text-gray-600 w-full break-all text-sm">
                                    {project.description}
                                </p>
                            </div>

                            {user?.role === "Admin" && (
                                <div className="flex flex-col gap-2">
                                    {/* Edit */}
                                    <button
                                        title="btn"
                                        onClick={() =>
                                            handleEdit(
                                                project._id
                                            )
                                        }
                                        className="p-1 border border-gray-200 rounded text-green-500 hover:bg-gray-100"
                                    >
                                        <Edit size={18} />
                                    </button>

                                    {/* Delete */}
                                    <button
                                        title="btn"
                                        onClick={() =>
                                            handleDelete(
                                                project._id
                                            )
                                        }
                                        className="p-1 border border-red-200 rounded hover:bg-red-50 text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>
                        {projectloading
                            ? "Loading Projects..."
                            : "Projects not found"}
                    </div>
                )}
            </div>

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