import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import {
    Users as UsersIcon,
    Shield,
    User,
    Loader2,
    Search,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 4;

interface UserType {
    _id: string;
    name: string;
    email: string;
    role: "Admin" | "Member";
    createdAt: string;
}

export default function Users() {
    const [users, setUsers]           = useState<UserType[]>([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");
    const [filterRole, setFilterRole] = useState<"All" | "Admin" | "Member">("All");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // ── Fetch ─────────────────────────────────────────────────────────────
    const fetchUsers = async () => {
        try {
            const { data } = await API.get("/dashboard/users");
            setUsers(data.users || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // ── Delete ────────────────────────────────────────────────────────────
    const deleteUser = async (userId: string) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try {
            setDeletingId(userId);
            await API.delete(`/dashboard/users/${userId}`);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            toast.success("User deleted");
        } catch {
            toast.error("Failed to delete user");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Filter (memoised) ─────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return users.filter((u) => {
            const matchSearch =
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q);
            const matchRole = filterRole === "All" || u.role === filterRole;
            return matchSearch && matchRole;
        });
    }, [users, search, filterRole]);

    // Reset to page 1 whenever filter/search changes
    useEffect(() => { setCurrentPage(1); }, [search, filterRole]);

    // ── Pagination (operates on `filtered`, not `users`) ──────────────────
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filtered.slice(start, start + ITEMS_PER_PAGE);
    }, [filtered, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── Summary counts ────────────────────────────────────────────────────
    const adminCount  = users.filter((u) => u.role === "Admin").length;
    const memberCount = users.filter((u) => u.role === "Member").length;

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <section className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <UsersIcon size={22} className="text-indigo-600" />
                        Users
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {users.length} total &mdash; {adminCount} admin{adminCount !== 1 ? "s" : ""},{" "}
                        {memberCount} member{memberCount !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    to="/dashboard/create-user"
                    className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-4 py-2 rounded-sm text-sm font-semibold"
                >
                    + Create User
                </Link>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Users", value: users.length,  icon: <UsersIcon size={18} className="text-indigo-500" />,  bg: "bg-indigo-50"  },
                    { label: "Admins",      value: adminCount,    icon: <Shield    size={18} className="text-purple-500" />,  bg: "bg-purple-50"  },
                    { label: "Members",     value: memberCount,   icon: <User      size={18} className="text-emerald-500" />, bg: "bg-emerald-50" },
                ].map(({ label, value, icon, bg }) => (
                    <div key={label} className="bg-white rounded-sm border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${bg}`}>{icon}</div>
                        <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                        </div>
                    </div>
                ))}
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
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as "All" | "Admin" | "Member")}
                    className="px-3 py-2 text-sm md:max-w-36 w-full border border-gray-200 rounded-sm bg-white focus:outline-none"
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
                        <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-5 py-4 text-left font-semibold">User</th>
                                <th className="px-5 py-4 text-left font-semibold">Email</th>
                                <th className="px-5 py-4 text-left font-semibold">Role</th>
                                <th className="px-5 py-4 text-left font-semibold hidden md:table-cell">Joined</th>
                                <th className="px-5 py-4 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 size={28} className="animate-spin text-indigo-400" />
                                            <span className="text-sm">Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
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
                                paginatedUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        {/* Avatar + Name */}
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-sm bg-indigo-600 text-white flex items-center justify-center text-sm font-bold uppercase shrink-0">
                                                    {user.name[0]}
                                                </div>
                                                <span className="font-medium text-gray-900 capitalize">{user.name}</span>
                                            </div>
                                        </td>
                                        {/* Email */}
                                        <td className="px-5 py-3 font-semibold text-gray-800">{user.email}</td>
                                        {/* Role */}
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold ${
                                                user.role === "Admin"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-emerald-100 text-emerald-700"
                                            }`}>
                                                {user.role === "Admin" ? <Shield size={11} /> : <User size={11} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        {/* Joined */}
                                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap hidden md:table-cell">
                                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric",
                                            })}
                                        </td>
                                        {/* Delete */}
                                        <td className="px-5 py-3 text-center">
                                            <button
                                                title="Delete user"
                                                onClick={() => deleteUser(user._id)}
                                                disabled={deletingId === user._id}
                                                className="inline-flex cursor-pointer items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === user._id
                                                    ? <Loader2 size={15} className="animate-spin" />
                                                    : <Trash2 size={15} />}
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
                    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 flex items-center justify-between">
                        <span>
                            Showing{" "}
                            {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}
                            {" "}–{" "}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                            {" "}of {filtered.length} user{filtered.length !== 1 ? "s" : ""}
                        </span>
                        {search || filterRole !== "All" ? (
                            <span className="text-indigo-400">(filtered from {users.length} total)</span>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                    {/* Previous */}
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`px-4 py-2 rounded-sm border text-sm font-medium transition ${
                            currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"
                        }`}
                    >
                        Previous
                    </button>

                    {/* Page numbers — show ellipsis for large sets */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                            // always show first, last, current, and neighbours
                            return (
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - currentPage) <= 1
                            );
                        })
                        .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                            if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                                acc.push("...");
                            }
                            acc.push(page);
                            return acc;
                        }, [])
                        .map((item, idx) =>
                            item === "..." ? (
                                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => handlePageChange(item as number)}
                                    className={`w-10 h-10 rounded-sm text-sm font-semibold transition ${
                                        currentPage === item
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white border hover:bg-gray-50"
                                    }`}
                                >
                                    {item}
                                </button>
                            )
                        )}

                    {/* Next */}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`px-4 py-2 rounded-sm border text-sm font-medium transition ${
                            currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}