import { useState } from "react";
import { z } from "zod";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


// Zod Schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const [apiError, setApiError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((err) => {
                fieldErrors[String(err.path[0])] = err.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setApiError("");

        try {
            setLoading(true);

            const { data } = await API.post(
                "/auth/login",
                formData
            );

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            toast.success("Login Successfully");

            navigate("/dashboard");
        } catch (error) {
            const err = error as AxiosError<{
                message: string;
            }>;

            const message =
                err.response?.data?.message ||
                "Login failed";

            setApiError(message);

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-130 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 border  border-gray-200 rounded-xl shadow-md w-full max-w-md"
            >
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Login
                </h1>

                {/* Email */}
                <label>Email</label>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded-sm mb-3"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            email: e.target.value,
                        })
                    }
                />

                {errors?.email && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors?.email}
                    </p>
                )}

                {/* Password */}
                <label>Password</label>

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded-sm mb-4"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            password: e.target.value,
                        })
                    }
                />

                {errors?.password && (
                    <p className="text-red-500 text-sm mb-4">
                        {errors?.password}
                    </p>
                )}
                {apiError && (
                    <p className="text-red-500 text-sm mb-4">
                        {apiError}
                    </p>
                )}
                <button
                    disabled={loading}
                    className="w-full bg-blue-500 cursor-pointer font-bold text-white py-3 rounded-sm disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="flex items-center justify-center mt-3">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="font-bold ml-1 text-blue-500 hover:underline"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
}