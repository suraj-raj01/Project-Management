import { useEffect, useState } from "react";
import { z } from "zod";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    User,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";

import { getUserFromStorage } from "../helpers/GetUserInfo";

// Zod Schema

const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export default function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
    }>({});

    const [apiError, setApiError] =
        useState("");

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: "",
        });

    const user = getUserFromStorage();

    // Redirect if already logged in

    useEffect(() => {
        if (user?._id) {
            navigate("/dashboard");
        }
    }, [navigate, user]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Record<string,string > = {};
            result.error.issues.forEach((err) => {
                fieldErrors[
                    String(err.path[0])
                ] = err.message;
            });

            setErrors(fieldErrors);

            return;
        }

        setErrors({});
        setApiError("");

        try {
            setLoading(true);
             await API.post(  "/auth/register",
                formData
            );

            toast.success(  "Registered Successfully" );
            navigate("/login");
        } catch (error) {

            const err = error as AxiosError<{  message: string; }>;
            const message =  err.response?.data?.message || "Registration failed";
            setApiError(message);
            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative overflow-hidden -mt-15 pt-18 min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4 py-5">

            {/* Background Effects */}

            <div className="absolute top-0 left-0 w-72 h-72 bg-green-300/30 blur-3xl rounded-full" />

            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300/30 blur-3xl rounded-full" />

            {/* Main Card */}

            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 rounded-lg overflow-hidden shadow-2xl border border-white/30 bg-white/70 backdrop-blur-xl">

                {/* Left Side */}

                <div className="hidden lg:flex flex-col justify-center px-10 bg-gradient-to-br from-green-500 to-emerald-700 text-white relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-3xl" />

                    <div className="relative z-10">

                        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-5">
                            <ShieldCheck size={18} />

                            MERN Stack Team Collaboration
                        </div>

                        <h1 className="text-5xl font-black leading-tight">
                            Create Account 🚀
                        </h1>

                        <p className="mt-6 text-lg text-white/80 leading-8">
                            Join the Team Task Manager platform
                            and start managing projects,
                            assignments, and team productivity.
                        </p>

                        <div className="mt-10 space-y-5">

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Secure Authentication
                                    </h3>

                                    <p className="text-sm text-white/70">
                                        JWT based login system
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                                    <LockKeyhole size={20} />
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Role Based Access
                                    </h3>

                                    <p className="text-sm text-white/70">
                                        Admin & Member support
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form */}

                <div className="p-5 sm:p-12 lg:p-5">

                    <div className="max-w-md mx-auto">

                        <div className="mb-5">

                            <h2 className="text-4xl font-black text-gray-900">
                                Register
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Create your account to continue.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Name */}

                            <div>

                                <label className="text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>

                                <div className="mt-2 relative">

                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        disabled={loading}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white/80 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 transition"
                                    />
                                </div>

                                {errors?.name && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}

                            <div>

                                <label className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>

                                <div className="mt-2 relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        disabled={loading}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white/80 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 transition"
                                    />
                                </div>

                                {errors?.email && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}

                            <div>

                                <label className="text-sm font-semibold text-gray-700">
                                    Password
                                </label>

                                <div className="mt-2 relative">

                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter password"
                                        value={formData.password}
                                        disabled={loading}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full pl-12 pr-14 py-3 rounded-full border border-gray-200 bg-white/80 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 transition"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>

                                {errors?.password && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* API Error */}

                            {apiError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3">
                                    {apiError}
                                </div>
                            )}

                            {/* Button */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                            >
                                {loading
                                    ? "Registering..."
                                    : "Create Account"}

                                {!loading && (
                                    <ArrowRight
                                        size={18}
                                        className="group-hover:translate-x-1 transition"
                                    />
                                )}
                            </button>

                            {/* Login */}

                            <p className="text-center text-gray-500 pt-3">

                                Already have an account?

                                <Link
                                    to="/login"
                                    className="ml-2 font-semibold text-green-600 hover:text-green-700 hover:underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}