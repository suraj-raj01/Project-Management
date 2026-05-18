import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../../pages/helpers/GetUserInfo";
import { MessageCircle, ThumbsUp, Reply } from "lucide-react";

export default function AllTopics() {
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // track loading per discussion
    const [likeLoading, setLikeLoading] = useState<string | null>(null);
    const user = getUserFromStorage();

    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/discussion?page=${currentPage}&limit=10`);
            setDiscussions(response.data?.discussions || []);
            // console.log(response.data)
            setTotalPages(response.data?.totalPages);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch discussions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscussions();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    const navigate = useNavigate();

    const handleLike = async (id: string) => {
        try {
            setLikeLoading(id);

            const response = await API.post(
                `/discussion/${id}/like`,
                { userId: user._id }
            );

            setDiscussions((prev) =>
                prev.map((discussion) =>
                    discussion._id === id
                        ? {
                            ...discussion,
                            likes: response.data.likes,
                        }
                        : discussion
                )
            );

        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLikeLoading(null);
        }
    };

    if (!loading && discussions.length === 0) {
        return (
            <div className="p-10 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 flex items-center justify-center rounded-2xl text-gray-600 shadow-sm">
                No discussions yet. Start the conversation 🚀
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 mt-5">
            {loading ? (
                <div className="space-y-4 max-w-4xl">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-200 rounded-sm p-5 animate-pulse"
                        >
                            <div className="h-5 w-52 bg-gray-200 rounded mb-4" />
                            <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                            <div className="h-4 w-3/4 bg-gray-100 rounded mb-4" />

                            <div className="flex gap-4">
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                discussions.map((discussion) => (
                    <div
                        key={discussion._id}
                        className="group md:max-w-4xl rounded-md bg-white hover:border-gray-200 hover:shadow-lg transition-all duration-300 md:p-5 p-2 border border-gray-100"
                    >
                        <div className="flex items-center justify-between flex-wrap w-fit gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                {discussion?.createdBy?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start gap-0">
                                <h3 title="View Profile" onClick={() => navigate(`/dashboard/discussion/profile/${discussion?.createdBy._id}`)} className="cursor-pointer hover:text-teal-600 font-semibold text-gray-800 uppercase tracking-wide text-sm">
                                    {discussion?.createdBy?.name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                    {new Date(
                                        discussion.createdAt
                                    ).toLocaleString()}
                                </span>
                            </div>

                        </div>

                        {/* Top */}
                        <div className="md:max-w-4xl mt-1 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                                    {discussion.title}
                                </h3>

                                <p className="text-md text-gray-600">
                                    {discussion.description}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap bg-teal-50/50 pb-5 items-center md:justify-end justify-center md:gap-6 gap-3 md:px-2 mt-5 pt-4">
                            {/* Comments */}
                            <Link
                                to={`/dashboard/discussion/comments/${discussion._id}`}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                            >
                                <MessageCircle size={18} />
                                <span className="font-semibold">
                                    {discussion.replies.length} Comments
                                </span>
                            </Link>

                            {/* Likes */}
                            <button
                                onClick={() => handleLike(discussion._id)}
                                disabled={likeLoading === discussion._id}
                                className={`flex items-center gap-2 text-sm transition-all ${likeLoading === discussion._id
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-600 hover:text-teal-600 cursor-pointer font-semibold"
                                    }`}
                            >
                                <ThumbsUp size={18} className={discussion.likes.length > 0 ? "fill-teal-500 text-white" : "text-teal-600"} />

                                {likeLoading === discussion._id ? (
                                    <span className="animate-pulse font-semibold">
                                        Updating...
                                    </span>
                                ) : (
                                    <span>
                                        {discussion.likes.length} Likes
                                    </span>
                                )}
                            </button>

                            {/* Reply */}
                            <Link
                                to={`/dashboard/discussion/reply/${discussion._id}`}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                            >
                                <Reply size={18} />
                                <span className="font-semibold">Reply</span>
                            </Link>
                        </div>
                    </div>
                ))
            )}
            {/* Pagination */}
            {!loading && discussions.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">

                    {/* Prev */}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => prev - 1)
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-1 font-semibold rounded-sm border border-gray-400 bg-white text-gray-700 hover:bg-teal-50 hover:border-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1;

                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-8 rounded-sm text-sm font-semibold transition-all ${currentPage === page
                                    ? "bg-teal-600 text-white shadow-md"
                                    : "bg-white border border-gray-400 text-gray-700 hover:bg-teal-50 hover:border-teal-300"
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    {/* Next */}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => prev + 1)
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-1 font-semibold rounded-sm border border-gray-400 bg-white text-gray-700 hover:bg-teal-50 hover:border-teal-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}