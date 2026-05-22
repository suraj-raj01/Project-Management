import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../helpers/GetUserInfo";
import { AlertCircle } from "lucide-react";

export default function ProjectForm() {
    const navigate = useNavigate();
    const user = getUserFromStorage();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    // Get Single Project
    const getProjectById = async (id: string) => {
        try {
            setLoading(true);
            const { data } = await API.get(
                `/projects/${id}`
            );
            // console.log(data, 'data')
            setFormData({
                name: data.project.name,
                description: data.project.description,
            });

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (id) {
            getProjectById(id);
        }
    }, [id]);

    // submit form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (id) {
                await API.put(`/projects/${id}`, formData);
                toast.success("Project Updated");
            } else {
                // Create
                await API.post("/projects", { ...formData, createdBy: user._id });
                toast.success("Project Created");
            }
            // Reset form
            setFormData({
                name: "",
                description: "",
            });
            navigate("/dashboard/projects");
        } catch (error: any) {
            if (error.response.data.success === false) {
                console.log(error);
                if (error.response.data.rollback === "upgrade") {
                    setShowUpgradeModal(true);
                }
            } else {
                toast.error("Failed to create project");
            }
        } finally {
            setLoading(false);
        }
    };

    if (user.role === "Member") return <div className="min-h-140 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
            <AlertCircle size={24} />
            <h1 className="text-3xl font-bold">Unauthorized</h1>
            <p>You do not have permission to access this page</p>
        </div>
    </div>

    return (
        <section>
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h1 className="text-2xl font-bold">
                        {id ? "Update Project" : "Create Project"}
                    </h1>
                    <p className="text-gray-500 text-sm">Manage and track your projects</p>
                </div>
                <div>
                    <Link to="/dashboard/projects" className="bg-teal-500 text-white px-4 py-2 rounded-sm hover:bg-teal-600 transition">
                        All Project
                    </Link>
                </div>
            </div>
            <div className="border border-gray-200 md:max-w-2xl rounded-sm p-5  shadow-sm">

                <form action="" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Project Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full border bg-gray-50 border-gray-200 p-3 rounded-sm mb-4"
                    />

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={5}
                        className="w-full border bg-gray-50 border-gray-200 p-3 rounded-sm mb-4"
                    />

                    <button
                        disabled={loading}
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-sm transition"
                    >
                        {loading ? "Submitting..." : id ? "Update Project" : "Create Project"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/projects")}
                        disabled={loading}
                        className="ml-4 px-5 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </form>
            </div>

            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-3">
                            Upgrade Required
                        </h2>

                        <p className="text-gray-600 mb-5">
                            You have reached your project limit. Please upgrade to create more projects.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => navigate("/pricing")}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Upgrade
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}