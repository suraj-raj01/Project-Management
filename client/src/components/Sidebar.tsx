import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    LogOut,
    X,
    Users,
    MessageCircle,
    BadgeDollarSignIcon,
    CircleDollarSign,
    CircleDollarSignIcon,
    UserCheck2Icon,
} from "lucide-react";

import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    to: string;
    icon: any;
    label: string;
    end: boolean;
}

type UserRole = "Superadmin" | "Admin" | "Member";

// NAVIGATION ITEMS

// Superadmin
const superAdminNavItems: NavItem[] = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/users", icon: Users, label: "Members", end: false },
    { to: "/dashboard/admins", icon: UserCheck2Icon, label: "Admins", end: false },
    { to: "/dashboard/projects", icon: FolderKanban, label: "Projects", end: false },
    { to: "/dashboard/tasks", icon: CheckSquare, label: "Tasks", end: false },
    { to: "/dashboard/discussions", icon: MessageCircle, label: "Team Discussion", end: false },
    // { to: "/dashboard/subscription", icon: BadgeDollarSignIcon, label: "Subscription", end: false },
    { to: "/dashboard/Subscribers", icon: CircleDollarSign, label: "Subscribers", end: false },
];

// Admin
const adminNavItems: NavItem[] = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/users", icon: Users, label: "Members", end: false },
    { to: "/dashboard/projects", icon: FolderKanban, label: "Projects", end: false },
    { to: "/dashboard/tasks", icon: CheckSquare, label: "Tasks", end: false },
    { to: "/dashboard/discussions", icon: MessageCircle, label: "Team Discussion", end: false },
    { to: "/dashboard/subscription", icon: BadgeDollarSignIcon, label: "Subscription Plan", end: false },
];

// Member
const memberNavItems: NavItem[] = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/dashboard/usertasks", icon: CheckSquare, label: "My Tasks", end: false },
    { to: "/dashboard/discussions", icon: MessageCircle, label: "Team Discussion", end: false },
];

export default function Sidebar({
    isOpen,
    onClose,
}: SidebarProps) {

    const navigate = useNavigate();

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    })();

    const role: UserRole = user?.role || "Member";

    /* =========================================
       GET NAV ITEMS BASED ON ROLE
    ========================================= */

    const getNavItems = (): NavItem[] => {
        switch (role) {
            case "Superadmin":
                return superAdminNavItems;

            case "Admin":
                return adminNavItems;

            case "Member":
                return memberNavItems;

            default:
                return memberNavItems;
        }
    };

    const navItems = getNavItems();

    /* =========================================
       LOGOUT HANDLER
    ========================================= */

    const logoutHandler = () => {
        toast(
            (t) => (
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
            ),
            {
                duration: 10000,
                style: {
                    borderRadius: "4px",
                    background: "#fff",
                    color: "#111827",
                    padding: "12px",
                },
            }
        );
    };

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    /* =========================================
       PANEL TITLE
    ========================================= */

    const getPanelTitle = () => {
        switch (role) {
            case "Superadmin":
                return "Superadmin Panel";

            case "Admin":
                return "Admin Panel";

            default:
                return "Workspace";
        }
    };

    const getPanelIcon = () => {
        switch (role) {
            case "Superadmin":
                return "S";

            case "Admin":
                return "A";

            default:
                return "W";
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-teal-200/50 backdrop-blur-xs lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-30 h-full w-72
                    backdrop-blur-xl
                    bg-teal-950 text-white
                    flex flex-col py-6 px-3
                    border-r border-gray-200
                    shadow-md shadow-black/20
                    transition-all duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:static lg:translate-x-0 lg:z-auto lg:w-72
                `}
            >

                {/* Header */}
                <div className="flex items-center justify-between mb-5 border-b pb-3 border-white/10">

                    <div className="flex items-center gap-3 -mt-3">
                        <div className="w-10 h-10 rounded-full border-teal-500 border-b-2 bg-linear-to-br from-teal-600 to-orange-300 flex items-center justify-center shadow-lg">
                            <span className="font-bold text-white">
                                {getPanelIcon()}
                            </span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-wide">
                                {getPanelTitle()}
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

                {/* Navigation */}
                <nav className="flex flex-col flex-1 gap-1">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-3 
                                rounded-sm text-sm font-medium
                                transition-all duration-200 relative overflow-hidden
                                ${isActive
                                    ? "bg-linear-to-tl from-teal-950 to-teal-800 text-white shadow-sm shadow-teal-900/30"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }
                                `
                            }
                        >
                            <Icon size={18} strokeWidth={1.8} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Upgrade Button */}
                {role !== "Member" && (
                    <Link
                        to="/pricing"
                        className="border md:hidden block w-fit px-4 py-2 rounded-full border-teal-500 border-b-2 bg-linear-to-br from-teal-600/50 to-orange-300/50 flex items-center gap-2"
                    >
                        Upgrade Plan <CircleDollarSignIcon size={20} />
                    </Link>
                )}

                {/* Footer */}
                <div className="border-t border-white/10 pt-4 mt-4 flex flex-col gap-3">
                    {user?.name && (
                        <div className="flex items-center gap-2 justify-between">
                            {/* User Info */}
                            <div
                                className="min-w-0 flex gap-2 items-center cursor-pointer"
                                onClick={() => { navigate(`/dashboard/users/${user?._id}/view`) }}
                            >
                                <div className="w-10 h-10 rounded-full border-teal-500 border-b-2 bg-linear-to-br from-teal-600 to-orange-300 flex items-center justify-center text-xl font-bold uppercase shrink-0">
                                    {user?.name?.charAt(0)}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold uppercase truncate">
                                        {user?.name}
                                    </p>

                                    <p className="text-xs text-gray-400 truncate">
                                        {user?.email || ""}
                                    </p>
                                </div>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={logoutHandler}
                                className="
                                    flex items-center justify-center
                                    px-2.5 py-2.5 rounded-full
                                    text-gray-50 bg-red-500/60
                                    hover:bg-red-500 hover:text-white
                                    transition-all duration-200
                                    cursor-pointer
                                "
                                title="Logout"
                            >
                                <LogOut size={20} strokeWidth={2} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}