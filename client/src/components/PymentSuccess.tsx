import { CheckCircle2Icon } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
    return (
        <section className="max-w-full bg-green-600 h-screen mx-auto -mt-15 ">
            <div className="flex flex-col items-center justify-center pt-50">
                <h1 className="text-center font-bold text-3xl text-white uppercase flex items-center justify-center gap-2"><CheckCircle2Icon size={45} fill="teal" color="white"/> Payment Success </h1>
                <button title="Dashboard" className="py-2 px-5 cursor-pointer mt-5 border border-teal-300 bg-teal-600 text-white font-bold rounded-sm">
                    <Link to='/dashboard'>Dashboard</Link>
                </button>
            </div>
        </section>
    )
}