import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../helpers/GetUserInfo";

export default function CreateUser() {
    const navigate = useNavigate();
    const user = getUserFromStorage();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
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
                await API.post("/dashboard/users", { ...formData, createdBy: user._id });
                toast.success("User Created Successfully");
            }
            navigate("/dashboard/users");
        } catch (error: any) {
            if (error.response.data.rollback === "upgrade") {
                setShowUpgradeModal(true);
            } else {
                toast.error(error.response.data.message);
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:min-h-145 min-h-140 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="md:p-6 p-4 border border-gray-200 rounded-sm shadow-md w-full max-w-2xl"
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
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                )}

                <select
                    title="role"
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
                    <option value="Admin" disabled = {user.role!=="Superadmin"}>Admin</option>
                </select>

                <button
                    type="submit"
                    className="w-full border-teal-500 border-b-2 bg-linear-to-br from-teal-600 to-green-300 text-white py-3 rounded-sm"
                    disabled={loading}
                >
                    {loading ? "Creating..." : (id ? "Update Member" : "Create Member")}
                </button>
            </form>


            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-3">
                            Upgrade Required
                        </h2>

                        <p className="text-gray-600 mb-5">
                            You have reached your limit of users. Please upgrade to add more users.
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
        </div>
    );
}