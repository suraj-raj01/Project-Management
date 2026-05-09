import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateUser() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await API.post("/auth/register", formData);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log(data);
            toast.success("User Created Successfully");
            navigate("/dashboard/users");
        } catch (error) {
            console.log(error);
            toast.error("User creation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-140 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 border border-gray-200 rounded-sm shadow-md w-full max-w-md"
            >
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Create Members
                </h1>
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border p-3 rounded-sm mb-4"
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded-sm mb-4"
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded-sm mb-4"
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-sm"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
    );
}