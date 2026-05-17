import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <section className="w-full">
            <div className="flex flex-col gap-1 items-center justify-center h-140">
                <span className="text-4xl font-bold text-red-600">
                    😵404 - Page Not Found
                </span>
                <p className="text-sm font-medium text-gray-600">
                    The page you are looking for does not exist.
                </p>
                <Link to="/dashboard" className="px-4 py-2 text-sm mt-3 font-bold rounded-sm bg-teal-500 text-white hover:bg-teal-600 transition">
                    Go to Dashboard
                </Link>
            </div>
        </section>
    )
}