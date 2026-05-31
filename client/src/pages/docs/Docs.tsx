import {
    ShieldCheck,
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    BarChart3,
    Lock,
    CalendarClock,
    ChevronRight,
    ListCheckIcon,
    SquareX,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Docs() {
    const features = [
        {
            title: "Authentication",
            icon: <Lock className="text-indigo-600" size={22} />,
            desc: "Secure JWT-based authentication with login and registration.",
        },
        {
            title: "Dashboard Analytics",
            icon: <LayoutDashboard className="text-teal-600" size={22} />,
            desc: "Track total tasks, completed tasks, overdue tasks, and project statistics.",
        },
        {
            title: "Project Management",
            icon: <FolderKanban className="text-purple-600" size={22} />,
            desc: "Create projects, manage members, and organize team workflow.",
        },
        {
            title: "Task Management",
            icon: <CheckSquare className="text-emerald-600" size={22} />,
            desc: "Create tasks, assign members, update task status, and manage priorities.",
        },
        {
            title: "Role Based Access",
            icon: <ShieldCheck className="text-red-500" size={22} />,
            desc: "Admins can manage everything while members only access assigned tasks.",
        },
        {
            title: "Team Collaboration",
            icon: <Users className="text-pink-600" size={22} />,
            desc: "Collaborate with multiple users inside projects.",
        },
    ];

    const steps = [
        "Register or login into the platform",
        "Create a project as Admin",
        "Add members to the project",
        "Create and assign tasks",
        "Track progress from dashboard",
        "Members update task status",
        "Monitor overdue and completed tasks",
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 -mt-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}

                <div className="bg-teal-50 rounded-lg mt-20 p-3 md:p-6">
                    <div className="flex items-center md:gap-3 gap-2 mb-5">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <ListCheckIcon
                                className="text-indigo-600"
                                size={28}
                            />
                        </div>

                        <div>
                            <h1 className="md:text-4xl text-xl font-bold text-gray-900">
                                Team Task Manager
                            </h1>

                            <p className="text-gray-500 text-sm">
                                Complete guide and features overview
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-600 leading-5 max-w-4xl">
                        Team Task Manager is a MERN Stack web application
                        designed to help teams manage projects, assign tasks,
                        and track work progress efficiently using role-based access control.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-6">
                        <span className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
                            React.js
                        </span>

                        <span className="bg-teal-100 text-teal-600 px-4 py-2 rounded-full text-sm font-medium">
                            Node.js
                        </span>

                        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                            Express.js
                        </span>

                        <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                            MongoDB
                        </span>

                        <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                            Tailwind CSS
                        </span>
                    </div>

                    {/* demo account */}
                    <div className="mt-8 max-w-2xl">

                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>

                            <p className="ml-2 font-semibold text-gray-700 text-sm md:text-base">
                                Demo Admin Account
                            </p>
                        </div>

                        <div className="relative overflow-hidden rounded-sm border border-gray-800 bg-linear-to-br from-gray-900 via-gray-800 to-black shadow-2xl">

                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 h-32 w-32 bg-teal-500/20 blur-3xl rounded-full"></div>

                            <div className="relative p-5 space-y-4">

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">
                                            Login Credentials
                                        </h3>

                                        <p className="text-gray-400 text-sm">
                                            Use this account for testing
                                        </p>
                                    </div>

                                    <div className="bg-teal-500/20 text-teal-400 text-xs px-3 py-1 rounded-md font-medium">
                                        Admin
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="bg-gray-800/70 border border-gray-700 rounded-md p-4">
                                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                                        Email
                                    </p>

                                    <p className="text-teal-400 font-semibold break-all">
                                        admin@gmail.com
                                    </p>
                                </div>

                                {/* Password */}
                                <div className="bg-gray-800/70 border border-gray-700 rounded-md p-4">
                                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                                        Password
                                    </p>

                                    <p className="text-yellow-400 font-semibold">
                                        123456
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex flex-col gap-2 md:flex-row items-center justify-between pt-2">
                                    <p className="text-gray-500 text-xs">
                                        Team Management Demo Access
                                    </p>

                                    <button className="bg-teal-600 hover:bg-teal-700 transition px-4 py-2 rounded-md text-white text-sm font-medium">
                                        <Link to='/login'>Quick Login</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}

                <div className="mt-10">

                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3
                            className="text-indigo-600"
                            size={24}
                        />

                        <h2 className="text-3xl font-bold text-gray-900">
                            Features
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className=" rounded-lg border border-gray-100 hover:scale-105 shadow-sm p-4 hover:bg-teal-50 hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-teal-100 p-3 rounded-xl">
                                        {feature.icon}
                                    </div>

                                    <h3 className="text-xl font-semibold">
                                        {feature.title}
                                    </h3>
                                </div>

                                <p className="text-gray-600 leading-7">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How To Use */}

                <div className="mt-12 rounded-lg border border-gray-100 shadow-sm p-4 md:p-8">

                    <div className="flex items-center gap-3 mb-6">
                        <CalendarClock
                            className="text-teal-600"
                            size={24}
                        />

                        <h2 className="text-3xl font-bold text-gray-900">
                            How To Use
                        </h2>
                    </div>

                    <div className="space-y-5">

                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4"
                            >
                                <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                                    {index + 1}
                                </div>

                                <div className="flex items-center gap-2">
                                    <ChevronRight
                                        size={18}
                                        className="text-gray-400"
                                    />

                                    <p className="text-gray-700 text-lg">
                                        {step}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roles */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

                    {/* Admin */}

                    <div className="hover:bg-teal-50 rounded-lg border border-gray-100 shadow-sm p-4 md:p-8">

                        <h2 className="text-2xl font-bold text-indigo-600 mb-5">
                            Admin Access
                        </h2>

                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-center gap-2"><CheckSquare className="text-teal-600" size={16} /> Create Projects</li>
                            <li className="flex items-center gap-2"> <CheckSquare className="text-teal-600" size={16} /> Add Team Members</li>
                            <li className="flex items-center gap-2"> <CheckSquare className="text-teal-600" size={16} /> Create Tasks</li>
                            <li className="flex items-center gap-2"> <CheckSquare className="text-teal-600" size={16} /> Assign Tasks</li>
                            <li className="flex items-center gap-2"> <CheckSquare className="text-teal-600" size={16} /> Delete Tasks</li>
                            <li className="flex items-center gap-2"> <CheckSquare className="text-teal-600" size={16} /> View Analytics</li>
                            <li className="flex items-center gap-2"> <CheckSquare className="text-teal-600" size={16} /> Manage Entire Workflow</li>
                        </ul>
                    </div>

                    {/* Member */}

                    <div className="hover:bg-teal-50 rounded-lg border border-gray-100 shadow-sm p-4 md:p-8">

                        <h2 className="text-2xl font-bold text-emerald-600 mb-5">
                            Member Access
                        </h2>

                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-center gap-2"><CheckSquare className="text-teal-600" size={16} /> View Assigned Tasks</li>
                            <li className="flex items-center gap-2"><CheckSquare className="text-teal-600" size={16} /> Update Task Status</li>
                            <li className="flex items-center gap-2"><CheckSquare className="text-teal-600" size={16} /> Track Progress</li>
                            <li className="flex items-center gap-2"><SquareX className="text-red-600" size={16} /> Access Assigned Projects</li>
                            <li className="flex items-center gap-2"><SquareX className="text-red-600" size={16} /> Cannot Create Projects</li>
                            <li className="flex items-center gap-2"><SquareX className="text-red-600" size={16} /> Cannot Delete Tasks</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}

                <div className="mt-12 text-center text-gray-500 text-sm">
                    Built using MERN Stack • Railway Deployment • Tailwind CSS UI
                </div>
            </div>
        </div>
    );
}