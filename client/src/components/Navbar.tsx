import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="flex shadow-md items-center px-4 py-3 font-bold justify-start bg-gray-100">
            <h1 className="text-xl">
                <Link to="/">Team Task Manager</Link>
            </h1>
            <button className="ml-auto bg-blue-500 text-white p-2 border rounded">
                <Link to="/login">Sign In</Link>
            </button>
        </div>
    );
}