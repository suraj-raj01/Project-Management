import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    PlusSquare,
    LogOut,
    X,
    Users,
    MessageCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems1 = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/tasks", icon: CheckSquare, label: "Tasks", end: false },
    { to: "/dashboard/projects", icon: FolderKanban, label: "Projects", end: false },
    { to: "/dashboard/create-task", icon: PlusSquare, label: "Create Task", end: false },
    { to: "/dashboard/users", icon: Users, label: "Members", end: false },
    { to: "/dashboard/discussions", icon: MessageCircle, label: "Team Discussion", end: false },
];
const navItems2 = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/usertasks", icon: CheckSquare, label: "My Tasks", end: false },
    { to: "/dashboard/discussions", icon: MessageCircle, label: "Team Discussion", end: false },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    })();

    // logout handler with confirmation
    const logoutHandler = () => {
        toast((t) => (
            <div className="flex rounded-sm flex-col gap-4 p-1">
                <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                        Confirm Logout
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Are you sure you want to logout?
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 text-sm rounded-sm border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");

                            toast.dismiss(t.id);

                            toast.success("Logged out successfully");

                            navigate("/");
                        }}
                        className="px-4 py-2 text-sm rounded-sm bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            style: {
                borderRadius: "4px",
                background: "#fff",
                color: "#111827",
                padding: "12px",
            },
        });
    };

    const handleNavClick = () => {
        if (window.innerWidth < 1024) onClose();
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-green-200/50 backdrop-blur-xs lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`
                    fixed top-0 left-0 z-30 h-full w-70 bg-gray-900 text-white
                    flex flex-col py-6 px-2 shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:static lg:translate-x-0 lg:z-auto lg:shadow-none lg:w-68
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="md:text-xl md:pb-0 pb-2 font-bold uppercase w-full">
                        {user.role === "Admin" ? "Admin Dashboard" : "Dashboard"}
                    </h1>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-sm hover:bg-white/10 transition-colors"
                        title="Close sidebar"
                    >
                        <X size={25} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-1 flex-1">
                    {user.role === "Admin" ? (
                        navItems1.map(({ to, icon: Icon, label, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-2 py-2.5 rounded-xs text-sm font-medium transition-all duration-150 ${isActive
                                        ? "bg-green-600 text-white"
                                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={18} strokeWidth={1.8} />
                                {label}
                            </NavLink>
                        ))

                    ) : (
                        navItems2.map(({ to, icon: Icon, label, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-2 py-2.5 rounded-xs text-sm font-medium transition-all duration-150 ${isActive
                                        ? "bg-green-600 text-white"
                                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={18} strokeWidth={1.8} />
                                {label}
                            </NavLink>
                        ))
                    )}

                </nav>

                {/* User info + Logout */}
                <div className="border-t border-white/10 pt-4 mt-4 flex flex-col gap-3">
                    {user?.name && (
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate(`/dashboard/users/${user?._id}/view`) }}>
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                {user.name[0]}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold uppercase truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email || ""}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={logoutHandler}
                        className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-500/10 hover:text-red-500 transition-all duration-150 w-full"
                    >
                        <LogOut size={18} strokeWidth={1.8} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}