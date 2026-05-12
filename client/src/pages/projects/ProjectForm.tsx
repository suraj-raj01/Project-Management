import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProjectForm() {
    const navigate = useNavigate();
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
                await API.post("/projects", formData);
                toast.success("Project Created");
            }
            // Reset form
            setFormData({
                name: "",
                description: "",
            });
            navigate("/dashboard/projects");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

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
                    <Link to="/dashboard/projects" className="bg-green-500 text-white px-4 py-2 rounded-sm hover:bg-green-600 transition">
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
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-sm transition"
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
        </section>
    );
}