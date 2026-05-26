import { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams } from "react-router-dom";
import {
    CalendarDays,
    CreditCard,
    ShieldCheck,
    BadgeCheck,
    User,
    Mail,
    ReceiptText,
    Clock3,
} from "lucide-react";

export default function PaymentView() {
    const { id } = useParams();
    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/payment/plans/${id}`);
            // console.log(data.plans)
            setPayment(data?.plans);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [id]);

    if (loading) {
        return (
            <section className="p-3 w-full">
                <div className="bg-white w-full items-center justify-center mt-10 p-6">
                    <p className="text-gray-500 text-center">Loading payment details...</p>
                </div>
            </section>
        );
    }

    if (!payment) {
        return (
            <section className="p-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-red-500">Payment not found.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="">
            <div className="max-w-full mx-auto space-y-5">

                {/* Header */}
                <div className=" rounded-sm p-6 border border-gray-100 text-teal-800 shadow-sm hover:shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h1 className="text-3xl font-bold">
                                {payment?.planName} Plan
                            </h1>

                            <p className="text-teal-600 mt-2">
                                Subscription payment and billing details
                            </p>
                        </div>

                        <div className="bg-teal-100 px-4 py-2 rounded-md w-fit">
                            <p className="text-sm text-teal-800">
                                Status
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                                <BadgeCheck size={18} />
                                <span className="font-semibold capitalize">
                                    {payment?.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-10">

                    {/* Left Side */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Plan Info */}
                        <div className="bg-white border border-gray-100 rounded-md shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-800">
                                    Plan Details
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                                <div className="border border-gray-100 p-4">
                                    <p className="text-sm text-gray-500">
                                        Plan Name
                                    </p>

                                    <h3 className="text-lg font-semibold text-gray-800 mt-1">
                                        {payment?.planName}
                                    </h3>
                                </div>

                                <div className="border border-gray-100  p-4">
                                    <p className="text-sm text-gray-500">
                                        Duration
                                    </p>

                                    <h3 className="text-lg font-semibold text-gray-800 mt-1">
                                        {payment?.duration}
                                    </h3>
                                </div>

                                <div className="border border-gray-100  p-4">
                                    <p className="text-sm text-gray-500">
                                        Price
                                    </p>

                                    <h3 className="text-2xl font-bold text-green-600 mt-1">
                                        ₹{payment?.price}
                                    </h3>
                                </div>

                                <div className="border border-gray-100  p-4">
                                    <p className="text-sm text-gray-500">
                                        Subscription Started
                                    </p>

                                    <div className="flex items-center gap-2 mt-2 text-gray-700">
                                        <CalendarDays size={18} />
                                        <span>
                                            {new Date(
                                                payment?.startDate
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="border border-gray-100 rounded-md shadow-sm hover:shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-5">
                                Included Features
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {payment?.features?.map(
                                    (feature: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-1 hover:bg-teal-100 p-2"
                                        >
                                            <BadgeCheck
                                                className="text-green-600 mt-1"
                                                size={18}
                                            />

                                            <p className="text-gray-700">
                                                ({index + 1}) {feature}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white border-gray-100 shadow-sm hover:shadow-md rounded-md p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <ReceiptText className="text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-800">
                                    Razorpay Details
                                </h2>
                            </div>

                            <div className="space-y-2">
                                <div className="">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Order ID
                                    </p>

                                    <p className="font-medium text-gray-800 break-all">
                                        {payment?.razorpay_order_id}
                                    </p>
                                </div>

                                <div className="">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Payment ID
                                    </p>

                                    <p className="font-medium text-gray-800 break-all">
                                        {payment?.razorpay_payment_id}
                                    </p>
                                </div>

                                <div className="">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Signature
                                    </p>

                                    <p className="font-medium text-gray-800 break-all text-sm">
                                        {payment?.razorpay_signature}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6">

                        {/* User Info */}
                        <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-5">
                                User Information
                            </h2>

                            <div className="space-y-5">

                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <User
                                            className="text-indigo-600"
                                            size={26}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Full Name
                                        </p>

                                        <h3 className="font-semibold text-gray-800">
                                            {payment?.userId?.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                                        <Mail
                                            className="text-green-600"
                                            size={24}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Email Address
                                        </p>

                                        <h3 className="font-semibold text-gray-800">
                                            {payment?.userId?.email}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-md p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <Clock3 className="text-indigo-600" />

                                <h2 className="text-xl font-bold text-gray-800">
                                    Timeline
                                </h2>
                            </div>

                            <div className="space-y-5">

                                <div className="border-l-4 border-indigo-500 pl-4">
                                    <p className="text-sm text-gray-500">
                                        Subscription Start Date
                                    </p>

                                    <h4 className="font-medium text-gray-800 mt-1">
                                        {new Date(
                                            payment?.startDate
                                        ).toLocaleString()}
                                    </h4>
                                </div>

                                <div className="border-l-4 border-green-500 pl-4">
                                    <p className="text-sm text-gray-500">
                                        Subscription End Date
                                    </p>

                                    <h4 className="font-medium text-gray-800 mt-1">
                                        {new Date(
                                            payment?.userId.subscriptionEndDate
                                        ).toLocaleString()}
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* Payment Status Card */}
                        <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-md p-6 text-white shadow-lg">
                            <div className="flex items-center gap-3">
                                <CreditCard size={28} />

                                <div>
                                    <h3 className="font-bold text-xl">
                                        Payment Successful
                                    </h3>

                                    <p className="text-green-100 text-sm mt-1">
                                        Your subscription is currently active
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-green-100 text-sm">
                                    Total Amount
                                </p>

                                <h2 className="text-4xl font-bold mt-1">
                                    ₹{payment?.price}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}