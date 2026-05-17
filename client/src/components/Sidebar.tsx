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
                    className="fixed inset-0 z-20 bg-teal-200/50 backdrop-blur-xs lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`
                    fixed top-0 left-0 z-30 h-full w-72
                    bg-gray-950/95 backdrop-blur-xl text-white
                    flex flex-col py-6 px-3
                    border-r border-white/10
                    shadow-md shadow-black/20
                    transition-all duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:static lg:translate-x-0 lg:z-auto lg:w-72
                    `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <span className="font-bold text-white">{user.role === "Admin" ? "A" : "W"}</span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-wide">
                                {user.role === "Admin" ? "Admin Panel" : "Workspace"}
                            </h1>
                            <p className="text-xs text-gray-400">
                                Team Management System
                            </p>
                        </div>
                    </div>
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
                                    `group flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium 
                                        transition-all duration-200 relative overflow-hidden
                                        ${isActive
                                        ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-sm shadow-teal-900/30"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
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
                                    `group flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium 
                                        transition-all duration-200 relative overflow-hidden
                                        ${isActive
                                        ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-sm shadow-teal-900/30"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
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
                            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold uppercase shrink-0">
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
                        className="flex items-center justify-center gap-3 px-4 py-3 rounded-sm 
                        text-sm font-medium text-red-300 bg-red-500/10 
                        hover:bg-red-500/20 hover:text-red-200
                        transition-all duration-200 w-full"
                    >
                        <LogOut size={18} strokeWidth={1.8} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}