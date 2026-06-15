import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";

import {
    CalendarDays,
    CreditCard,
    IndianRupee,
    Search,
    ShieldCheck,
    User,
    UsersIcon,
} from "lucide-react";
import TableSkeleton from "../skeleton/TableSkeleton";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

interface Plan {
    _id: string;
    planName: string;
    price: number;
    duration: string;
    features: string[];
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    startDate: string;
    createdAt: string;
    updatedAt: string;

    userId: {
        _id: string;
        name: string;
        email: string;
    };
}

export default function Plans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("")

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/payment/plans`);
            setPlans(data.plans || []);
            // console.log(data.plans,'plans')
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const filteredTasks = useMemo(() => {
        return plans.filter((plan) => {
            const q = search.toLowerCase();

            const matchSearch =
                plan?.planName.toLowerCase().includes(q) ||
                plan?.status.toLowerCase().includes(q) ||
                plan?.userId?.name.toLowerCase().includes(q) ||
                plan?.userId?.email.toLowerCase().includes(q);

            const matchStatus =
                statusFilter === "All" ||
                plan.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [plans, search, statusFilter]);

    useEffect(() => { setCurrentPage(1); }, [search, statusFilter]);

    const totalPages = Math.ceil(
        filteredTasks.length / ITEMS_PER_PAGE
    );

    // paginated tasks
    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        const endIndex = startIndex + ITEMS_PER_PAGE;

        return filteredTasks.slice(startIndex, endIndex);
    }, [plans, filteredTasks, currentPage]);

    // page change
    const handlePageChange = (page: any) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Status Badge
    const statusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500 text-white";

            case "inactive":
                return "bg-green-400 text-white";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const navigate = useNavigate();

    if (loading) return <TableSkeleton />

    return (
        <section className="">
            {/* Header */}
            <div className="mb-6">

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Subscription Plans
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage all purchased subscription plans
                </p>
            </div>

            <div className="flex flex-col md:flex-row py-2 items-center justify-between gap-2">
                {/* search */}
                <div className="relative flex-1 md:max-w-96 w-full">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by plan, name, email or status..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
                    />
                </div>
                {/* filter by status */}
                <div className="w-full md:w-auto">
                    <select
                        title="update status"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className={`border border-gray-200 px-3 py-2 md:w-auto w-full rounded-sm text-sm outline-none ${statusColor(statusFilter)}`}>
                        <option value="All">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Not Active</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xs border border-gray-200 overflow-hidden shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full">
                        {/* Table Head */}
                        <thead className="bg-linear-to-r from-teal-400 to-emerald-600 border-b border-gray-200">
                            <tr className="text-left">
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    User
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Plan
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Price
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Duration
                                </th>
                                {/* <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                                    Features
                                </th> */}
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Payment Info
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Start Date
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {/* Plans */}
                            {paginatedTasks.length === 0 ? (
                                <tr className="">
                                    <td colSpan={9} className="py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-1">
                                            <UsersIcon size={32} className="text-gray-300" />
                                            <span className="text-sm font-medium">No data founds</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (paginatedTasks.map((plan) => (

                                <tr key={plan._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >

                                    {/* User */}
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                                <User size={20} className="text-teal-700" />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-900 uppercase">
                                                    {plan.userId.name}
                                                </h3>
                                                <p className="text-sm -mt-1 text-gray-500">
                                                    {plan.userId.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Plan */}
                                    <td className="px-3 py-2 bg-teal-100">

                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                {plan.planName}
                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Subscription Plan
                                            </p>
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-3 py-2">

                                        <div className="flex items-center gap-1 font-bold text-gray-900">
                                            <IndianRupee size={18} />
                                            {plan.price}
                                        </div>
                                    </td>

                                    {/* Duration */}
                                    <td className="px-3 py-2">

                                        <span className="px-3 py-1 rounded-sm bg-green-50 text-green-700 text-xs font-semibold">
                                            {plan.duration}
                                        </span>
                                    </td>

                                    {/* Features */}
                                    {/* <td className="px-3 py-2">

                                            <div className="space-y-2">

                                                {plan.features
                                                    .slice(0, 3)
                                                    .map((feature, index) => (

                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-2 text-sm text-gray-700"
                                                        >

                                                            <BadgeCheck
                                                                size={16}
                                                                className="text-green-600 mt-0.5 shrink-0"
                                                            />

                                                            <span>
                                                                {feature}
                                                            </span>
                                                        </div>
                                                    ))}

                                                {plan.features.length > 3 && (
                                                    <p className="text-xs text-gray-400">
                                                        +{plan.features.length - 3} more
                                                    </p>
                                                )}
                                            </div>
                                        </td> */}

                                    {/* Status */}
                                    <td className="px-3 py-2">

                                        <div
                                            className={`
                                                    inline-flex items-center gap-2
                                                    px-3 py-1 rounded-sm text-xs font-semibold capitalize
                                                    ${plan.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }
                                                `}
                                        >

                                            <ShieldCheck size={14} />

                                            {plan.status}
                                        </div>
                                    </td>

                                    {/* Payment Info */}
                                    <td className="px-3 py-2">

                                        <div className="space-y-2 text-sm">

                                            <div className="flex items-center gap-2 text-gray-700">
                                                <CreditCard size={15} />
                                                <span className="font-medium">
                                                    {plan.razorpay_payment_id.slice(0, 15)}...
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-500 break-all">
                                                {plan.razorpay_order_id}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Start Date */}
                                    <td className="px-3 py-2 bg-teal-100">

                                        <div className="flex items-center gap-2 text-sm text-gray-700">

                                            <CalendarDays size={16} />

                                            {new Date(
                                                plan.startDate
                                            ).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 bg-teal-100">
                                        <button onClick={() => { navigate(`/dashboard/Subscribers/${plan._id}/view`) }}>
                                            <span className="px-3 py-1 rounded-sm bg-white text-teal-800 cursor-pointer text-xs font-semibold">
                                                View Details
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>

                </div>
            </div>

            {!loading && paginatedTasks.length > 0 && (
                <div className="px-2 py-3 border border-gray-300 bg-teal-100 text-xs text-gray-800 flex items-center justify-between">
                    <span>
                        Showing{" "}
                        {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredTasks.length)}
                        {" "}–{" "}
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredTasks.length)}
                        {" "}of {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                    </span>
                    {filteredTasks.length < plans.length ? (
                        <span className="text-teal-400">(Filtered from {plans.length} plans)</span>
                    ) : null}
                </div>
            )}
            {/* // paination */}
            <div className="mt-5 flex items-center justify-between gap-2">
                {totalPages >= 1 && (
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {/* Previous */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`px-4 py-1 rounded-sm border text-sm font-medium transition
                                ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-50"
                                }`}
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-7 rounded-sm text-sm font-semibold transition
                                        ${currentPage === page
                                            ? "bg-teal-600 text-white"
                                            : "bg-white border hover:bg-gray-50"
                                        }
                                    `} >
                                    {page}
                                </button>
                            );
                        }
                        )}

                        {/* Next */}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`px-4 py-1 rounded-sm border text-sm font-medium transition ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"} `} >
                            Next
                        </button>

                    </div>
                )}
            </div>
        </section>
    );
}