import { Link, NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    LogIn,
    Menu,
    X,
    FileText,
    ChevronDown,
} from "lucide-react";
import { useState } from "react";

import { getUserFromStorage } from "../pages/helpers/GetUserInfo";

export default function Navbar() {
    const user = getUserFromStorage();

    const [mobileMenu, setMobileMenu] = useState(false);
    const [companyOpen, setCompanyOpen] = useState(false);

    return (
        <header className="sticky top-2 z-50 md:px-10 -mt-3">
            <nav className="mx-auto max-w-7xl rounded-sm md:rounded-full border border-gray-100 bg-white/60 backdrop-blur-md shadow-md">
                <div className="flex items-center justify-between px-3 md:px-8 py-3">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3" >
                        <div className="w-11 h-11 rounded-full bg-linear-to-tl from-orange-300 to-teal-500 flex items-center justify-center shadow-md">
                            <FileText
                                className="text-white"
                                size={22}
                            />
                        </div>

                        <div>
                            <h1 className="text-lg uppercase hidden md:block font-extrabold md:text-xl text-teal-600">
                                TASK Management
                            </h1>
                            <h1 className="text-lg uppercase md:hidden -mb-1 md:text-2xl font-black tracking-tight bg-linear-to-r from-teal-700 to-emerald-500 text-transparent bg-clip-text">
                                TASK Management
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
                                    ? "bg-teal-100/50 text-teal-700"
                                    : "text-gray-600 hover:bg-gray-100"}`
                            }>
                            Home
                        </NavLink>

                        <NavLink
                            to="/pricing"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                ${isActive
                                    ? "bg-teal-100 text-teal-700"
                                    : "text-gray-600 hover:bg-gray-100"}`
                            }>
                            Pricing
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
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-tl from-orange-300 to-teal-500 text-white font-semibold border-b-2 border-teal-400 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                <LayoutDashboard size={18} />

                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-tl from-orange-300 to-teal-500 text-white font-semibold border-b-2 border-teal-400 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                <LogIn size={18} />

                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Button */}

                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        className="md:hidden p-2 rounded-sm bg-transparent hover:bg-gray-100 transition">
                        {mobileMenu ? (
                            <X size={22} color="red" />
                        ) : (
                            <Menu size={22} color="teal" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}

                {mobileMenu && (
                    <div className="md:hidden -top-2 fixed z-9999 bg-teal-50 backdrop-blur-md transition-all duration-1000 ease-in-out w-90 h-screen border-t pt-6 border-gray-100 px-6 space-y-1 shadow-2xl">

                        <Link
                            to="/"
                            className="flex items-center gap-3 pb-10" >
                            <div className="w-11 h-11 rounded-full bg-linear-to-tl from-orange-300 to-teal-500 flex items-center justify-center shadow-md">
                                <FileText
                                    className="text-white"
                                    size={22}
                                />
                            </div>

                            <div>
                                <h1 className="text-lg uppercase hidden md:block font-extrabold md:text-xl text-teal-600">
                                    TASK Management
                                </h1>
                                <h1 className="text-lg uppercase md:hidden -mb-1 md:text-2xl font-black tracking-tight bg-linear-to-r from-teal-700 to-emerald-500 text-transparent bg-clip-text">
                                    TASK Management
                                </h1>

                                <p className="text-xs text-gray-500">
                                    Manage projects & tasks efficiently
                                </p>
                            </div>
                        </Link>

                        <NavLink
                            to="/"
                            className="block py-2 border-b border-gray-300 font-semibold text-gray-700 hover:bg-teal-100 transition"
                            onClick={() => setMobileMenu(false)}>
                            Home
                        </NavLink>

                        <NavLink
                            to="/pricing"
                            className="block border-b border-gray-300 font-semibold py-2 text-gray-700 hover:bg-teal-100 transition"
                            onClick={() => setMobileMenu(false)}>
                            Pricing
                        </NavLink>

                        <NavLink
                            to="/docs"
                            className="block border-b border-gray-300 font-semibold py-2 text-gray-700 hover:bg-teal-100 transition"
                            onClick={() => setMobileMenu(false)}>
                            Docs
                        </NavLink>
                        <div className="relative border-b border-gray-300">
                            <button
                                onClick={() => setCompanyOpen(!companyOpen)}
                                className="w-full flex items-center justify-between py-3 font-semibold text-gray-700" >
                                Company
                                <span
                                    className={`transition-transform duration-300 ${companyOpen ? "rotate-180" : ""}`} >
                                    <ChevronDown size={16} />
                                </span>
                            </button>

                            {companyOpen && (
                                <div className="w-full bg-teal-100/20 rounded-xs py-3 overflow-hidden ">
                                    <Link
                                        to="/about"
                                        onClick={() => {
                                            setCompanyOpen(false);
                                            setMobileMenu(false);
                                        }}
                                        className="block px-4 py-1 hover:bg-teal-50"
                                    >
                                        About
                                    </Link>

                                    <Link
                                        to="/careers"
                                        onClick={() => {
                                            setCompanyOpen(false);
                                            setMobileMenu(false);
                                        }}
                                        className="block px-4 py-1 hover:bg-teal-50"
                                    >
                                        Careers
                                    </Link>

                                    <Link
                                        to="/projects"
                                        onClick={() => {
                                            setCompanyOpen(false);
                                            setMobileMenu(false);
                                        }}
                                        className="block px-4 py-1 hover:bg-teal-50"
                                    >
                                        Projects
                                    </Link>

                                    <Link
                                        to="/services"
                                        onClick={() => {
                                            setCompanyOpen(false);
                                            setMobileMenu(false);
                                        }}
                                        className="block px-4 py-1 hover:bg-teal-50"
                                    >
                                        Services
                                    </Link>
                                </div>
                            )}
                        </div>

                        {user?._id ? (
                            <Link
                                to="/dashboard"
                                onClick={() => setMobileMenu(false)}
                                className="flex items-center mt-8 justify-center gap-2 w-full px-5 py-3 rounded-sm bg-linear-to-tl from-orange-300 to-teal-500  text-white font-semibold">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileMenu(false)}
                                className="flex items-center mt-8 justify-center gap-2 w-full px-5 py-3 rounded-sm bg-linear-to-tl from-orange-300 to-teal-500  text-white font-semibold">
                                <LogIn size={18} /> Sign In
                            </Link>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}