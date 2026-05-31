import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import {
    Users as UsersIcon,
    Shield,
    User,
    Loader2,
    Search,
    Trash2,
    EditIcon,
    Eye,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import TableSkeleton from "../skeleton/TableSkeleton";
import { getUserFromStorage } from "../helpers/GetUserInfo";

const ITEMS_PER_PAGE = 7;

interface UserType {
    _id: string;
    name: string;
    email: string;
    role: "Admin" | "Member";
    createdAt: string;
}

export default function Users() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<"All" | "Admin" | "Member">("All");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch users
    const fetchUsers = async () => {
        try {
            const { data } = await API.get("/dashboard/users");
            setUsers(data.users || []);
            // console.log(data.users,'users')
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // ── Delete 
    const deleteUser = async (userId: string) => {
        const user = getUserFromStorage();
        if (user._id === userId) {
            toast.error("You cannot delete yourself");
            return;
        }
        toast((t) => (
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                        Delete User
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Delete this user? This action cannot be undone.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                setDeletingId(userId);
                                await API.delete(`/dashboard/users/${userId}`);
                                setUsers((prev) => prev.filter((u) => u._id !== userId));
                                toast.dismiss(t.id);
                                toast.success("User deleted successfully");
                            } catch (error) {
                                console.log(error);
                                toast.error("Failed to delete user");
                            } finally {
                                setDeletingId(null);
                            }
                        }}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-sm hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 10000,
            style: {
                borderRadius: "4px",
                background: "#fff",
                color: "#111827",
                padding: "12px",
            },
        });
    };

    const navigate = useNavigate();
    const updateUser = async (userId: string) => {
        navigate(`/dashboard/create-user/${userId}`);
    };

    const viewUser = async (userId: string) => {
        navigate(`/dashboard/users/${userId}/view`);
    };

    // ── Filter (memoised) 
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return users.filter((u) => {
            const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
            const matchRole = filterRole === "All" || u.role === filterRole;
            return matchSearch && matchRole;
        });
    }, [users, search, filterRole]);

    // Reset to page 1 whenever filter/search changes
    useEffect(() => { setCurrentPage(1); }, [search, filterRole]);

    // ── Pagination (operates on `filtered`, not `users`) 
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const user = getUserFromStorage();
    if (user.role === "Member") return <div className="min-h-140 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-red-500">
            <AlertCircle size={24} />
            <h1 className="text-3xl font-bold">Unauthorized</h1>
            <p>You do not have permission to access this page</p>
        </div>
    </div>

    if (loading) return (
        <TableSkeleton />
    )

    // ── Render 
    return (
        <section className="space-y-4">

            {/* Header */}
            <div className="flex gap-3 flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <UsersIcon size={22} className="text-teal-600" />
                        Users
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        track and manage your team members.
                    </p>
                </div>
                <Link
                    to="/dashboard/create-user"
                    className="border-teal-500 border-b-2 bg-linear-to-br from-teal-600 to-orange-300 text-center transition-colors text-white px-4 py-2 rounded-sm text-sm font-semibold"
                >
                    + Create Member
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
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
                <select
                    title="filter"
                    className="px-3 py-2 text-sm md:max-w-36 w-full border border-gray-200 rounded-sm bg-white focus:outline-none"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as "All" | "Admin" | "Member")}
                >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-linear-to-l from-teal-600 to-teal-300 text-white text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-5 py-4 text-center font-semibold">Index</th>
                                <th className="px-5 py-4 text-left font-semibold">User</th>
                                <th className="px-5 py-4 text-left font-semibold">Email</th>
                                <th className="px-5 py-4 text-left font-semibold">Role</th>
                                <th className="px-5 py-4 text-left font-semibold">Joined</th>
                                <th className="px-5 py-4 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-1">
                                            <UsersIcon size={32} className="text-gray-300" />
                                            <span className="text-sm font-medium">No users found</span>
                                            <span className="text-xs">
                                                {search || filterRole !== "All"
                                                    ? "Try adjusting your filters."
                                                    : "No users added yet."}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        {/* Avatar + Name */}
                                        <td className="flex items-center justify-center font-bold">
                                            <p> {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</p>
                                        </td>
                                        <td className="px-5 py-1">
                                            <div className="flex items-center gap-3 min-w-40">
                                                <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold uppercase shrink-0">
                                                    {user.name[0]}
                                                </div>
                                                <span className="font-medium uppercase text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        {/* Email */}
                                        <td title="view user" className="px-5 py-2 bg-teal-100 font-semibold text-gray-800 cursor-pointer hover:text-teal-800" onClick={() => navigate(`/dashboard/users/${user?._id}/view`)}>{user.email}</td>
                                        {/* Role */}
                                        <td className="px-5 py-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${user.role === "Admin"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-teal-100 text-teal-700"
                                                }`}>
                                                {user.role === "Admin" ? <Shield size={11} /> : <User size={11} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        {/* Joined */}
                                        <td className="px-5 py-2 text-gray-500 whitespace-nowrap font-semibold">
                                            {new Date(user.createdAt).toLocaleDateString("en-Us", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        {/* Delete */}
                                        <td className="px-2 bg-teal-100 py-2 flex items-center justify-center gap-1 text-center">
                                            <button
                                                title="Delete user"
                                                onClick={() => deleteUser(user._id)}
                                                disabled={deletingId === user._id}
                                                className="inline-flex cursor-pointer items-center justify-center w-8 h-8 rounded-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === user._id
                                                    ? <Loader2 size={15} className="animate-spin" />
                                                    : <Trash2 size={15} />}
                                            </button>
                                            <button
                                                title="Update user"
                                                onClick={() => updateUser(user._id)}
                                                disabled={deletingId === user._id}
                                                className="inline-flex cursor-pointer items-center justify-center w-8 h-8 rounded-sm text-teal-400 hover:bg-teal-50 hover:text-teal-500 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === user._id
                                                    ? <Loader2 size={15} className="animate-spin" />
                                                    : <EditIcon size={15} />}
                                            </button>
                                            <button
                                                title="View user"
                                                onClick={() => viewUser(user._id)}
                                                disabled={deletingId === user._id}
                                                className="inline-flex cursor-pointer items-center justify-center w-8 h-8 rounded-sm text-teal-400 hover:bg-teal-50 hover:text-teal-500 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === user._id
                                                    ? <Loader2 size={15} className="animate-spin" />
                                                    : <Eye size={15} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table footer */}
                {!loading && filtered.length > 0 && (
                    <div className="px-5 py-3 border-t border-teal-200 bg-teal-100 text-xs text-gray-800 flex items-center justify-between">
                        <span>
                            Showing{" "}
                            {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}
                            {" "}–{" "}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                            {" "}of {filtered.length} user{filtered.length !== 1 ? "s" : ""}
                        </span>
                        {search || filterRole !== "All" ? (
                            <span className="text-teal-400">(filtered from {users.length} total)</span>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Pagination */}
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