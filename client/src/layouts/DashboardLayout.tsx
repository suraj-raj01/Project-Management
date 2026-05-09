import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

function getUserFromStorage() {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        return {};
    }
}

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

    return (
        <div className="flex h-screen overflow-hidden font-sans">
            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* ── Main area ───────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Top Navbar */}
                <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
                    {/* Left: hamburger + search */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="p-2 md:hidden rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                            title="Toggle sidebar"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    {/* Right: bell + avatar */}
                    <div className="flex items-center gap-3">
                        
                        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
                            <button
                                className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase flex items-center justify-center ring-2 ring-indigo-100 hover:ring-indigo-200 transition-all"
                                title={userName}
                            >
                                {userInitial}
                            </button>
                            <span className="hidden md:block text-sm font-semibold text-gray-700 uppercase tracking-wide max-w-30 truncate">
                                {userName}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-3">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}