import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getUserFromStorage } from "../pages/helpers/GetUserInfo";


export default function DashboardLayout() {
    // On large screens sidebar starts open; on mobile it starts closed
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

    // Sync sidebar state when screen resizes across the lg breakpoint
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true); // always show on desktop
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const user = getUserFromStorage();
    const userName: string = user?.name || "Guest";
    const userInitial: string = userName[0]?.toUpperCase() || "G";

    const navigate = useNavigate();

    return (
        <div className="flex h-screen overflow-hidden">
            {/* ── Sidebar  */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* ── Main area  */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Navbar */}
                <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 
                    bg-white/40 backdrop-blur-sm border-b border-gray-200/60 shadow-sm shrink-0">

                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="p-2 md:hidden rounded-xl hover:bg-gray-100 transition-all text-teal-800"
                            title="Toggle sidebar"
                        >
                            <Menu size={20} />
                        </button>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Welcome Back 👋
                            </h2>
                            <p className="text-xs text-gray-500">
                                Manage your workspace efficiently
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <div
                        title="Profile"
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate(`/dashboard/users/${user?._id}/view`)}
                    >
                        <button
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-300 
                            text-white text-xl font-bold uppercase flex items-center justify-center 
                            shadow-md shadow-teal-100 hover:scale-105 transition-all"
                            title={userName}
                        >
                            {userInitial}
                        </button>
                        <div className="h-8 w-0.5 bg-gray-100"/>
                        <div className="hidden sm:flex flex-col text-left">
                            <p className="text-sm font-semibold text-gray-800 uppercase">
                                {userName}
                            </p>
                            <p className="text-xs text-gray-500 font-bold">
                                {"Profile"}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}