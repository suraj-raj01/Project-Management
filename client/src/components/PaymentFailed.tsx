import { CrossIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentFailed() {
    return (
        <section className="max-w-full bg-red-600 h-screen mx-auto -mt-15 ">
            <div className="flex flex-col items-center justify-center pt-50">
                <h1 className="text-center font-bold text-3xl text-white uppercase flex items-center justify-center gap-2"><CrossIcon size={45} fill="teal" color="white" /> Payment Failed </h1>
                <button title="home" className="py-2 px-5 cursor-pointer mt-5 border border-red-300 bg-teal-600 text-white font-bold rounded-sm">
                    <Link to='/'>Try Again</Link>
                </button>
            </div>
        </section>
    )
}