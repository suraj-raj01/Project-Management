import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import {
    CalendarDays,
    Mail,
    MessageSquare,
    ThumbsUp,
    User2,
} from "lucide-react";

export default function Profile() {
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);
    const [discussions, setDiscussions] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Fetch User
    const fetchUser = async () => {
        try {
            setLoading(true);
            const data = await API.get(`/dashboard/users/${id}`);
            setUser(data?.data?.user);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Discussions
    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            const data = await API.get(`/discussion/userdiscussions/${id}` );
            setDiscussions(data?.data?.discussion);
        } catch (error) {
            console.error("Error fetching discussions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchDiscussions();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-130 flex items-center justify-center">
                <div className="animate-pulse text-green-600 text-lg font-semibold">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-140 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
                    User profile not found
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen">
            <div className="max-w-full mx-auto">
                {/* Profile Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 border border-green-100 shadow-sm rounded-sm p-6 md:p-8 max-w-full mx-auto mb-6">
                    {/* Background Glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200/30 blur-3xl rounded-full" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-200/20 blur-3xl rounded-full" />

                    <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-6xl font-bold uppercase shadow-lg ring-4 ring-white">
                                {user?.name?.charAt(0)}
                            </div>

                            {/* Online Badge */}
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
                                        {user?.name}
                                    </h1>

                                    <p className="text-gray-500 mt-1">
                                        Active community member
                                    </p>
                                </div>

                                {/* Role Badge */}
                                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-semibold w-fit">
                                    <User2 size={16} />
                                    {user?.role}
                                </div>
                            </div>

                            {/* User Meta */}
                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mt-5 text-gray-600">
                                <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-md border border-gray-100 shadow-sm">
                                    <Mail size={18} className="text-green-600" />
                                    <span className="text-sm md:text-base">
                                        {user?.email}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-md border border-gray-100 shadow-sm">
                                    <CalendarDays
                                        size={18}
                                        className="text-green-600"
                                    />
                                    <span className="text-sm md:text-base">
                                        Joined{" "}
                                        {new Date(
                                            user?.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discussions */}
                <div>
                    {discussions?.length === 0 ? (
                        <div className="bg-white rounded-sm border border-gray-100 p-10 text-center text-gray-500">
                            No discussions found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5">
                            {discussions?.map(
                                (discussion: any) => (
                                    <div
                                        key={discussion?._id}
                                        className="md:w-4xl bg-white border rounded-md border-gray-100 mx-auto p-2 md:p-5 hover:shadow-md transition-all"
                                    >
                                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                                            {discussion?.title}
                                        </h3>

                                        <p className="text-gray-600 mt-3 line-clamp-4">
                                            {discussion?.description}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-5 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp
                                                        size={16}
                                                    />
                                                    {discussion?.likes?.length}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <MessageSquare
                                                        size={16}
                                                    />
                                                    {discussion?.replies?.length}
                                                </div>
                                            </div>

                                            <span className="text-xs text-gray-400">
                                                Post on {" - "}
                                                {new Date(
                                                    discussion?.createdAt
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        {/* Replies */}
                                        {discussion?.replies?.length > 0 && (
                                            <div className="mt-5 space-y-3">
                                                <h4 className="font-medium text-gray-800">
                                                    Recent Replies
                                                </h4>

                                                {discussion?.replies?.slice(0, 2)?.map(
                                                    (reply: any) => (
                                                        <div key={reply?._id} className="bg-gray-50 rounded-sm p-3">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <p className="font-medium text-sm text-gray-800 uppercase">
                                                                    {reply?.user?.name}
                                                                </p>

                                                                <span className="text-xs text-gray-400">
                                                                    {new Date(reply?.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>

                                                            <p className="text-sm text-gray-600">
                                                                {reply?.comment}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}