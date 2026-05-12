import { Link } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    FolderKanban,
    ListChecks,
    LogIn,
    Users,
} from "lucide-react";

const Home = () => {
    return (
        <section className="relative overflow-hidden min-h-screen pt-35 pb-10 md:pb-1 md:pt-20 flex items-center justify-center bg-gradient-to-br from-green-50 -mt-15 via-white to-emerald-100 px-4">

            {/* Background Blur Effects */}

            <div className="absolute top-0 left-0 w-72 h-72 bg-green-300/30 blur-3xl rounded-full" />

            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300/30 blur-3xl rounded-full" />

            {/* Main Content */}

            <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

                {/* Left Content */}

                <div>

                    <div className="inline-flex w-full md:w-auto items-center gap-2 justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                        <CheckCircle2 size={16} />
                        Team Task Management Platform
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl text-center md:text-start font-black leading-tight tracking-tight text-gray-900">

                        Organize Team
                        <span className="block bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text">
                            Tasks Efficiently
                        </span>
                    </h1>

                    <p className="mt-6 text-lg md:text-start text-center text-gray-600 leading-8 max-w-2xl">
                        Streamline project management, assign tasks,
                        track progress, and improve collaboration with
                        a powerful MERN Stack task management system.
                    </p>

                    {/* Buttons */}

                    <div className="flex items-center gap-4 mt-8">

                        <Link
                            to="/docs"
                            className="group flex w-full md:w-auto items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-7 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            Documentation

                            <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition"
                            />
                        </Link>

                        <Link
                            to="/login"
                            className="group px-7 py-3 w-full md:w-auto flex items-center gap-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-300"
                        >
                            <LogIn size={18} className="group-hover:translate-x-1 transition" />
                            Sign In
                        </Link>
                    </div>

                    {/* Stats */}

                    <div className="flex flex-wrap gap-8 mt-10">

                        <div>
                            <h3 className="text-3xl font-black text-gray-900">
                                100%
                            </h3>

                            <p className="text-gray-500 text-sm">
                                Responsive UI
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-black text-gray-900">
                                JWT
                            </h3>

                            <p className="text-gray-500 text-sm">
                                Authentication
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-black text-gray-900">
                                RBAC
                            </h3>

                            <p className="text-gray-500 text-sm">
                                Role Based Access
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side UI Preview */}

                <div className="relative">

                    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl p-6">

                        {/* Mock Navbar */}

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-bold text-xl">
                                    Dashboard
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Team Task Overview
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-green-500 to-emerald-600" />
                        </div>

                        {/* Cards */}

                        <div className="grid grid-cols-2 gap-4">

                            <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-md p-5">
                                <div className="flex items-center justify-between">
                                    <ListChecks
                                        className="text-green-600"
                                        size={22}
                                    />

                                    <span className="text-xs text-green-600 font-semibold">
                                        Tasks
                                    </span>
                                </div>

                                <h3 className="text-3xl font-black mt-5">
                                    120
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Total Tasks
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-md p-5">
                                <div className="flex items-center justify-between">
                                    <FolderKanban
                                        className="text-emerald-600"
                                        size={22}
                                    />

                                    <span className="text-xs text-emerald-600 font-semibold">
                                        Projects
                                    </span>
                                </div>

                                <h3 className="text-3xl font-black mt-5">
                                    24
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Active Projects
                                </p>
                            </div>

                            <div className="col-span-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white shadow-xl">
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm opacity-80">
                                            Team Members
                                        </p>

                                        <h3 className="text-4xl font-black mt-2">
                                            18
                                        </h3>
                                    </div>

                                    <div className="bg-white/20 p-4 rounded-2xl">
                                        <Users size={32} />
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div className="w-[75%] h-full bg-white rounded-full" />
                                    </div>

                                    <p className="text-sm mt-2 opacity-90">
                                        75% productivity this week
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Decoration */}

                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-400/30 blur-2xl rounded-full" />

                    <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-emerald-400/30 blur-2xl rounded-full" />
                </div>
            </div>
        </section>
    );
};

export default Home;