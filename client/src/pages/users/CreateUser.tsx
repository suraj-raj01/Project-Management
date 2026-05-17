import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateUser() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const { id } = useParams();

    const fetchUser = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/dashboard/users/${id}`);
            // console.log(data);
            setFormData({
                name: data?.user?.name,
                email: data?.user?.email,
                role: data?.user?.role,
                password: "",
            });
        }
        catch (error) {
            console.log(error);
            // toast.error("Failed to fetch user data");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) fetchUser();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (id) {
                await API.put(`/dashboard/users/${id}`, formData);
                toast.success("User updated successfully");
            } else {
                await API.post("/auth/register", formData);
                toast.success("User Created Successfully");
            }
            navigate("/dashboard/users");
        } catch (error: any) {
            // console.log(error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-160 flex bg-linear-to-r from-gray-50 to-gray-200 items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className=" p-8 border border-gray-200 rounded-sm shadow-md w-full max-w-2xl"
            >
                <h1 className="text-3xl font-bold mb-6 text-teal-800 text-center">
                    {id ? ("Update Member") : ("Create Member")}
                </h1>
                <input
                    type="text"
                    value={formData.name}
                    placeholder="Name"
                    className="w-full border border-gray-300 p-3 rounded-sm mb-4"
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                />

                <input
                    type="email"
                    value={formData.email}
                    placeholder="Email"
                    className="w-full border border-gray-300 p-3 rounded-sm mb-4"
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />

                {id ? ("") : (
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 p-3 rounded-sm mb-4"
                        onChange={
                            (e) =>
                                setFormData({ ...formData, password: e.target.value })
                        }
                    />
                )}

                <select
                    name="role"
                    id="role"
                    value={formData.role}
                    className="w-full border border-gray-300 p-3 rounded-sm mb-4"
                    onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                    }
                >
                    <option value="">Select Role</option>
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-teal-500 text-white py-3 rounded-sm"
                    disabled={loading}
                >
                    {loading ? "Creating..." : (id ? "Update Member" : "Create Member")}
                </button>
            </form>
        </div>
    );
}