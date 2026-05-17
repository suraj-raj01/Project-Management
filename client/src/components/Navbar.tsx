import { Link, NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    LogIn,
    Menu,
    X,
    FileText,
} from "lucide-react";
import { useState } from "react";

import { getUserFromStorage } from "../pages/helpers/GetUserInfo";

export default function Navbar() {
    const user = getUserFromStorage();

    const [mobileMenu, setMobileMenu] = useState(false);

    return (
        <header className="sticky top-2 z-50 md:px-10 -mt-3">

            <nav className="mx-auto max-w-7xl rounded-sm md:rounded-full border border-gray-100 bg-white/60 backdrop-blur-sm shadow-md">
                <div className="flex items-center justify-between px-3 md:px-8 py-3">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3" >
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center shadow-md">
                            <FileText
                                className="text-white"
                                size={22}
                            />
                        </div>

                        <div>
                            <h1 className="text-lg hidden md:block font-extrabold md:text-xl font-black tracking-tight bg-gradient-to-r from-teal-700 to-emerald-500 text-transparent bg-clip-text">
                                Team Task Management
                            </h1>
                            <h1 className="text-lg md:hidden -mb-1 md:text-2xl font-black tracking-tight bg-gradient-to-r from-teal-700 to-emerald-500 text-transparent bg-clip-text">
                                TTM
                            </h1>

                            <p className="text-xs text-gray-500">
                                Manage projects & tasks efficiently
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}

                    <div className="hidden md:flex items-center gap-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                ${isActive
                                    ? "bg-teal-100 text-teal-700"
                                    : "text-gray-600 hover:bg-gray-100"}`
                            }>
                            Home
                        </NavLink>

                        <NavLink
                            to="/docs"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                
                                ${isActive
                                    ? "bg-teal-100 text-teal-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            Docs
                        </NavLink>

                        {user?._id ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                <LayoutDashboard size={18} />

                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                <LogIn size={18} />

                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Button */}

                    <button
                        onClick={() =>
                            setMobileMenu(!mobileMenu)
                        }
                        className="md:hidden p-2 rounded-sm bg-gray-100 hover:bg-gray-200 transition"
                    >
                        {mobileMenu ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}

                {mobileMenu && (
                    <div className="md:hidden fixed z-50 bg-teal-50 backdrop-blur-md transition-all duration-500 ease-in-out w-full border-t border-gray-100 px-5 pb-10 pt-4 space-y-1">

                        <NavLink
                            to="/"
                            className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-100 transition"
                            onClick={() =>
                                setMobileMenu(false)
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/docs"
                            className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-100 transition"
                            onClick={() =>
                                setMobileMenu(false)
                            }
                        >
                            Docs
                        </NavLink>

                        {user?._id ? (
                            <Link
                                to="/dashboard"
                                onClick={() =>
                                    setMobileMenu(false)
                                }
                                className="flex items-center mt-5 justify-center gap-2 w-full px-5 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold"
                            >
                                <LayoutDashboard size={18} />

                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() =>
                                    setMobileMenu(false)
                                }
                                className="flex items-center mt-5 justify-center gap-2 w-full px-5 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold"
                            >
                                <LogIn size={18} />

                                Sign In
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}