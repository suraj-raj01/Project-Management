import { Link } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

const Home = () => {
    return (
        <section className="relative overflow-hidden min-h-screen pt-45 pb-10 md:pb-1 md:pt-20 flex items-center justify-center bg-linear-to-br from-teal-50 -mt-15 via-white to-emerald-100 px-4 transition-all duration-1000">
            {/* Background Blur Effects */}
            <div className="absolute top-0 animate-pulse left-0 w-full md:w-202 md:h-100 h-80 bg-teal-300/30 blur-3xl rounded-full" />
            <div className="absolute bottom-0 animate-pulse -right-10 w-full md:w-200 md:h-100 h-80 bg-orange-300/30 blur-3xl rounded-full" />
            <div className="absolute hidden md:block rotate-270 top-30 -left-72.5 w-full h-135"/>
            {/* Main Content */}

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 gap-15 items-center">
                {/* Left Content */}
                <div>
                    <div className="flex w-fit  border border-b-2 mx-auto border-teal-400 blur-in-sm items-center gap-2 justify-center text-teal-700 px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-md">
                        <CheckCircle2 size={16} />
                        Team Task Management Platform
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl text-center font-black leading-tight tracking-tight text-gray-900">

                        Organize Your Team
                        <span className="block bg-linear-to-r from-teal-600 to-emerald-500 text-transparent bg-clip-text">
                            Tasks Efficiently
                        </span>
                    </h1>

                    <p className="mt-6 md:text-lg text-center text-gray-600 md:leading-8 max-w-4xl">
                        Optimize workflows, manage projects efficiently, and enhance team productivity with a robust and scalable Task management platform. Assign tasks, monitor progress in real time, and foster seamless collaboration across your organization.
.
                    </p>

                    {/* Buttons */}

                    <div className="flex flex-col justify-center md:flex-row items-center gap-4 md:gap-4 mt-13">
                        <Link
                            to="/docs"
                            className="group flex w-full md:w-auto justify-center items-center gap-2 bg-linear-to-tl from-orange-300 to-teal-500 border-b-2 border-teal-400 text-white md:px-8 px-5 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            Documentation
                            <ArrowRight size={18}
                                className="group-hover:translate-x-1 transition"
                            />
                        </Link>

                        <Link
                            to="/pricing"
                            className="group md:px-10 px-2 py-3 w-full md:w-auto flex justify-center items-center gap-3 rounded-full border border-teal-600 bg-transparent text-teal-800 font-semibold hover:bg-linear-to-tl from-orange-300 to-teal-500 border-b-2 hover:text-white transition-all duration-300">
                            Get Started
                            <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition"
                            />
                        </Link>
                    </div>

                    {/* Stats */}

                    <div className="flex flex-wrap items-center justify-center gap-10 mt-25 md:mt-8">

                        <div className="md:w-auto flex flex-col text-center w-full">
                            <h3 className="text-4xl font-black text-teal-900">
                                100%
                            </h3>

                            <p className="text-gray-500 text-sm">
                                Responsive UI using Tailwind
                            </p>
                        </div>

                        <div className="md:w-auto flex flex-col text-center w-full">
                            <h3 className="text-4xl font-black text-teal-900">
                                JWT
                            </h3>

                            <p className="text-gray-500 text-sm">
                                Secure Authentication
                            </p>
                        </div>

                        <div className="md:w-auto flex flex-col text-center w-full">
                            <h3 className="text-4xl font-black text-teal-900">
                                RBAC
                            </h3>

                            <p className="text-gray-500 text-sm">
                                Role Based Access Control
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side UI Preview */}

                
            </div>
        </section>
    );
};

export default Home;