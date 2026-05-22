import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";

import {
    CalendarDays,
    Edit,
    Eye,
    Search,
    Trash,
    User,
} from "lucide-react";
import TableSkeleton from "../skeleton/TableSkeleton";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

interface Admin {
    _id: string;
    name: string;
    email: string;
    subscription: string;
    subscriptionEndDate: string;
    createdAt: string;
    updatedAt: string;
}

export default function Admins() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("")

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/dashboard/admins`);
            setAdmins(data.admins || []);
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
        return admins.filter((user) => {
            const q = search.toLowerCase();

            const matchSearch =
                user?.name.toLowerCase().includes(q) ||
                user?.email.toLowerCase().includes(q)
            return matchSearch;
        });
    }, [admins, search]);

    useEffect(() => { setCurrentPage(1); }, [search]);

    const totalPages = Math.ceil(
        filteredTasks.length / ITEMS_PER_PAGE
    );

    // paginated tasks
    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        const endIndex = startIndex + ITEMS_PER_PAGE;

        return filteredTasks.slice(startIndex, endIndex);
    }, [admins, filteredTasks, currentPage]);

    // page change
    const handlePageChange = (page: any) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
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
                    Manage all purchased subscription admins
                </p>
            </div>

            <div className="flex flex-col md:flex-row py-2 items-center justify-between gap-2">
                {/* search */}
                <div className="relative flex-1 md:max-w-96 w-full">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        {/* Table Head */}
                        <thead className="bg-teal-600 border-b border-gray-200">
                            <tr className="text-left">
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Name
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Email
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Plan
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Plan Expiry
                                </th>
                                <th className="px-5 py-4 text-sm font-semibold text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {/* Plans */}
                            {!loading &&
                                paginatedTasks.map((admin) => (

                                    <tr key={admin._id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >

                                        {/* User */}
                                        <td className="px-3 py-2 min-w-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                                    <User size={20} className="text-teal-700" />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-gray-900 uppercase">
                                                        {admin.name}
                                                    </h3>

                                                </div>
                                            </div>
                                        </td>


                                        <td className="px-3 py-2 bg-teal-100">
                                            <div>
                                                <h3 className="font-normal text-gray-900">
                                                    {admin.email}
                                                </h3>
                                            </div>
                                        </td>
                                        {/* Plan */}
                                        <td className="px-3 py-2 min-w-40">
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {admin.subscription}
                                                </h3>
                                                <p>Subscription plan</p>
                                            </div>
                                        </td>

                                        {/* End Date */}
                                        <td className="px-3 py-2 min-w-40">

                                            <div className="flex items-center gap-2 text-sm text-gray-700">

                                                <CalendarDays size={16} />

                                                {new Date(
                                                    admin.subscriptionEndDate
                                                ).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 bg-teal-100">
                                            <section className="flex gap-1">
                                                <div onClick={()=>{navigate(`/dashboard/users/${admin?._id}/view`)}} className="p-1 hover:bg-gray-100 text-teal-500">
                                                    <Eye size={16}/>
                                                </div>
                                                <div className="p-1 hover:bg-gray-100 text-teal-500">
                                                    <Edit size={16}/>
                                                </div>
                                                <div className="p-1 hover:bg-red-100 text-red-500">
                                                    <Trash size={16}/>
                                                </div>
                                            </section>
                                        </td>
                                    </tr>
                                ))}
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
                    {filteredTasks.length < admins.length ? (
                        <span className="text-teal-400">(Filtered from {admins.length} admins)</span>
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